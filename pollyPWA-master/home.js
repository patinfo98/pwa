// Create the worker
let initComplete = false;
let onLoadComplete = false;
let elements = {}; // Declare the elements object
const worker = new Worker(new URL('webworker.js', import.meta.url), { type: 'module' });

// Function to handle the fetched data
const onDataFetched = (data) => {
    initComplete = true;
    finishSetup(data);
};

// Send the "init" message to the worker to begin data fetching
worker.postMessage('init');

// Listen for data from the worker
worker.onmessage = function(event) {
    const data = event.data;
    onDataFetched(data); // Call the onDataFetched function when data is available
};

window.onload = function () {
    let ids = [
        "bigCard",
        "bigCardName",
        "bigCardVotes",
        "bigCardPinButton",
        "bigCardQuestion",
        "bigCardAnswerOne",
        "bigCardAnswerTwo",
        "skipButton", 
        "answerCard",
        "answerCardText",
        "answerCardTag",
        "answerCardPercent",
        "cardId",
        "outOfPollsContainer",
        "outOfPollsButton",
    ];
    getElementsById(ids);
    onLoadComplete = true;
    finishSetup();
};

function getElementsById(ids) {
    ids.forEach(id => {
        elements[id] = document.getElementById(id);
    });
}

function finishSetup(data) {
    if (!initComplete || !onLoadComplete) return;

    // Use data fetched from the worker in your logic
    pollList = data.polls;
    // Continue with the rest of the setup logic...
    elements.bigCardAnswerOne.addEventListener("click", function () { onCardFinished(1) });
    elements.bigCardAnswerTwo.addEventListener("click", function () { onCardFinished(2) });
    elements.outOfPollsButton.addEventListener("click", function () { resetPolls() });
    elements.skipButton.addEventListener("click", function () {
        addPollToSeen(); 
        getNextCard();
        updateCards();
        if(currentCard == -1) {
            showOutOfQuestions();
        } else {
            setCardData();
            showQuestionCard();
        }
    });
    elements.bigCardPinButton.addEventListener("click", function () { 
        addPollToSeen(true);
        setCardData();
        updateCards();
    });

    if(currentCard != -1) {
        setCardData();
    } else {
        showOutOfQuestions();
    }
}

function setCardData() {
    const cardData = pollList.find((poll) => {
        return (poll.id == currentCard)
    })
    let pinned = false 
    for(poll of seenPolls) { 
        if(poll.id == currentCard) {
            pinned = poll.pinned
            break
        }
    }
    const voteCount = cardData.votesOne + cardData.votesTwo
    const voteCountString = voteCount + " votes"
    elements.bigCardName.textContent = cardData.userName
    elements.bigCardVotes.textContent = voteCountString
    elements.bigCardQuestion.textContent = cardData.question
    elements.bigCardAnswerOne.textContent = cardData.answerOne
    elements.bigCardAnswerTwo.textContent = cardData.answerTwo
    elements.bigCard.style.background = cardData.color
    elements.bigCardPinButton.src = pinned ? "img/simple_pin_filled.svg" : "img/simple_pin_outline.svg"
}

function onCardFinished(voteOption) {
    for(const poll of pollList) {
        if (poll.id == currentCard) {
            console.log("running on Card finished: " + poll.id + " " + currentCard)
            if (voteOption == 1) {
                poll.votesOne++
                answerCardText.textContent = poll.answerOne
            } else {
                poll.votesTwo++
                answerCardText.textContent = poll.answerTwo
            }
            const voteCount = poll.votesOne + poll.votesTwo
            const votePercent = Math.round((voteOption == 1 ? poll.votesOne : poll.votesTwo) / voteCount * 100)
            answerCardPercent.textContent = votePercent + "%"
            if (votePercent > 50) {
                answerCardTag.textContent = "majority"
                answerCardTag.style.background = "rgb(101 129 35)"
            } else {
                answerCardTag.textContent = "minority"
                answerCardTag.style.background = "rgb(170 106 48)"
            }
            addPollToSeen()
            getNextCard()
            updateCards()
            showAnswerCard()
            break;
        }
    }
}

async function showAnswerCard() {
    answerCard.style.display = "flex"
    bigCard.style.display = "none"
    setTimeout(function () {
        if(currentCard == -1) {
            showOutOfQuestions()
        } else {
            setCardData()
            showQuestionCard()
        }
    }, 500);
}

function showQuestionCard() {
    answerCard.style.display = "none"
    outOfPollsContainer.style.display = "none"
    bigCard.style.display = "flex"
}

function showOutOfQuestions() {
    answerCard.style.display = "none"
    bigCard.style.display = "none"
    outOfPollsContainer.style.display = "flex"
}

function resetPolls() {
    seenPolls = []
    currentCard = 1
    updateCards()
    setCardData()
    showQuestionCard()

}

function getNextCard() {
    pollList = shuffle(pollList)
    const seenPollIds = seenPolls.map((poll) => { return poll.id })
    const nextPoll = pollList.find((poll) => { return !seenPollIds.includes(poll.id) })
    if (nextPoll !== undefined) {
        currentCard = nextPoll.id
    } else {
        currentCard = -1
    }
}

function addPollToSeen(toggle = false) {
    for(const seenPoll of seenPolls) {
        if(seenPoll.id == currentCard) {
            if(toggle) {
                seenPoll.pinned = !seenPoll.pinned
            }
            seenPoll.time = new Date()
            return
        }
    }
    seenPolls.push({
        id: currentCard, 
        pinned: toggle,
        time: new Date()})
}

//algorithm from https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/
function shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
}
