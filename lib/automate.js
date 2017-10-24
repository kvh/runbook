'use strict';

var runbook = runbook || {};


runbook.BrowserAutomator = class BrowserAutomator {
  constructor(options) {
    // this.options = Object.assign(automatorDefaultOptions, options);
    this.browserOperations = [];
    this.id_index = 0;
  }

  assignRunbookIdClass(el) {
    let el_id = `__runbook_id_${id_index++}`;
    $(el).addClass(el_id);
    return el_id;
  }

  addBrowserOperation(type, el, value) {
    this.browserOperations.push({
      type: type,
      targetSelector: '.' + this.assignRunbookIdClass(el)
      value: value
    });
  }

  setValue(input, value) {
    console.log('Setting value');
    console.log(input);
    console.log(value);
    if (input.type == 'radio'){
      let el_radio = $('input[name="'+input.name+'"]').filter('[value="'+value+'"]');
      //el_radio.prop('checked', true);
      // Click to trigger any attached events
      this.addBrowserOperation('click-element', el_radio);
    } else if (input.type == 'checkbox'){
      if (value && value != 'false') {
        this.addBrowserOperation('click-element', input.element);
      }
      // $(input.element).prop('checked', value && value != 'false');
    } else if (input.options.length > 0) {
      // TODO:
      let option = matchOption(value, input.options);
      this.addBrowserOperation('select-option', input.element, value);
    } else {
      this.addBrowserOperation('input-text', input.element, value);
    }
  }

  fillFormInput(match) {
    /* match = {score: , name: ?, dtype: ?, value: }
    */
    let inputs = match.tree.getAllInputElements();
    if (inputs.length > 1) {
      this.fillMultipleElementInput(inputs, match);
    }
    this.setValue(inputs[0], match.value);
  }

  fillMultipleElementInput(inputs, match) {
    // Only two cases at the moment: 1) phone, 2) date (expiration, birth, etc)
    // TODO: generalize, support all
    if (match.dtype == 'phone') {
      if (inputs.length != 3) console.log('Wrong number inputs for phone');
      let slices = [[0,3], [3,6], [6]];
      for (var i = 0; i < inputs.length; i++) {
        this.setValue(inputs[i], match.value.slice(...slices[i]));
      }
    } else {
      // Otherwise we'll just assume it's a date! (TODO)
      this.fillDate(inputs, match);
    }
  }

  fillDate(inputs, match) {
    let dt = moment(match.value);
    let parts = matchDateParts(inputs);
    let ops = [];
    for (var i = 0; i < inputs.length; i++) {
      this.setValue(inputs[i], dt.format(parts[i]));
    }
  }

  submitForm(form_tree, actuallySubmit) {
    let submit = form_tree.getBestGuessSubmit();
    console.log('Submitting');
    console.log(submit);

    if (actuallySubmit) {
      // Pause to let bloated front-end frameworks do their thing first...
      this.addBrowserOperation('click-element', submit.element);
    } else {
      console.log("Not actually submitting");
    }
  }

}


