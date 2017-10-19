'use strict';

var runbook = runbook || {};


runbook.Automator = (function () {

  var auto = {};

  auto.clickElement = function(el) {
    el.click();
  }

  auto.setValue = function(input, value) {
    console.log('Setting value');
    console.log(input);
    console.log(value);
    if (input.type == 'radio'){
      let el_radio = $('input[name="'+input.name+'"]').filter('[value="'+value+'"]');
      //el_radio.prop('checked', true);
      // Click to trigger any attached events
      auto.clickElement(el_radio);
    } else if (input.type == 'checkbox'){
      if (value && value != 'false') {
        auto.clickElement(input.element);
      }
      // $(input.element).prop('checked', value && value != 'false');
    } else if (input.options.length > 0) {
      // TODO:
      let option = matchOption(value, input.options);
      $(input.element).val(option).change();
    } else {
      // Trigger key-event (keeps some form validation from complaining)
      $(input.element).sendkeys(value).change();
      // var keyEvent = document.createEvent('KeyboardEvent');
      // keyEvent.initKeyboardEvent('keydown', true, false, null, 0,
      //                            false, 0, false, 77, 0);
      // input.element.focus();
      // input.element.dispatchEvent(keyEvent);
      // $(input.element).val(value).change();
    }
  }

  auto.fillFormInput = function (match) {
    /* match = {score: , name: ?, dtype: ?, value: }
    */
    let inputs = match.tree.getAllInputElements();
    if (inputs.length > 1) {
      auto.fillMultipleElementInput(inputs, match);
      // console.log('ERROR: Can\'t handle more than 1 element ATM');
      return;
    }
    auto.setValue(inputs[0], match.value);
  }

  auto.fillMultipleElementInput = function (inputs, match) {
    // Only two cases at the moment: 1) phone, 2) date (expiration, birth, etc)
    // TODO: generalize, support all
    if (match.dtype == 'phone') {
      if (inputs.length != 3) console.log('Wrong number inputs for phone');
      let slices = [[0,3], [3,6], [6]];
      for (var i = 0; i < inputs.length; i++) {
        auto.setValue(inputs[i], match.value.slice(...slices[i]));
      }
    } else {
      // Otherwise we'll just assume it's a date! (TODO)
      auto.fillDate(inputs, match);
    }
  }

  auto.fillDate = function (inputs, match) {
    let dt = moment(match.value);
    let parts = matchDateParts(inputs);
    for (var i = 0; i < inputs.length; i++) {
      auto.setValue(inputs[i], dt.format(parts[i]));
    }
  }

  auto.submitForm = function (form_tree, actuallySubmit) {
    let submit = form_tree.getBestGuessSubmit();
    console.log('Submitting');
    console.log(submit);

    if (actuallySubmit) {
      auto.clickElement(submit.element);
    } else {
      console.log("Not actually submitting");
    }
  }

  return auto;
}());
