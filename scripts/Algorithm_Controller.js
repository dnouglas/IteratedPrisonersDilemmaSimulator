"use strict";

/*
 * Updates the player's algorithm code based on the selected strategy.
 * Custom Algorithm provides a placeholder code template for users to modify.
 * All other algorithms are unmodifiable.
 * Use when the strategy dropdown changes and when the page is initialized. 
 * 
 * @param {number} player - The player number (1 or 2).
 * @returns {void}. Output is written directly to the corresponding textarea. in IPD_Simulator.html
 */
export function updateAlgorithm(player) {
    // Algorithms
    const ALGORITHMS = {
        // Always Cooperate
        ac: "// Always Cooperate" + "\n"
            + "return true;",
        
        // Always Defect
        ad: "// Always Defect" + "\n"
            + "return false;" ,
        
        // Tit for Tat
        tft: "// Tit for Tat" + "\n" 
            + "// Cooperate on round 0, then copy opponent's last move" + "\n"
            + "if (round === 0) return true;" + "\n"
            + "return opponentMoves[round - 1];",

        // Random
        rand: "// Random" + "\n"
            + "// Cooperate or defect with equal probability" + "\n"
            + "return Math.random() < 0.5;",

        // Grim Trigger
        grudge: "// Grudger (Grim Trigger)" + "\n"
            + "// Cooperate until opponent defects once — then defect forever" + "\n"
            + "for (let i = 0; i < opponentMoves.length; i++) {" + "\n"
            + "  if (opponentMoves[i] === false) return false;" + "\n"
            + "}" + "\n"
            + "return true;",

        // Pavlov
        pavlov: "// Pavlov (Win-Stay, Lose-Shift)" + "\n"
            + "// Cooperate first round." + "\n"
            + "// If last outcome was R (coop+coop) or T (defect+coop): repeat last move." + "\n"
            + "// If last outcome was P (defect+defect) or S (coop+defect): switch." + "\n"
            + "if (round === 0) return true;" + "\n"
            + "let me = myMoves[round - 1];" + "\n"
            + "let opp = opponentMoves[round - 1];" + "\n"
            + "if (me === true && opp === true) return true;   // R — stay cooperate" + "\n"
            + "if (me === false && opp === true) return false; // T — stay defect" + "\n"
            + "if (me === false && opp === false) return true; // P — switch to cooperate" + "\n"
            + "if (me === true && opp === false) return false; // S — switch to defect",

        // Custom Algorithm
        custom: "// Custom Algorithm" + "\n"
            + "// Variables available:" + "\n"
            + "//   myMoves[]       — your move history (true = cooperate, false = defect)" + "\n"
            + "//   opponentMoves[] — opponent's move history" + "\n"
            + "//   round           — current round index, 0-based" + "\n"
            + "// Return true to cooperate, false to defect." + "\n"
            + "if (round === 0) return true;" + "\n"
            + "return opponentMoves[round - 1];"
    };

    // Update the code editor with the selected algorithm
    const sel = document.getElementById("p" + player + "Strategy"); // Chosen strategy from the select dropdown
    const ta = document.getElementById("p" + player + "Code"); // Textarea containing algorithm code
    const algo = ALGORITHMS[sel.value];
    ta.value = algo;
    ta.readOnly = (sel.value !== "custom");
}