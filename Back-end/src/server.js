// server.js

const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');

const { generateDeck, simulateGame, simulateGameAfterFlop, simulateGameAfterTurn,simulateGameAfterRiver } = require('./utils/pokerLogic');

const app = express();
const PORT = 3001;


app.use(cors());
app.use(express.json());

const MONTE_CARLO_SIMULATIONS = 50000;  // Increased from 10000 for better accuracy

app.post('/calculate-odds', (req, res) => {
    try {
        const ourHand = req.body.cards;
        if (!ourHand || ourHand.length !== 2) {
            return res.status(400).json({ error: 'Invalid input. Please provide exactly 2 cards.' });
        }

        const deck = generateDeck();

        let winCount = 0;
        let loseCount = 0;
        let tieCount = 0;

        for (let i = 0; i < MONTE_CARLO_SIMULATIONS; i++) {
            const result = simulateGame(ourHand, deck);
            if (result === 'win') winCount++;
            else if (result === 'lose') loseCount++;
            else tieCount++;
        }

        const odds = {
            win: winCount / MONTE_CARLO_SIMULATIONS*100,
            lose: loseCount / MONTE_CARLO_SIMULATIONS*100,
            tie: tieCount / MONTE_CARLO_SIMULATIONS*100
        };

        res.json(odds);

    } catch (error) {
        console.error('Error calculating odds:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.post('/calculate-odds-after-flop', (req, res) => {
    try {
        const ourHand = req.body.cards;
        const flop = req.body.flop;  // Get the flop from the request

        if (!ourHand || ourHand.length !== 2 || !flop || flop.length !== 3) {
            return res.status(400).json({ error: 'Invalid input. Please provide exactly 2 cards for your hand and 3 cards for the flop.' });
        }

        const deck = generateDeck();

        let winCount = 0;
        let loseCount = 0;
        let tieCount = 0;

        for (let i = 0; i < MONTE_CARLO_SIMULATIONS; i++) {
            const result = simulateGameAfterFlop(ourHand, flop, deck);  // Use the new simulation function
            if (result === 'win') winCount++;
            else if (result === 'lose') loseCount++;
            else tieCount++;
        }

        const odds = {
            win: winCount / MONTE_CARLO_SIMULATIONS*100,
            lose: loseCount / MONTE_CARLO_SIMULATIONS*100,
            tie: tieCount / MONTE_CARLO_SIMULATIONS*100
        };

        res.json(odds);

    } catch (error) {
        console.error('Error calculating odds:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.post('/calculate-odds-after-turn', (req, res) => {
    try {
        const ourHand = req.body.cards;
        const flop = req.body.flop;
        const turn = req.body.turn;

        if (!ourHand || ourHand.length !== 2 || !flop || flop.length !== 3 || !turn) {
            return res.status(400).json({ error: 'Invalid input. Please provide exactly 2 cards for your hand, 3 cards for the flop, and 1 card for the turn.' });
        }

        const deck = generateDeck();

        let winCount = 0;
        let loseCount = 0;
        let tieCount = 0;

        for (let i = 0; i < MONTE_CARLO_SIMULATIONS; i++) {
            const result = simulateGameAfterTurn(ourHand, flop, turn, deck);
            if (result === 'win') winCount++;
            else if (result === 'lose') loseCount++;
            else tieCount++;
        }

        const odds = {
            win: winCount / MONTE_CARLO_SIMULATIONS*100,
            lose: loseCount / MONTE_CARLO_SIMULATIONS*100,
            tie: tieCount / MONTE_CARLO_SIMULATIONS*100
        };

        res.json(odds);

    } catch (error) {
        console.error('Error calculating odds after turn:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.post('/calculate-odds-after-river', (req, res) => {
    try {
        const ourHand = req.body.cards;
        const flop = req.body.flop;
        const turn = req.body.turn;
        const river = req.body.river;  // Get the river card from the request

        if (!ourHand || ourHand.length !== 2 || !flop || flop.length !== 3 || !turn || !river) {
            return res.status(400).json({ error: 'Invalid input. Please provide exactly 2 cards for your hand, 3 cards for the flop, 1 card for the turn, and 1 card for the river.' });
        }

        const deck = generateDeck();

        let winCount = 0;
        let loseCount = 0;
        let tieCount = 0;

        for (let i = 0; i < MONTE_CARLO_SIMULATIONS; i++) {
            const result = simulateGameAfterRiver(ourHand, flop, turn, river, deck);  // Use the new simulation function
            if (result === 'win') winCount++;
            else if (result === 'lose') loseCount++;
            else tieCount++;
        }

        const odds = {
            win: winCount / MONTE_CARLO_SIMULATIONS*100,
            lose: loseCount / MONTE_CARLO_SIMULATIONS*100,
            tie: tieCount / MONTE_CARLO_SIMULATIONS*100
        };

        res.json(odds);

    } catch (error) {
        console.error('Error calculating odds after river:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
