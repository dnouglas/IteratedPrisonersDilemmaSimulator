# Iterated Prisoner's Dilemma Simulator

Vanilla HTML-CSS-JS webpage that allows users to simulate a finite Iterated Prisoner's Dilemma game using JavaScript-based algorithms.

</br>


## Background: [The Prisoner's Dilemma](https://en.wikipedia.org/wiki/Prisoner%27s_dilemma)

The Prisoner's Dilemma is a classic problem in game theory. Two prisoners (players) are interrogated separately and must each decide, without communication, whether to cooperate (stay silent) or defect (betray/narc on the other). There are three possible outcomes:

1. **Both stay silent**: Each prisoner gets 1 year in jail. 
2. **One prisoner defects while the other stays silent**: The prisoner who defects goes free while the prisoner who stayed silent gets 3 years in jail.
3. **Both defect**: Each prisoner gets 2 years in jail.

What is the optimal choice for each prisoner? It turns out that defection always results in a better payoff than cooperation:

- If you know the other prisoner will defect you can either cooperate (3 years in jail) or also defect (2 years in jail).
- If you know the other prisoner will cooperate you can either also cooperate (1 year in jail) or defect (0 years in jail).

In either case, defecting will give you the lighter sentence. Thus, it is in both prisoners' self interests to defect, which means that both will get 2 years in jail. Where does the dilemma come in? Notice that had both cooperated, each of them would have only gotten 1 year in jail. Thus, it would have been better for the prisoners had they both decided to cooperate! 

In other words, although it is rational for both prisoners to defect, mutual cooperation yields a higher payoff for each.

</br>

### The Prisoner's Dilemma Generalized

We can generalize this scenario as such: Suppose two players must choose (without communcation) to either "cooperate" or "defect". There are three possible outcomes:

1. **Both Cooperate**: Each player receies a reward payoff with value $R$.
2. **One Player Defects, One Player Cooperates**: The defecting player receives a temptation payoff with value $T$, while the cooperating player receives a sucker payoff with value $S$.
3. **Both Defect**: Each player receives a punishment payoff with value $P$.

The following condition must hold for the scenario to be a valid Prisoner's Dilemma Game: $$ T > R > P > S $$
- The relationships $T > R$ and $P > S$ imply that defection is the optimal choice for each player.
- The relationship $R > P$ implies that mutual cooperation yields a higher payoff than mutual defection.

In our original scenario, the payoff values would be as such:
- $ T = 0 $ (Prisoner goes free)
- $ R = -1 $ (1 year in prison)
- $ P = -2 $ (2 years in prison)
- $ S = -3 $ (3 years in prison)

</br>

### The Iterated Prisoner's Dilemma

The iterated version of the Prisoner's Dilemma plays the game over many rounds, allowing strategies based on past decisions to emerge. Each player now remembers their opponent's actions in previous rounds (as well as their own previous actions), and can change their decision to cooperate/defect based on these past actions. 

Each round takes on the generalized form of the original Prisoner's Dilemma game as described earlier. The interated version also requires the following condition to ensure that alternating cooperation and defection does not give a greater reward than mutual cooperation: $$ 2R > T + S $$

The optimal strategy depends on the number of rounds played. If the game is played for a finite number of rounds, and both players know this, then the optimal strategy for each player is to defect in all rounds. Why is that? In the last round, the players might as well defect since there are no later chances to retaliate. Thus, both players optimally defect on the last turn. But this means that the players might as well defect in the second-to-last round as well, since the other player will defect in the last round no matter what. This rationale cascades all the way to each player optimally defecting on the first round, implying that the optimal strategy is to always defect. Note however that mutual cooperation in every round still yields a higher payoff for both players. If the game is played for an indefinite/unknown or infinite number of rounds, then studies have shown that strategies tend to shift towards mutual cooperation over time. 

There are many real world scenarios that can be abstracted into a version of the Iterated Prisoner's Dilemma (examples in politics, sports, economics, psychology, nature, etc.), which is why this topic has extreme significance in Game Theory.

</br>

### Axelrod's Tournament

Robert Axelrod's famous 1980 computer tournament invited Game Theorists to submit strategies to compete against each other in an Iterated Prisoner's Dilemma game. One of the best performing strategies was the deceptively simple Tit for Tat, written in just 4 lines of BASIC: cooperate on the first round, then mirror the opponent's last move (retaliate when and only when the opponent defects).

Axelrod found that when the Iterated Prisoner's Dilemma was repeated over many many rounds with a population of many different strategies/players, nice/cooperative strategies tended to do much better than greedy/defective strategies. In analyzing the best performing strategies, he noted the following properties of a successful strategy:
- **Nice**: The strategy must not be the first to defect (must initially cooperate).
- **Retaliatory**: The strategy must at least sometimes retaliate when an opposing strategy defects (must not always cooperate).
- **Forgiving**: The strategy must eventually cooperate again if the opposing strategy does not continue to defect.
- **Non-Envious**: The strategy must not try to score more than the opponent (must not defect "for no reason" or always defect).

Note that in this context, a successful strategy is not necessarily one that strives to "win" each IPD game by finishing with more points than the opposing strategy (in other words locally optimal), but rather one that strives to optimize its average overall payoff in every game against every possible strategy in the population (in other words globally optimal). Thus the optimal strategy also depends on the nature of all the other strategies within the population. For example, a tit-for-tat stategy would be disadvantaged in a population where all the other strategies are to always defect. Similarly, an always defect strategy would be disadvantaged in a population where all the other strategies are tit-for-tat.

</br>


## How to Use

This simulator allows you to run two predefined strategies against each other in a singular IPD game with a finite amount of rounds that you also specify (unfortunately an infinite number of rounds is simply not possible). The payoffs used are as specified below (they satisfy both conditions for a valid IPD game):

- **Temptation (T)**: 5
- **Reward (R)**: 3
- **Punishment (P)**: 1
- **Sucker (S)**: 0

The strategies/algorithms themselves are written using JavaScript code. A few predefined algorithms are provided as examples (tit-for-tat, always cooperate, always defect, random, grim trigger, and pavlov), but you can also write your own custom algorithms. Note that your code/algorithm runs as a JavaScript function body with the following variables as input parameters:

- **myMoves[]** - array of your past moves (true = cooperate, false = defect)
- **opponentMoves[]** - array of opponent's past moves
- **round** - current round index, 0-based. The size of each array is equal to the current round.

Given these inputs, your code must decide whether to cooperate (return true) or defect (return false) for the current round. Once the two strategies are specified, you can begin the simulation and it will run the two algorithms against each other for the specified number of rounds (see Simulation_Run_Worker.js if curious about how exactly the two algorithms are run against each other) and output the results to the webpage if the simulation was successful. 

Here is an example of a valid strategy that can be run in the simulator. Specifically, this is the code for the Tit for Tat strategy:

```js
// Tit for Tat: Cooperate in the first round, then copy the opponent's last move
if (round === 0) 
    return true;

return opponentMoves[round - 1];
```

</br>


## Implementation History

This section is mostly just me ranting about how this thing took me way longer than it should've to make...

Full transparency I used Claude to help me build the outline of this project, as I could not quite figure out where to start (Web/UI design is not my forte...). The first iterations of the webpage it created, although they worked, were packed into a single file and completely unreadable and overwhelming with many many redundant/questionable chunks of code. The vast majority of the time I spent on this project was spent deciphering what the hell Claude cooked up and debugging/refactoring the program into actually readable modules. 

When I first thought of making this project, the biggest fish I had to fry was the issue of how to safely run the simulation when the algorithms were user-inputted and potentially erroneous? My first thought was to use the eval() function, but a quick google search and a plethora of sources screaming that eval() is evil and susceptible to dangerous code injections because it has full access to the DOM made me drop the idea pretty quickly. Trying to write a bunch of validity checks before plugging a user algorithm into eval() is simply not feasible. 

So, searching up how to safely run user-inputted code, the next thing I came across were IFrames, which are inline frame elements that load an entirely separate HTML document inside the current page. I thought this would work great because putting the script to run the algorithms within the iframe would isolate the code to the iframe's DOM and block it from accessing the main website DOM and only allow communication to the main DOM via postMessage(). Thus, the initial implementation utilized an invisible iframe to run the simulations. 

Although the initial implementation worked fine at first glance, things started getting weird when testing with large numbers of rounds, like 10,000. It took a several hours for me to realize that the issue lies in the fact that iframes execute their scripts on the same main thread as the main DOM (JS is single threaded). When the simulation needs to run that many rounds, it can take many seconds to finish. In those seconds in which the simulation is running it takes complete control of the main thread, preventing any other events that may have occurred in the main DOM from being processed and creating a frozen/glitching effect in the UI. 

I initially tried to fix this using a chunking method, adding a setTimeout() request to the simulation code for every 200 rounds to return control of the thread back to the main DOM to periodically process events such as scrolling and rendering. But a funny (not really I almost crashed out when I discovered this) side effect to this "fix" was that when running a 10,000 round simulation, I could scroll up and down the UI with no noticable freezing, but if I rapidly scrolled up and down repeatedly while the simulation was still running then the simulation would actually take too long to run (10+ seconds) and time out (when usually it would take around 3-5 seconds to complete)! This happened because rapidly scrolling up and down would continuously send rerender requests to the thread, and since these rerenders take precendence over a setTimeout() request (in the Macrotask Queue), the setTimeout would get starved waiting for the scrolling/rendering to stop, indefinitely pausing the simulation until the user stopped scrolling up and down the screen, resulting in a simulation time limit exceeded error.

Cooked. Or at least I thought I was. Looking in to how to resolve this issue, I eventually discovered Web Workers, the ultimate solution to my problem. A Web Worker is like an iframe, but with two main differences: one, they are not HTML elements but rather a background script runner completely detached from the main user interface/DOM, and two, they run their scripts on a separate background thread as opposed to also running it on the main thread. Web Workers are great for doing heavy computations (e.g. 10,000 rounds of an IPD Game!!!) off the main thread without interfering with the UI or DOM. Not only did switching to a Web Worker solve all the problems I described earlier, but it also made the code to run the simulation (Simulation_Run_Controller.js, Simulation_Run_Worker.js) so much more readable and concise! If only I could have started with the Web Worker in the first place...


</br>

## Feedback/Mistakes/Improvements?

let me know :)