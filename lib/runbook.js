'use strict';

var runbook = runbook || {};


// For extension
if (typeof chrome === 'undefined')
  var chrome = null;


runbook.defaultOptions = {
  doneSignal: '_runbook_done',
  submitForms: true
};


runbook.Runbook = class Runbook {

  constructor(options) {
    this.options = this.updateOptions(options);
  }

  updateOptions(config) {
    return Object.assign(runbook.defaultOptions, config);
  }

  getCurrentPage() {
    let automator = new runbook.BrowserAutomator();
    var page = new runbook.Page(automator);
    page.fromCurrentPage();
    return page;
  }

  executeTaskActionOnCurrentPage(action, userData) {
    let page = this.getCurrentPage();
    return this.executeTaskActionOnPage(page, action, userData);
  }

  executeTaskActionOnPage(page, action, userData) {
    console.log("Executing task action");
    action = new runbook.Action(action);

    // let promise = Promise.resolve([]);
    let res = null;

    if (action.type == 'form') {
      userData = new runbook.UserData(userData);
      res = page.fillAndSubmitForm(action, userData,
                                            this.options.submitForms);

    } else if (action.type == 'goto') {
      // Find and click link to new location
      res = page.goto(action);

    } else if (action.type == 'click') {
      // Click action NOT resulting in new location
      res = page.click(action);
      // this.sendDoneSignal();

    } else if (action.type == 'extract') {
      // Extract action NOT resulting in new location
      res = page.extract(action);
      // this.sendDoneSignal();
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
