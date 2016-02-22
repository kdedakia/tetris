/* ANALYTICS FUNCTIONS */

function getSummary(i,j) {
    var obj = {"generation":i+1};
    var game = ALL_DATA[i][j];
    obj["score"] = game.score;
    for (var x=0;x<FEATURES.length;x++) {
      obj[FEATURES[x]] = game.weights[x];
    }

    return obj;
}

function maxScore() {
  var max = 0;

  for (var i=0; i < ALL_DATA.length; i++) {
    for (var j=0;j < ALL_DATA[i].length;j++) {
      var score = ALL_DATA[i][j].score
      if (score > max) {
        max = score;
      }
    }
  }
  return max;
}

// Get Top 10 Scores + Associated Weightings
//TODO: fix duplicate score bug
function topSummary(keep) {
  var top = {}; //top[score] = [i,j]
  var topScores = []; //Pop the lowest score, insert new top score

  for(var i=0;i<ALL_DATA.length;i++){
    for (var j=0;j<ALL_DATA[i].length;j++){
      var s = ALL_DATA[i][j].score

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
    topData.push(getSummary(top[k][0],top[k][1]));
  }

  return topData;
}

function numGame() {
  var num = 0.0;
  if(DATA.length != 0) {
    for(var i=0;i<POP_LENGTH;i++) {
      num++;
      if (DATA[i].score == undefined) {
        num = (num/POP_LENGTH*100).toFixed(2);
        break;
      }
    }
  }

  $("#progress").html(num);
  return;
}


/* LOCALSTORAGE FUNCTIONS */

function inStorage(key) {
  if (Object.keys(localStorage).indexOf(key) != -1) {
    return true;
  }
  return false;
}

function pullAllData() {
  if (LOAD_DATA) {
    key = "ALL_DATA";
    if (inStorage(key)) {
      ALL_DATA = JSON.parse(localStorage[key]);
      F_H = JSON.parse(localStorage["F_H"]);
      return true;
    }
  }

  return false;
}

function saveData() {
  localStorage["ALL_DATA"] = JSON.stringify(ALL_DATA);
  localStorage["F_H"] = JSON.stringify(F_H);
}

function getRuns() {
  if(inStorage("ALL_RUNS")) {
    return JSON.parse(localStorage["ALL_RUNS"]);
  }
  return [];
}

function saveRun() {
  var ALL_RUNS = [];
  if(inStorage("ALL_RUNS")) {
    ALL_RUNS = JSON.parse(localStorage["ALL_RUNS"]);
  }
  var run = {};
  run["config"] = CURR_RUN.config
  run["features"] = FEATURES;
  run["data"] = ALL_DATA;
  run["fh"] = F_H;
  ALL_RUNS.push(run);
  localStorage["ALL_RUNS"] = JSON.stringify(ALL_RUNS);
  saveOnline(run);

  restartGame();
}
