"use strict";

// Top level script for IPD webpage

import { updateAlgorithm } from './Algorithm_Controller.js';
import { simulateAlgorithms } from './Simulation_Run_Controller.js';
import { setStatus, renderRounds, renderSummary } from "./Simulation_Render_Controller.js";

// Simulation state guard
let isRunning = false;
let lastRunEndTime = 0;
const REARM_DELAY_MS = 300;

function canExecute() {
  return !isRunning && (Date.now() - lastRunEndTime >= REARM_DELAY_MS)
}

/*
 * Retrieve the player algorithms and run the simulation.
 * This function is called when the user clicks the "Run Simulation" button, and a simulation is not already running.
 * 
 * @returns {void}. Output is rendered directly to the simulation output sections in IPD_Simulator.html
 */
async function startSimulation() {
  if (!canExecute()) return;
  isRunning = true;

  // Validate number of rounds before starting simulation
  const numRounds = parseInt(document.getElementById('numRounds').value, 10);
  if (!numRounds || numRounds < 1 || numRounds > 10000) {
    setStatus('Round count must be between 1 and 10,000.', 'err');
    isRunning = false;
    return;
  }

  // Disable buttons while the simulation is running.
  document.getElementById('runBtn').disabled = true;
  document.getElementById('resetBtn').disabled = true;

  // Set up blank slate for simulation output
  document.getElementById('roundScroll').innerHTML = '';
  document.getElementById('summaryContent').innerHTML = '<div class="sum-empty">[ Running... ]</div>';
  setStatus('Computing ' + numRounds + ' rounds...', '');

  // Retrieve both player algorithms
  const code1 = document.getElementById('p1Code').value;
  const code2 = document.getElementById('p2Code').value;

  // Try running the simulation
  try {
    const results = await simulateAlgorithms(code1, code2, numRounds);
    renderRounds(results);
    renderSummary(results);
    setStatus('Done. ' + numRounds + ' rounds completed.', 'ok');
  } catch(err) {
    setStatus('Error: ' + err.message, 'err');
  } finally {
    isRunning = false;
    lastRunEndTime = Date.now();
    document.getElementById('runBtn').disabled = false;
    document.getElementById('resetBtn').disabled = false;
  }
}

/*
 * Reset the simulation UI to its initial state.
 * This function is called when the user clicks the "Reset" button, and a simulation is not currently running.
 * 
 * @returns {void}. Output is rendered directly to the simulation output sections in IPD_Simulator.html
 */
function resetSimulation() {
  if (!canExecute()) return;

  document.getElementById('roundScroll').innerHTML = '<div class="out-empty">[ No simulation run yet ]</div>';
  document.getElementById('summaryContent').innerHTML = '<div class="sum-empty">[ Run a simulation to see results ]</div>';
  setStatus('', '');
}

/* 
 * Initialize the webpage functionality. 
 */
(function init() {
  // Load default algorithm code
  updateAlgorithm(1);
  updateAlgorithm(2);

  // Event Listeners for algorithm selection changes
  document.getElementById('p1Strategy').addEventListener('change', () => updateAlgorithm(1));
  document.getElementById('p2Strategy').addEventListener('change', () => updateAlgorithm(2));

  // Event Listeners for simulation run/reset
  document.getElementById('runBtn').addEventListener('click', startSimulation);
  document.getElementById('resetBtn').addEventListener('click', resetSimulation);

  // Information Modal Event Listeners 
  document.getElementById('infoBtn').addEventListener('click', () => {
    document.getElementById('infoModal').classList.add('open');
  });
  document.getElementById('modalCloseBtn').addEventListener('click', () => {
    document.getElementById('infoModal').classList.remove('open');
  });
  document.getElementById('infoModal').addEventListener('click', function(e) {
    if (e.target === this) // Only close the modal if the user clicks outside the modal content
      this.classList.remove('open');
  });
})();