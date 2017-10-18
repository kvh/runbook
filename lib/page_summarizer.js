'use strict';

var runbook = runbook || {};



/*
*
* Form Tree class and builders
*
*/

class TreeNode {
  constructor(value ) {
  this.value = value;
  this.parent = undefined;
  this.children = [];
  }

  addChild(child) {
  child.parent = this;
  this.children.push(child);
  }
}


var field_values = {};


function buildFormTreeFromElement(elem){
  let root = new TreeNode(elem);
  collapseDomTree(root, findAllFormElements, isFormElement);
  return root;
};

function summarizeForm(elem){
  let tree = buildFormTreeFromElement(elem);
  return summarizeTree(tree);
};

function getAllLabels(elem) {
  return Array.from(elem.querySelector('label,.label'))
}


const FORM_FIELDS = ['input', 'select', 'textarea', 'button']; // TODO: others? select-one?
const INPUT_TAGS = ['input', 'select', 'textarea']


// TODO: text elements (for looking up price, confirming order, others?)
// Idea for text tree: look at nodeType of children, if all text, then isTextElement
// Average font size, weight, etc; all possible text trees

function findAllFormElements(elem) {
  let fields = Array.from(elem.querySelectorAll(FORM_FIELDS.join(',')));
  if (isFormElement(elem)){
    fields.push(elem);
  }
  return fields
};


function isFormElement(elem){
  return (FORM_FIELDS.indexOf(elem.tagName.toLowerCase()) != -1
   && elem.type != 'hidden') // TODO: ignoring hidden elements always? probably, we are pretending to be user
}


function collapseDomTree(root, findAllRelevantElements, isRelevantElement) {
  // Comments below reflect original form field use case, but is generalizable to any "relevant" element tree

  // collapses DOM tree into a Form field tree - TreeNodes represent distinct field groupings in tree
  // Element of each node is the outermost, uppermost element that encompasses that group of relevant elements
  // Thus node elements should create total partitioning of dom tree below "root", minus any non-relevant immediate sub-trees
  // console.log('Entering ' + root.value.tagName + ' ' + root.value.className);
  let elem = root.value;
  let n_fields = findAllRelevantElements(elem).length;

  // Base case, we are at leaf TreeNode
  if (n_fields == 1) {
  return;
  }
  let curr = elem;
  let next = curr;

  for(let j=0;j<100;j++) {
  // console.log('Processing ' + curr.tagName + ' ' + curr.className);
  let dom_children = curr.children;
  // console.log('with ' + dom_children.length + ' children');

  for (let i=0; i<dom_children.length; i++){

    let n_fields_child = findAllRelevantElements(dom_children[i]).length;

    // child contains all fields, subsume element and keep searching
    if (n_fields_child == n_fields){
    next = dom_children[i];
    break;
    }
    // child contains some of fields, add and recurse
    else if (n_fields_child < n_fields && n_fields_child > 0) {
      let child = new TreeNode(dom_children[i]);
      // console.log('Adding TreeNode ' + child.value.tagName + ' ' + child.value.className);
      root.addChild(child);
      collapseDomTree(child, findAllRelevantElements, isRelevantElement);
    }

    // else if child is form field, add and continue
    else if (isRelevantElement(dom_children[i])){
    child = new TreeNode(dom_children[i]);
    // console.log('Adding input ' + child.value.tagName + ' ' + child.value.className);
    root.addChild(child);
    }

    // else, is dead branch, skip it
  }
  if (next === curr) {
    break;
  }
  curr = next;
  }
}




/*
*
* Form Tree summarizers
*
*/

class FormElement {
  constructor(summary, dom_elem) {
    Object.assign(this, summary);
    this.element = dom_elem;
  }

  isInput() {
      return (INPUT_TAGS.indexOf(this.tag.toLowerCase()) != -1)
          && (this.type.toLowerCase() != 'hidden')
          && (this.visible); // TODO: ok for now, but sometimes we may want to interact with non-visible inputs (in a modal thats not active for instance)
  }

  isAction() {
      return (this.type.toLowerCase() == 'submit')
          || (this.tag.toLowerCase() == 'button');
  }
}


class ClickableElement {
  constructor(summary, dom_elem) {
    Object.assign(this, summary);
    this.element = dom_elem;
  }

  getText() {
    if (this.tag.toLowerCase() == 'input') {
      return this.element.value;
    }
    return this.text;
  }
}


class FormTree {
  constructor(summary, root_elem) {
    Object.assign(this, summary);
    this.form_elements = this.fields; // Convert from legacy name
    this.root_element = root_elem;
  }

  isSingleInput() {
    let inputs = this.getAllInputElements();
    let n_inputs = inputs.length;
    if (n_inputs == 0 || n_inputs > 3) // No known input with greater than 3 fields
      return false;
    if (n_inputs == 1)
      return true;
    /*
    * Else, check for combo field
    * Current combo fields: date and phone
    * TODO: a bit hacky
    */
    // Phone
    if (scoreFieldDataTypeMatch('phone', this) > .8 && n_inputs == 3)
      // All in a row
      if (inputs.map(i => i.rect.yMin).all())
        return true
    // Birthdate
    if (scoreFieldMatch('birth', this) > .6 && n_inputs == 3)
      // All in a row
      if (inputs.map(i => i.rect.yMin).all())
        return true
    // Expiration
    if (scoreFieldDataTypeMatch('card_expiration', this) > .8 && n_inputs == 2)
        return true
    return false;
  }

  getAllInputElements() {
    return this.form_elements.filter(f => f.isInput());
  }

  getAllChildrenWithInputs() {
    let n_inputs = this.getAllInputElements().length;
    if (n_inputs == 0)
      return [];
    if (this.isSingleInput())
      return [this];
    return this.children.reduce((a,b) => a.concat(b.getAllChildrenWithInputs()), []);
  }

  getAllText() {
    return this.text + ' ' + this.fields.map(f => f.name + ' ' + f.text + ' ' + f.placeholder).join(' ');
  }

  getAllInputElementText() {
    return this.text + ' ' + this.getAllInputElements().map(f => f.name + ' ' + f.text + ' ' + f.placeholder).join(' ');
  }

  getAllActionElements() {
    return this.form_elements.filter(f => f.isAction());
  }

  getBestGuessLabel() {
    let label_raw = this.text; // Default

    // First preference for actual label
    if (this.getAllInputElements().length == 1) {
      let field = this.getAllInputElements()[0];
      if (field.label_text)
        label_raw = field.label_text;
      // if (field.place_holder)
      //   return field.place_holder;
    }

    // Split on colon (common label syntax)
    return label_raw.split(':')[0].trim();
  }

  getBestGuessSubmit() {
    // TODO: more than one?
    let actions = this.getAllActionElements();
    if (actions.length == 0)
      return;
    if (actions.length == 1)
      return actions[0];
    // Return type==submit with preference
    let [action, score] = selectBest(actions, a => scoreFieldElementDataTypeMatch('submit', a));
    return action;
  }
}


function isVisible(el) {
  return (el.offsetParent !== null);
}

function getOptions(el) {
  let options = Array.from(el.querySelectorAll('option'));
  let option_values = [];
  options.forEach(function(elem) {
  option_values.push([elem.value, elem.innerText]);
  });
  return option_values;
}

/**
 * Calculate the bounding box of a DOM element.
 *
 * @param element is the jQuery element which is the root of the calculation
 */
function getBoundingBox(element) {
  let position = element.offset();
  let width = element.outerWidth();
  let height = element.outerHeight();
  let box = {
    xMin: position.left,
    xMax: position.left + width,
    yMin: position.top,
    yMax: position.top + height
  }
  ;

  // Ignore elements with overflow hidden, children will be masked and
  // can be ignored...
  if (element.css('overflow') !== 'hidden') {
  element.children().each(function() {
    let child = $(this);
    if(child.is(':visible')){
    let childBox = getBoundingBox(child);

    // Merge child box into current box:
    box = {
      xMin: Math.min(box.xMin, childBox.xMin),
      xMax: Math.max(box.xMax, childBox.xMax),
      yMin: Math.min(box.yMin, childBox.yMin),
      yMax: Math.max(box.yMax, childBox.yMax)
    };
    }
  });
  }

  return box;
}

function normalizeBoundingBox(box) {
  let width = window.innerWidth;
  let height = window.innerHeight;
  return {
    xMin: box.xMin / width,
    xMax: box.xMax / width,
    yMin: box.yMin / height,
    yMax: box.yMax / height,
  }
}



function summarizeGroup(fields) {
  if (fields.length == 1) {
  return [fields[0], null];
  }
  // This is a radio or similar, summarize other fields with options
  let options = [];
  for (let i = 0; i < fields.length; i++) {
  options.push([fields[i].value, fields[i].innerText]);
  }
  return [fields[0], options]
}

function consolidateFieldGroups(elems){
  // turns multiple radio box inputs into single element
  let groups = [];
  if (elems.length < 1) {
  return groups;
  }
  let curr_name = elems[0].name;
  let curr_group = [];
  for (let i = 0; i < elems.length; i++) {
  // If curr name is not blank and has same name, or just on the first iter, then group together
  if (i == 0 || curr_name && curr_name == elems[i].name) {
    curr_group.push(elems[i]);
  } else {
    // else treat as separate
    groups.push(summarizeGroup(curr_group));
    curr_group = [elems[i]];
    curr_name = elems[i].name;
  }
  }
  groups.push(summarizeGroup(curr_group));
  return groups;
}

function get_label_for(el) {
  return $('[for="' + el.id + '"]');
}



function summarizeElement(field, options) {
  if (!options) {
    options = getOptions(field);
  }
  let jq = $(field);
  let rect = getBoundingBox(jq);
  let norm_rect = normalizeBoundingBox(rect);
  let label = get_label_for(field);
  // jq.offset();
  // rect.width = jq.width();
  // rect.height = jq.height();
  let fs = {
    'text':field.innerText,
    'tag':field.tagName,
    'type':field.type,
    'id':field.id,
    'name':field.name,
    'href':field.href,
    'label_text':label.text(),
    'length':field.getAttribute('maxlength'),
    'num_options':options.length,
    'options':options,
    'value':field.value,
    'placeholder':field.placeholder,
    'title':field.title,
    'visible':isVisible(field),
    'rect':rect,
    'normalized_rect':norm_rect,
    // 'uuid':createUuid(field)
  }
  return fs;
}

function summarizeClickableElement(elem) {
  let fs = summarizeElement(elem);
  return new ClickableElement(fs, elem);
}

function summarizeFormElement(elem) {
  let fs = summarizeElement(elem);
  return new FormElement(fs, elem);
}


function summarizeFields(elem) {
  // Get all form-related elements
  let fields = findAllFormElements(elem);

  // Group related inputs (e.g. radios) into standard form [(el, options), ..]
  let groups = consolidateFieldGroups(fields);

  let summary = [];
  for (let i = 0; i < groups.length; i++) {
    summary.push(summarizeFormElement(groups[i][0], groups[i][1]));
  };
  return summary;
}


function summarizeTree(tree) {
  // TODO: unnecessary replication of fields at each level of tree
  let fields = summarizeFields(tree.value);
  let jq = $(tree.value);
  let rect = getBoundingBox(jq);
  let norm_rect = normalizeBoundingBox(rect);
  let summary = {
    'text':tree.value.innerText,
    'fields': fields,
    'rect': rect,
    'normalized_rect': norm_rect,
    // 'uuid':createUuid(tree.value)
  }
  summary['children'] = [];
  for (let i = 0; i < tree.children.length; i++) {
    summary['children'].push(summarizeTree(tree.children[i]));
  };
  return new FormTree(summary, tree.value);
}


function summarizeAllForms() {
  let forms = document.querySelectorAll('form');
  let trees = [];
  for (let i = 0; i < forms.length; i++) {
    trees.push(summarizeForm(forms[i]));
  }
  return trees;
}


function summarizeAllClickables(root){
  let links = document.getElementsByTagName('a');
  let buttons = document.getElementsByTagName('button');
  let submits = document.querySelectorAll('input[type="submit"]')
  // TODO: do these count?
  // let chboxes = document.querySelectorAll('input[type="checkbox"]')
  // let radios = document.querySelectorAll('input[type="radio"]')
  let clickables = [...links].concat([...buttons]).concat([...submits]); //.concat([...chboxes]).concat([...radios]);
  let summaries = [];
  for (let i = 0; i < clickables.length; i++) {
    let s = summarizeClickableElement(clickables[i]);
    summaries.push(s);
  }
  return summaries;
}


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  exports.summarizeAllClickables = summarizeAllClickables;
  exports.summarizeAllForms = summarizeAllForms;
} else {
  window.summarizeAllClickables = summarizeAllClickables;
  window.summarizeAllForms = summarizeAllForms;
}
