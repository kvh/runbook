'use strict';

var runbook = runbook || {};


function selectBest(objects, scoring_function) {
  let scores = [];
  objects.forEach(obj => {
    let score = scoring_function(obj);
    scores.push({'obj':obj, 'score':score});
    });
  let best = scores.sort((a, b) => b.score - a.score)[0];
  return [best.obj, best.score]
}


/*
  Form scoring
*/

function scoreFieldMatch(str, form_tree) {
  /*
  Scores match of 'str' (e.g. 'password' or 'email address') to this form_tree.
     [DISABLED now] First checks for exact match with `name` attribute of first element. Label is more appropriate than field name.
  Then falls back to getting best guess label for whole tree and computing the word similarity. If it can't find
  a reasonable label, it just computes the raw sim score for all text it can find on the input elements.
  */
  // if (form_tree.getAllInputElements().length == 1 && form_tree.getAllInputElements()[0].name == str) {
  //   return 1;
  // }
  if (form_tree.getBestGuessLabel()) {
    return runbook.similarity.blendedSimilarity(cleanText(form_tree.getBestGuessLabel()), cleanText(str));
  }
  return runbook.similarity.blendedSimilarity(cleanText(form_tree.getAllInputElementText()), cleanText(str));
}

function scoreFieldElementMatch(str, element) {
  return runbook.similarity.blendedSimilarity(cleanText(element.text), cleanText(str));
}

function scoreFieldDataTypeMatch(dtype_key, form_tree) {
  let dtype_names = getFieldType(dtype_key).names;
  let [best_name, score] = selectBest(dtype_names, name => scoreFieldMatch(name, form_tree));
  return score;
}

function scoreAndMatchNameDataType(dtype_key, name) {
  // Score 'name' match with the dtype against its keywords
  let dtype_names = getFieldType(dtype_key).names;
  name = cleanText(name);
  let [best_name, score] = selectBest(dtype_names, dtype_name => runbook.similarity.word_similarity(name, cleanText(dtype_name)));
  return score;
}

function scoreFieldElementDataTypeMatch(dtype_key, element) {
  // Scores input element's relevance to dtype (e.g. to find submit button)
  let dtype_names = getFieldType(dtype_key).names;
  let [best_name, score] = selectBest(dtype_names, name => scoreFieldElementMatch(name, element));
  return score;
}


function scoreAndMatchFormTreeForDataSpecs(given_data, inferred_datatypes, form_tree, min_match_threshold=.2) {
  let scores = [];
  let child_trees = form_tree.getAllChildrenWithInputs();

  given_data.forEach(data => {
    // TODO: consolidate with inferred!
    let field_scores = [];
    child_trees.forEach(tree => {
      let score = {
        value: data.value,
        tree: tree
      }
      if (isFieldType(data.name)) {
        score.score = scoreFieldDataTypeMatch(data.name, tree);
        score.dtype = data.name;
      } else {
        score.score = scoreFieldMatch(data.name, tree);
        score.name = data.name;
      }
      field_scores.push(score);
      });
    scores.push(field_scores);
    });

  inferred_datatypes.forEach(dtype => {
    let field_scores = [];
    child_trees.forEach(tree => {
      let score = {
        score: scoreFieldDataTypeMatch(dtype, tree),
        dtype: dtype,
        value: null,
        tree: tree
        };
      field_scores.push(score);
      });
    scores.push(field_scores);
    });

  // Put scores in a matrix
  let score_matrix = math.zeros(scores.length, scores[0].length)._data;
  for (var i = 0; i < scores.length; i++) {
    for (var j = 0; j < scores[i].length; j++) {
      score_matrix[i][j] = scores[i][j].score;
    }
  }

  /*
   Assignment problem. We use the Hungarian Algorithm (Munkres) to
   optimally assign datatype requirements to field inputs based on
   scores.
   */
  let res = computeMunkres(computeMunkres.make_cost_matrix(score_matrix));
  // Map back to matches
  let total_score = res.map(([i,j]) => score_matrix[i][j]).reduce((a,b) => a + b, 0);
  let matches = res.map(([i,j]) => scores[i][j]);


  // Drop matches below threshold (likely extra implied datatypes matching with optional fields on page)
  matches = matches.filter(m => m.score > min_match_threshold);

  console.log('Scoring form tree');
  console.log(scores);
  // console.log(res);
  // console.log(score_matrix);
  console.log(total_score);
  // console.log(matches);
  return [matches, total_score]
}


function scoreFormTypes(form_tree) {
  let scores = FORM_TYPES.map(form_type =>
    scoreAndMatchFormTreeForDataSpecs([], getAllDataTypesForFormType(form_type), form_tree));
}


/*
  User input scoring
*/

function scoreArrayMatch(a1, a2) {
  return a1.intersection(a2).length / Math.max(a1.length, a2.length);
}


function matchDateParts(inputs) {
  if (inputs.map(i => i.options.length).all()) {
    return inputs.map(element => {
      if (element.options.length >= 12 && element.options.length <= 14)
        if (scoreArrayMatch(element.options.map(op => parseInt(op)),
                             range(13)) > .8)
          return 'M';
      if (element.options.length >= 31 && element.options.length <= 33)
        if (scoreArrayMatch(element.options.map(op => parseInt(op)),
                             range(32)) > .8)
          return 'D';
      // Else year? TODO
      return 'Y'
      });
  }
  // Crude
  // TODO: localize
  // Take with preference first Y, then Y, M, then Y, M, D
  // Not always true, but usually
  return ['D', 'M', 'Y'].slice(3 - inputs.length);
}


function matchOption(value, options) {
  let [best, score] = selectBest(options, option => {
    return Math.max(runbook.similarity.levenshtein_similarity(value, option[0]),
                    runbook.similarity.levenshtein_similarity(value, option[1]));
    });
  return best[0];
}


/*
  Clickable scoring
*/

function scoreClickablesForKeywords(clickable, keywords) {
  let clickable_text = cleanText(clickable.getText());
  if (clickable_text == '')
    return 0;
  let [keyword, score] = selectBest(keywords, keyword => {
    if (clickable_text == keyword)
      return 1;
    // Shortcut (there can be a LOT of links on a page)
    let ratio = keyword.length / clickable_text.length;
    if (ratio > 2 || ratio < .2)
      return 0
    // TODO: a bit crude
    // return levenshtein_similarity(clickable_text, keyword);
    if (clickable_text.indexOf(keyword) != -1) {
      return ratio;
    }
    return 0;
  });
  return score;
}


function scoreClickablesForClass(clickable, clickable_class, evaluateHidden=false) {
  if (!clickable.visible && !evaluateHidden)
    return 0;
  let keywords = getKeywordsForClass(clickable_class);
  return scoreClickablesForKeywords(clickable, keywords);
}



