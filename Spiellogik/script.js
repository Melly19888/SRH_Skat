"use strict";
// Canvas und Kontexte definieren
const spielfeld = document.getElementById('spielfeld');
const canvasSecondary = document.getElementById('canvasSecondary');
const thirdCanvas = document.getElementById('thirdCanvas');
const innerCanvas = document.getElementById('innerCanvas');
const ctx = spielfeld.getContext('2d');
const ctxSecondary = canvasSecondary.getContext('2d');
const ctxthirdCanvas = thirdCanvas.getContext('2d');
const startGameBtn = document.getElementById('startGameBtn');
const cardWidth = 170;
const cardHeight = 200;
const player1Points = document.getElementById('player1Points');
const player2Points = document.getElementById('player2Points');
const player3Points = document.getElementById('player3Points');
// Startposition der Karten
const startY = spielfeld.height - cardHeight;
const spielWerte = new Map([
            ['karo', 9],
            ['herz', 10],
            ['pik', 11],
            ['kreuz', 12],
            ['null', 23],
            ['nullHand', 35],
            ['nullover', 46],
            ['grand', 24],
            ['nulloverHand', 59]
        ]);
// Array mit Kartennamen erstellen und mischen
const cards = ['img/card1.gif', 'img/card2.gif', 'img/card3.gif', 'img/card4.gif',
    'img/card5.gif', 'img/card6.gif', 'img/card7.gif', 'img/card8.gif', 'img/card9.gif',
    'img/card10.gif', 'img/card11.gif', 'img/card12.gif', 'img/card13.gif', 'img/card14.gif',
    'img/card15.gif', 'img/card16.gif', 'img/card17.gif', 'img/card18.gif', 'img/card19.gif',
    'img/card20.gif', 'img/card21.gif', 'img/card22.gif', 'img/card23.gif', 'img/card24.gif',
    'img/card25.gif', 'img/card26.gif', 'img/card27.gif', 'img/card28.gif', 'img/card29.gif',
    'img/card30.gif', 'img/card31.gif', 'img/card32.gif']; // Hier sind alle Kartennamen aufgeführt
const cardWerte = new Map([
            ['img/card1.gif', 2],
            ['img/card2.gif', 2],
            ['img/card3.gif', 2],
            ['img/card4.gif', 2],
            ['img/card5.gif', 11],
            ['img/card6.gif', 10],
            ['img/card7.gif', 4],
            ['img/card8.gif', 3],
            ['img/card9.gif', 0],
            ['img/card10.gif', 0],
            ['img/card11.gif', 0],
            ['img/card12.gif', 11],
            ['img/card13.gif', 10],
            ['img/card14.gif', 4],
            ['img/card15.gif', 3],
            ['img/card16.gif', 0],
            ['img/card17.gif', 0],
            ['img/card18.gif', 0],
            ['img/card19.gif', 11],
            ['img/card20.gif', 10],
            ['img/card21.gif', 4],
            ['img/card22.gif', 3],
            ['img/card23.gif', 0],
            ['img/card24.gif', 0],
            ['img/card25.gif', 0],
            ['img/card26.gif', 11],
            ['img/card27.gif', 10],
            ['img/card28.gif', 4],
            ['img/card29.gif', 3],
            ['img/card30.gif', 0],
            ['img/card31.gif', 0],
            ['img/card32.gif', 0]
        ]);
const playerRoles = ["Vorhand", "Mittelhand", "Hinterhand"];


let currentPlayerIndex = 0;
let stichCount = 0; // Zähler für die Anzahl der bewerteten Stiche		
let gameState = {
    currentPlayerIndex: 0,
    showCustomCard: false
};
let textToShow = "";
let currentBidderIndex = 0;
// Deklarieren Sie highestBidder im globalen Scope
let highestBidder = {
    id: -1,
    name: "",
    bid: 0
};
// Globale Variable für den Hand-Spielzustand
let isHandGame = false;
let skatcards = [];
let tablecards = [];
// Spieler Namen und Kartenmaße
let player1 = {id: 0,
    cards: [],
    ausgewaehlt: [],
    stich: [],
	name: "",
	role: "Vorhand" };
let player2 = {id: 1,
    cards: [],
    ausgewaehlt: [],
    stich: [], name: "",
	role: "Mittelhand" };
let player3 = {id: 2,
    cards: [],
    ausgewaehlt: [],
    stich: [], 
	name: "",
	role: "Hinterhand" };
let aktiverSpielwert = -1;
// Aktueller Spieler und Flagge für Spielerrollenwahl
let currentPlayer = "Vorhand";
let rolesChosenFlag = false; // Variable für die Bestätigung der Spielerrollen
let passCount = 0; // Zähler für die Anzahl der Pässe
// Globale Variable für den Index des aktuellen Spielers
let currentState = 0;
let NamePlay = "Vorhand";
let canClickFieldForStock = false; // Für "stockDrueckenBtn"
let canClickFieldForNextPlayer = false; // Für "nextPlayerBtn"
let playerCards = player1.cards; // Ersetze dies durch die tatsächlichen Karten des Spielers.

player1Points.addEventListener('change', function () {
    player2Points.value = this.value;
    player3Points.value = this.value;
});
player2Points.addEventListener('change', function () {
    player1Points.value = this.value;
    player3Points.value = this.value;
});
player3Points.addEventListener('change', function () {
    player1Points.value = this.value;
    player2Points.value = this.value;
});

// Spieler Namen aus dem Local Storage entfernen
localStorage.removeItem('player1Name');
localStorage.removeItem('player2Name');
localStorage.removeItem('player3Name');
localStorage.removeItem('player4Name');
localStorage.removeItem('gameStarted');

document.getElementById("SpielAusWertenBtn").style.display = "none";
document.getElementById("playBeginBtn").style.display = "none";
document.getElementById("nextPlayerBtn").style.display = "none";
document.getElementById("nextPlayerBtn1").style.display = "none";
document.getElementById("confirmGameBtn").style.display = "none";
document.getElementById("leftGameBtn").style.display = "none";
document.getElementById("startGameBtn").style.display = "block";
document.getElementById("reizwerteMnu").style.display = "none";
document.getElementById("handBtn").style.display = "none";
document.getElementById("stockDrueckenBtn").style.display = "none";
document.getElementById("skatAufnehmenBtn").style.display = 'none';
document.getElementById("stockDrueckenBtn").style.display = 'none';
document.getElementById("playCardBtn").style.display = 'none';
document.getElementById("openCardsBtn").style.display = 'none';
document.getElementById("stichBtn").style.display = 'none';
document.getElementById("neuesSpielBtn").style.display = "none";



// Verstecke alle Buttons zu Beginn
document.querySelectorAll('.ReihenfolgeButtons button').forEach(button => {
    button.style.display = 'none';
});
// Event Listener für Eingabe der Spieler Namen
document.getElementById("player1Name").addEventListener("change", function () {
    player1.name = this.value;
});
document.getElementById("player2Name").addEventListener("change", function () {
    player2.name = this.value;
});
document.getElementById("player3Name").addEventListener("change", function () {
    player3.name = this.value;
});
// Beim Laden der Seite werden die Eingabefelder geleert
window.onload = function () {
    document.getElementById("player1Name").value = "";
    document.getElementById("player2Name").value = "";
    document.getElementById("player3Name").value = "";
};

// Funktion zum Berechnen des Multiplikators für Grand
function calcMultiplierForGrand(playerCards) {
    // Definiere die Karten-IDs der Buben
    const bubeIds = ['img/card1.gif', 'img/card2.gif', 'img/card3.gif', 'img/card4.gif'];

    // Zähle wie viele Buben vorhanden sind
    let bubenCount = 0;
    for (let i = 0; i < bubeIds.length; i++) {
        if (playerCards.includes(bubeIds[i])) {
            bubenCount++;
        }
    }

    // Berechne den Multiplikator basierend auf der Anzahl der fehlenden Buben
    const missingBuben = 4 - bubenCount;
    const multiplier = missingBuben === 0 ? "mit 1" : `ohne ${missingBuben}`;

    return multiplier;
}
// Funktion zum Hinzufügen des Multiplikators zum Spielwert
function addMultiplierToGameValue(gameValue, multiplier) {
    switch(multiplier) {
        case "mit 1":
            return gameValue * 2; 
        case "ohne 1":
            return gameValue * 2; 
        case "mit 2":
            return gameValue * 3; 
		 case "ohne 2":
            return gameValue * 3; 
        case "mit 3":
            return gameValue * 4; 
		case "ohne 3":
            return gameValue * 4; 
		case "mit 4":
            return gameValue * 5; 
		case "ohne 4":
            return gameValue * 5; 
        default:
            return gameValue; 
    }
}

const grandBaseValue = spielWerte.get('grand'); // Basiswert für Grand aus dem Map holen.
const grandMultiplier = calcMultiplierForGrand(playerCards); // Multiplikator berechnen.
const grandFinalValue = addMultiplierToGameValue(grandBaseValue, grandMultiplier); // Endgültigen Wert berechnen.

// Funktion zum Extrahieren der Kartennummer aus dem Dateinamen
function extractCardNumber(card) {
    return parseInt(card.match(/\d+/)[0]);
}
// Funktion zum Mischen des Arrays
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
// Funktion zum Zeichnen einer Karte auf dem Canvas
function drawCard(x, y, card, isSelected) {
    const img = new Image();
    img.src = card;
    img.onload = function () {
        if (isSelected) {
            y = y - 150;
        }
        ctx.drawImage(img, x, y, cardWidth, cardHeight);
    };
}
function updateButtonDisplay(selectedCardsCount) {
    if (selectedCardsCount === 2) {
        document.getElementById('stockDrueckenBtn').style.display = 'block'; // Button anzeigen
    } else {
        document.getElementById('stockDrueckenBtn').style.display = 'none'; // Button verstecken
    }
}
// Funktion zum Löschen des Bereichs, in dem die Karten gezeichnet werden
function clearCardArea() {
    // Angenommen startY ist der Y-Startpunkt und spielfeld.height ist die Höhe des Canvas
    ctx.clearRect(0, startY, spielfeld.width, spielfeld.height - startY);
    ctx.clearRect(0, 0, spielfeld.width, startY); // Lösche den Bereich oberhalb der Karten

}
// Funktion zum Laden der Karten für einen Spieler
function drawCards(cards, selectcards) {

    // Überprüfe, ob cards ein Array ist und Elemente enthält
    if (Array.isArray(cards) && cards.length > 0) {
        cards.forEach((card, index) => {
            let posX = index * (cardWidth - 10) + 1;
            let posY = startY;

            // Positionierung der Karten für Spieler 4 in der Mitte des Canvas
            if (cards === skatcards && (index === 0 || index === 1)) {
                posX = spielfeld.width / 2 - cardWidth / 2 + index * (cardWidth - 10);
                posY = spielfeld.height / 2 - cardHeight / 2;
            }
            if ((cards === tablecards) && (tablecards.length > 0)) {
                posX = spielfeld.width / 2 - 2 * (cardWidth / 2) + index * (cardWidth - 10);
                posY = spielfeld.height / 2 - cardHeight / 2;
            }

            // Karte zeichnen
            drawCard(posX, posY, card, selectcards.includes(card));

        });
    }
}
// Funktion zum Anzeigen der Karten-Deckblätter
function drawCustomCard(anzahl) {
	
    for (let i = 0; i < anzahl; i++) {
        drawCard(i * (cardWidth - 10) + 1, startY, 'img/card33.gif');
    }
	

    // Zwei Karten nebeneinander in der Mitte des Canvas laden
    if (skatcards.length > 0) {
        drawCard(spielfeld.width / 2 - cardWidth / 2, spielfeld.height / 2 - cardHeight / 2, 'img/card33.gif');
        drawCard(spielfeld.width / 2 + cardWidth / 2 - 10, spielfeld.height / 2 - cardHeight / 2, 'img/card33.gif');
    }
}
function clearCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function showPlayerRoles() {
    const innerCanvas = document.getElementById("innerCanvas");
    clearCanvas(innerCanvas); // Lösche zuerst den Canvas

    const ctxInner = innerCanvas.getContext("2d");
    ctxInner.fillStyle = "magenta";
    ctxInner.font = "bold 60px Arial";
    const lineHeight = 150;

    // Verwende die aktuellen Rollen der Spieler
    let rolesArray = [player1.role, player2.role, player3.role];

    // Mischen der Rollen und Sortieren, damit Vorhand immer zuerst kommt
    shuffle(rolesArray);
    rolesArray.sort((a, b) => {
        if (a === "Vorhand") return -1;
        if (b === "Vorhand") return 1;
        if (a === "Mittelhand") return -1;
        if (b === "Mittelhand") return 1;
        return 0;
    });

    // Zeichne die Rollen der Spieler auf das Canvas
    for (let i = 0; i < rolesArray.length; i++) {
        let playerName = getPlayerName(i); // Hole den Namen des Spielers basierend auf der Rolle
        ctxInner.fillText(`${rolesArray[i]}: ${playerName}`, 50, lineHeight * (i + 1));
    }

    currentPlayer = rolesArray[0]; // Setze den aktuellen Spieler

    // Ändern des Textes im Sekundär-Canvas
    let textToShow = "";

    switch (currentPlayer) {
        case "Vorhand":
            textToShow = `${getPlayerName(0)} du bist dran`;
            break;
        case "Mittelhand":
            textToShow = `${getPlayerName(1)} du bist dran`;
            break;
        case "Hinterhand":
            textToShow = `${getPlayerName(2)} du bist dran`;
            break;
        default:
            break;
    }

    const canvasSecondary = document.getElementById("canvasSecondary");
    const ctxSecondary = canvasSecondary.getContext("2d");

    ctxSecondary.clearRect(0, 0, canvasSecondary.width, canvasSecondary.height);
    ctxSecondary.fillStyle = "red";
    ctxSecondary.font = "bold 60px Arial";

    const textWidth = ctxSecondary.measureText(textToShow).width;
    const xPosition = (canvasSecondary.width - textWidth) / 2;
    const yPosition = (canvasSecondary.height - 40) / 2 + canvasSecondary.offsetTop;

    ctxSecondary.fillText(textToShow, xPosition, yPosition);

    // Zeige oder verstecke Buttons basierend auf dem aktuellen Zustand des Spiels
    updateButtonDisplay();
}
// Diese Funktion könnte existieren oder muss entsprechend Ihrer Logik implementiert werden.
function updateButtonDisplay() {
   // Implementierung abhängig von Ihrem Spielzustand.
   // Zum Beispiel könnten Sie hier entscheiden, welche Buttons angezeigt oder versteckt werden sollen.
}
function drawPlayerRoles() {
    const innerCanvas = document.getElementById("innerCanvas");
    const ctxInner = innerCanvas.getContext("2d");

    // Lösche das gesamte Canvas vor dem Neuzeichnen
    ctxInner.clearRect(0, 0, innerCanvas.width, innerCanvas.height);

    // Setze Stil für den Text
    ctxInner.fillStyle = "magenta";
    ctxInner.font = "bold 60px Arial";

    // Definiere die Zeilenhöhe für den Text
    const lineHeight = 150;

    // Hole die aktuellen Rollen der Spieler
    let rolesArray = ["Vorhand", "Mittelhand", "Hinterhand"];

    // Zeichne die Rollen der Spieler auf das Canvas
    for (let i = 0; i < rolesArray.length; i++) {
        ctxInner.fillText(`${rolesArray[i]}: ${getPlayerName(i)}`, 50, lineHeight * (i + 1));
    }
}
// Aufruf der Funktion zum Testen (dies würde irgendwo in Ihrem Code passieren)
function getPlayerName(index) {
    switch (index) {
        case 0: 
			return player1.name || "Spieler 1";
        case 1: 
			return player2.name || "Spieler 2";
        case 2: 
			return player3.name || "Spieler 3";
        default: 
			return "";
    }
}
function getNextPlayer(player){
	if (player === player1)
		return player2;
	if (player === player2)
		return player3;
	if (player === player3)
		return player1;
}
function displayText(textToShow) {
    const canvasSecondary = document.getElementById("canvasSecondary");
    const ctxSecondary = canvasSecondary.getContext("2d");
    ctxSecondary.clearRect(0, 0, canvasSecondary.width, canvasSecondary.height); // Altes Canvas löschen
    ctxSecondary.fillStyle = "red";
    ctxSecondary.font = "bold 60px Arial";

    const textWidth = ctxSecondary.measureText(textToShow).width;
    const xPosition = (canvasSecondary.width - textWidth) / 2;
    const yPosition = (canvasSecondary.height - 40) / 2 + canvasSecondary.offsetTop;

    ctxSecondary.fillText(textToShow, xPosition, yPosition);
}
// Funktion zum Anzeigen des Reizwerts auf dem dritten Canvas
function displayBidValueOnThirdCanvas(bidValue) {
    const thirdCanvas = document.getElementById("thirdCanvas");
    const ctxThird = thirdCanvas.getContext('2d');
    ctxThird.clearRect(0, 0, thirdCanvas.width, thirdCanvas.height); // Altes Canvas löschen
    ctxThird.fillStyle = "black"; // Ändere die Farbe zu Schwarz
    ctxThird.font = "bold 60px Arial"; // Wählen Sie die Schriftgröße und -art

    const textToShow = bidValue.toString();
    const textWidth = ctxThird.measureText(textToShow).width;
    const xPosition = (thirdCanvas.width - textWidth) / 2;
    const yPosition = (thirdCanvas.height / 2) + (60 / 2); // Vertikale Mitte plus halbe Schriftgröße

    ctxThird.fillText(textToShow, xPosition, yPosition);
}
function updateCanvasSecondaryText(text) {
    ctxSecondary.clearRect(0, 0, canvasSecondary.width, canvasSecondary.height); // Altes Canvas löschen
    ctxSecondary.fillStyle = "red";
    ctxSecondary.font = "bold 60px Arial";

    const textWidth = ctxSecondary.measureText(text).width;
    const xPosition = (canvasSecondary.width - textWidth) / 2;
    const yPosition = (canvasSecondary.height - 40) / 2 + canvasSecondary.offsetTop;

    ctxSecondary.fillText(text, xPosition, yPosition);
}
// Funktion zum Anzeigen des höchsten Bieters in der Konsole und auf dem Canvas
function displayHighestBidder() {
    if (highestBidder.name !== "") {
        const textToShow = `${highestBidder.name} : ${highestBidder.bid}`;

        updateCanvasSecondaryText(textToShow);
    }
}
function showCustomPopup(message) {
    const popup = document.createElement("div");
    popup.classList.add("custom-popup");
    popup.textContent = message;

    document.body.appendChild(popup);

    // Zentriere das Popup-Fenster auf dem Bildschirm
    popup.style.top = `${(window.innerHeight - popup.offsetHeight) / 2}px`;
    popup.style.left = `${(window.innerWidth - popup.offsetWidth) / 2}px`;

    setTimeout(() => {
        document.body.removeChild(popup);
    }, 2000); // Schließe das Popup nach 2 Sekunden automatisch
}
function displayHighestBidderAndHideCards() {
    if (highestBidder.name !== "") {
        const textToShow = `${highestBidder.name} : ${highestBidder.bid}`;
        updateCanvasSecondaryText(textToShow); // Zeige den Namen des höchsten Bieters an

        drawCustomCard(getPlayer(highestBidder.id).cards.length); // Blende alle Karten aus mit card33.gif

        // Verstecke den leftGameBtn
        document.getElementById("leftGameBtn").style.display = "none";

        // Zeige den confirmGameBtn wieder an
        document.getElementById("confirmGameBtn").style.display = "block";

    }
}
// Funktion zum Anzeigen des ausgewählten Spiels auf dem canvasSecondary
function displaySelectedGame(gameName) {
    const ctxInner = canvasSecondary.getContext("2d");
    ctxInner.clearRect(0, 0, canvasSecondary.width, canvasSecondary.height); // Altes Canvas löschen
    ctxInner.fillStyle = "red";
    ctxInner.font = "bold 60px Arial";

    // Füge "Hand" hinzu, wenn isHandGame true ist
    const textToShow = isHandGame ? gameName + " Hand" : gameName;

    const textWidth = ctxInner.measureText(textToShow).width;
    const xPosition = (canvasSecondary.width - textWidth) / 2;
    const yPosition = (canvasSecondary.height / 2) + (60 / 2); // Vertikale Mitte plus halbe Schriftgröße

    ctxInner.fillText(textToShow, xPosition, yPosition);
}
function showGameOptions() {
    // Zeige den handBtn wieder an
    document.getElementById("handBtn").style.display = "block";

    // Zeige den skatAufnehmenBtn wieder an
    document.getElementById("skatAufnehmenBtn").style.display = "block";
}
function loadHighestBidderCards() {
    // Überprüfe, welcher Spieler der Höchstbietende ist
    if (highestBidder.name === player1.name) {
        drawCards(player1.cards, player1.selectcards); // Lade die Karten von Spieler 1
    } else if (highestBidder.name === player2.name) {
        drawCards(player2.cards, player2.selectcards); // Lade die Karten von Spieler 2
    } else if (highestBidder.name === player3.name) {
        drawCards(player3.cards, player3.selectcards); // Lade die Karten von Spieler 3
    }

    // Verstecke den confirmGameBtn nach dem Laden der Karten und Anzeigen der Optionen
    document.getElementById("confirmGameBtn").style.display = "none";
}
// Hilfsfunktion zum Anzeigen der Spieloptionen-Buttons
function showGameOptions() {
    document.getElementById("handBtn").style.display = "block"; // Zeige den handBtn wieder an
    document.getElementById("skatAufnehmenBtn").style.display = "block"; // Zeige den skatAufnehmenBtn wieder an
}
function rotatePlayers() {
	console.log("Spielerrolle setzten");
	console.log(player1);
	console.log(player2);
	console.log(player3);
    // Rotiere die Spielerpositionen
   let Temp = player1;
   
	player1 = player2;
    player2 = player3;
    player3 = Temp;

    // Aktualisiere auch die IDs der Spieler entsprechend ihrer neuen Position
    player1.id = 0;
    player2.id = 1;
    player3.id = 2;
	// Zeichne die Spielerrollen neu
    drawPlayerRoles();
	rotatePlayerRolesAndDisplay();
	
}
// Funktion zum Zurücksetzen des Spiels und Neuverteilung der Karten
function resetGame() {
	    shuffle(cards); // Mische die Karten neu

    tablecards = [];

    // Setze ausgewählte Karten und Stiche zurück
    [player1, player2, player3].forEach(player => {
        player.selectcards = [];
        player.stich = [];
        // Sortiere die Karten nach ihrer Größe
        player.cards.sort((a, b) => extractCardNumber(a) - extractCardNumber(b));
    });
	drawCards();

    currentPlayerIndex = 0;   // Beginne mit dem ersten Spieler als aktiver Spieler
    currentBidderIndex = 0;   // Beginne mit dem ersten Spieler als Bieter

    highestBidder.name = "";  // Setze den höchsten Bieter zurück
    highestBidder.bid = 0;
    highestBidder.id = -1;  // Setze die ID des höchsten Bieters zurück

    passCount = 0;            // Setze den Pass-Zähler zurück
	 gameState.currentPlayerIndex = 0;
    gameState.showCustomCard = false;

    textToShow = "";

    isHandGame = false;       // Setze den Hand-Spielzustand zurück

    aktiverSpielwert = -1;     // Setze den aktiven Spielwert zurück

    // Weitere UI-Elemente und Zustände zurücksetzen...

    // Zeichne die neuen Rollen auf dem Bildschirm
    drawPlayerRoles();

    // Aktualisiere das UI entsprechend der neuen Zustände
    updateUI();

}
// Hilfsfunktion zum Aktualisieren des UIs nach dem Zurücksetzen des Spiels
function updateUI() {
    // Aktualisiere Punktestände, Namen und andere UI-Elemente hier...

    // Beispiel: Setze Punktestände auf Anfangswerte zurück
    player1Points.value = '0';
    player2Points.value = '0';
    player3Points.value = '0';
    // ... Weitere UI-Aktualisierungen ...
}
// Funktion zum Löschen der Karten von Player4 aus der Mitte des Canvas
function clearMiddleCards() {
	
    const ctxSpielfeld = spielfeld.getContext('2d');

    // Angenommen, die Karten von Player4 befinden sich in der Mitte des Canvas,
    // dann löschen wir diesen Bereich.
    const middleCardX1 = spielfeld.width / 2 - cardWidth / 2;
    const middleCardY = spielfeld.height / 2 - cardHeight / 2;
    const middleCardX2 = middleCardX1 + cardWidth - 10; // Position der zweiten Karte

    // Lösche den Bereich für die erste Karte
    ctxSpielfeld.clearRect(middleCardX1, middleCardY, cardWidth, cardHeight);

    // Lösche den Bereich für die zweite Karte (wenn vorhanden)
    ctxSpielfeld.clearRect(middleCardX2, middleCardY, cardWidth, cardHeight);
}
function displayPassedGame() {
	
    const canvasSecondary = document.getElementById("canvasSecondary");
    const ctxSecondary = canvasSecondary.getContext("2d");
    ctxSecondary.clearRect(0, 0, canvasSecondary.width, canvasSecondary.height); // Altes Canvas löschen
    ctxSecondary.fillStyle = "red";
    ctxSecondary.font = "bold 60px Arial";

    // Berechne die Position für die erste Zeile
    let textToShowFirstLine = "Das Spiel wurde";
    let textWidthFirstLine = ctxSecondary.measureText(textToShowFirstLine).width;
    let xPositionFirstLine = (canvasSecondary.width - textWidthFirstLine) / 2;
    let yPositionFirstLine = (canvasSecondary.height / 2) + 100; // Etwas oberhalb der Mitte

    // Berechne die Position für die zweite Zeile
    let textToShowSecondLine = "eingepasst";
    let textWidthSecondLine = ctxSecondary.measureText(textToShowSecondLine).width;
    let xPositionSecondLine = (canvasSecondary.width - textWidthSecondLine) / 2;
    let yPositionSecondLine = (canvasSecondary.height / 2) + 200; // Etwas unterhalb der Mitte

    // Schreibe den Text auf das Canvas
    ctxSecondary.fillText(textToShowFirstLine, xPositionFirstLine, yPositionFirstLine);
    ctxSecondary.fillText(textToShowSecondLine, xPositionSecondLine, yPositionSecondLine);

    // Blende den leftGameBtn aus und zeige nur den confirmGameBtn an
    document.getElementById("leftGameBtn").style.display = "none";
    document.getElementById("confirmGameBtn").style.display = "none";
	    document.getElementById("neuesSpielBtn").style.display = "block";

}
function getPlayer(id) {
	console.log("getPlayer " + id);
    switch (id) {
    case 0:
        return player1;
    case 1:
        return player2;
    case 2:
        return player3;
    default:
        return null;
    }
}
function clearTextFromCanvas() {
    const textHeight = 80; // Angenommene Höhe des Textes basierend auf der Schriftgröße
    const padding = 80; // Ein wenig zusätzlicher Platz um den Text herum

    // Berechne die Y-Position für das Löschen basierend auf der Position, wo der Text gezeichnet wird
    const yPositionToClear = (canvasSecondary.height / 2) + 200 - textHeight - padding;
    const heightToClear = textHeight + (2 * padding);

    // Lösche den Bereich, wo der Text gezeichnet wird
    ctxSecondary.clearRect(0, yPositionToClear, canvasSecondary.width, heightToClear);
}
function displayTextOnCanvas(text) {

    clearTextFromCanvas(); // Lösche nur den Bereich des alten Textes

    ctxSecondary.fillStyle = "red"; // Setze die Farbe auf Rot
    ctxSecondary.font = "bold 60px Arial"; // Wähle die Schriftgröße und -art

    const textWidth = ctxSecondary.measureText(text).width;
    const xPosition = (canvasSecondary.width - textWidth) / 2;

    // Die Y-Position ist bereits in der Funktion clearTextFromCanvas definiert
    const yPosition = (canvasSecondary.height / 2) + 200;

    ctxSecondary.fillText(text, xPosition, yPosition); // Zeichne den neuen Text
}
function werteStichAus(cards, spielwert, playerDerAngespieltHat) {
    
    displayTextOnCanvas(textToShow);
	if (playerDerAngespieltHat === player1) {
		document.getElementById("player1Btn").textContent  = "*" + player1.name + "*";
	} else {
		document.getElementById("player1Btn").textContent  = player1.name;
	}
	if (playerDerAngespieltHat === player2) {
		document.getElementById("player2Btn").textContent  = "*" + player2.name + "*";
	} else {
		document.getElementById("player2Btn").textContent  = player2.name;
	}
	if (playerDerAngespieltHat === player3) {
		document.getElementById("player3Btn").textContent  = "*" + player3.name + "*";
	} else {
		document.getElementById("player3Btn").textContent  = player3.name;
	}

    new Promise((resolve, reject) => {
        document.getElementById("player1Btn").addEventListener('click', () => {
            resolve(player1);
        });

        document.getElementById("player2Btn").addEventListener('click', () => {
            resolve(player2);
        });

        document.getElementById("player3Btn").addEventListener('click', () => {
            resolve(player3);
        });
    });
	return undefined;
}
function verarbeiteStichFuer(winnerPlayer) {
   
    if (winnerPlayer === undefined) {
        
        return;
    }
    

    // Füge die Tischkarten zum Stich des Gewinners hinzu
    winnerPlayer.stich.push(...tablecards);
    tablecards = [];

    // Setze den aktuellen Spielerindex auf den Gewinner
    gameState.currentPlayerIndex = winnerPlayer.id;

    // Überprüfe, ob der Gewinner keine Karten mehr hat und werte das Spiel aus
    if (winnerPlayer.cards.length === 0) {
        werteSpielAus();
    } else {
        textToShow = `${winnerPlayer.name} du bist dran`;
        displayTextOnCanvas(textToShow);
    }

    // Verstecke den Button für den nächsten Stich und zeige den Button für den nächsten Spieler an
    document.getElementById("stichBtn").style.display = "none";
    document.getElementById("nextPlayerBtn").style.display = "block";

    // Erhöhe den Zähler für die bewerteten Stiche
    stichCount++;

    // Überprüfe, ob das Limit von 10 Bewertungen erreicht wurde
    if (stichCount >= 10) {
        // Schließe den Dialog und zeige den Button für ein neues Spiel an
        document.getElementById("dialog-Stich").close();
        document.getElementById("neuesSpielBtn").style.display = "none";
		document.getElementById("SpielAusWertenBtn").style.display = "block";
		document.getElementById("nextPlayerBtn").style.display = "none";

        // Setze stichCount zurück auf 0 für das nächste Spiel
        stichCount = 0;

        // Optional: Führe weitere Aktionen aus, wenn das Spiel endet (z.B. Punkte anzeigen)

    } else {
        // Zeige weiterhin den Dialog für die nächste Stichbewertung an
        document.getElementById("dialog-Stich").showModal();

        // Optional: Bereite alles vor für den nächsten Stich (z.B. Karten neu zeichnen)

    }
}
function calcCardValues(cards) {
	
	let value = 0;
	cards.forEach(card => {
		
		value += cardWerte.get(card);
	});
	return value;
}
function calcBubePlus1(cards) {
	return 3; //TODO gilt für Prototyp, richtige Rechnung folgt noch
}
function calcWertPunkte(cards, spielwert, istGewonnen, istSchneider, istSchwarz) {
	let faktor = 0;
	switch(spielwert) {
		case 9: // karo
		case 10: // herz
		case 11: // pik
		case 12: // kreuz
		case 24: // grand
			faktor = calcBubePlus1(cards);
			if (istSchneider) faktor ++;
			if (istSchwarz) faktor ++;
			return istGewonnen ? faktor * spielwert : -2 * faktor * spielwert;
			break;
		case 23: // null
		case 35: // null hand
		case 46: // null over
		case 59: // null hand over
			return istSchwarz ? spielwert : -2 * spielwert;
			break;
	}
}
function werteSpielAus() {
   

    // Hat Spieler oder haben die Gegner gewonnen?
    let ergebnisReizGewinner = calcCardValues(getPlayer(highestBidder.id).stich);
   

    // Überprüfe auf Schwarz
    let istSchwarz = getPlayer(highestBidder.id).stich.length === 0 ||
                     (getNextPlayer(getPlayer(highestBidder.id)).stich.length === 0 &&
                      getNextPlayer(getNextPlayer(getPlayer(highestBidder.id))).stich.length === 0);

    // Punkte der Runde errechnen und beim aktiven Spieler addieren oder bei Niederlage abziehen
    let wertPunkte = calcWertPunkte(
        highestBidder.card,
        aktiverSpielwert, // welche Trumpf
        ergebnisReizGewinner > 60, // hat gewonnen
        ergebnisReizGewinner <= 30 || ergebnisReizGewinner >= 90, // schneider
        istSchwarz,
        isHandGame
    );
	// Falls die Punkte 0 oder negativ werden, ist das Spiel komplett vorbei
	// ansonsten wieder zum Reizen übergehen
}
function showCardsAndChooseReiz() {
    // Implementierung der Funktion hier
   
}
function updateAndDisplayCurrentPlayerRole() {
    // Aktualisiere den Index des aktuellen Spielers
    currentPlayerIndex = (currentPlayerIndex + 1) % playerRoles.length;

    // Hole den Namen des aktuellen Spielers basierend auf dem Index
    const currentPlayerRole = playerRoles[currentPlayerIndex];
    const playerName = getPlayerName(currentPlayerIndex);

    // Zeige die Rolle und den Namen des Spielers an
    displayTextOnCanvas(`${currentPlayerRole}: ${playerName}`);

    // Hier können Sie auch weitere Aktionen durchführen,
    // z.B. Karten zeichnen oder andere UI-Elemente aktualisieren
}
function startNewGame() {
    // Setze alle relevanten Spielvariablen zurück
    currentPlayerIndex = 0;
    stichCount = 0;
    gameState = {
        currentPlayerIndex: 0,
        showCustomCard: false
    };
    textToShow = "";
    currentBidderIndex = 0;
    highestBidder = {
        id: -1,
        name: "",
        bid: 0
    };
 
    isHandGame = false;
    skatcards = [];
    tablecards = [];

    // Setze die Spielerinformationen zurück
    let player1 = {id: 0,
    cards: [],
    ausgewaehlt: [],
    stich: [],
	name: "Spieler A",
	role: "Vorhand" };
	let player2 = {id: 1,
    cards: [],
    ausgewaehlt: [],
    stich: [], name: "Spieler B",
	role: "Mittelhand" };
	let player3 = {id: 2,
    cards: [],
    ausgewaehlt: [],
    stich: [], 
	name: "Spieler C",
	role: "Hinterhand" };
    aktiverSpielwert = -1;

    // Setze UI-Elemente zurück
    resetUI();

    // Mische die Karten und verteile sie erneut
    shuffle(cards);

    // Verteile die Karten an die Spieler und den Skat neu
    distributeCards();

    // Zeige die Rollen der Spieler an und beginne das Reizen
    showPlayerRoles();
	
}
function resetUI() {


    // Lösche den Bereich des Canvas, wo Karten gezeichnet werden könnten
    clearCardArea();
}
function distributeCards() {
    // Verteile die Karten an die Spieler und den Skat neu
    player1.cards = cards.slice(0, 10);
    player2.cards = cards.slice(10, 20);
    player3.cards = cards.slice(20, 30);
    skatcards = cards.slice(30, 32);

    // Sortiere die Karten jedes Spielers nach ihrer Größe
    player1.cards.sort((a, b) => extractCardNumber(a) - extractCardNumber(b));
    player2.cards.sort((a, b) => extractCardNumber(a) - extractCardNumber(b));
    player3.cards.sort((a, b) => extractCardNumber(a) - extractCardNumber(b));
}
function rotatePlayerRolesAndDisplay() {
	
  // Rotiere die Rollen der Spieler
  const tempRole = player1.role;
  player1.role = player2.role;
  player2.role = player3.role;
  player3.role = tempRole;

  // Aktualisiere die Anzeige auf dem thirdCanvas
  drawPlayerRoles();
  rotatePlayerRoles();
}
function rotatePlayerRoles() {
  // Speichere die aktuelle Vorhand (erster Spieler) temporär
  let tempPlayer = player1;

  // Verschiebe die Rollen und Namen der Spieler
  player1 = player2; // Aus Mittelhand wird Vorhand
  player2 = player3; // Aus Hinterhand wird Mittelhand
  player3 = tempPlayer; // Aus Vorhand wird Hinterhand

  // Aktualisiere auch die IDs der Spieler entsprechend ihrer neuen Position
  player1.id = 0;
  player2.id = 1;
  player3.id = 2;

  // Zeichne die aktualisierten Rollen und Namen neu (falls erforderlich)
  drawPlayerRoles();
}

document.getElementById("confirmGameBtn").addEventListener("click", function () {
	
    textToShow = ""; // Verwende die bereits global deklarierte Variable textToShow
    switch (currentPlayer) {
    case "Vorhand":
	
        drawCards(player1.cards, player1.selectcards);
        document.getElementById("reizwerteMnu").style.display = "block";
        document.getElementById("leftGameBtn").style.display = "block";
        updateAndDisplayCurrentPlayerRole();
        currentPlayer = "Mittelhand";

        break;

    case "Mittelhand":

        document.getElementById("reizwerteMnu").style.display = "block";
        document.getElementById("leftGameBtn").style.display = "block";
        drawCards(player2.cards, player2.selectcards); // Lade card33.gif über die Karten von Mittelhand
        updateAndDisplayCurrentPlayerRole();
        currentPlayer = "Hinterhand";

        break;

    case "Hinterhand":
        
        document.getElementById("reizwerteMnu").style.display = "block";
        document.getElementById("leftGameBtn").style.display = "block";
        drawCards(player3.cards, player3.selectcards); // Lade card33.gif über die Karten von Mittelhand
        updateAndDisplayCurrentPlayerRole();
        currentPlayer = "Skat";
        break;
    case "Skat":

        currentPlayer = "Meist gereizt";
        drawCustomCard(10);
        // Zeige die Buttons "Hand" und "Aufnehmen" an
        showGameOptions();
        // Zeige den höchsten Bieter an und blende alle Karten aus
        displayHighestBidderAndHideCards();
        document.getElementById("reizwerteMnu").style.display = "none";
        document.getElementById("leftGameBtn").style.display = "none";
        document.getElementById("confirmGameBtn").style.display = "none";
        break;

    default:

        break;
    }

    if (currentPlayer !== "") {
        updateCanvasSecondaryText(textToShow); // Aktualisiere Text im sekundären Canvas
        document.getElementById("confirmGameBtn").style.display = "none"; // Verstecke confirmGameBtn
		
    } else {
        // Alle Spieler haben gereizt, verstecke alle Buttons und zeige das Ergebnis an
        document.getElementById("reizwerteMnu").style.display = "none";
        document.getElementById("leftGameBtn").style.display = "none";
        document.getElementById("confirmGameBtn").style.display = "none";
        updateCanvasSecondaryText(`${highestBidder.name}: ${highestBidder.bid}`); // Zeige Gewinner und Gebot an
    }

    
    // Überprüfe, ob das Spiel eingepasst wurde
    if (passCount === 3) {
		reset;
		
		document.getElementById("handBtn").style.display = "none";
        document.getElementById("skatAufnehmenBtn").style.display = "none";
		 document.getElementById("confirmGameBtn").style.display = "none";
        // Ändere den Text des Buttons "startGameBtn" zu "Nächstes Spiel"
		document.getElementById("neuesSpielBtn").style.display = "block";
     
    }

    // Überprüfe, welcher Spieler der Höchstbietende ist
    if (highestBidder.name === player1.name) {
        drawCards(player3.cards, player3.selectcards); // Lade die Karten von Spieler 1

    } else if (highestBidder.name === player2.name) {
        drawCards(player1.cards, player1.selectcards); // Lade die Karten von Spieler 2

    } else if (highestBidder.name === player3.name) {
        drawCards(player2.cards, player2.selectcards); // Lade die Karten von Spieler 3

    }
	loadHighestBidderCards();
    // Verstecke den confirmGameBtn nach dem Laden der Karten
    document.getElementById("confirmGameBtn").style.display = "none";
	
console.log(highestBidder);
console.log(loadHighestBidderCards);
});
// Event Listener für den Button "leftGameBtn"
document.getElementById("leftGameBtn").addEventListener("click", function () {
	
    const reizwerteSelect = document.getElementById("reizwerteMnu");
    if (!reizwerteSelect.value) {
        alert("Bitte wählen Sie einen Reizwert aus.");
        return; // Frühzeitige Rückkehr, wenn kein Wert ausgewählt wurde
    }
    const selectedReizValue = parseInt(reizwerteSelect.value, 10);

    // Überprüfe, ob der Spieler gepasst hat (Reizwert von 0 ausgewählt)
    if (selectedReizValue === 0) {
        passCount++; // Erhöhe den Pass-Zähler
        if (passCount === 3) {
            drawCustomCard(10);
            document.getElementById("handBtn").style.display = "none";
        document.getElementById("skatAufnehmenBtn").style.display = "none";
		 document.getElementById("confirmGameBtn").style.display = "none";
        // Ändere den Text des Buttons "startGameBtn" zu "Nächstes Spiel"
		
            displayPassedGame(); // Zeige die Nachricht an, dass das Spiel eingepasst wurde
            return; // Beende die Funktion frühzeitig
        }

    } else if (selectedReizValue > highestBidder.bid) {
		document.getElementById("leftGameBtn").style.display = "none";
		document.getElementById("reizwerteMnu").style.display = "none";
        highestBidder.bid = selectedReizValue;
        highestBidder.name = getPlayerName(currentBidderIndex);
        highestBidder.id = currentBidderIndex;
		highestBidder.cards = getPlayer(currentBidderIndex).cards.concat(skatcards) ;
        gameState.currentPlayerIndex = currentBidderIndex;

        displayBidValueOnThirdCanvas(selectedReizValue);
        passCount = 0; // Setze den Pass-Zähler zurück, da ein gültiges Gebot abgegeben wurde
    }

    currentBidderIndex++;

    drawCustomCard(10); // Blende die Karten mit card33.gif aus

    // Überprüfe, ob alle Spieler gepasst haben
    if (passCount === 3) {
        return; // Beende die Funktion frühzeitig
    }

    if (currentBidderIndex > 2) {
        displayHighestBidderAndHideCards();
        currentBidderIndex = 0; // Setze den Bieterindex zurück für den nächsten Durchlauf
    } else {
        let nextPlayerName = getPlayerName(currentBidderIndex);
        updateCanvasSecondaryText(`${nextPlayerName} du bist dran`);

        document.getElementById("confirmGameBtn").style.display = "block";
        document.getElementById("leftGameBtn").style.display = "none";
        document.getElementById("reizwerteMnu").style.display = "none";
    }
});
document.addEventListener('click', function (event) {
	console.log("Spielerrolle setzten");
	console.log(player1);
	console.log(player2);
	console.log(player3);
    
    if (event.target.id === "startGameBtn") {
        // Holen Sie sich die Namen aus den Eingabefeldern
        const player1Name = document.getElementById("player1Name").value;
        const player2Name = document.getElementById("player2Name").value;
        const player3Name = document.getElementById("player3Name").value;

        if (!rolesChosenFlag && (player1Name !== "" && player2Name !== "" && player3Name !== "")) {
            showPlayerRoles();
            rolesChosenFlag = true;

            // Deaktivieren der Namenseingabefelder
            document.getElementById("player1Name").readOnly = true;
            document.getElementById("player2Name").readOnly = true;
            document.getElementById("player3Name").readOnly = true;
			document.getElementById("confirmGameBtn").style.display = "block";
			document.getElementById("startGameBtn").style.display = "none";

            // Ersetzen Sie die Dropdowns durch Textfelder mit den ausgewählten Punkten
            [player1Points, player2Points, player3Points].forEach((select, index) => {
                const selectedValue = select.options[select.selectedIndex].text;
                const playerName = [player1Name, player2Name, player3Name][index];
                const textElement = document.createElement("input");
                const inputId = `playerInput${index}`;
                textElement.type = "text";
                textElement.value = `${playerName}: ${selectedValue}`;
                textElement.readOnly = true;
                textElement.id = inputId;
                select.parentNode.replaceChild(textElement, select);
            });
        } else {
            showCustomPopup("Bitte geben Sie die Namen aller drei Spieler ein.");
        }
		
		drawPlayerRoles();
		
		
    }
	
});
/// Event Listener für alle Buttons mit der Klasse "Reihenfolge"
document.querySelectorAll('.ReihenfolgeButtons .Reihenfolge').forEach(button => {
	
    button.addEventListener('click', function () {
		
        clearMiddleCards(); // Rufe die Funktion auf, um die Karten zu löschen
        displaySelectedGame("Wir spielen " + this.textContent); // Zeige das ausgewählte Spiel an

        // Verstecke alle Trumpf-Elemente
        document.getElementById("karo").style.display = "none";
        document.getElementById("herz").style.display = "none";
        document.getElementById("pik").style.display = "none";
        document.getElementById("kreuz").style.display = "none";
        document.getElementById("grand").style.display = "none";
        document.getElementById("null").style.display = "none";
        document.getElementById("nullover").style.display = "none";

        isHandGame = false;

        // Setze aktivTrumpf basierend auf dem ausgewählten Spiel
        const spielName = this.textContent;
        aktiverSpielwert = spielWerte.get(this.id); // Verwende null als Fallback-Wert


        document.getElementById("playBeginBtn").style.display = "block";
    });
});
// Event Listener für den Button "handBtn"
document.getElementById("handBtn").addEventListener("click", function () {
	
    // Setze isHandGame auf true, da Hand gespielt wird
    isHandGame = true;
	let player = getPlayer(highestBidder.id);
	player.stich.push(...skatcards);

    skatcards = [];

    // Verstecke den handBtn
    this.style.display = 'none';

    // Verstecke den skatAufnehmenBtn
    document.getElementById("skatAufnehmenBtn").style.display = 'none';

    // Verstecke das reizwerte Element
    document.getElementById("reizwerteMnu").style.display = "none";

    // Verstecke den leftGameBtn
    document.getElementById("leftGameBtn").style.display = "none";

    // Einblenden den confirmGameBtn
    document.getElementById("confirmGameBtn").style.display = "none";

    // Zeige die Elemente mit der Klasse ReihenfolgeButtons an
    document.querySelectorAll('.ReihenfolgeButtons button').forEach(button => {
        clearMiddleCards();
        button.style.display = 'block';
        handBtn
    });
});
// Event Listener für den Button "skatAufnehmenBtn"
document.getElementById("skatAufnehmenBtn").addEventListener("click", function skatAufnehmenBtn () {
	

    // Zeige skatcards an
    drawCards(skatcards, []);

    switch (highestBidder.id) {
    case 0:
        player1.cards.push(...skatcards);
        player1.cards.sort((a, b) => extractCardNumber(a) - extractCardNumber(b));
        break
    case 1:
        player2.cards.push(...skatcards);
        player2.cards.sort((a, b) => extractCardNumber(a) - extractCardNumber(b));
        break
    case 2:
        player3.cards.push(...skatcards);
        player3.cards.sort((a, b) => extractCardNumber(a) - extractCardNumber(b));
        break
    }

    // Leere das Array skatcards und lösche die Karten aus der Mitte des Canvas
    skatcards = [];

    // Optional: Verstecke den skatAufnehmenBtn nach dem Aufnehmen der Karten
    this.style.display = 'none';
	
	 canClickFieldForStock = true; // Erlaube Klicken auf das Spielfeld
	 
    // Verstecke auch den Handbutton
    document.getElementById("handBtn").style.display = 'none';

    // Einblenden des confirmGameBtn
    document.getElementById("confirmGameBtn").style.display = "block";

    // Ausblenden des reizwerte Elements
    document.getElementById("reizwerteMnu").style.display = "none";

    // Ausblenden des leftGameBtn
    document.getElementById("leftGameBtn").style.display = "none";

    // Event Listener für den Button "confirmGameBtn"
    const confirmGameBtn = document.getElementById("confirmGameBtn");
    confirmGameBtn.textContent = "Karten nehmen";

    confirmGameBtn.addEventListener("click", function () {

        clearMiddleCards();

        // Ausblenden des reizwerte Elements
        document.getElementById("reizwerteMnu").style.display = "none";

        // Ausblenden des leftGameBtn
        document.getElementById("leftGameBtn").style.display = "none";
        // Optional: Verstecke den skatAufnehmenBtn nach dem Aufnehmen der Karten
        document.getElementById("skatAufnehmenBtn").style.display = 'none';
        // Verstecke auch den Handbutton
        document.getElementById("handBtn").style.display = 'none';
        document.getElementById("confirmGameBtn").style.display = 'block';

        // Überprüfe, ob der Text des Buttons "Karten aufnehmen" ist
        if (this.textContent === "Karten nehmen") {
            // Ändere die Beschriftung des Buttons zu "Stock drücken"
            this.textContent = "Stock drücken";

            // Führe hier die Aktionen aus, die beim Aufnehmen der Karten nötig sind
            // Zum Beispiel: Karten zum Spieler hinzufügen, Skat aufnehmen etc.
        }

        document.getElementById("confirmGameBtn").style.display = "none";

    });

});
// Event Listener für das Anklicken von Karten hinzufügen
spielfeld.addEventListener('click', function spielfeldClick (event) {
	  if (!canClickFieldForStock && !canClickFieldForNextPlayer) {
        return; // Frühzeitige Rückkehr, wenn Klicken nicht erlaubt ist
    }
	
    const rect = spielfeld.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
	

	
    if (aktiverSpielwert < 0) {
        // Überprüfe, ob der Klick innerhalb des gültigen Bereichs liegt
        if (clickY > 4/5.5*(rect.height-rect.top)) {

            const cardNummber = Math.floor(clickX / ((rect.width - rect.left)/12));
            let player = getPlayer(gameState.currentPlayerIndex);
            console.log(player);
            console.log(gameState.currentPlayerIndex);

            // Stelle sicher, dass die angeklickte Karte gültig ist
            if (cardNummber >= 0 && cardNummber < player.cards.length) {
                let card = player.cards[cardNummber];

                // Drücken nach dem reizen

                console.log("reizen in Event Karten anklicken");

                // Wenn die Karte bereits ausgewählt ist, entferne sie aus den ausgewählten Karten
                if (player.selectcards.includes(card)) {
                    player.selectcards.splice(player.selectcards.indexOf(card), 1);
                } else if (player.selectcards.length < 2) { // Füge die Karte hinzu, wenn weniger als 2 ausgewählt sind

                    player.selectcards.push(card);
                }

                // Aktualisiere die Anzeige der Buttons basierend auf der Anzahl der ausgewählten Karten
                updateButtonDisplay(player.selectcards.length);

                clearCardArea(); // Lösche den Bereich vor dem Neuzeichnen
                drawCards(player.cards, player.selectcards); // Zeichne die Spielerkarten neu
            }
        }
    } else {
        // Spielen
		
        if (clickY > 4/5.5*(rect.height-rect.top)) {

            const cardNummber = Math.floor(clickX / ((rect.width - rect.left)/12));
            let player = getPlayer(gameState.currentPlayerIndex);

            // Stelle sicher, dass die angeklickte Karte gültig ist
            if (cardNummber >= 0 && cardNummber < player.cards.length) {
                let card = player.cards[cardNummber];
				

                
				
                // Wenn die Karte bereits ausgewählt ist, entferne sie aus den ausgewählten Karten
                if (player.selectcards.includes(card)) {
                    player.selectcards.splice(player.selectcards.indexOf(card), 1);
					document.getElementById("playCardBtn").style.display = "none";
                } else if (player.selectcards.length < 1) {
                    player.selectcards.push(card);
					document.getElementById("playCardBtn").style.display = "block";
                }
				

                clearCardArea(); // Lösche den Bereich vor dem Neuzeichnen
				drawCards(tablecards, []);
                drawCards(player.cards, player.selectcards);
				
				

            }
        }

    }

});
// Event Listener für den Button "stockDrueckenBtn"
document.getElementById("stockDrueckenBtn").addEventListener("click", function stockDrueckenBtnClick () {
	
    // Verstecke den "stockDrueckenBtn" Button
    this.style.display = "none";
	
	canClickFieldForStock = false;
	
    // Zeige alle Buttons an
    document.querySelectorAll('.ReihenfolgeButtons button').forEach(button => {
        button.style.display = 'block';
    });

    player1.cards.sort((a, b) => extractCardNumber(a) - extractCardNumber(b));
    player2.cards.sort((a, b) => extractCardNumber(a) - extractCardNumber(b));
    player3.cards.sort((a, b) => extractCardNumber(a) - extractCardNumber(b));

    // Hole den aktuellen Spieler basierend auf der ID des höchsten Bieters
    let player = getPlayer(highestBidder.id);

    // Überprüfe, ob der Spieler existiert und ob ausgewählte Karten vorhanden sind
    if (player && player.selectcards.length > 0) {
        // Füge die ausgewählten Karten zum Stich des höchsten Bieters hinzu
		player.stich.push(...player.selectcards);

        // Entferne die ausgewählten Karten aus dem Array der Karten des Spielers
        player.selectcards.forEach(selectedCard => {
            const cardIndex = player.cards.indexOf(selectedCard);
            if (cardIndex !== -1) {
                player.cards.splice(cardIndex, 1);
            }
        });

        // Leere das Array der ausgewählten Karten
        player.selectcards = [];

        // Aktualisiere die Anzeige der Buttons basierend auf der Anzahl der ausgewählten Karten
        updateButtonDisplay(player.selectcards.length);

        clearCardArea(); // Lösche den Bereich vor dem Neuzeichnen
        drawCards(player.cards, player.selectcards); // Zeichne die Spielerkarten neu


    }
});
// Event Listener für den Button "handBtn"
document.getElementById("playBeginBtn").addEventListener("click", function () {
	console.log("Spielerrolle setzten");
	console.log(player1);
	console.log(player2);
	console.log(player3);
	
    // Zeige an, dass Player1 dran ist (ersetzen Sie 'player1.name' durch den tatsächlichen Namen)
    const playerNameText = `${player1.name} du bist dran`;

    displayTextOnCanvas(playerNameText); // Zeige den Text auf dem Canvas an

    drawCustomCard(10);
    document.getElementById("nextPlayerBtn1").style.display = "block";
    document.getElementById("playBeginBtn").style.display = "none";
    // Zeige das ausgewählte Spiel und den aktuellen Spieler an
});
document.getElementById("nextPlayerBtn").addEventListener("click", function () {
	
	drawCards(tablecards, []);
    clearCardArea(); // Lösche den Bereich vor dem Neuzeichnen
	
    let nextPlayer = getPlayer(gameState.currentPlayerIndex);
	

    drawCards(nextPlayer.cards, []);
    drawCards(tablecards, []);
	
    canClickFieldForNextPlayer = true; // Erlaube Klicken auf das Spielfeld
	document.getElementById("nextPlayerBtn").style.display = "none";
    document.getElementById("playCardBtn").style.display = "none";
});
document.getElementById("nextPlayerBtn1").addEventListener("click", function () {
	
	
    clearCardArea(); // Lösche den Bereich vor dem Neuzeichnen
	
    
	drawCards(player1.cards, player1.selectcards);
    
	
    canClickFieldForNextPlayer = true; // Erlaube Klicken auf das Spielfeld
	document.getElementById("nextPlayerBtn1").style.display = "none";
    document.getElementById("playCardBtn").style.display = "none";
});
document.getElementById("openCardsBtn").addEventListener("click", function openCardsBtn() {
	
});
document.getElementById("playCardBtn").addEventListener("click", function playCardBtn() {
        let player = getPlayer(gameState.currentPlayerIndex); // wer spielt gerade?
        if (player.selectcards.length !== 1) { // Wächter, ob die Funktion wirklich arbeiten darf
            return;
        }
        let card = player.selectcards[0]; // die Karte, die jetzt gespielt wird
        clearCardArea();

        // nimm die Karte aus der Hand des Spielers
        const cardIndex = player.cards.indexOf(card);
        if (cardIndex !== -1) {
            player.cards.splice(cardIndex, 1);
            player.selectcards = [];
            console.log("cardIndex " + cardIndex);
            console.log("player " + player);
            console.log(player);
        }

        // lege Karte auf den Tisch
        tablecards.push(card);
        drawCards(tablecards, []);
        console.log("tablecards " + tablecards);
        console.log(tablecards);

        // Nachdem tablecards aktualisiert wurde, überprüfe, ob wir die Spielerbuttons anzeigen/verstecken müssen
        console.log("Event Text");
        if (tablecards.length === 3) {
            // Wenn drei Karten auf dem Tisch liegen, zeige die Buttons an
            document.getElementById("nextPlayerBtn").style.display = "none";
			document.getElementById("stichBtn").style.display = "block";
			
			console.log("*******player*******");
			console.log(player);

            let winnerPlayer = werteStichAus(tablecards, aktiverSpielwert, getNextPlayer(player));
			if (winnerPlayer !== undefined) {
				verarbeiteStichFuer(winnerPlayer);
			} else {
			
			}
        } else {
            let nextPlayer = getNextPlayer(player);
            gameState.currentPlayerIndex = nextPlayer.id;
            document.getElementById("nextPlayerBtn").style.display = "block";
            textToShow = `${nextPlayer.name} du bist dran`;
            displayTextOnCanvas(textToShow);
        }
		
		canClickFieldForNextPlayer = false;
        drawCustomCard(player.cards.length+1);
        document.getElementById("playCardBtn").style.display = "none"; 
});
document.getElementById("stichBtn").addEventListener("click", () => {
            document.getElementById("dialog-Stich").showModal();
            });
document.getElementById("player1Btn").addEventListener("click", () => {
				verarbeiteStichFuer(player1);
                document.getElementById("dialog-Stich").close();
            });
document.getElementById("player2Btn").addEventListener("click", () => {
				verarbeiteStichFuer(player2);
                document.getElementById("dialog-Stich").close();
			});
document.getElementById("player3Btn").addEventListener("click", () => {
				verarbeiteStichFuer(player3);
                document.getElementById("dialog-Stich").close();
			});
document.getElementById("SpielAusWertenBtn").addEventListener("click", function () {
	document.getElementById("neuesSpielBtn").style.display = "block";
	document.getElementById("SpielAusWertenBtn").style.display = "none";
	
	
});
document.getElementById("neuesSpielBtn").addEventListener("click",  function neuesSpielBtn() {
	rotatePlayers();
	drawCustomCard(10);
	drawCards();
	clearTextFromCanvas();
	startNewGame();
	clearCardArea(); 
    resetGame(); // Beispiel: Funktion zum Zurücksetzen des Spiels aufrufen

    this.style.display = "none"; // Verstecke den Button für ein neues Spiel wieder
	document.getElementById("startGameBtn").style.display = "none";
	document.getElementById("confirmGameBtn").style.display = "block";
    stichCount = 0; // Setze den Zähler für die bewerteten Stiche zurück auf 0
	
});	
// Zeichne die Spielerrollen neu

console.log("Spielerrolle setzten");
	console.log(player1);
	console.log(player2);
	console.log(player3);
	startNewGame();
	resetGame();
	drawCustomCard(10);
