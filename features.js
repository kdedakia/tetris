function getEdges(game,coors) {
  var edges = 0;

  // Loop through each coor of block
  for (var i=0; i<coors.length; i++) {
    var x_coor = coors[i][0];
    var y_coor = coors[i][1];

    var checks = [[x_coor-1,y_coor],[x_coor+1,y_coor],[x_coor,y_coor+1]];
    for (var j=0;j<checks.length;j++){
      check = checks[j]
      if (check[0] != -1 && check[0] != 10 && game._filled.check(check[0],check[1]) != undefined) {
        edges++;
      }
    }
  }

  return edges;
}

function getHoles(game,blocks,x,y,drop) {
  var coors = []
  var holes = 0;
  var blockades = 0;

  for (i=0; i<blocks.length; i+=2) {
    coors.push([x + blocks[i], y + blocks[i+1]]);
  }

  var edges = getEdges(game,coors);

  //Track lowest block for each column
  var span = {}
  for (var i=0; i<blocks.length; i+=2) {
      var x_coor = x + blocks[i];
      var y_coor = y + blocks[i+1];
      if (span[x_coor] == undefined) {
        span[x_coor] = y_coor;
      }
      else if (span[x_coor] < y_coor) {
        span[x_coor] = y_coor;
      }
  }

  $.each( span, function( x_val, y_val ) {
    var cts = true;
    for (var j = y_val + 1; j < 20; j++) {
      if (game._filled.check(parseInt(x_val),j) == undefined) {
        if(j == y_val + 1 || cts) {
            holes++;
            if (j <= 18 && game._filled.check(parseInt(x_val),j+1) != undefined) {
              cts = false
            }
        } else {
          blockades++;
        }
      } else {
        cts = false;
      }
    }
  });
  if(drop) {
    $("#holes").html(holes);
    $("#blockades").html(blockades);
    $("#edges").html(edges);
  }

  return [holes, blockades, edges];
}

function getWalls(blocks,x,y,drop) {
  var walls = 0;
  var coors = [];
  for (var i=0; i<blocks.length; i+=2) {
    if (x+blocks[i] == 0 || x+blocks[i] == 9) {
      walls++;
    }
  }
  if (drop) {
    $("#walls").html(walls);
  }

  return walls;
}

function getMaxHeight(game) {
  for( var y=0; y<game._BLOCK_HEIGHT; y++) {
    for( var x=0; x<game._BLOCK_WIDTH; x++) {
      if (game._filled.check(x,y) != undefined) {
        return game._BLOCK_HEIGHT - y;
      }
    }
  }
  return -1;
}

function getLinesCleared(game,blocks,x,y) {
  var coors = [];
  var lines = 0;

  for (i=0; i<blocks.length; i+=2) {
    coors.push([x + blocks[i], y + blocks[i+1]]);
  }

  for( var y=0; y<game._BLOCK_HEIGHT; y++) {
    var count = 0;

    for( var x=0; x<game._BLOCK_WIDTH; x++) {
      if (game._filled.check(x,y) != undefined) {
        count++;
      } else {
        // Check if new blocks are in the spot
        for (var i=0; i < coors.length; i++) {
          if(coors[i][0] == x && coors[i][1] == y) {
            count++;
          }
        }
      }
      if (x == game._BLOCK_WIDTH-1 && count == game._BLOCK_WIDTH) {
        lines++;
      }
    }

  }

  return lines;
}

function blockScore(game,possibles, blocks, x, y, filled, width, height) {
  var score = 0;
  var res = getHoles(game,blocks,x,y,false);
  var h = res[0];
  var bl = res[1];
  var edges = res[2];
  var wallEdges = getWalls(blocks,x,y,false);
  var maxH = getMaxHeight(game);
  var linesCleared = getLinesCleared(game,blocks,x,y);

  // WEIGHTINGS
  if (DATA.length != 0) {
    var weights = DATA[POP_IDX].weights;
    score = score + h * weights[0];
    score = score + bl * weights[1];
    score = score + edges * weights[2]
    score = score + wallEdges * weights[3];
    score = score + maxH * weights[4];
    score = score + linesCleared * weights[5];
  }
  return score;
}
