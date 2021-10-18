let blackjackData = {
    "you": { "scoreId": "#player__score", "div": "#player__row", "score": 0 },
    "dealer": { "scoreId": "#dealer__score", "div": "#dealer__row", "score": 0 },
    "cards": ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Q', 'K', 'J', 'A'],
    "cardsPoints": { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'Q': 10, 'K': 10, 'J': 10, 'A': [1, 11] },
    "isStand": false,
    // "IsRoundOver": false,
    "wins": 0,
    "losses": 0,
    "draws": 0,
};

const YOU = blackjackData["you"];
const DEALER = blackjackData["dealer"];
const CARDS = blackjackData["cards"];
const POINTS = blackjackData["cardsPoints"];

let wins = blackjackData["wins"];
let losses = blackjackData["losses"];
let draws = blackjackData["draws"];

let currentBalance = parseInt(document.getElementById("balance__money").innerText);
let currentBet = parseInt(document.getElementById("bet__num").innerText);

document.querySelector("#menu").addEventListener("click", function () {
    toggleClass(modal, "hide");
});

document.querySelector("#deal").addEventListener("click", function () {
    Deal();
});

document.querySelector("#double").addEventListener("click", function () {
    Double();
});

document.querySelector("#hit").addEventListener("click", function () {
    Hit();
});

document.querySelector("#stand").addEventListener("click", function () {
    DealerScript();
});

document.querySelector("#new_round").addEventListener("click", function () {
    resetInterface();
});

document.querySelector("#resume").addEventListener("click", function () {
    toggleClass(modal, "hide");
});

document.querySelector("#restart").addEventListener("click", function () {
    fullRestart();
});

document.querySelector("#show_stats").addEventListener("click", function () {
    toggleClass(stats, "hide");
    toggleClass(modal, "hide");

    if (!document.querySelector("#stats").className.includes("hide")) {
        document.querySelector("#toggle_show-hide").innerText = "Hide";
    } else {
        document.querySelector("#toggle_show-hide").innerText = "Show";
    }
});

document.querySelector("#chip_1").addEventListener("click", function () {
    addChipToBet(1);
});

document.querySelector("#chip_5").addEventListener("click", function () {
    addChipToBet(5);
});

document.querySelector("#chip_10").addEventListener("click", function () {
    addChipToBet(10);
});

document.querySelector("#chip_25").addEventListener("click", function () {
    addChipToBet(25);
});

document.querySelector("#chip_100").addEventListener("click", function () {
    addChipToBet(100);
});

function toggleClass(element, yourClass) {
    element.classList.toggle(yourClass);
}

function setBalanceAndBet() {
    document.getElementById("bet__num").innerText = currentBet;
    document.getElementById("balance__money").innerText = currentBalance;
}

function addChipToBet(chipName) {
    let chipImg = document.createElement("img");
    chipImg.src = `./images/Chips/${chipName}.png`;
    chipImg.className = "bet__chips-item";
    chipImg.id = `bet__chip-${chipName}`;

    if (chipName <= currentBalance) {
        currentBalance -= chipName;
        currentBet += chipName;

        if (!document.getElementById(chipImg.id)) {
            document.querySelector("#bet__chips").appendChild(chipImg);
        }
    } else {
        alert("Not enough money");
    }

    setBalanceAndBet();

    chipImg.onclick = function () {
        let chip = document.getElementById(`bet__chip-${chipName}`);

        if (!document.getElementById("table").className.includes("hide")) {

            if (currentBet >= chipName) {
                currentBalance += chipName;
                currentBet -= chipName;
                if (currentBet < chipName) {
                    chip.remove();
                }

                if (currentBet < 1) {
                    if (document.querySelector("#bet__chip-1")) {
                        document.querySelector("#bet__chip-1").remove();
                    }
                }
                if (currentBet < 5) {
                    if (document.querySelector("#bet__chip-5")) {
                        document.querySelector("#bet__chip-5").remove();
                    }
                }
                if (currentBet < 10) {
                    if (document.querySelector("#bet__chip-10")) {
                        document.querySelector("#bet__chip-10").remove();
                    }
                }
                if (currentBet < 25) {
                    if (document.querySelector("#bet__chip-25")) {
                        document.querySelector("#bet__chip-25").remove();
                    }
                }
                if (currentBet < 100) {
                    if (document.querySelector("#bet__chip-100")) {
                        document.querySelector("#bet__chip-100").remove();
                    }
                }
            }

            setBalanceAndBet();
        }
    }
}

function randomNum() {
    let random = Math.floor(Math.random() * 13);
    return CARDS[random];
}

function Deal() {
    if (currentBet != 0) {
        toggleClass(table, "hide");
        toggleClass(deal, "hide");
        toggleClass(controls, "hide");

        if (document.getElementById("hit").className.includes("hide")) {
            toggleClass(hit, "hide");
        }

        if (document.getElementById("stand").className.includes("hide")) {
            toggleClass(stand, "hide");
        }
    } else {
        alert("Place a bet first");
    }
}

let i = 0;

function Hit() {
    if (blackjackData["isStand"] === false) {
        let card = randomNum();
        addCard(card, YOU);
        setScore(card, YOU);
        showScore(YOU);

        i++;
        if (i === 2) {
            toggleClass(double, "hide");
        } else if (i > 2) {
            i = undefined;

            if (!document.getElementById("double").className.includes("hide")) {
                toggleClass(double, "hide");
            }
        }
    }
}

function addCard(card, activePlayer) {
    if (activePlayer["score"] <= 21) {
        let cardImg = document.createElement("img");
        cardImg.src = `./images/Cards/${card}.png`;
        cardImg.className = "card__item";

        document.querySelector(activePlayer['div']).appendChild(cardImg);
    }
}

function setScore(card, activePlayer) {
    if (card === "A") {

        if (activePlayer["score"] + POINTS[card][1] <= 21) {
            activePlayer["score"] += POINTS[card][1];
        } else {
            activePlayer["score"] += POINTS[card][0];
        }

    } else {
        activePlayer["score"] += POINTS[card];
    }
}

function showScore(activePlayer) {
    if (activePlayer["score"] > 21) {
        document.querySelector(activePlayer["scoreId"]).innerText = "LOST";
        document.querySelector(activePlayer["scoreId"]).style.color = "red";
        document.querySelector(activePlayer["scoreId"]).style.fontWeight = "700";

        if (!document.getElementById("hit").className.includes("hide")) {
            toggleClass(hit, "hide");
        }
    } else if (activePlayer["score"] == 21) {
        document.querySelector(activePlayer["scoreId"]).innerText = activePlayer["score"];
        document.querySelector(activePlayer["scoreId"]).style.color = "#4e9e00";
        document.querySelector(activePlayer["scoreId"]).style.fontWeight = "700";
    }
    else {
        document.querySelector(activePlayer["scoreId"]).innerText = activePlayer["score"];
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function DealerScript() {
    blackjackData["isStand"] = true;

    toggleClass(stand, "hide");
    if (!document.getElementById("hit").className.includes("hide")) {
        toggleClass(hit, "hide");
    }

    if (!document.getElementById("double").className.includes("hide")) {
        toggleClass(double, "hide");
    }

    while (DEALER["score"] < 17 && blackjackData["isStand"] === true) {
        let card = randomNum();
        addCard(card, DEALER);
        setScore(card, DEALER);
        showScore(DEALER);
        await wait(1000);
    }

    // blackjackData["IsRoundOver"] = true;
    let winner = chooseWinner();
    showWinner(winner);
    toggleClass(new_round, "hide");
}

function chooseWinner() {
    let winner;

    if (YOU["score"] <= 21) {

        if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21) {
            winner = YOU;
        } else if (YOU["score"] < DEALER["score"]) {
            winner = DEALER;
        } else if (YOU["score"] === DEALER["score"]) {
            winner = undefined;
        }

    } else if (YOU["score"] > 21 && DEALER["score"] <= 21) {
        winner = DEALER;
    } else if (YOU["score"] > 21 && DEALER["score"] > 21) {
        winner = undefined;
    }

    return winner;
}

function showWinner(winner) {
    let message, messageColor;

    if (winner === YOU) {
        message = "You won!";
        messageColor = "#4e9e00";

        wins += 1;
        document.querySelector("#wins__count").innerText = wins;
    } else if (winner === DEALER) {
        message = "You lost!";
        messageColor = "red";

        losses += 1;
        document.querySelector("#losses__count").innerText = losses;
    } else {
        message = "Draw!";
        messageColor = "#ffffff";

        draws += 1;
        document.querySelector("#draws__count").innerText = draws;
    }

    document.querySelector("#winner").innerText = message;
    document.querySelector("#winner").style.color = messageColor;
}

function Double() {
    if (blackjackData["isStand"] === false) {
        currentBalance -= currentBet;
        document.getElementById("balance__money").innerText = currentBalance;
        currentBet *= 2;
        document.getElementById("bet__num").innerText = currentBet;
        Hit();
        blackjackData["isStand"] = true;

        if (!document.getElementById("double").className.includes("hide")) {
            toggleClass(double, "hide");
        }
    }
}

function resetScore() {
    YOU["score"] = 0;
    DEALER["score"] = 0;

    document.querySelector(YOU["scoreId"]).innerText = YOU["score"];
    document.querySelector(YOU["scoreId"]).style.color = "#ffffff";
    document.querySelector(YOU["scoreId"]).style.fontWeight = "400";

    document.querySelector(DEALER["scoreId"]).innerText = DEALER["score"];
    document.querySelector(DEALER["scoreId"]).style.color = "#ffffff";
    document.querySelector(DEALER["scoreId"]).style.fontWeight = "400";
}

function updateBalance() {
    if (chooseWinner() === YOU) {
        currentBalance += currentBet * 2;
    } else if (chooseWinner() === undefined) {
        currentBalance += currentBet;
    }

    document.getElementById("balance__money").innerText = currentBalance;
}

function clearBet() {
    const betChips = document.querySelector("#bet__chips");
    while (betChips.firstChild) {
        betChips.firstChild.remove()
    };

    currentBet = 0;
    document.getElementById("bet__num").innerText = currentBet;
}

function clearCards() {
    const playerCards = document.querySelector(YOU["div"]);
    const dealerCards = document.querySelector(DEALER["div"]);

    while (playerCards.firstChild) playerCards.firstChild.remove();
    while (dealerCards.firstChild) dealerCards.firstChild.remove();
}

function resetInterface() {
    updateBalance();
    resetScore();
    clearCards();
    clearBet();

    document.querySelector("#winner").innerText = "";

    blackjackData["isStand"] = false;
    // blackjackData["IsRoundOver"] = false;

    toggleClass(table, "hide");
    toggleClass(deal, "hide");
    toggleClass(controls, "hide");
    toggleClass(stand, "hide");
    toggleClass(hit, "hide");

    if (!document.getElementById("double").className.includes("hide")) {
        toggleClass(double, "hide");
    }

    if (!document.getElementById("new_round").className.includes("hide")) {
        toggleClass(new_round, "hide");
    }

    i = 0;
}

function fullRestart() {
    resetScore();
    clearCards();
    clearBet();

    document.querySelector("#winner").innerText = "";

    // setTimeout(function () {
    //     document.querySelector("#winner").innerText = "";
    // }, 1000);

    blackjackData["isStand"] = false;

    wins = 0;
    losses = 0;
    draws = 0;

    document.querySelector("#wins__count").innerText = wins;
    document.querySelector("#losses__count").innerText = losses;
    document.querySelector("#draws__count").innerText = draws;
    // blackjackData["IsRoundOver"] = false;
    currentBalance = 3000;
    document.getElementById("balance__money").innerText = currentBalance;
    toggleClass(modal, "hide");

    if (!document.getElementById("hit").className.includes("hide")) {
        toggleClass(hit, "hide");
    }

    if (!document.getElementById("stand").className.includes("hide")) {
        toggleClass(stand, "hide");
    }

    if (!document.getElementById("double").className.includes("hide")) {
        toggleClass(double, "hide");
    }

    if (!document.getElementById("new_round").className.includes("hide")) {
        toggleClass(new_round, "hide");
    }

    if (document.getElementById("table").className.includes("hide")) {
        toggleClass(table, "hide");
    }

    if (document.getElementById("deal").className.includes("hide")) {
        toggleClass(deal, "hide");
    }

    if (!document.getElementById("controls").className.includes("hide")) {
        toggleClass(controls, "hide");
    }

    i = 0;
}









