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
  run["time"] = (Date.now() - t)/1000;
  ALL_RUNS.push(run);
  localStorage["ALL_RUNS"] = JSON.stringify(ALL_RUNS);
  saveOnline(run);

  restartGame();
}

function resetData() {
  var to_reset = ["DATA","ALL_DATA","F_H"];
  for (var i=0;i<to_reset.length;i++) {
    delete localStorage[to_reset[i]];
  }
  DATA = [];
  ALL_DATA = [];
  F_H = [];
  POP_IDX = 0;
  numGame();
}

/* FIREBASE FUNCTIONS */

function getOnline(cb) {
  db.child("games").once("value", function(data) {
    online = data.val();
    console.log(data.val());
    setRuns();
    cb();
  });
}

function saveOnline(run) {
  db.child("games").once("value", function(data) {
    if(run.config.max_generations > 10) {
      var temp = data.val();
      temp.push(run);
      db.child("games").set(temp);
    }

  });
}

/*
function resetOnline() {
  db.once("value", function(data) {
    online = data.val();
    var arr = [];
    for (var k in online) {
      arr.push(online[k]);
    }
    db.child("games").set(arr);
  });
}
*/
