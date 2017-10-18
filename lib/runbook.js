'use strict';

var runbook = runbook || {};


// For extension
if (typeof chrome === 'undefined')
  var chrome = null;


runbook.defaultOptions = {
  doneSignal: '_runbook_done',
};


runbook.Runbook = class Runbook {

  constructor(options) {
    this.userTask = userTask;
    this.recipe = recipe;
    this.userData = userData;
    this.options = this.updateOptions(options);
  }

  updateOptions(config) {
    return Object.assign(defaultOptions, config);
  }

  getCurrentPage() {
    return (new runbook.Page()).fromCurrentPage();
  }

  executeTaskActionOnCurrentPage(action, taskData) {
    let page = this.getCurrentPage();
    return this.executeTaskOnPage(page, action, taskData);
  }

  executeTaskActionOnPage(page, action, taskData) {
    console.log("Executing task action");

    // initUserData(taskData);

    let promise = Promise.resolve([]);
    let res = null;

    if (action.type == 'form') {
      promise, res = page.fillAndSubmitForm(action);

    } else if (action.type == 'goto') {
      // Find and click link to new location
      promise, res = page.goto(action);

    } else if (action.type == 'click') {
      // Click action NOT resulting in new location
      promise, res = page.click(action);
      promise.then(() => this.sendDoneSignal());

    } else if (action.type == 'extract') {
      // Extract action NOT resulting in new location
      promise, res = page.extract(action);
      promise.then(() => this.sendDoneSignal());
    }

    return res;
  }

  sendDoneSignal() {
      if (chrome != null) {
        // Extension
        chrome.runtime.sendMessage({msg:this.options.doneSignal});
      } else {
        // Puppeteer
        window.alert(this.options.doneSignal);
      }
  }

}
