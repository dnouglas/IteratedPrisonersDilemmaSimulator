"use strict";

/**
 * Run the two algorithms against each other for the specified number of rounds.
 * Run within a Web Worker to prevent malicious/erroneous code from affecting the main page.
 * Using a Web Worker also runs the simulation on a separate thread, so we don't have to worry about 
 * two programs fighting over the same thread causing the webpage UI to freeze (as opposed to an iframe).
 * 
 * @param {string} algo1 - The code for player 1's algorithm.
 * @param {string} algo2 - The code for player 2's algorithm.
 * @param {number} rounds - The number of rounds to simulate. Integer between 1 and 10000 (inclusive).
 * 
 * @returns {Promise} - If simulation run is successful, resolves to an Array of [p1Move, p2Move] for each round.
 *                      If simulation run is unsuccessful, rejects with an Error containing the reason for error.
 */
export function simulateAlgorithms(algo1, algo2, rounds) {
  return new Promise((resolve, reject) => {
    // Set up Web Worker
    const worker = new Worker('scripts/Simulation_Run_Worker.js');

    // 10 second time limit for the simulation to complete, otherwise reject the promise
    const TIMEOUT_MS = 10000;
    const timer = setTimeout(() => {
      worker.terminate();
      reject(new Error(`Simulation timed out (>${TIMEOUT_MS / 1000}s).`));
    }, TIMEOUT_MS);

    // Once the worker finishes executing, receive its message
    worker.onmessage = (e) => {
      clearTimeout(timer);
      worker.terminate();

      if (e.data.ok) 
        resolve(e.data.results);
      else 
        reject(new Error(e.data.err || 'Runtime error'));
    }

    // Catch worker errors
    worker.onerror = (e) => {
      clearTimeout(timer);
      worker.terminate();

      reject(new Error(e.message || 'Worker error'));
    }

    // Execute worker code
    worker.postMessage({ algo1, algo2, rounds });
  });
}