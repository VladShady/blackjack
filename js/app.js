let blackjackData = {
    "you": { "scoreId": "#player__score", "div": "#player__row", "score": 0 },
    "dealer": { "scoreId": "#dealer__score", "div": "#dealer__row", "score": 0 },
    "cards": ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Q', 'K', 'J', 'A'],
    "cardsPoints": { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'Q': 10, 'K': 10, 'J': 10, 'A': [1, 11] },
    "isStand": false,
    "isDealerPlaying": false,
    "wins": 0,
    "losses": 0,
    "draws": 0,
};

const YOU = blackjackData["you"];
const DEALER = blackjackData["dealer"];
const CARDS = blackjackData["cards"];
const POINTS = blackjackData["cardsPoints"];

let winsNum = blackjackData["wins"];
let lossesNum = blackjackData["losses"];
let drawsNum = blackjackData["draws"];

document.querySelector("#balance__money").innerText = localStorage.getItem("balance");

document.querySelector("#wins__count").innerText = localStorage.getItem("wins");
document.querySelector("#losses__count").innerText = localStorage.getItem("losses");
document.querySelector("#draws__count").innerText = localStorage.getItem("draws");

let currentBalance = parseInt(document.getElementById("balance__money").innerText);
let currentBet = parseInt(document.getElementById("bet__num").innerText);

let wins = parseInt(localStorage.getItem("wins"));
let losses = parseInt(localStorage.getItem("losses"));
let draws = parseInt(localStorage.getItem("draws"));

checkChips(500, 5000, chip_1);
checkChips(1000, 10000, chip_5);
checkChips(5000, 30000, chip_10);

document.querySelector("#menu").addEventListener("click", function () {
    toggleClass(modal, "hide");
});

document.querySelector("#deal").addEventListener("click", function () {
    Deal();
});

document.querySelector("#all_in").addEventListener("click", function () {
    allIn();
})

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

                removeChip(1);
                removeChip(5);
                removeChip(10);
                removeChip(25);
                removeChip(100);
                removeChip(500);
                removeChip(1000);
                removeChip(5000);
            }
            setBalanceAndBet();
        }
    }
}

function removeChip(chipNum) {
    if (currentBet < chipNum && document.querySelector(`#bet__chip-${chipNum}`)) {
        document.querySelector(`#bet__chip-${chipNum}`).remove();
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
        toggleClass(all_in, "hide");

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

function allIn() {
    if (currentBalance === 0 && currentBet != 0) {
        currentBalance += currentBet;
        currentBet = 0;
        document.querySelector("#all_in").innerText = "All in";
    } else if (currentBalance != 0) {
        currentBet += currentBalance;
        currentBalance = 0;
        document.querySelector("#all_in").innerText = "Undo";
    }

    setBalanceAndBet();
}

let i = 0;

function Hit() {
    if (blackjackData["isStand"] === false) {
        let card = randomNum();
        addCard(card, YOU);
        setScore(card, YOU);
        showScore(YOU);

        i++;
        if (i === 2 && YOU["score"] != 21) {
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

        document.querySelector(activePlayer["div"]).appendChild(cardImg);
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

        if (!document.getElementById("hit").className.includes("hide")) {
            toggleClass(hit, "hide");
        }
    } else {
        document.querySelector(activePlayer["scoreId"]).innerText = activePlayer["score"];
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function DealerScript() {
    blackjackData["isStand"] = true;
    blackjackData["isDealerPlaying"] = true;

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

    let winner = chooseWinner();
    showWinner(winner);
    toggleClass(new_round, "hide");
    blackjackData["isDealerPlaying"] = false;
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
    } else if (winner === DEALER) {
        message = "You lost!";
        messageColor = "red";

        losses += 1;
    } else {
        message = "Draw!";
        messageColor = "#ffffff";

        draws += 1;
    }

    localStorage.setItem("wins", wins);
    localStorage.setItem("losses", losses);
    localStorage.setItem("draws", draws);

    document.querySelector("#wins__count").innerText = localStorage.getItem("wins");
    document.querySelector("#losses__count").innerText = localStorage.getItem("losses");
    document.querySelector("#draws__count").innerText = localStorage.getItem("draws");

    document.querySelector("#winner").innerText = message;
    document.querySelector("#winner").style.color = messageColor;
}

function Double() {
    if (blackjackData["isStand"] === false) {
        if (currentBalance < currentBet) {
            alert("Not enough money");
        } else {
            currentBalance -= currentBet;
            document.getElementById("balance__money").innerText = currentBalance;
            currentBet *= 2;
            document.getElementById("bet__num").innerText = currentBet;
            Hit();
            blackjackData["isStand"] = true;

            if (!document.getElementById("hit").className.includes("hide")) {
                toggleClass(hit, "hide");
            }
        }

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

function restoreChips() {

    if (currentBalance < 30000 && document.querySelector("#chip_5000")) {
        document.querySelector("#chip_5000").remove();

        toggleClass(chip_10, "hide");
    }


    if (currentBalance < 10000 && document.querySelector("#chip_1000")) {
        document.querySelector("#chip_1000").remove();

        toggleClass(chip_5, "hide");
    }

    if (currentBalance < 5000 && document.querySelector("#chip_500")) {
        document.querySelector("#chip_500").remove();

        toggleClass(chip_1, "hide");
    }
}

function checkChips(chipname, balanceLvl, chipToRemove) {
    let chipImg = document.createElement("img");
    let chipsRow = document.querySelector("#chips__row");
    chipImg.className = "chips__item";

    if (currentBalance >= balanceLvl && !document.querySelector(`#chip_${chipname}`)) {
        chipImg.id = `chip_${chipname}`;
        chipImg.src = `./images/Chips/${chipname}.png`;
        toggleClass(chipToRemove, "hide");
        chipsRow.appendChild(chipImg);

        document.querySelector(`#chip_${chipname}`).addEventListener("click", function () {
            addChipToBet(chipname);
        });
    }
}

function replaceChip() {
    restoreChips();

    checkChips(500, 5000, chip_1);
    checkChips(1000, 10000, chip_5);
    checkChips(5000, 30000, chip_10);
}


function updateBalance() {
    if (chooseWinner() === YOU) {
        if (YOU["score"] === 21) {
            currentBalance += currentBet * 2.5;
        } else {
            currentBalance += currentBet * 2;
        }
    } else if (chooseWinner() === undefined) {
        currentBalance += currentBet;
    }

    currentBalance = Math.round(currentBalance);

    document.getElementById("balance__money").innerText = currentBalance;
    localStorage.setItem("balance", currentBalance);
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
    replaceChip();

    document.querySelector("#winner").innerText = "";
    document.querySelector("#all_in").innerText = "All in";

    blackjackData["isStand"] = false;

    toggleClass(table, "hide");
    toggleClass(deal, "hide");
    toggleClass(controls, "hide");
    toggleClass(stand, "hide");
    toggleClass(hit, "hide");

    if (document.getElementById("double").className.includes("hide")) {
        toggleClass(all_in, "hide");
    }

    if (!document.getElementById("double").className.includes("hide")) {
        toggleClass(double, "hide");
    }

    if (!document.getElementById("new_round").className.includes("hide")) {
        toggleClass(new_round, "hide");
    }

    i = 0;
}

function fullRestart() {
    if (blackjackData["isDealerPlaying"] === false) {

        resetScore();
        clearCards();
        clearBet();

        document.querySelector("#winner").innerText = "";
        document.querySelector("#all_in").innerText = "All in";

        blackjackData["isStand"] = false;

        wins = 0;
        losses = 0;
        draws = 0;

        document.querySelector("#wins__count").innerText = wins;
        document.querySelector("#losses__count").innerText = losses;
        document.querySelector("#draws__count").innerText = draws;
        // currentBalance = 3000;
        localStorage.setItem("balance", 3000);
        localStorage.setItem("wins", 0);
        localStorage.setItem("losses", 0);
        localStorage.setItem("draws", 0);

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

        if (document.getElementById("all_in").className.includes("hide")) {
            toggleClass(all_in, "hide");
        }

        if (!document.getElementById("controls").className.includes("hide")) {
            toggleClass(controls, "hide");
        }

        i = 0;

        restoreChips();
        location.reload();
    }
}









