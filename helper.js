Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}

Array.prototype.inArr = function (array) {
  for(var i=0;i<this.length;i++){
    if (this[i].equals(array) ) {
      return true;
    }
  }
  return false;
}

//Used by makeRun to avoid changing DEFAULT_CONFIG
function clone(obj){
  if(obj == null || typeof(obj) != 'object')
      return obj;

  var temp = new obj.constructor();
  for(var key in obj)
      temp[key] = clone(obj[key]);

  return temp;
}

function WeightsHash(weights) {
  obj = {};
  for (var x=0;x<FEATURES.length;x++) {
    obj[FEATURES[x]] = weights[x];
  }
  return obj;
}
