// pokerLogic.js
const logger = require('./logger');

const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const suits = 'CDHS';

// Generate a deck of cards
const generateDeck = () => {
    let deck = [];
    for (let r of ranks) {
        for (let s of suits) {
            deck.push(r + s);
        }
    }
    return deck;
};


// Evaluate the strength of a hand
const evaluateHand = (hand) => {
    const rankCounts = countRanks(hand);
    let handStrength;

    // Log the rank counts for debugging
    logger.info(`Hand: ${hand.join(', ')} - Rank Counts: ${JSON.stringify(rankCounts)}`);

    if (isRoyalFlush(hand)) {
        handStrength = 9;  // Royal Flush
    } else if (isFlush(hand) && isStraight(hand)) {
        handStrength = 8;  // Straight Flush
    } else if (isFourOfAKind(rankCounts)) {
        handStrength = 7;  // Four of a Kind
    } else if (isFullHouse(rankCounts)) {
        handStrength = 6;  // Full House
    } else if (isFlush(hand)) {
        handStrength = 5;  // Flush
    } else if (isStraight(hand)) {
        handStrength = 4;  // Straight
    } else if (isThreeOfAKind(rankCounts)) {
        handStrength = 3;  // Three of a Kind
    } else if (isTwoPairs(rankCounts)) {
        handStrength = 2;  // Two Pairs
    } else if (isOnePair(rankCounts)) {
        handStrength = 1;  // One Pair
    } else {
        handStrength = 0;  // High Card
    }

    // Log the evaluated hand strength
    logger.info(`Hand: ${hand.join(', ')} - Strength: ${handStrength}`);

    return handStrength;
};


const countRanks = (hand) => {
    const counts = {};
    for (let card of hand) {
        const rank = card[0];
        counts[rank] = (counts[rank] || 0) + 1;
    }
    return counts;
};

const isRoyalFlush = (hand) => {
    const sortedHand = hand.sort((a, b) => ranks.indexOf(a[0]) - ranks.indexOf(b[0]));
    return isFlush(hand) && isStraight(hand) && sortedHand[4][0] === 'A';
};

const isFlush = (hand) => {
    const suit = hand[0][1];
    return hand.every(card => card[1] === suit);
};

const isStraight = (hand) => {
    const sortedHand = hand.sort((a, b) => ranks.indexOf(a[0]) - ranks.indexOf(b[0]));

    // Check for regular straight
    let startRank = ranks.indexOf(sortedHand[0][0]);
    let isRegularStraight = true;
    for (let i = 1; i < sortedHand.length; i++) {
        if (ranks.indexOf(sortedHand[i][0]) !== startRank + i) {
            isRegularStraight = false;
            break;
        }
    }

    // Check for straight with Ace as the lowest card
    let isAceLowStraight = sortedHand[0][0] === 'A' && sortedHand[1][0] === '2';
    if (isAceLowStraight) {
        startRank = ranks.indexOf(sortedHand[1][0]);
        for (let i = 2; i < sortedHand.length; i++) {
            if (ranks.indexOf(sortedHand[i][0]) !== startRank + i - 1) {
                isAceLowStraight = false;
                break;
            }
        }
    }

    return isRegularStraight || isAceLowStraight;
};

const isFourOfAKind = (rankCounts) => {
    return Object.values(rankCounts).includes(4);
};

const isThreeOfAKind = (rankCounts) => {
    return Object.values(rankCounts).includes(3);
};

const isTwoPairs = (rankCounts) => {
    return Object.values(rankCounts).filter(count => count === 2).length === 2;
};

const isOnePair = (rankCounts) => {
    return Object.values(rankCounts).filter(count => count === 2).length === 1;
};


const isFullHouse = (rankCounts) => {
    return Object.values(rankCounts).includes(3) && Object.values(rankCounts).includes(2);
};


// Simulate a game and determine if our hand wins
const simulateGame = (ourHand, deck) => {
    let shuffledDeck = [...deck];
    shuffledDeck = shuffledDeck.filter(card => !ourHand.includes(card));  // Remove our cards from the deck
    shuffledDeck.sort(() => 0.5 - Math.random());  // Shuffle the deck

    const communityCards = shuffledDeck.slice(0, 5);
    const opponent1Hand = shuffledDeck.slice(5, 7);
    const opponent2Hand = shuffledDeck.slice(7, 9);

    const ourStrength = evaluateHand(ourHand.concat(communityCards));
    const opponent1Strength = evaluateHand(opponent1Hand.concat(communityCards));
    const opponent2Strength = evaluateHand(opponent2Hand.concat(communityCards));

    if (ourStrength > opponent1Strength && ourStrength > opponent2Strength) {
        return 'win';
    } else if (ourStrength < opponent1Strength || ourStrength < opponent2Strength) {
        return 'lose';
    } else {
        return 'tie';
    }
};

const simulateGameAfterFlop = (ourHand, flop, deck) => {
    let shuffledDeck = [...deck];
    shuffledDeck = shuffledDeck.filter(card => !ourHand.includes(card) && !flop.includes(card));  // Remove our cards and the flop from the deck
    shuffledDeck.sort(() => 0.5 - Math.random());  // Shuffle the deck

    const turnAndRiver = shuffledDeck.slice(0, 2);  // Only two more community cards after the flop
    const communityCards = flop.concat(turnAndRiver);
    
    const opponent1Hand = shuffledDeck.slice(2, 4);
    const opponent2Hand = shuffledDeck.slice(4, 6);

    const ourStrength = evaluateHand(ourHand.concat(communityCards));
    const opponent1Strength = evaluateHand(opponent1Hand.concat(communityCards));
    const opponent2Strength = evaluateHand(opponent2Hand.concat(communityCards));

    if (ourStrength > opponent1Strength && ourStrength > opponent2Strength) {
        return 'win';
    } else if (ourStrength < opponent1Strength || ourStrength < opponent2Strength) {
        return 'lose';
    } else {
        return 'tie';
    }
};

const simulateGameAfterTurn = (ourHand, flop, turn, deck) => {
    let shuffledDeck = [...deck];
    shuffledDeck = shuffledDeck.filter(card => !ourHand.includes(card) && !flop.includes(card) && card !== turn);  // Remove our cards, the flop, and the turn from the deck
    shuffledDeck.sort(() => 0.5 - Math.random());  // Shuffle the deck

    const river = shuffledDeck[0];  // Only one more community card after the turn
    const communityCards = flop.concat(turn, river);
    
    const opponent1Hand = shuffledDeck.slice(1, 3);
    const opponent2Hand = shuffledDeck.slice(3, 5);

    const ourStrength = evaluateHand(ourHand.concat(communityCards));
    const opponent1Strength = evaluateHand(opponent1Hand.concat(communityCards));
    const opponent2Strength = evaluateHand(opponent2Hand.concat(communityCards));

    if (ourStrength > opponent1Strength && ourStrength > opponent2Strength) {
        return 'win';
    } else if (ourStrength < opponent1Strength || ourStrength < opponent2Strength) {
        // Log the hands when our hand is evaluated as weaker than one of the opponents
        logger.info(`Our Hand: ${ourHand.concat(communityCards).join(', ')}`);
        logger.info(`Opponent 1 Hand: ${opponent1Hand.concat(communityCards).join(', ')}`);
        logger.info(`Opponent 2 Hand: ${opponent2Hand.concat(communityCards).join(', ')}`);
        return 'lose';
    } else {
        // Log the hands when our hand is evaluated as a tie with one of the opponents
        logger.info(`TIE - Our Hand: ${ourHand.concat(communityCards).join(', ')}`);
        logger.info(`TIE - Opponent 1 Hand: ${opponent1Hand.concat(communityCards).join(', ')}`);
        logger.info(`TIE - Opponent 2 Hand: ${opponent2Hand.concat(communityCards).join(', ')}`);
        return 'tie';
    }
};

const simulateGameAfterRiver = (ourHand, flop, turn, river, deck) => {
    let shuffledDeck = [...deck];
    shuffledDeck = shuffledDeck.filter(card => !ourHand.includes(card) && !flop.includes(card) && card !== turn && card !== river);  // Remove our cards, the flop, the turn, and the river from the deck
    shuffledDeck.sort(() => 0.5 - Math.random());  // Shuffle the deck

    const communityCards = flop.concat(turn, river);
    
    const opponent1Hand = shuffledDeck.slice(0, 2);
    const opponent2Hand = shuffledDeck.slice(2, 4);

    const ourStrength = evaluateHand(ourHand.concat(communityCards));
    const opponent1Strength = evaluateHand(opponent1Hand.concat(communityCards));
    const opponent2Strength = evaluateHand(opponent2Hand.concat(communityCards));

    if (ourStrength > opponent1Strength && ourStrength > opponent2Strength) {
        return 'win';
    } else if (ourStrength < opponent1Strength || ourStrength < opponent2Strength) {
        logger.info(`Our Hand: ${ourHand.concat(communityCards).join(', ')}`);
        logger.info(`Opponent 1 Hand: ${opponent1Hand.concat(communityCards).join(', ')}`);
        logger.info(`Opponent 2 Hand: ${opponent2Hand.concat(communityCards).join(', ')}`);
        return 'lose';
    } else {
        logger.info(`TIE - Our Hand: ${ourHand.concat(communityCards).join(', ')}`);
        logger.info(`TIE - Opponent 1 Hand: ${opponent1Hand.concat(communityCards).join(', ')}`);
        logger.info(`TIE - Opponent 2 Hand: ${opponent2Hand.concat(communityCards).join(', ')}`);
        return 'tie';
    }
};


module.exports = {
    generateDeck,
    simulateGame,
    simulateGameAfterFlop,
    simulateGameAfterTurn,
    simulateGameAfterRiver
};
