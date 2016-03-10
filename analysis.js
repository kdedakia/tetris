/* ANALYTICS FUNCTIONS */

function getSummary(i,j,run_data) {
    var obj = {"generation":i+1};
    var game = run_data[i][j];
    obj["score"] = game.score;
    for (var x=0;x<FEATURES.length;x++) {
      obj[FEATURES[x]] = game.weights[x];
    }

    return obj;
}

function maxScore(run_data) {
  run_data = typeof run_data !== 'undefined' ? run_data : ALL_DATA;
  var max = 0;

  for (var i=0; i < run_data.length; i++) {
    for (var j=0;j < run_data[i].length;j++) {
      var score = run_data[i][j].score
      if (score > max) {
        max = score;
      }
    }
  }
  return max;
}

// Get Top 10 Scores + Associated Weightings
//TODO: fix duplicate score bug
function topSummary(keep,run_data) {
  run_data = typeof run_data !== 'undefined' ? run_data : ALL_DATA;
  var top = {}; //top[score] = [i,j]
  var topScores = []; //Pop the lowest score, insert new top score

  for(var i=0;i<run_data.length;i++){
    for (var j=0;j<run_data[i].length;j++){
      var s = run_data[i][j].score

      if (topScores.length < keep){
        topScores.push(s);
        top[s] = [i,j];
      }
      //Replace lowest score
      else if (s > topScores[0]) {
        delete top[topScores.shift()]; //remove lowest
        topScores.push(s);
        topScores.sort(function(a, b){return a-b}); //ascending order
        top[s] = [i,j];
      }
    }
  }

  var topData = [];
  for (k in top) {
    topData.push(getSummary(top[k][0],top[k][1],run_data));
  }

  return topData;
}
