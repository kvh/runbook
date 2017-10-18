'use strict';

var runbook = runbook || {};


const USER_DATA_DEFAULTS = {
  // Personal
  country: 'United States',

  // Account
  remember: 'checked',
  agree: 'checked'
}


runbook.TaskData = class TaskData {

  constructor(taskData) {
    data = Object.assign({}, USER_DATA_DEFAULTS);
    data = Object.assign(data, taskData);
  }

  getUserValueForDataType(match) {
    // TODO
    return getUserValueForName(match.dtype);
  }

  getUserValueForName(matchname, callback) {
    // match.dtype = match.name;
    // First look for matching key in user_data:
    let [dataname, score] = selectBest(Object.getOwnPropertyNames(this.data), dataname =>
      blendedSimilarity(cleanText(dataname), cleanText(matchname)));
    console.log("Winning dataname");
    console.log([dataname, score]);
    // return Promise.resolve(currentUserData[dataname]);
    // TODO: why .5? Should we just take best no matter what? When would we want to fall back to a data type we don't have...
    if (score > .3) {
      return this.data[dataname];
    }
    return '';
  }
}
