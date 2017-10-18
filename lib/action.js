'use strict';

var runbook = runbook || {};


runbook.Action = class Action {

  constructor(action) {
    this.type = action.type;
    this.class = action.class;
    this.keywords = action.keywords;
    this.selector = action.selector;
    this.raw_data = action.data;
    this.data = this.normalizeActionData(action.data);
  }

  getDataNames() {
    return this.data.map(d => d.name);
  }

  normalizeActionData(data) {
    if (data == null) return [];
    let norm_data = data.map(d => {
      if (typeof d == 'string') {
        return {'name':d};
      }
      return d;
    });
    return norm_data;
  }

}


runbook.Task = class Task {

  constructor(task) {
    this.type = task.type;
    this.starting_url = task.starting_url;
    this.actions = task.actions.map(a => new Action(a));
  }
}

runbook.Recipe = class Recipe {

  constructor(recipe) {
    this.title = recipe.title;
    this.description = recipe.description;
    this.tasks = recipe.tasks.map(t => new Task(t));
  }
}


