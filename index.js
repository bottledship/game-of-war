//Queries
const newDeckBtn = document.getElementById("new-deck")
const drawCardsBtn = document.getElementById("draw-card")
const cardsContainer = document.getElementsByClassName("card-container")
const deckIdHolder = document.getElementById("deck-id-holder")
const deckIdDisplay = document.getElementById("deck-id")
const theWinner = document.getElementById("the-winner")
const cardsRemainP = document.getElementById("cards-remain")
const playerScoreSpan = document.getElementById("player-score")
const computerScoreSpan = document.getElementById("computer-score")
let deckId
let playerScore = 0
let computerScore = 0

//Event Listeners
newDeckBtn.addEventListener("click", handleClick)
drawCardsBtn.addEventListener("click", drawCards)

//Functions
function handleClick() {
    theWinner.textContent = "Let's go! 💪"
    playerScore = 0
    computerScore = 0
    playerScoreSpan.textContent = "0"
    computerScoreSpan.textContent = "0"
    fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            deckId = data.deck_id
            deckIdDisplay.textContent = deckId
            deckIdHolder.style.display = "block"
            cardsRemainP.textContent = `Cards remaining: ${data.remaining}`
        })
        drawCardsBtn.style.display = "inline-block"
}

function drawCards() {
    for (let i = 0; i < cardsContainer.length; i++) {
        cardsContainer[i].innerHTML = ""
    }
    fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
        .then(res => res.json())
        .then(drawnCards => {
            cardsRemainP.textContent = `Cards remaining: ${drawnCards.remaining}`
            //postmortem: pass in just the array of cards! (not the entire response)
            displayCards(drawnCards.cards)
            updateWinner(compareCards(drawnCards.cards))

            if (drawnCards.remaining === 0) {
                drawCardsBtn.disabled = true
                drawCardsBtn.style.background = "maroon";
                drawCardsBtn.textContent = "Game Over"
                
                if (playerScore > computerScore) {
                    theWinner.textContent = "🦍 Ape won the game! 🍌"
                }
                else if (computerScore > playerScore) {
                    theWinner.textContent = "🤖 Computer won :( 💀"
                }
                else {
                    theWinner.textContent = "STALEMATE 😊"
                }
                
            }

        })
}


function displayCards(cards) {
    for (const [index, card] of cards.entries()) {
        //using string interpolation to insert the url and code into an img tag.
        cardsContainer[index].innerHTML += `<img src="${card.images.png}" alt="${card.code}">`
    }
}

function compareCards(cards) {
    //Convert cards values to number.
    const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9", 
    "10", "JACK", "QUEEN", "KING", "ACE"]
    
    const card1Value = valueOptions.indexOf(cards[0].value)
    const card2Value = valueOptions.indexOf(cards[1].value)

    if (card1Value === card2Value) {
        return "tie"
    }
    else if (card1Value > card2Value) {
        return "card1"
    }
    else {
        return "card2"
    }

}

function updateWinner(who) {
    if (who === "tie") {
        theWinner.textContent = "It's a War!"
    }
    else if (who === "card1") {
        theWinner.textContent = "Computer wins!"
        computerScore += 1
        computerScoreSpan.textContent = computerScore
    }
    else {
        theWinner.textContent = "You win!"
        playerScore += 1
        playerScoreSpan.textContent = playerScore
    }

}