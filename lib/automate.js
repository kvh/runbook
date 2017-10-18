'use strict';

var runbook = runbook || {};


runbook.Automator = {

  clickElement: function(el) {
    el.click();
  },

  setValue: function(input, value) {
    console.log('Setting value');
    console.log(input);
    console.log(value);
    if (input.type == 'radio'){
      let el_radio = $('input[name="'+input.name+'"]').filter('[value="'+value+'"]');
      //el_radio.prop('checked', true);
      // Click to trigger any attached events
      runbook.Automator.clickElement(el_radio);
    } else if (input.type == 'checkbox'){
      if (value && value != 'false') {
        runbook.Automator.clickElement(input.element);
      }
      // $(input.element).prop('checked', value && value != 'false');
    } else if (input.options.length > 0) {
      // TODO:
      let option = matchOption(value, input.options);
      $(input.element).val(option).change();
    } else {
      $(input.element).val(value).change();
    }
  },

  fillFormInput: function (match) {
    /* match = {score: , name: ?, dtype: ?, value: }
    */
    let inputs = match.tree.getAllInputElements();
    if (inputs.length > 1) {
      runbook.Automator.fillMultipleElementInput(inputs, match);
      // console.log('ERROR: Can\'t handle more than 1 element ATM');
      return;
    }
    runbook.Automator.setValue(inputs[0], match.value);
  },

  fillMultipleElementInput: function (inputs, match) {
    // Only two cases at the moment: 1) phone, 2) date (expiration, birth, etc)
    // TODO: generalize, support all
    if (match.dtype == 'phone') {
      if (inputs.length != 3) console.log('Wrong number inputs for phone');
      let slices = [[0,3], [3,6], [6]];
      for (var i = 0; i < inputs.length; i++) {
        runbook.Automator.setValue(inputs[i], match.value.slice(...slices[i]));
      }
    } else {
      // Otherwise we'll just assume it's a date! (TODO)
      runbook.Automator.fillDate(inputs, match);
    }
  },

  fillDate: function (inputs, match) {
    let dt = moment(match.value);
    let parts = matchDateParts(inputs);
    for (var i = 0; i < inputs.length; i++) {
      runbook.Automator.setValue(inputs[i], dt.format(parts[i]));
    }
  },

  submitForm: function (form_tree, mockSubmit) {
    let submit = form_tree.getBestGuessSubmit();
    console.log('Submitting');
    console.log(submit);

    if (!mockSubmit) {
      runbook.Automator.clickElement(submit.element);
    } else {
      console.log("Not actually submitting");
    }
  }
}
