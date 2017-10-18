'use strict';

var runbook = runbook || {};


// TODO
const USER_DATA_DEFAULTS = {
  // Personal
  country: 'United States',

  // Account
  remember: 'checked',
  agree: 'checked'
}


runbook.UserData = class UserData {

  constructor(userData) {
    this.data = Object.assign({}, USER_DATA_DEFAULTS);
    this.data = Object.assign(this.data, userData);
  }

  getUserValueForDataType(match) {
    // TODO
    return this.getUserValueForName(match.dtype);
  }

  getUserValueForName(matchname, callback) {
    let [dataname, score] = selectBest(Object.getOwnPropertyNames(this.data), dataname =>
      runbook.similarity.blendedSimilarity(cleanText(dataname), cleanText(matchname)));
    console.log("Winning dataname");
    console.log([dataname, score]);

    // TODO: why .3? Should we just take best no matter what? When would we want to fall back to a data type we don't have...
    if (score > .3) {
      return Promise.resolve(this.data[dataname]);
    }
    return Promise.resolve('');
  }
}
