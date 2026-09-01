"use strict";

/*
 * Run the two algorithms against each other for the specified number of rounds.
 * Run within an iframe sandbox to prevent malicious/erroneous code from affecting the main page.
 * 
 * @param {string} algo1 - The code for player 1's algorithm.
 * @param {string} algo2 - The code for player 2's algorithm.
 * @param {number} rounds - The number of rounds to simulate. Integer between 1 and 10000 (inclusive).
 * 
 * @returns {Promise} - If algorithm run is successful, resolves to an Array of [p1Move, p2Move] for each round.
 *                      If algorithm run is unsuccessful, rejects with an Error containing the reason for error.
 */
export function simulateAlgorithms(algo1, algo2, rounds) {
  return new Promise((resolve, reject) => {
    // 10 second time limit for the simulation to complete, otherwise reject the promise
    const TIMEOUT_MS = 10000;
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error(`Simulation timed out (>${TIMEOUT_MS / 1000}s).`));
    }, TIMEOUT_MS);

    // unique identifier for simulation run, made of random characters from 0-9 and a-z.
    const id = Math.random().toString(36).slice(2);

    // set up hidden iframe to run the user code in a sandboxed environment
    const iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', 'allow-scripts');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Clean up functionality for the iframe and event listener after completion or timeout
    let cleaned = false;
    function cleanup() {
      if (cleaned) 
        return;

      clearTimeout(timer);
      window.removeEventListener('message', onMessage);
      iframe.remove();

      cleaned = true;
    }

    // Listener for messages from the js code running in the iframe
    // Messages have following format for data: { _id: <id>, ok: true/false, results: <array> or err: <string> }
    window.addEventListener('message', onMessage);
    function onMessage(e) {
      // Only accept messages from the iframe we created, with acutal data and matching this call's id
      if (e.source !== iframe.contentWindow || !e.data || e.data._id !== id) return;

      // Receiving a message indicates the simulation has completed, so we can clean up.
      cleanup();

      // If the simulation was successful, resolve the promise with the results.
      // If the simulation was unsuccessful, reject the promise with an error.
      if (e.data.ok)
        resolve(e.data.results);
      else
        reject(new Error(e.data.err || 'Runtime error'));
    }

    // Build the sandboxed script and set it as the iframe's content
    // Run the user algorithms and post the results back to the parent window
    iframe.srcdoc = buildSandboxScript(id, algo1, algo2, rounds);
  });
}

/*
 * Builds the sandboxed HTML/JS that runs inside the iframe.
 * Algorithms must return true (cooperate) or false (defect).
 * 
 * @param {string} id - Unique identifier for this simulation run.
 * @param {string} algo1 - The code for player 1's algorithm.
 * @param {string} algo2 - The code for player 2's algorithm.
 * @param {number} rounds - The number of rounds to simulate. Integer between 1 and 10000 (inclusive).
 * 
 * @returns {string} - The HTML/JS content to set as the iframe's srcdoc. 
 *                      Contains actual script that runs the simulation.
 *                      Posts results back to the parent window.
 */
function buildSandboxScript(id, algo1, algo2, rounds) {
  const runnerCode = `
    (function () {
      let fn1, fn2;
      try {
        fn1 = new Function("myMoves", "opponentMoves", "round", ${JSON.stringify(algo1)});
        fn2 = new Function("myMoves", "opponentMoves", "round", ${JSON.stringify(algo2)});
      } catch (err) {
        parent.postMessage({ _id: ${JSON.stringify(id)}, ok: false, err: String(err && err.message ? err.message : err) }, "*");
        return;
      }

      let p1History = [];
      let p2History = [];
      let results = [];
      const total = ${rounds};
      const CHUNK = 200; // tune as needed
      let round = 0;

      function runChunk() {
        try {
          const end = Math.min(round + CHUNK, total);
          for (; round < end; round++) {
            let move1 = fn1(p1History.slice(), p2History.slice(), round) === true;
            let move2 = fn2(p2History.slice(), p1History.slice(), round) === true;
            p1History.push(move1);
            p2History.push(move2);
            results.push([move1, move2]);
          }

          if (round < total) {
            setTimeout(runChunk, 0); // yield to event loop, then continue
          } else {
            parent.postMessage({ _id: ${JSON.stringify(id)}, ok: true, results: results }, "*");
          }
        } catch (err) {
          parent.postMessage({ _id: ${JSON.stringify(id)}, ok: false, err: String(err && err.message ? err.message : err) }, "*");
        }
      }

      runChunk();
    })();
  `;

  return `<script>${runnerCode}<\/script>`;
}