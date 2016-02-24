## Tetris AI created using a Genetic Algorithm

#### tetris.html: initializes all variables, main functions to manage the genetic algorithm
#### logging.js: log data to 1)temporary variables 2)localStorage 3)firebase
* game: id, weights (for features), score
* DATA var contains all games for current generation
* ALL_DATA var contains an array of DATA for all generations for 1 specific RUN
* RUN: 1 genetic algorithm test, stores parameters for genetic algorithm (mutation rate, retain rate, etc )
* ALL_RUNS var contains array of all previous RUNS, stored in localStorage 
* You can close your browser at any time, as all data is stored in localStorage. When you reopen the browser, it will continue at the last successful generation completed



#### genetic.js: genetic algorithm code
#### helper.js: misc helper functions
#### blockrain.jquery.js: library for tetris game, slightly modified to use my functions

