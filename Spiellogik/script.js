"use strict";
// Canvas und Kontexte definieren
const spielfeld = document.getElementById('spielfeld');
const canvasSecondary = document.getElementById('canvasSecondary');
const thirdCanvas = document.getElementById('thirdCanvas');
const innerCanvas = document.getElementById('innerCanvas');
const ctx = spielfeld.getContext('2d');
const ctxSecondary = canvasSecondary.getContext('2d');
const ctxthirdCanvas = thirdCanvas.getContext('2d');
const showCardsBtn = document.getElementById('showCards');

const cardWidth = 170;
const cardHeight = 200;
const player1Points = document.getElementById('player1Points');
const player2Points = document.getElementById('player2Points');
const player3Points = document.getElementById('player3Points');

// Startposition der Karten
const startY = spielfeld.height - cardHeight;

const spielWerte = new Map([
 [ 'karo', 9],
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
 'img/card25.gif', 'img/card26.gif', 'img/card27.gif',' img/card28.gif',' img/card29.gif',
' img/card30.gif', ' img/card31.gif',' img/card32.gif']; // Hier sind alle Kartennamen aufgeführt

let gameState = {
  currentPlayerIndex: 0,
  showCustomCard: false
};
let textToShow = "";
let currentBidderIndex = 0;
 // Deklarieren Sie highestBidder im globalen Scope
let highestBidder = { id: -1, name: "", bid: 0, stich: []};
let gegenspieler ={stich:[]};
// Button zum Anzeigen der Karten

let hasPickedUpSkat = false;

// Globale Variable für den Hand-Spielzustand
let isHandGame = false;

let skatcards = [];
let tablecards = [];

// Spieler Namen und Kartenmaße
let player1 = {name:"", cards:[], ausgewaehlt:[]};
let player2 = {name:"", cards:[], ausgewaehlt:[]};
let player3 = {name:"", cards:[], ausgewaehlt:[]};
let aktiverSpielwert = -1;

// Aktueller Spieler und Flagge für Spielerrollenwahl
let currentPlayer = "Vorhand";
let rolesChosenFlag = false; // Variable für die Bestätigung der Spielerrollen

let passCount = 0; // Zähler für die Anzahl der Pässe

// Globale Variable für den Index des aktuellen Spielers
let currentState = 0;

    player1Points.addEventListener('change', function() {
        player2Points.value = this.value;
        player3Points.value = this.value;
    });

    player2Points.addEventListener('change', function() {
        player1Points.value = this.value;
        player3Points.value = this.value;
    });

    player3Points.addEventListener('change', function() {
        player1Points.value = this.value;
        player2Points.value = this.value;
    });

// Spieler Namen aus dem Local Storage entfernen
localStorage.removeItem('player1Name');
localStorage.removeItem('player2Name');
localStorage.removeItem('player3Name');
localStorage.removeItem('player4Name');
localStorage.removeItem('gameStarted');

	document.getElementById("playBegin").style.display = "none";
	document.getElementById("nextPlayer").style.display = "none";
	document.getElementById("confirmGameBtn").style.display = "none";
    document.getElementById("leftGameButton").style.display = "none";
    document.getElementById("showCards").style.display = "block";
	document.getElementById("reizwerte").style.display = "none";
	document.getElementById("handBtn").style.display = "none";
	document.getElementById("aufnehmenBtn").style.display = "none";
	document.getElementById('aufnehmen').style.display = 'none'; 
	
	// Verstecke alle Buttons zu Beginn
document.querySelectorAll('.ReihenfolgeButtons button').forEach(button => {
    button.style.display = 'none';
});
// Event Listener für Eingabe der Spieler Namen
document.getElementById("player1Name").addEventListener("change", function() {
    player1.name = this.value;
});
document.getElementById("player2Name").addEventListener("change", function() {
    player2.name = this.value;
});
document.getElementById("player3Name").addEventListener("change", function() {
    player3.name = this.value;
});
// Beim Laden der Seite werden die Eingabefelder geleert
window.onload = function() {
    document.getElementById("player1Name").value = "";
    document.getElementById("player2Name").value = "";
    document.getElementById("player3Name").value = "";
};

// Sortiere die Karten nach ihrer Größe, nachdem Player1 die Karten erhalten hat
player1.cards.sort((a, b) => extractCardNumber(a) - extractCardNumber(b)); 
player2.cards.sort((a, b) => extractCardNumber(a) - extractCardNumber(b)); 
player3.cards.sort((a, b) => extractCardNumber(a) - extractCardNumber(b)); 

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
    img.onload = function() {
		if (isSelected){
			y =y-150;
		}
        ctx.drawImage(img, x, y, cardWidth, cardHeight);
    };
}
function updateButtonDisplay(selectedCardsCount) {
    if (selectedCardsCount === 2) {
        document.getElementById('aufnehmen').style.display = 'block'; // Button anzeigen
        
       
    } else {
        document.getElementById('aufnehmen').style.display = 'none'; // Button verstecken
        
       
    }
}
// Funktion zum Löschen des Bereichs, in dem die Karten gezeichnet werden
function clearCardArea() {
    // Angenommen startY ist der Y-Startpunkt und spielfeld.height ist die Höhe des Canvas
    ctx.clearRect(0, startY, spielfeld.width, spielfeld.height - startY);
	 ctx.clearRect(0, 0, spielfeld.width, startY); // Lösche den Bereich oberhalb der Karten
   
}
// Funktion zum Laden der Karten für einen Spieler
function loadPlayerCards(playerCards, selectcards) {
	
	
    // Überprüfe, ob playerCards ein Array ist und Elemente enthält
    if (Array.isArray(playerCards) && playerCards.length > 0) {
        playerCards.forEach((card, index) => {
            let posX = index * (cardWidth - 10) + 1;
            let posY = startY;

            // Positionierung der Karten für Spieler 4 in der Mitte des Canvas
            if (playerCards === skatcards && (index === 0 || index === 1)) {
                posX = spielfeld.width / 2 - cardWidth / 2 + index * (cardWidth - 10);
                posY = spielfeld.height / 2 - cardHeight / 2;
            }
			if ((playerCards === tablecards) &&( tablecards.length >0)) {
                posX = spielfeld.width / 2 - 2*(cardWidth / 2) + index * (cardWidth - 10);
                posY = spielfeld.height / 2 - cardHeight / 2;
            }
	
            // Karte zeichnen
            drawCard(posX, posY, card, selectcards.includes(card));
			
			
        });
    } 
}
// Funktion zum Laden der benutzerdefinierten Karten
function loadCustomCard() {
    for (let i = 0; i < 10; i++) {     
        drawCard(i * (cardWidth - 10) + 1, startY, 'img/card33.gif');
    }

    // Zwei Karten nebeneinander in der Mitte des Canvas laden
	if (skatcards.length > 0){
		drawCard(spielfeld.width / 2 - cardWidth / 2, spielfeld.height / 2 - cardHeight / 2, 'img/card33.gif');
		drawCard(spielfeld.width / 2 + cardWidth / 2 - 10, spielfeld.height / 2 - cardHeight / 2, 'img/card33.gif');
	}
}
// Spielerrollen anzeigen
function showPlayerRoles() {
    let rolesArray = ["Vorhand", "Mittelhand", "Hinterhand"];
    shuffle(rolesArray);
    rolesArray.sort((a, b) => {
        if (a === "Vorhand") return -1;
        if (b === "Vorhand") return 1;
        if (a === "Mittelhand") return -1;
        if (b === "Mittelhand") return 1;
        return 0;
    });

    const innerCanvas = document.getElementById("innerCanvas");
    const ctxInner = innerCanvas.getContext("2d");

    ctxInner.fillStyle = "magenta";
    ctxInner.font = "bold 60px Arial";

    const lineHeight = 150;

    for (let i = 0; i < rolesArray.length; i++) {
        ctxInner.fillText(`${rolesArray[i]}: ${getPlayerName(i)}`, 50, lineHeight*(i+1));
    }

    currentPlayer = rolesArray[0];

    // Zeige den Bestätigen-Button an und verstecke den Karten-Anzeigen-Button
    document.getElementById("confirmGameBtn").style.display = "block";
    document.getElementById("leftGameButton").style.display = "none";
    document.getElementById("showCards").style.display = "none";
   

    // Ändern des Textes im Sekundär-Canvas
    let textToShow = "";

    switch(currentPlayer) {
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

   ctxSecondary.fillStyle="red";
   ctxSecondary.font="bold 60px Arial";

   const textWidth = ctxSecondary.measureText(textToShow).width;

   const xPosition = (canvasSecondary.width - textWidth) / 2;
   const yPosition = (canvasSecondary.height - 40) / 2 + canvasSecondary.offsetTop;

   ctxSecondary.fillText(textToShow, xPosition, yPosition);
}
function getPlayerName(index) {
   switch(index) {
       case 0:
           return document.getElementById("player1Name").value || "Spieler 1";
       case 1:
           return document.getElementById("player2Name").value || "Spieler 2";
       case 2:
           return document.getElementById("player3Name").value || "Spieler 3";
       default:
           return "";
   }
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
  ctxSecondary.fillStyle="red";
  ctxSecondary.font="bold 60px Arial";

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
// Funktion zum Anzeigen des höchsten Bieters in der Konsole
function displayHighestBidderInConsole() {
    if (highestBidder.name !== "") {
       
		
    } 
}
function displayHighestBidderAndHideCards() {
    if (highestBidder.name !== "") {
        const textToShow = `${highestBidder.name} : ${highestBidder.bid}`;
        updateCanvasSecondaryText(textToShow); // Zeige den Namen des höchsten Bieters an
		

        loadCustomCard(); // Blende alle Karten aus mit card33.gif

        // Verstecke den leftGameButton
        document.getElementById("leftGameButton").style.display = "none";

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

    // Zeige den aufnehmenBtn wieder an
    document.getElementById("aufnehmenBtn").style.display = "block";
}
function loadHighestBidderCards() {
    // Überprüfe, welcher Spieler der Höchstbietende ist
    if (highestBidder.name === player1.name) {
        loadPlayerCards(player1.cards,player1.selectcards); // Lade die Karten von Spieler 1
    } else if (highestBidder.name === player2.name) {
        loadPlayerCards(player2.cards, player2.selectcards); // Lade die Karten von Spieler 2
    } else if (highestBidder.name === player3.name) {
        loadPlayerCards(player3.cards, player3.selectcards); // Lade die Karten von Spieler 3
    }

    

    // Verstecke den confirmGameBtn nach dem Laden der Karten und Anzeigen der Optionen
    document.getElementById("confirmGameBtn").style.display = "none";
}
// Hilfsfunktion zum Anzeigen der Spieloptionen-Buttons
function showGameOptions() {
    document.getElementById("handBtn").style.display = "block"; // Zeige den handBtn wieder an
    document.getElementById("aufnehmenBtn").style.display = "block"; // Zeige den aufnehmenBtn wieder an
}
function updateShowCardsButtonText(text) {
    const showCardsButton = document.getElementById("showCards");
    if (showCardsButton) {
        showCardsButton.textContent = text;
    }
}
// Funktion zum Zurücksetzen des Spiels und Neuverteilung der Karten
function resetGame() {
	
	
	shuffle(cards); // Mische die Karten neu

	 // Ausblenden des leftGameButton
    const leftGameButton = document.getElementById("leftGameButton");
    if (leftGameButton) {
        leftGameButton.style.display = "none";
    }

    // Ausblenden des reizwerte Elements
    const reizwerteElement = document.getElementById("reizwerte");
    if (reizwerteElement) {
        reizwerteElement.style.display = "none";
    }
	
   player1.cards = cards.slice(0, 10);
    player2.cards = cards.slice(10, 20);
    player3.cards = cards.slice(20, 30);
    skatcards = cards.slice(30, 32);
	tablecards =[];
	player1.selectcards=[];
	player2.selectcards=[];
	player3.selectcards=[];
	// Sortiere die Karten nach ihrer Größe, nachdem Player1 die Karten erhalten hat
player1.cards.sort((a, b) => extractCardNumber(a) - extractCardNumber(b)); 
player2.cards.sort((a, b) => extractCardNumber(a) - extractCardNumber(b)); 
player3.cards.sort((a, b) => extractCardNumber(a) - extractCardNumber(b)); 

    currentPlayer = "Vorhand"; // Beginne wieder bei Spieler 1
    currentBidderIndex = 0;

    highestBidder.name = "";
    highestBidder.bid = 0;

    passCount = 0; // Setze den Pass-Zähler zurück

    rolesChosenFlag = false;

    document.getElementById("player1Name").readOnly = false;
    document.getElementById("player2Name").readOnly = false;
    document.getElementById("player3Name").readOnly = false;

    updateCanvasSecondaryText(""); // Leere Text im sekundären Canvas

    loadCustomCard(); // Blende alle Karten aus mit card33.gif

    

    // Stelle sicher, dass der showCards-Button sichtbar ist und andere Buttons versteckt sind
    document.getElementById("showCards").style.display = "block";

    // Verstecke die Buttons "Hand" und "Aufnehmen"
	
    document.getElementById("handBtn").style.display = "none";
    document.getElementById("aufnehmenBtn").style.display = "none";

  
	
	document.addEventListener('click', function(event) {
    if (event.target.id === "showCards") {
        if (!rolesChosenFlag && (player1.name !== "" && player2.name !== "" && player3.name !== "")) {
            showPlayerRoles();
            rolesChosenFlag = true;

            

            [player1Points, player2Points, player3Points].forEach((select, index) => {
                const selectedValue = select.options[select.selectedIndex].text;
                const playerName = [player1.name, player2.name, player3.name][index];
                const textElement = document.createElement("input");
                const inputId = `playerInput` + index++  ;
                textElement.type = "text";
                textElement.value = `${playerName}: ${selectedValue}`;
                textElement.readOnly = true;
                textElement.id = inputId ;
                select.parentNode.replaceChild(textElement, select);
            });
        } 
    }
	
});

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
    let yPositionSecondLine = (canvasSecondary.height / 2)+200 ; // Etwas unterhalb der Mitte

    // Schreibe den Text auf das Canvas
    ctxSecondary.fillText(textToShowFirstLine, xPositionFirstLine, yPositionFirstLine);
    ctxSecondary.fillText(textToShowSecondLine, xPositionSecondLine, yPositionSecondLine);
	
	 // Blende den leftGameButton aus und zeige nur den confirmGameBtn an
    document.getElementById("leftGameButton").style.display = "none";
    document.getElementById("confirmGameBtn").style.display = "block";

}
function getPlayer(id){
	switch (highestBidder.id ) {
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
    const textHeight = 60; // Angenommene Höhe des Textes basierend auf der Schriftgröße
    const padding = 10; // Ein wenig zusätzlicher Platz um den Text herum

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
// Funktion zum Laden der Karten des nächsten Spielers und Anzeigen des Textes
function loadNextPlayerCards() {
	
    let nextPlayer;
    let textToShow;

    switch (currentState) {
        case 0:
            nextPlayer = player1;
            textToShow = `${player1.name} du bist dran`;
			
            break;
		case 1:
            nextPlayer = player2;
            textToShow = `${player2.name} du bist dran`;
            break;
        case 2:
            nextPlayer = player2;
            textToShow = `${player2.name} du bist dran`;
			
            break;
		case 3:
            nextPlayer = player3;
            textToShow = `${player3.name} du bist dran`;
            break;
        case 4:
            nextPlayer = player3;
            textToShow = `${player3.name} du bist dran`;
			
            break;
		case 5:
            nextPlayer = player1;
            textToShow = `${player1.name} du bist dran`;
			currentState = -1; // Zurücksetzen für den nächsten Durchlauf
            break;
        default:
            
    }
		gameState.currentPlayerIndex=nextPlayer;
		
        loadPlayerCards(nextPlayer.cards, []);
		loadPlayerCards(tablecards,[]);
        displayTextOnCanvas(textToShow); // Zeige den Text auf dem Canvas an
        currentState++; // Gehe zum nächsten Spieler über
		
		
        if (currentState > 5) {
			nextPlayer = player1; // Zurück zu Vorhand, wenn alle durch sind
            
        }
   
}
// Funktion zum Anzeigen der Karten des nächsten Spielers oder card33.gif
function showNextPlayerOrCustomCard() {
  // Bestimme den aktuellen Spieler basierend auf dem Index
  
  switch (gameState.currentPlayerIndex) {
	
    case 1:
      currentPlayer = player1;
      break;
    case 2:
      currentPlayer = player2;
      break;
    case 3:
      currentPlayer = player3;
      break;
    default:

  }

  // Entscheide, ob die Karten des Spielers oder card33.gif angezeigt werden sollen
  if (gameState.showCustomCard || !currentPlayer) {
    loadCustomCard(); // Zeige card33.gif an
    gameState.showCustomCard = false; // Setze zurück für nächsten Durchlauf
  } else {
    loadPlayerCards(currentPlayer.cards, currentPlayer.ausgewaehlt); // Lade die Karten des aktuellen Spielers
    gameState.showCustomCard = true; // Nächstes Mal card33.gif anzeigen
  }

  // Gehe zum nächsten Spieler über oder zurück zu Vorhand, wenn alle durch sind
  if (!gameState.showCustomCard) {
    gameState.currentState = (gameState.currentState + 1) % 3;
  }
}
// Event Listener für den Button "confirmGameBtn"
document.getElementById("confirmGameBtn").addEventListener("click", function() {
    textToShow = ""; // Verwende die bereits global deklarierte Variable textToShow

    switch(currentPlayer) {
        case "Vorhand":
			
            textToShow = `${player1.name} du bist dran`;
            loadPlayerCards(player1.cards, player1.selectcards);
            document.getElementById("reizwerte").style.display = "block";
            document.getElementById("leftGameButton").style.display = "block";
            loadPlayerCards(player1.cards, player1.selectcards); // Lade card33.gif über die Karten von Mittelhand
			 textToShow = `${player1.name} du bist dran`;
			  currentPlayer = "Mittelhand";
            
            break;
        
        case "Mittelhand":
			
            textToShow = `${player2.name} du bist dran`;
            loadPlayerCards(player2.cards, player2.selectcards);
            document.getElementById("reizwerte").style.display = "block";
            document.getElementById("leftGameButton").style.display = "block";
            loadPlayerCards(player2.cards, player2.selectcards); // Lade card33.gif über die Karten von Mittelhand
			 textToShow = `${player2.name} du bist dran`;
			 currentPlayer = "Hinterhand";
           
            break;
			
        case "Hinterhand":
			
            textToShow = `${player3.name} du bist dran`;
            loadPlayerCards(player3.cards, player3.selectcards);
            document.getElementById("reizwerte").style.display = "block";
            document.getElementById("leftGameButton").style.display = "block";
            loadPlayerCards(player3.cards, player3.selectcards); // Lade card33.gif über die Karten von Mittelhand
			 textToShow = `${player3.name} du bist dran`;
			 currentPlayer = "Skat";			
            break;
		case "Skat":
			
			currentPlayer = "Meist gereizt";
			loadCustomCard();		 
           	// Zeige die Buttons "Hand" und "Aufnehmen" an
			showGameOptions();
			break;
		
			 // Zeige den höchsten Bieter an und blende alle Karten aus
            displayHighestBidderAndHideCards(); 
            document.getElementById("reizwerte").style.display = "none";
            document.getElementById("leftGameButton").style.display = "none";
            document.getElementById("confirmGameBtn").style.display = "none";
            break;
          
            
        default:
           
            break;
    }

    if (currentPlayer !== "") {
        updateCanvasSecondaryText(textToShow); // Aktualisiere Text im sekundären Canvas
        document.getElementById("confirmGameBtn").style.display = "none"; // Verstecke confirmGameBtn
        document.getElementById("reizwerte").style.display = "block"; // Dropdown-Menü anzeigen für aktuellen Spieler
        document.getElementById("leftGameButton").style.display = "block"; // Zeige leftGameButton an
    } else {
        // Alle Spieler haben gereizt, verstecke alle Buttons und zeige das Ergebnis an
        document.getElementById("reizwerte").style.display = "none";
        document.getElementById("leftGameButton").style.display = "none";
        document.getElementById("confirmGameBtn").style.display = "none";
        updateCanvasSecondaryText(`${highestBidder.name}: ${highestBidder.bid}`); // Zeige Gewinner und Gebot an
    }


	 loadHighestBidderCards();
    // Überprüfe, ob das Spiel eingepasst wurde
    if (passCount === 3) {
		  // Ändere den Text des Buttons "showCards" zu "Nächstes Spiel"
    updateShowCardsButtonText("Nächstes Spiel");
         // Starte das Spiel neu
    } 

    // Überprüfe, welcher Spieler der Höchstbietende ist
    if (highestBidder.name === player1.name) {
        loadPlayerCards(player1.cards, player1.selectcards); // Lade die Karten von Spieler 1
		
    } else if (highestBidder.name === player2.name) {
        loadPlayerCards(player2.cards, player2.selectcards); // Lade die Karten von Spieler 2
		
    } else if (highestBidder.name === player3.name) {
        loadPlayerCards(player3.cards, player3.selectcards); // Lade die Karten von Spieler 3
	
    }


    // Verstecke den confirmGameBtn nach dem Laden der Karten
    document.getElementById("confirmGameBtn").style.display = "none";
	
  
});
// Event Listener für den Button "leftGameButton"
document.getElementById("leftGameButton").addEventListener("click", function() {
    const reizwerteSelect = document.getElementById("reizwerte");
    if (!reizwerteSelect.value) {
        alert("Bitte wählen Sie einen Reizwert aus.");
        return; // Frühzeitige Rückkehr, wenn kein Wert ausgewählt wurde
    }
    const selectedReizValue = parseInt(reizwerteSelect.value, 10);

     // Überprüfe, ob der Spieler gepasst hat (Reizwert von 0 ausgewählt)
    if (selectedReizValue === 0) {
        passCount++; // Erhöhe den Pass-Zähler
        if (passCount === 3) {
			 loadCustomCard();
			  document.getElementById("leftGameButton").style.display = "none";
				document.getElementById("confirmGameBtn").style.display = "block";
            displayPassedGame(); // Zeige die Nachricht an, dass das Spiel eingepasst wurde
            return; // Beende die Funktion frühzeitig
        }

    } else if (selectedReizValue > highestBidder.bid) {
        highestBidder.bid = selectedReizValue;
        highestBidder.name = getPlayerName(currentBidderIndex);
		highestBidder.id = currentBidderIndex;
		gameState.currentPlayerIndex = currentBidderIndex;
		
        displayBidValueOnThirdCanvas(selectedReizValue);
        passCount = 0; // Setze den Pass-Zähler zurück, da ein gültiges Gebot abgegeben wurde
    }

    currentBidderIndex++;

    loadCustomCard(); // Blende die Karten mit card33.gif aus

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
        document.getElementById("leftGameButton").style.display = "none";
        document.getElementById("reizwerte").style.display = "none";
    }
});
document.addEventListener('click', function(event) {
    if (event.target.id === "showCards") {
		
        if (!rolesChosenFlag && (player1.name !== "" && player2.name !== "" && player3.name !== "")) {
            showPlayerRoles();
            rolesChosenFlag = true;

            // Deaktivieren der Namenseingabefelder
            document.getElementById("player1Name").readOnly = true;
            document.getElementById("player2Name").readOnly = true;
            document.getElementById("player3Name").readOnly = true;

            
          
        }  else {
            showCustomPopup("Bitte geben Sie die Namen aller drei Spieler ein.");
        }
    }
});
/// Event Listener für alle Buttons mit der Klasse "Reihenfolge"
document.querySelectorAll('.ReihenfolgeButtons .Reihenfolge').forEach(button => {
    button.addEventListener('click', function() {
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

        

        
        document.getElementById("playBegin").style.display = "block";
    });
});
// Event Listener für den Button "handBtn"
document.getElementById("handBtn").addEventListener("click", function() {
    // Setze isHandGame auf true, da Hand gespielt wird
    isHandGame = true;
	highestBidder.stich.push(...skatcards);
	
	
	skatcards = [];
	
	
    // Verstecke den handBtn
    this.style.display = 'none';

    // Verstecke den aufnehmenBtn
    document.getElementById("aufnehmenBtn").style.display = 'none';

    // Verstecke das reizwerte Element
    document.getElementById("reizwerte").style.display = "none";

    // Verstecke den leftGameButton
    document.getElementById("leftGameButton").style.display = "none";
	
	// Einblenden den confirmGameBtn
    document.getElementById("confirmGameBtn").style.display = "block";


    // Zeige die Elemente mit der Klasse ReihenfolgeButtons an
    document.querySelectorAll('.ReihenfolgeButtons button').forEach(button => {
		  clearMiddleCards();
        button.style.display = 'block';handBtn
    });
});
// Event Listener für den Button "aufnehmenBtn"
document.getElementById("aufnehmenBtn").addEventListener("click", function() {
	
	// Zeige skatcards an
    loadPlayerCards(skatcards,[]);
	

	switch (highestBidder.id ) {
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
  

    // Optional: Verstecke den aufnehmenBtn nach dem Aufnehmen der Karten
    this.style.display = 'none';

    // Verstecke auch den Handbutton
    document.getElementById("handBtn").style.display = 'none';

    
	
	// Einblenden des confirmGameBtn
    document.getElementById("confirmGameBtn").style.display = "block";
	
	
    // Ausblenden des reizwerte Elements
    document.getElementById("reizwerte").style.display = "none";

    // Ausblenden des leftGameButton
    document.getElementById("leftGameButton").style.display = "none";

    // Event Listener für den Button "confirmGameBtn"
const confirmGameBtn = document.getElementById("confirmGameBtn");
 confirmGameBtn.textContent = "Karten nehmen";



confirmGameBtn.addEventListener("click", function() {
	
	
	  clearMiddleCards();

	 // Ausblenden des reizwerte Elements
    document.getElementById("reizwerte").style.display = "none";

    // Ausblenden des leftGameButton
    document.getElementById("leftGameButton").style.display = "none";
	// Optional: Verstecke den aufnehmenBtn nach dem Aufnehmen der Karten
   document.getElementById("aufnehmenBtn").style.display = 'none';
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
spielfeld.addEventListener('click', function(event) {
	const rect = spielfeld.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

	
    // Überprüfe, ob der Klick innerhalb des gültigen Bereichs liegt
    if (clickY - startY + cardHeight * 1.5 > 0) {
      

        const cardNummber = Math.floor(1.2 * (clickX) / (cardWidth));
        let player = getPlayer(gameState.currentPlayerIndex);
	console.log(player);
	console.log(gameState.currentPlayerIndex);
	
        // Stelle sicher, dass die angeklickte Karte gültig ist
        if (cardNummber >= 0 && cardNummber < player.cards.length) {
            let card = player.cards[cardNummber];

			// Drücken nach dem reizen
			if (aktiverSpielwert < 0){
				// Wenn die Karte bereits ausgewählt ist, entferne sie aus den ausgewählten Karten
				if (player.selectcards.includes(card)) {
					player.selectcards.splice(player.selectcards.indexOf(card), 1);
				} else if (player.selectcards.length < 2) { // Füge die Karte hinzu, wenn weniger als 2 ausgewählt sind
					player.selectcards.push(card);
				}

				// Aktualisiere die Anzeige der Buttons basierend auf der Anzahl der ausgewählten Karten
				updateButtonDisplay(player.selectcards.length);

			   
				clearCardArea(); // Lösche den Bereich vor dem Neuzeichnen
				loadPlayerCards(player.cards, player.selectcards); // Zeichne die Spielerkarten neu
			// Spielen
			}else {
				tablecards.push(card);

        
		
		
				const cardIndex = player.cards.indexOf(card);
				if (cardIndex !== -1) {
					player.cards.splice(cardIndex,1);
				}
			}
		}

    }


});
// Event Listener für den Button "aufnehmen"
document.getElementById("aufnehmen").addEventListener("click", function() {
    // Verstecke den "aufnehmen" Button
    this.style.display = "none";

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
        highestBidder.stich.push(...player.selectcards);

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
        loadPlayerCards(player.cards, player.selectcards); // Zeichne die Spielerkarten neu

       
    }
});
// Event Listener für den Button "handBtn"
document.getElementById("playBegin").addEventListener("click", function() {
	// Zeige an, dass Player1 dran ist (ersetzen Sie 'player1.name' durch den tatsächlichen Namen)
        const playerNameText = `${player1.name} du bist dran`;

        displayTextOnCanvas(playerNameText); // Zeige den Text auf dem Canvas an

	loadCustomCard();
  document.getElementById("nextPlayer").style.display = "block";
  document.getElementById("playBegin").style.display = "none";
  // Zeige das ausgewählte Spiel und den aktuellen Spieler an
   
});
document.getElementById("nextPlayer").addEventListener("click", function() {
	 loadNextPlayerCards(); // Lade die Karten des nächsten Spielers beim Klicken
	showNextPlayerOrCustomCard();

            
          
 
	
});

resetGame();