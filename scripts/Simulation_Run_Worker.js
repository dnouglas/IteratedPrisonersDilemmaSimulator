"use strict";

/*
 * Code to run simulation. Will be run on a Web Worker inside Simulation_Run_Controller.js
 */
self.onmessage = function(e) {
  const { algo1, algo2, rounds } = e.data;
  try {
    // Set up functions for each algorithm
    const fn1 = new Function("myMoves", "opponentMoves", "round", algo1);
    const fn2 = new Function("myMoves", "opponentMoves", "round", algo2);

    let p1History = [];
    let p2History = [];
    let results = [];

    // Run the algorithms against each other for each round
    for (let round = 0; round < rounds; round++) {
      let move1 = fn1(p1History.slice(), p2History.slice(), round) === true;
      let move2 = fn2(p2History.slice(), p1History.slice(), round) === true;
      p1History.push(move1);
      p2History.push(move2);
      results.push([move1, move2]);
    }

    // results isbn  array of [p1Move, p2Move] for each round
    self.postMessage({ ok: true, results });
  } catch (err) {
    self.postMessage({ ok: false, err: String(err && err.message ? err.message : err) });
  }
};