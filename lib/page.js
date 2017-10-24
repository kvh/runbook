'use strict';

var runbook = runbook || {};


runbook.Page = class Page {

  constructor(automator) {
    this.automator = automator;
  }

  fromCurrentPage() {
    this.form_trees = summarizeAllForms();
    this.clickables = summarizeAllClickables();
    this.title = document.title;
    this.url = window.location.href;
    this.raw = document.documentElement.outerHTML;
    this.text = document.documentElement.innerText;
    this.visit_start = performance.timing.navigationStart;
    this.metadata = {
        window_width:window.innerWidth,
        window_height:window.innerHeight
    };
  }


  /*
    Form methods
  */
  fillAndSubmitForm(action, userData, submitForms, score_threshold=.5) {
    // Get all parent and child datatypes implied by the action class (e.g. login, register, payment, etc)
    let inferred_datatypes = getAllDataTypesForFormType(action.class);
    // Data set explicitly in the action
    let given_data = action.data || {};

    let form_scores = this.form_trees.map(form => [form, scoreAndMatchFormTreeForDataSpecs(given_data, inferred_datatypes, form)]);
    let [form, [matches, score]] = form_scores.sort((a, b) => b[1][1] - a[1][1])[0];

    console.log(score);
    console.log(form);
    console.log(matches);

    // let matches = [];
    matches.forEach(match => {
      if (match.value == null) {
        if (match.dtype)
          match.value = userData.getUserValueForDataType(match);
          // matches.push(userData.getUserValueForDataType(match).then(value => {match.value = value; return match;}));
        else
          match.value = userData.getUserValueForName(match.name);
          // matches.push(userData.getUserValueForName(match.name).then(value => {match.value = value; return match;}));
      } else {
          // matches.push(Promise.resolve(match));
      }
    });

    matches.forEach(m => this.automator.fillFormInput(m));
    this.automator.submitForm(form, submitForms);

    // What is useful to caller here?
    // return matches; // Won't necessarily have user data yet
    return {browserOperations:this.automator.browserOperations, scoring:score, result:form.id};
  }

  evaluateFormSubmit(action) {
  /*
  hmmmmm
   - url change (won't work with SPAs, e.g.)
   - different vs same form (unless filling out two of identical forms in a row)
   - form errors on page (don't have capability yet, but we want either way so we could potentially debug live)
  */
  }


  /*
    Goto methods

    Goto action expects to load new resource (e.g. form submit, link click)
  */
  goto(action) {

    console.log("Goto");
    console.log(action);

    let [clickable, score] = [null, 0];
    if (action.class != null && action.class != 'custom') {
      [clickable, score] = selectBest(this.clickables, clickable => scoreClickablesForClass(clickable, action.class));
    } else {
      [clickable, score] = selectBest(this.clickables, clickable => scoreClickablesForKeywords(clickable, action.keywords));
    }

    console.log([score, clickable]);

    this.automator.addBrowserOperation('click-element', clickable.element);

    return {browserOperations:this.automator.browserOperations, scoring:score, result:clickable.id};
  }

  evaluateGoto(action) {
  /*
  hmmmmm
   - url change: should be ok given the "goto" premise. but that premise is broken...
   - anything about the page changed in response? we got a spinner? network activity?

  */
  }

  /*
    Click methods

    Click is raw click action with no expectation of loading a new location.
  */
  // click(action) {
  //   console.log("Click");
  //   console.log(action);

  //   if (action.selector != null) {
  //     $(action.selector).click();
  //   let automator = new runbook.BrowserAutomator();
  //   automator.addBrowserOperation('click', clickable.element);

  //   return {browserOperations:automator.browserOperations, scoring:score, result:clickable.id};
  //   } else {
  //     // Hmmm... same for now
  //     return this.goto(action);
  //   }
  // }

  /*
    Extract methods
  */
  extract(action) {
    console.log("Extract");
    console.log(action);

    if (action.selector != null) {
      var text = $(action.selector).text();
      return {browserOperations:[], result:text};
    } else {
      // TODO:
      // [text, score] = selectBest(this.texts, text => scoreTextForKeywords(text, action.keywords));
      // return {browserOperations:[], result:text};
    }
  }

  extractScreenshot(action) {
    console.log("Extract");
    console.log(action);

    if (action.selector != null) {
      let operation = {type:'take-screenshot', targetSelector:action.selector}
      return {browserOperations:[operation]};
    } else {
      // TODO:
      // [text, score] = selectBest(this.texts, text => scoreTextForKeywords(text, action.keywords));
      // return {browserOperations:[], result:text};
    }
  }

}

