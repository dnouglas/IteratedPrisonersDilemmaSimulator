"use strict";

/**
 * Update simulation status bar.
 * 
 * @param {string} msg - The message to display in the status bar.
 * @param {string} cls - class to apply to the status bar for CSS styling ('', 'err', or 'ok').
 * @returns {void} Output is written directly to the status bar in IPD_Simulator.html
 */
export function setStatus(msg, cls) {
    const el = document.getElementById('statusBar');
    el.textContent = msg;
    el.className = cls;
}

/** 
 * Helper function, calculates the payoff for each player based on their moves. 
 *
 * Payoff Conditions: 
 * - TEMPTATION > REWARD > PUNISHMENT > SUCKER
 * - 2 * REWARD > TEMPTATION + SUCKER
 * 
 * Moves: true = cooperate, false = defect
 * @returns {Array} - [p1, p2] - the payoff for player 1 and player 2 respectively.
 */
function calcPayoffs(m1, m2) {
    const TEMPTATION = 5, REWARD = 3, PUNISHMENT = 1, SUCKER = 0;

    if (m1 === true && m2 === true) return [REWARD, REWARD];
    if (m1 === false && m2 === false) return [PUNISHMENT, PUNISHMENT];
    if (m1 === false && m2 === true) return [TEMPTATION, SUCKER];
    if (m1 === true && m2 === false) return [SUCKER, TEMPTATION];
}

/**
 * Render simulation output.
 * Format of each round render is Round #, Player 1 Move, Player 1 Points, Player 2 Move, Player 2 Points
 * 
 * @param {Array} results - An array of [p1Move, p2Move] for each round.
 * @returns {void} Output is written directly to the Simulation Output section in IPD_Simulator.html
 */
export function renderRounds(results) {
    const scroll = document.getElementById('roundScroll');

    // Create HTML results for each round.
    let html = ``;
    for (let i = 0; i < results.length; i++) {
        const [move1, move2] = results[i];
        const [payoff1, payoff2] = calcPayoffs(move1, move2);
        
        html += `<div class="round-row">
                    <span class="r-num"> #${i+1} </span>
                    <span class="r-move">
                        <span class="badge badge-${(move1 ? 'c' : 'd')}"> ${(move1 ? 'C' : 'D')} </span>
                        <span class="r-pts"> +${payoff1} </span>
                    </span>
                    <span class="r-move">
                        <span class="badge badge-${(move2 ? 'c' : 'd')}"> ${(move2 ? 'C' : 'D')} </span>
                        <span class="r-pts"> +${payoff2} </span>
                    </span>
                 </div>`;
    }

    // Render the html to Simulation Output and scroll to the bottom.
    scroll.innerHTML = html;
    scroll.scrollTop = scroll.scrollHeight;
}

/**
 * Render simulation summary.
 * 
 * @param {Array} results - An array of [p1Move, p2Move] for each round.
 * @returns {void} Output is written directly to the Summary section in IPD_Simulator.html
 */
export function renderSummary(results){
    // Calculate number of cooperations and defections for each player
    const moveCounts = results.reduce((accumulator, currentMoves) => {
        const [move1, move2] = currentMoves;

        if (move1) accumulator.p1Cooperations++;
        else accumulator.p1Defections++;
        
        if (move2) accumulator.p2Cooperations++;
        else accumulator.p2Defections++;

        return accumulator;
    }, { p1Cooperations: 0, p1Defections: 0, p2Cooperations: 0, p2Defections: 0 });

    // Calculate final scores for each player
    const finalScores = results.reduce((accumulator, currentMoves) => {
        const [move1, move2] = currentMoves;
        const [payoff1, payoff2] = calcPayoffs(move1, move2);
        accumulator.p1FinalScore += payoff1;
        accumulator.p2FinalScore += payoff2;

        return accumulator;
    }, { p1FinalScore: 0, p2FinalScore: 0 });

    // Calculate final standing, who is ahead or if tied
    let lead = 'Tied';
    if (finalScores.p1FinalScore > finalScores.p2FinalScore) lead = 'P1 Leads';
    else if (finalScores.p1FinalScore < finalScores.p2FinalScore) lead = 'P2 Leads';

    document.getElementById('summaryContent').innerHTML =
        `<div id="scoreDisplay">
            <div class="score-blk">
                <div class="score-lbl">Player 1</div>
                <div class="score-num">${finalScores.p1FinalScore}</div>
                <div class="score-sub">pts</div>
            </div>
            <div id="vsSep">vs</div>
            <div class="score-blk">
                <div class="score-lbl">Player 2</div>
                <div class="score-num">${finalScores.p2FinalScore}</div>
                <div class="score-sub">pts</div>
            </div>
         </div>
         <div class="stat-line">
            <span class="stat-key">Rounds</span>
            <span class="stat-value">${results.length}</span>
         </div>
         <div class="stat-line">
            <span class="stat-key">Standing</span>
            <span class="stat-value hi">${lead}</span>
         </div>
         <div class="stat-line">
            <span class="stat-key">P1 &mdash; Cooperations</span>
            <span class="stat-value">${moveCounts.p1Cooperations}&times;</span>
         </div>
         <div class="stat-line">
            <span class="stat-key">P1 &mdash; Defections</span>
            <span class="stat-value">${moveCounts.p1Defections}&times;</span>
         </div>
         <div class="stat-line">
            <span class="stat-key">P2 &mdash; Cooperations</span>
            <span class="stat-value">${moveCounts.p2Cooperations}&times;</span>
         </div>
         <div class="stat-line">
            <span class="stat-key">P2 &mdash; Defections</span>
            <span class="stat-value">${moveCounts.p2Defections}&times;</span>
         </div>
        `;
}