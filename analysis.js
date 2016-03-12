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

function topScores(run) {
  run_data = typeof run !== 'undefined' ? run.data : ALL_DATA;
  var topScores = new Array(run_data.length);
  var topObj = new Array(run_data.length);

  for(var i=0;i<run_data.length;i++){
    var max = 0;
    for (var j=0;j<run_data[i].length;j++){
      var s = run_data[i][j].score
      if (s > max) {
        max = s;
        topScores[i] = max;
        topObj[i] = run_data[i][j];
      }
    }
  }
  return topScores;
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

function graph(run) {
  var ctx = document.getElementById("chart").getContext("2d");

  var lbls = [];
  for (var i=0;i<run.fh.length;i++) {
    lbls.push((i+1).toString());
  }

  var data = {
    labels: lbls,
    datasets: [
        {
            label: "Fitness History",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: run.fh
        },
        {
            label: "Top Score",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: topScores(run)
        }

    ]
  };

  var options = {
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
  }
  if(myLineChart != undefined) {
      myLineChart.destroy();
  }

  myLineChart = new Chart(ctx).Line(data, {});
}

function graph2(g) {
  var ctx = document.getElementById("chart").getContext("2d");

  var data = {
      labels: FEATURES,
      datasets: [
          {
              label: "My First dataset",
              fillColor: "rgba(220,220,220,0.2)",
              strokeColor: "rgba(220,220,220,1)",
              pointColor: "rgba(220,220,220,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(220,220,220,1)",
              data: [g.holes, g.blockades, g.edges, g.walls, g.maxHeight, g.linesCleared]
          }
      ]
  };

  if(myRadarChart != undefined) {
      myRadarChart.destroy();
  }
  myRadarChart = new Chart(ctx).Radar(data, {});
}

function graphRadars(g,l) {

  $(".radars").html("");
  // var l = 3;
  // topSummary(l,online[2].data);
  for (var i = l-1; i >= 0; i--) {
    $(".radars").append("<div class='radar r" + (i+1).toString() + "'>" + "<h2>Position:" + (l-i).toString() + "</h2><canvas id='" + "r" + (i+1).toString() + "' width='400' height='400'></canvas></div>");
    if (i % 2 == 0) {
      $(".radars").append("<br/>");
    }
    var ctx = document.getElementById("r" + (i+1).toString()).getContext("2d");
    g = topSummary(l,online[2].data)[i];
    var data = {
        labels: FEATURES,
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(104,105,216,0.4)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [g.holes, g.blockades, g.edges, g.walls, g.maxHeight, g.linesCleared]
            }
        ]
    };
    // if(myRadarChart != undefined) {
    //     myRadarChart.destroy();
    // }
    if (radar_charts[i] != undefined) {
      radar_charts[i].destroy();
    }
    radar_charts[i] = new Chart(ctx).Radar(data, {});
    // myRadarChart = new Chart(ctx).Radar(data, {});
  }
}

function showRadars() {

}

function showRunInfo(run) {
  $("#info_pop").val(run.config.pop_length);
  $("#info_elite").val(run.config.elite_length);
  $("#info_mutate").val(run.config.mutate);
  $("#info_retain").val(run.config.retain);
  $("#info_random_rate").val(run.config.random_rate);
  $("#info_min").val(run.config.min);
  $("#info_max").val(run.config.max);
}



function setRuns() {
  runs = typeof online !== 'undefined' ? online : JSON.parse(localStorage.ALL_RUNS);

  for (var i=0;i<runs.length;i++) {
    var id = JSON.stringify(runs[i].config);
    $("#select_run").append("<option value='" + id + "' >" + i + "</option>");
  }

}
