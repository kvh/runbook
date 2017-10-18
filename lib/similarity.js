'use strict';

var runbook = runbook || {};


runbook.similarity = (function () {

  var sim = {};

  sim.levenshtein = function(a, b) {
    let arr = [];
    let charCodeCache = [];

    if (a === b) {
      return 0;
    }

    var swap = a;

    if (a.length > b.length) {
      a = b;
      b = swap;
    }

    let aLen = a.length;
    let bLen = b.length;

    if (aLen === 0) {
      return bLen;
    }

    if (bLen === 0) {
      return aLen;
    }

    while (aLen > 0 && (a.charCodeAt(~-aLen) === b.charCodeAt(~-bLen))) {
      aLen--;
      bLen--;
    }

    if (aLen === 0) {
      return bLen;
    }

    let bCharCode;
    let ret;
    let tmp;
    let tmp2;
    let i = 0;
    let j = 0;

    while (i < aLen) {
      charCodeCache[i] = a.charCodeAt(i);
      arr[i] = ++i;
    }

    while (j < bLen) {
      bCharCode = b.charCodeAt(j);
      tmp = j++;
      ret = j;

      for (i = 0; i < aLen; i++) {
        tmp2 = bCharCode === charCodeCache[i] ? tmp : tmp + 1;
        tmp = arr[i];
        ret = arr[i] = tmp > ret ? tmp2 > ret ? ret + 1 : tmp2 : tmp2 > tmp ? tmp + 1 : tmp2;
      }
    }

    return ret;
  };


  sim.levenshtein_similarity = function(a, b) {
    if (a.length == 0 || b.length == 0)
      return 0
    return 1 - sim.levenshtein(a, b) / Math.max(a.length, b.length);
  }


  sim.word_similarity = function(a, b) {
    // TODO: speed this up without sets? (Rarely duplicate words...)
    // TODO: still want some fuzzy word stemming etc (match words on certain levenshtein ratio? expensive)
    if (a.length == 0 || b.length == 0)
      return 0;
    let as = new Set(a.split(' '));
    let bs = new Set(b.split(' '));
    let inter = [...as].filter(x => bs.has(x));
    return inter.length / Math.max(as.size, bs.size);
  }


  sim.nGram = function(n) {
    if (typeof n !== 'number' || isNaN(n) || n < 1 || n === Infinity) {
      throw new Error('`' + n + '` is not a valid argument for n-gram');
    }

    return grams;

    /* Create n-grams from a given value. */
    function grams(value) {
      var nGrams = [];
      var index;

      if (value === null || value === undefined) {
        return nGrams;
      }

      value = String(value);
      index = value.length - n + 1;

      if (index < 1) {
        return nGrams;
      }

      while (index--) {
        nGrams[index] = value.substr(index, n);
      }

      return nGrams;
    }
  }

  sim.diceCoefficient = function(value, alternative, ngrams=3) {
    let grams = sim.nGram(ngrams);
    let left = grams(value);
    let right = grams(alternative);
    let rightLength = right.length;
    let length = left.length;
    let index = -1;
    let intersections = 0;
    let rightPair;
    let leftPair;
    let offset;

    while (++index < length) {
      leftPair = left[index];
      offset = -1;

      while (++offset < rightLength) {
        rightPair = right[offset];

        if (leftPair === rightPair) {
          intersections++;

          /* Make sure this pair never matches again */
          right[offset] = '';
          break;
        }
      }
    }

    return 2 * intersections / (left.length + rightLength);
  }

  sim.blendedSimilarity = function(s1, s2) {
    let ws = sim.word_similarity(s1, s2);
    if (ws >= 1) return ws;
    let dc = sim.diceCoefficient(s1, s2);
    if (ws > dc) return ws;
    return dc;
  }


  return sim;
}());

