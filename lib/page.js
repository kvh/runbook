'use strict';

var runbook = runbook || {};


runbook.Page = class Page {

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
  fillAndSubmitForm(action, score_threshold=.5) {
    // Get all parent and child datatypes implied by the action class (e.g. login, register, payment, etc)
    let inferred_datatypes = getAllDataTypesForFormType(action.class);
    // Data set explicitly in the action
    let given_data = action.data || {};

    let form_scores = this.form_trees.map(form => [form, scoreAndMatchFormTreeForDataSpecs(given_data, inferred_datatypes, form)]);
    let [form, [matches, score]] = form_scores.sort((a, b) => b[1][1] - a[1][1])[0];

    console.log(score);
    console.log(form);
    console.log(matches);

    let all_promises = [];
    matches.forEach(match => {
      if (match.value == null) {
        if (match.dtype)
          all_promises.push(getUserValueForDataType(match).then(value => {match.value = value; return match;}));
        else
          all_promises.push(getUserValueForName(match.name).then(value => {match.value = value; return match;}));
      } else {
          all_promises.push(Promise.resolve(match));
      }
    });

    let p = Promise.all(all_promises).then(matches => {
      matches.forEach(m => fillFormInput(m));
      submitForm(form);
    });

    // What is useful to caller here?
    // return matches; // Won't necessarily have user data yet
    return p, {scoring:score, result:form.id};
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

    clickElement(clickable.element);

    return Promise.resolve(), {scoring:score, result:clickable.id};
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
  click(action) {
    console.log("Click");
    console.log(action);

    if (action.selector != null) {
      $(action.selector).click();
      return Promise.resolve(), {};
    } else {
      // Hmmm... same for now
      return this.goto(action);
    }
  }

  /*
    Extract methods
  */
  extract(action) {
    console.log("Extract");
    console.log(action);

    if (action.selector != null) {
      var text = $(action.selector).text();
      return Promise.resolve(), {result:text};
    } else {
      // TODO:
      [text, score] = selectBest(this.texts, text => scoreTextForKeywords(text, action.keywords));
      return Promise.resolve(), {scoring:score, result:text};
    }
  }

}

