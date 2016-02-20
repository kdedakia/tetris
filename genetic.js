/*
  GENETIC ALGORITHM CODE
*/

function randint(min_val, max_val) {
  return Math.floor(Math.random() * (max_val - min_val + 1) + min_val);
}
function individual(num_features) {
  var features = [];

  for(var i = 0; i < num_features; i++) {
    features.push(Math.random() * (max - min) + min);
  }
  return features;
}

function population(count,length) {
  arr = [];
  for (var i =0; i < count; i++) {
    arr.push(individual(length));
  }
  return arr;
}

function fitness(id){
  return DATA[id].score;
}

function grade(pop) {
    var sum = 0;
    for (var i = 0; i < pop.length;i++) {
      sum += DATA[i].score
    }
    return sum/pop.length;
}

function evolve(pop,retain,random_rate,mutate) {
    var graded = [];
    for (var x=0; x<pop.length;x++){
        graded.push([ fitness(x),pop[x] ]);
    }

    graded = graded.sort(function(a, b){return b[0]-a[0]});
    for (var i=0;i<graded.length;i++){
      graded[i] = graded[i][1];
    }

    var retain_length = Math.floor(graded.length * retain);
    var parents = [];

    /*
    pop = 15
    retain = 0.4
    r_l = 6
    e_l = 2
    so take 0,1 as elites 0->e_l-1
    mutate 2,3,4,5 e_l -> total: r_l - e_l
    */
    for (var i=elite_length;i < retain_length; i++) {
      parents.push(graded[i]);
    }

    // Randomly add other individuals to promote genetic diversity
    for (var i=retain_length; i<graded.length;i++) {
      if (random_rate > Math.random() ){
          parents.push(graded[i]);
      }
    }

    // Mutate some individuals
    for (var i=0; i <parents_length;i++) {
      if ( mutate > Math.random() ) {
        pos_to_mutate = randint(0,individual.length-1);
        parents[i][pos_to_mutate] = randInt(min,max);
      }
    }

    // Add elites
    for (var i=0;i <elite_length;i++) {
      parents.push(graded[i]);
    }

    // Crossover parents to create children
    var parents_length = parents.length;
    var desired_length = pop.length - parents_length;
    var children = [];
    while (children.length < desired_length) {
      male = randint(0,parents_length-1);
      female = randint(0, parents_length-1)
      if (male != female) {
        male = parents[male]
        female = parents[female]
        half = Math.ceil(male.length / 2);
        male = male.slice(0,half)
        female = female.slice(half);
        child = male.concat(female);
        children.push(child);
      }

    }
    parents = parents.concat(children);
    return parents;
}
