const modal = document.getElementById('cardModal');
const closeBtn = document.querySelector('.close-btn');
const emptyCards = document.querySelectorAll('.card.empty');
const deckContainer = document.querySelector('.deck');

const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const suits = ['C', 'D', 'H', 'S'];

let playerSelectedCards = [];
let flopSelectedCards = [];
let turnSelectedCards = null;
let riverSelectedCards = null;

// Generate the deck of cards in the modal
ranks.forEach(rank => {
    suits.forEach(suit => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.style.backgroundImage = `url('./Assets/${suit}/${rank}.png')`;
        card.innerText = rank + suit;
        deckContainer.appendChild(card);
    });
});

let selectedEmptyCard = null;  // To keep track of which empty card was clicked

// Show the modal when an empty card is clicked
emptyCards.forEach(card => {
    card.addEventListener('click', () => {
        selectedEmptyCard = card;  // Update the selectedEmptyCard
        modal.style.display = 'block';
    });
});

// Close the modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close the modal when clicking outside of it
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('card') && e.target.classList.contains('empty')) {
        selectedEmptyCard = e.target;  // Update the selectedEmptyCard
        modal.style.display = 'block';
    }
});

function checkPlayerCards() {
    if (playerSelectedCards.length === 2 && flopSelectedCards.length ===0) {
        const centerCards = document.querySelectorAll('.center-card.locked');
        for (let i = 0; i < 3; i++) {  // Only unlock the first 3 center cards
            centerCards[i].classList.remove('locked');
            centerCards[i].classList.add('empty');
        }
    } else if (playerSelectedCards.length === 2 && flopSelectedCards.length === 3 && turnSelectedCards===null){
        const turnEmptyCard = document.querySelectorAll('.turn');
        turnEmptyCard[0].classList.remove('locked');
        turnEmptyCard[0].classList.add('empty');
    } else if (playerSelectedCards.length === 2 && flopSelectedCards.length === 3 && turnSelectedCards != null && riverSelectedCards===null){
        const riverEmptyCard = document.querySelectorAll('.river');
        riverEmptyCard[0].classList.remove('locked');
        riverEmptyCard[0].classList.add('empty');
    }
}



// Function to handle card selection from the modal
function handleCardSelection(event) {
    const selectedCard = event.target;

    // Copy the backgroundImage style from the selected card to the empty card
    selectedEmptyCard.style.backgroundImage = selectedCard.style.backgroundImage;

    // Replace the empty card's content with the selected card's content
    selectedEmptyCard.innerText = selectedCard.innerText;
    selectedEmptyCard.classList.remove('empty');  // Remove the 'empty' class

    // Check if the selectedEmptyCard is a player card or a center card
    if (selectedEmptyCard.classList.contains('bottom-card')) {
        // Add the selected card to the playerSelectedCards array
        playerSelectedCards.push(selectedCard.innerText);
    } else if (selectedEmptyCard.classList.contains('center-card') && flopSelectedCards.length < 3) {
        // Add the selected card to the flopSelectedCards array
        flopSelectedCards.push(selectedCard.innerText);
    } else if (selectedEmptyCard.classList.contains('turn') && turnSelectedCards === null){
        turnSelectedCards = selectedCard.innerText;
    } else if (selectedEmptyCard.classList.contains('river') && turnSelectedCards!=null && riverSelectedCards===null){
        riverSelectedCards = selectedCard.innerText;
    }

    selectedCard.innerText = '';  // Clear the innerText of the selected card

    // Remove the selected card from the modal's deck
    selectedCard.remove();

    // Close the modal
    modal.style.display = 'none';

    // Check if playerSelectedCards has 2 cards
    checkPlayerCards();
}


// Show the modal when an empty card is clicked
emptyCards.forEach(card => {
    card.addEventListener('click', () => {
        selectedEmptyCard = card;  // Update the selectedEmptyCard
        modal.style.display = 'block';

        // Check if the card's content is in the playerSelectedCards array
        const cardIndex = playerSelectedCards.indexOf(card.innerText);
        if (cardIndex !== -1) {
            // Remove the card from the playerSelectedCards array
            playerSelectedCards.splice(cardIndex, 1);
        }
    });
});

// Add event listener to each card in the modal
deckContainer.addEventListener('click', handleCardSelection);

calculateOddsBtn.addEventListener('click', async () => {
    
    if (playerSelectedCards.length === 2 && flopSelectedCards.length === 0) {
        console.log(playerSelectedCards)
        console.log("odds")
        try {
            const response = await fetch('http://localhost:3001/calculate-odds', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cards: playerSelectedCards })
            });
            
            const data = await response.json();
            console.log(data);
            
            // Update the winning percentage display
            const winningPercentageElement = document.querySelector('.winning-percentage');
            winningPercentageElement.textContent = `Winning %: ${data.win.toFixed(2)}`;  // Displaying up to 2 decimal places
            
        } catch (error) {
            console.error('Error sending request:', error);
        }
    } else if(playerSelectedCards.length === 2 && flopSelectedCards.length === 3 && turnSelectedCards===null){
        console.log(playerSelectedCards)
        console.log(flopSelectedCards)
        console.log(turnSelectedCards)
        console.log("flop")
        try {
            const response = await fetch('http://localhost:3001/calculate-odds-after-flop', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cards: playerSelectedCards, flop : flopSelectedCards })
            });
            
            const data = await response.json();
            console.log(data);

            // Update the winning percentage display
            const winningPercentageElement = document.querySelector('.winning-percentage');
            winningPercentageElement.textContent = `Winning %: ${data.win.toFixed(2)}`;  // Displaying up to 2 decimal places
            
        } catch (error) {
            console.error('Error sending request:', error);
        }
    } else if(playerSelectedCards.length === 2 && flopSelectedCards.length === 3 && turnSelectedCards!=null && riverSelectedCards===null){
        console.log(playerSelectedCards)
        console.log(flopSelectedCards)
        console.log(turnSelectedCards)
        console.log("turn")
        try {
            const response = await fetch('http://localhost:3001/calculate-odds-after-turn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cards: playerSelectedCards, flop : flopSelectedCards, turn: turnSelectedCards })
            });
            
            const data = await response.json();
            console.log(data);
            
            // Update the winning percentage display
            const winningPercentageElement = document.querySelector('.winning-percentage');
            winningPercentageElement.textContent = `Winning %: ${data.win.toFixed(2)}`;  // Displaying up to 2 decimal places
            
        } catch (error) {
            console.error('Error sending request:', error);
        }
    } else if(playerSelectedCards.length === 2 && flopSelectedCards.length === 3 && turnSelectedCards!=null && riverSelectedCards!=null){
        try {
            console.log(playerSelectedCards)
            console.log(flopSelectedCards)
            console.log(turnSelectedCards)
            console.log(riverSelectedCards)
            console.log("river")
            const response = await fetch('http://localhost:3001/calculate-odds-after-river', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cards: playerSelectedCards, flop : flopSelectedCards, turn: turnSelectedCards, river: riverSelectedCards })
            });

            const data = await response.json();
            console.log(data);

            // Update the winning percentage display
            const winningPercentageElement = document.querySelector('.winning-percentage');
            winningPercentageElement.textContent = `Winning %: ${data.win.toFixed(2)}`;  // Displaying up to 2 decimal places

        } catch (error) {
            console.error('Error sending request:', error);
        }
    } 
    else {
        alert('Please select only your two cards to calculate pre-flop odds.');
    }
});

function resetGame() {
    // Clear playerSelectedCards, flopSelectedCards, turnSelectedCards, and riverSelectedCards
    playerSelectedCards = [];
    flopSelectedCards = [];
    turnSelectedCards = null;
    riverSelectedCards = null;

    // Reset all cards to their initial state
    document.querySelectorAll('.card').forEach(card => {
        card.innerText = '';
        card.style.backgroundImage = '';
        card.classList.add('empty');
        card.classList.remove('locked');
    });

    // Regenerate the deck in the modal
    deckContainer.innerHTML = '';  // Clear the current deck
    ranks.forEach(rank => {
        suits.forEach(suit => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.style.backgroundImage = `url('./Assets/${suit}/${rank}.png')`;
            deckContainer.appendChild(card);
        });
    });
}
const resetBtn = document.getElementById('resetBtn');
resetBtn.addEventListener('click', resetGame);
