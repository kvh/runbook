'use strict';

var runbook = runbook || {};


const non_word_separators_re = /[\_\-\/]+/g;
const non_word_re = /[^\w\s]+/g;
const whitespace_collapse_re = /\s+/g;

function cleanText(s) {
  if (s == null) return s;
  // Lower, strip non alpha-numeric, trim and collapse whitespace
  return s.toLowerCase().replace(non_word_separators_re, ' ')
                        .replace(non_word_re, '')
                        .replace(whitespace_collapse_re, ' ')
                        .trim();
}

