// Canvas und Kontexte definieren
const Spielfeld = document.getElementById('Spielfeld');
const canvasSecondary = document.getElementById('canvasSecondary');
const thirdCanvas = document.getElementById('thirdCanvas');
const innerCanvas = document.getElementById('innerCanvas');
const ctx = Spielfeld.getContext('2d');
const ctxSecondary = canvasSecondary.getContext('2d');
const ctxthirdCanvas = thirdCanvas.getContext('2d');

let textToShow = "";
let currentBidderIndex = 0;
 // Deklarieren Sie highestBidder im globalen Scope
let highestBidder = { name: "", bid: 0 };
// Button zum Anzeigen der Karten
const showCardsBtn = document.getElementById('showCards');

let hasPickedUpSkat = false;

// Spieler Namen und Kartenmaße
let player1Name = "";
let player2Name = "";
let player3Name = "";
const cardWidth = 170;
const cardHeight = 200;

 const player1Points = document.getElementById('player1Points');
    const player2Points = document.getElementById('player2Points');
    const player3Points = document.getElementById('player3Points');

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

// Aktueller Spieler und Flagge für Spielerrollenwahl
let currentPlayer = "Vorhand";
let rolesChosenFlag = false; // Variable für die Bestätigung der Spielerrollen

// Startposition der Karten
const startY = Spielfeld.height - cardHeight;

// Spieler Namen aus dem Local Storage entfernen
localStorage.removeItem('player1Name');
localStorage.removeItem('player2Name');
localStorage.removeItem('player3Name');
localStorage.removeItem('player4Name');
localStorage.removeItem('gameStarted');

 document.getElementById("confirmGameBtn").style.display = "none";
    document.getElementById("leftGameButton").style.display = "none";
    document.getElementById("showCards").style.display = "block";
	document.getElementById("reizwerte").style.display = "none";
	document.getElementById("handBtn").style.display = "none";
	document.getElementById("aufnehmenBtn").style.display = "none";
	
	// Verstecke alle Buttons zu Beginn
document.querySelectorAll('.ReihenfolgeButtons button').forEach(button => {
    button.style.display = 'none';
});

// Event Listener für Eingabe der Spieler Namen
document.getElementById("player1Name").addEventListener("change", function() {
    player1Name = this.value;
});

document.getElementById("player2Name").addEventListener("change", function() {
    player2Name = this.value;
});

document.getElementById("player3Name").addEventListener("change", function() {
    player3Name = this.value;
});


// Beim Laden der Seite werden die Eingabefelder geleert
window.onload = function() {
    document.getElementById("player1Name").value = "";
    document.getElementById("player2Name").value = "";
    document.getElementById("player3Name").value = "";
};



// Array mit Kartennamen erstellen und mischen
const cards = ['img/card1.gif', 'img/card2.gif', 'img/card3.gif', 'img/card4.gif',
 'img/card5.gif', 'img/card6.gif', 'img/card7.gif', 'img/card8.gif', 'img/card9.gif',
 'img/card10.gif', 'img/card11.gif', 'img/card12.gif', 'img/card13.gif', 'img/card14.gif',
 'img/card15.gif', 'img/card16.gif', 'img/card17.gif', 'img/card18.gif', 'img/card19.gif',
 'img/card20.gif', 'img/card21.gif', 'img/card22.gif', 'img/card23.gif', 'img/card24.gif',
 'img/card25.gif', 'img/card26.gif', 'img/card27.gif',' img/card28.gif',' img/card29.gif',
' img/card30.gif', ' img/card31.gif',' img/card32.gif']; // Hier sind alle Kartennamen aufgeführt

// Funktion zum Extrahieren der Kartennummer aus dem Dateinamen
function extractCardNumber(card) {
    return parseInt(card.match(/\d+/)[0]);
}

// Spielername-Änderungsereignisse abfangen und Werte speichern
document.getElementById("player1Name").addEventListener("change", function() {
    player1Name = this.value;
});
document.getElementById("player2Name").addEventListener("change", function() {
    player2Name = this.value;
});
document.getElementById("player3Name").addEventListener("change", function() {
    player3Name = this.value;
});


// Funktion zum Mischen des Arrays
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}



// Mische die sortierten Karten
shuffle(cards);

// Karten für jeden Spieler erstellen
let player1Cards = cards.slice(0, 10);
let player2Cards = cards.slice(10, 20);
let player3Cards = cards.slice(20, 30);
let player4Cards = cards.slice(30, 32);

console.log(player1Cards, player2Cards, player3Cards);


// Sortiere die Karten nach ihrer Größe, nachdem Player1 die Karten erhalten hat
player1Cards.sort((a, b) => extractCardNumber(a) - extractCardNumber(b)); 
player2Cards.sort((a, b) => extractCardNumber(a) - extractCardNumber(b)); 
player3Cards.sort((a, b) => extractCardNumber(a) - extractCardNumber(b)); 




// Funktion zum Zeichnen einer Karte auf dem Canvas
function drawCard(x, y, card) {
    const img = new Image();
    img.src = card;
    img.onload = function() {
        ctx.drawImage(img, x, y, cardWidth, cardHeight);
    };
}

// Funktion zum Laden der Karten für einen Spieler
function loadPlayerCards(playerCards) {
    // Überprüfe, ob playerCards ein Array ist und Elemente enthält
    if (Array.isArray(playerCards) && playerCards.length > 0) {
        playerCards.forEach((card, index) => {
            let posX = index * (cardWidth - 12) + 1;
            let posY = startY;

            // Positionierung der Karten für Spieler 4 in der Mitte des Canvas
            if (playerCards === player4Cards && (index === 0 || index === 1)) {
                posX = Spielfeld.width / 2 - cardWidth / 2 + index * (cardWidth - 10);
                posY = Spielfeld.height / 2 - cardHeight / 2;
            }

            // Karte zeichnen
            drawCard(posX, posY, card);
        });
    } else {
        console.error('loadPlayerCards wurde mit einem ungültigen Argument aufgerufen:', playerCards);
    }
}
// Funktion zum Laden der benutzerdefinierten Karten
function loadCustomCard() {
    for (let i = 0; i < 10; i++) {     
        drawCard(i * (cardWidth - 12) + 1, startY, 'img/card33.gif');
    }

    // Zwei Karten nebeneinander in der Mitte des Canvas laden
	if (player4Cards.length > 0){
		drawCard(Spielfeld.width / 2 - cardWidth / 2, Spielfeld.height / 2 - cardHeight / 2, 'img/card33.gif');
		drawCard(Spielfeld.width / 2 + cardWidth / 2 - 10, Spielfeld.height / 2 - cardHeight / 2, 'img/card33.gif');
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
 
// Event Listener für den Button "confirmGameBtn"
document.getElementById("confirmGameBtn").addEventListener("click", function() {
    textToShow = ""; // Verwende die bereits global deklarierte Variable textToShow

    switch(currentPlayer) {
        case "Vorhand":
            textToShow = `${player1Name} du bist dran`;
            loadPlayerCards(player1Cards);
            document.getElementById("reizwerte").style.display = "block";
            document.getElementById("leftGameButton").style.display = "block";
            currentPlayer = "Dummy"; // Wechsle zum nächsten Spieler
            break;
        case "Dummy":
			  document.getElementById("reizwerte").style.display = "block";
            document.getElementById("leftGameButton").style.display = "block";
            currentPlayer = "Mittelhand"; // Wechsle zum nächsten Spieler ohne Aktion
            break;
        case "Mittelhand":
            textToShow = `${player2Name} du bist dran`;
            loadPlayerCards(player2Cards);
            document.getElementById("reizwerte").style.display = "block";
            document.getElementById("leftGameButton").style.display = "block";
            currentPlayer = "Dumm"; // Wechsle zum nächsten Spieler
            break;
        case "Dumm":
            currentPlayer = "Hinterhand"; // Wechsle zum nächsten Spieler ohne Aktion
            break;
        case "Hinterhand":
            textToShow = `${player3Name} du bist dran`;
            loadPlayerCards(player3Cards);
            document.getElementById("reizwerte").style.display = "block";
            document.getElementById("leftGameButton").style.display = "block";
            currentPlayer = "Dum"; // Wechsle zum nächsten Spieler			
            break;
			case "Dum":
           currentPlayer = "Skat";
		case "Skat":
           
			currentPlayer = "Meist gereizt";
			break;
		case "Meist gereizt":
			 
			 // Zeige den höchsten Bieter an und blende alle Karten aus
            displayHighestBidderAndHideCards(); 
            document.getElementById("reizwerte").style.display = "none";
            document.getElementById("leftGameButton").style.display = "none";
            document.getElementById("confirmGameBtn").style.display = "none";
            break;
          
            
        default:
            console.error('Unbekannter currentPlayer:', currentPlayer);
            break;
    }

    if (currentPlayer !== "") {
        updateCanvasSecondaryText(textToShow); // Aktualisiere Text im sekundären Canvas
        document.getElementById("confirmGameBtn").style.display = "none"; // Verstecke confirmGameBtn
    } else {
        // Alle Spieler haben gereizt, verstecke alle Buttons und zeige das Ergebnis an
        document.getElementById("reizwerte").style.display = "none";
        document.getElementById("leftGameButton").style.display = "none";
        document.getElementById("confirmGameBtn").style.display = "none";
        updateCanvasSecondaryText(`${highestBidder.name}: ${highestBidder.bid}`); // Zeige Gewinner und Gebot an
    }
});








function displayHighestBidder() {
  const textToShow = `${highestBidder.name}: ${highestBidder.bid}`;
  displayText(textToShow);
  
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

let passCount = 0; // Zähler für die Anzahl der Pässe

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
        displayBidValueOnThirdCanvas(selectedReizValue);
        passCount = 0; // Setze den Pass-Zähler zurück, da ein gültiges Gebot abgegeben wurde
    }

    currentBidderIndex++;

    loadCustomCard(); // Blende die Karten mit card33.gif aus

    // Überprüfe, ob alle Spieler gepasst haben
      if (passCount === 3) {
        resetGame(); // Starte das Spiel neu
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

// Funktion zum Zurücksetzen des Spiels und Neuverteilung der Karten
function resetGame() {
    shuffle(cards); // Mische die Karten neu

    player1Cards = cards.slice(0, 10);
    player2Cards = cards.slice(10, 20);
    player3Cards = cards.slice(20, 30);

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

    console.log('Neues Spiel gestartet');
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

      console.log(textToShow);
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

document.addEventListener('click', function(event) {
    if (event.target.id === "showCards") {
        if (!rolesChosenFlag && (player1Name !== "" && player2Name !== "" && player3Name !== "")) {
            showPlayerRoles();
            rolesChosenFlag = true;

            // Deaktivieren der Namenseingabefelder
            document.getElementById("player1Name").readOnly = true;
            document.getElementById("player2Name").readOnly = true;
            document.getElementById("player3Name").readOnly = true;

            [player1Points, player2Points, player3Points].forEach((select, index) => {
                const selectedValue = select.options[select.selectedIndex].text;
                const playerName = [player1Name, player2Name, player3Name][index];
                const textElement = document.createElement("input");
                const inputId = `playerInput` + index++  ;
                textElement.type = "text";
                textElement.value = `${playerName}: ${selectedValue}`;
                textElement.readOnly = true;
                textElement.id = inputId ;
                select.parentNode.replaceChild(textElement, select);
            });
        } else if (rolesChosenFlag) {
            showCardsAndChooseReiz();
        } else {
            showCustomPopup("Bitte geben Sie die Namen aller drei Spieler ein.");
        }
    }
});

window.onload = function() { 
  document.getElementById("player1Name").value = ""; 
  document.getElementById("player2Name").value = ""; 
  document.getElementById("player3Name").value = ""; 
}; 
// Funktion zum Anzeigen des höchsten Bieters in der Konsole
function displayHighestBidderInConsole() {
    if (highestBidder.name !== "") {
        console.log(`${highestBidder.name} : ${highestBidder.bid}`);
		
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




function displayPassedGame() {
    const canvasSecondary = document.getElementById("canvasSecondary");
    const ctxSecondary = canvasSecondary.getContext("2d");
    ctxSecondary.clearRect(0, 0, canvasSecondary.width, canvasSecondary.height); // Altes Canvas löschen
    ctxSecondary.fillStyle = "red";
    ctxSecondary.font = "bold 60px Arial";

    // Berechne die Position für den Text
    const textToShow = "Das Spiel wurde eingepasst";
    const textWidth = ctxSecondary.measureText(textToShow).width;
    const xPosition = (canvasSecondary.width - textWidth) / 2;
    const yPosition = (canvasSecondary.height / 2) + 30; // Zentriere den Text vertikal

    // Schreibe den Text auf das Canvas
    ctxSecondary.fillText(textToShow, xPosition, yPosition);

   
}





// Funktion zum Löschen der Karten in der Mitte des Canvas
function clearMiddleCards() {
    const middleCardX = Spielfeld.width / 2 - cardWidth / 2;
    const middleCardY = Spielfeld.height / 2 - cardHeight / 2;
    ctx.clearRect(middleCardX - 5, middleCardY - 5, cardWidth * 2 + 10, cardHeight + 10); // Etwas größerer Bereich zum klaren Rand
}

// Funktion zum Ausblenden der ReihenfolgeButtons
function hideReihenfolgeButtons() {
    document.querySelectorAll('.ReihenfolgeButtons button').forEach(button => {
        button.style.display = 'none';
    });
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

// Event Listener für alle Buttons mit der Klasse "Reihenfolge"
document.querySelectorAll('.ReihenfolgeButtons .Reihenfolge').forEach(button => {
    button.addEventListener('click', function() {
        clearMiddleCards(); // Rufe die Funktion auf, um die Karten zu löschen
        hideReihenfolgeButtons(); // Blende die ReihenfolgeButtons aus
        displaySelectedGame(this.textContent); // Zeige das ausgewählte Spiel an
    });
});

// Globale Variable für den Hand-Spielzustand
let isHandGame = false;


// Event Listener für den Button "handBtn"
document.getElementById("handBtn").addEventListener("click", function() {
    // Setze isHandGame auf true, da Hand gespielt wird
    isHandGame = true;

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
        button.style.display = 'block';
    });
});

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

// Event Listener für alle Buttons mit der Klasse "Reihenfolge"
document.querySelectorAll('.ReihenfolgeButtons .Reihenfolge').forEach(button => {
    button.addEventListener('click', function() {
        clearMiddleCards(); // Rufe die Funktion auf, um die Karten zu löschen
        hideReihenfolgeButtons(); // Blende die ReihenfolgeButtons aus
        displaySelectedGame(this.textContent); // Zeige das ausgewählte Spiel an

        // Nachdem das Spiel angezeigt wurde, setze isHandGame zurück auf false
        isHandGame = false;
    });
});

function showGameOptions() {
    // Zeige den handBtn wieder an
    document.getElementById("handBtn").style.display = "block";

    // Zeige den aufnehmenBtn wieder an
    document.getElementById("aufnehmenBtn").style.display = "block";
}

function loadHighestBidderCards() {
    // Überprüfe, welcher Spieler der Höchstbietende ist
    if (highestBidder.name === player1Name) {
        loadPlayerCards(player1Cards); // Lade die Karten von Spieler 1
    } else if (highestBidder.name === player2Name) {
        loadPlayerCards(player2Cards); // Lade die Karten von Spieler 2
    } else if (highestBidder.name === player3Name) {
        loadPlayerCards(player3Cards); // Lade die Karten von Spieler 3
    }

    

    // Verstecke den confirmGameBtn nach dem Laden der Karten und Anzeigen der Optionen
    document.getElementById("confirmGameBtn").style.display = "none";
}

// Hilfsfunktion zum Anzeigen der Spieloptionen-Buttons
function showGameOptions() {
    document.getElementById("handBtn").style.display = "block"; // Zeige den handBtn wieder an
    document.getElementById("aufnehmenBtn").style.display = "block"; // Zeige den aufnehmenBtn wieder an
}


// Event Listener für den Button "confirmGameBtn"
document.getElementById("confirmGameBtn").addEventListener("click", function() {
    let textToShow = "";

    switch(currentPlayer){
        case "Vorhand":
            
            currentPlayer = "Dummy";
            textToShow = `${player1Name} du bist dran`;
			 loadCustomCard;
            break;
        case "Dummy":
	
            loadPlayerCards(player1Cards); // Lade card33.gif über die Karten von Mittelhand
			 textToShow = `${player1Name} du bist dran`;
			  currentPlayer = "Mittelhand";
			break;
		case "Mittelhand":
            loadCustomCard; // Lade card33.gif über die Karten von Vorhand
            currentPlayer = "Dumm";
            textToShow = `${player2Name} du bist dran`;
            break;
			  case "Dumm":
            loadPlayerCards(player2Cards); // Lade card33.gif über die Karten von Mittelhand
			 textToShow = `${player2Name} du bist dran`;
			 currentPlayer = "Hinterhand";
			break;
        case "Hinterhand":
            loadCustomCard(); // Lade card33.gif über die Karten von Hinterhand
            currentPlayer = "Skat";
            textToShow = `${player3Name} du bist dran`;
			 currentPlayer = "Dumm";
            break;
		  case "Dumm":
            loadPlayerCards(player3Cards); // Lade card33.gif über die Karten von Mittelhand
			 textToShow = `${player3Name} du bist dran`;
			 currentPlayer = "Skat";

			 break;
		 case "Skat":
            loadCustomCard(); // Lade card33.gif über die Karten von Hinterhand
			currentPlayer = "Meist gereizt";
          break;
		 case "Meist gereizt":
			loadCustomCard();		 
           		 // Zeige die Buttons "Hand" und "Aufnehmen" an
    showGameOptions();
            break;
        default:
            console.error('Unbekannter currentPlayer:', currentPlayer);
            return; // Beenden der Funktion bei unbekanntem currentPlayer
    }

    if (currentPlayer !== "") {
        updateCanvasSecondaryText(textToShow); // Aktualisiere Text im sekundären Canvas

        document.getElementById("reizwerte").style.display = "block"; // Dropdown-Menü anzeigen für aktuellen Spieler
        document.getElementById("leftGameButton").style.display = "block"; // Zeige leftGameButton an

        document.getElementById("confirmGameBtn").style.display = "none"; // Verstecke confirmGameBtn
    } else {
        updateCanvasSecondaryText(`${highestBidder.name}: ${highestBidder.bid}`); // Zeige Gewinner und Gebot an
    }

	 // Überprüfe, welcher Spieler der Höchstbietende ist
    if (highestBidder.name === player1Name) {
        loadPlayerCards(player1Cards); // Lade die Karten von Spieler 1
		
    } else if (highestBidder.name === player2Name) {
        loadPlayerCards(player2Cards); // Lade die Karten von Spieler 2
		
    } else if (highestBidder.name === player3Name) {
        loadPlayerCards(player3Cards); // Lade die Karten von Spieler 3
	
    }


    // Verstecke den confirmGameBtn nach dem Laden der Karten
    document.getElementById("confirmGameBtn").style.display = "none";
	
	  
	  
	 loadHighestBidderCards();
    // Überprüfe, ob das Spiel eingepasst wurde
    if (passCount === 3) {
		  // Ändere den Text des Buttons "showCards" zu "Nächstes Spiel"
    updateShowCardsButtonText("Nächstes Spiel");
        resetGame(); // Starte das Spiel neu
    } 
});

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
	
    player1Cards = cards.slice(0, 10);
    player2Cards = cards.slice(10, 20);
    player3Cards = cards.slice(20, 30);
    player4Cards = cards.slice(30, 32);
	
	// Sortiere die Karten nach ihrer Größe, nachdem Player1 die Karten erhalten hat
player1Cards.sort((a, b) => extractCardNumber(a) - extractCardNumber(b)); 
player2Cards.sort((a, b) => extractCardNumber(a) - extractCardNumber(b)); 
player3Cards.sort((a, b) => extractCardNumber(a) - extractCardNumber(b)); 

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

    console.log('Neues Spiel gestartet');

    // Stelle sicher, dass der showCards-Button sichtbar ist und andere Buttons versteckt sind
    document.getElementById("showCards").style.display = "block";

    // Verstecke die Buttons "Hand" und "Aufnehmen"
	
    document.getElementById("handBtn").style.display = "none";
    document.getElementById("aufnehmenBtn").style.display = "none";

    // Verstecke ReihenfolgeButtons
    hideReihenfolgeButtons();
	
	document.addEventListener('click', function(event) {
    if (event.target.id === "showCards") {
        if (!rolesChosenFlag && (player1Name !== "" && player2Name !== "" && player3Name !== "")) {
            showPlayerRoles();
            rolesChosenFlag = true;

            

            [player1Points, player2Points, player3Points].forEach((select, index) => {
                const selectedValue = select.options[select.selectedIndex].text;
                const playerName = [player1Name, player2Name, player3Name][index];
                const textElement = document.createElement("input");
                const inputId = `playerInput` + index++  ;
                textElement.type = "text";
                textElement.value = `${playerName}: ${selectedValue}`;
                textElement.readOnly = true;
                textElement.id = inputId ;
                select.parentNode.replaceChild(textElement, select);
            });
        } else if (rolesChosenFlag) {
            showCardsAndChooseReiz();
        } 
    }
});
}    


// Event Listener für den Button "aufnehmenBtn"
document.getElementById("aufnehmenBtn").addEventListener("click", function() {
    // Zeige player4Cards an
    loadPlayerCards(player4Cards);

    // Blende card341.gif aus
    clearMiddleCards(); // Diese Funktion sollte bereits definiert sein und die Karten in der Mitte des Canvas löschen

    // Optional: Verstecke den aufnehmenBtn nach dem Aufnehmen der Karten
    this.style.display = 'none';

    // Verstecke auch den Handbutton
    document.getElementById("handBtn").style.display = 'none';

    // Zeige die Buttons mit der Klasse .ReihenfolgeButtons an
    document.querySelectorAll('.ReihenfolgeButtons button').forEach(button => {
        button.style.display = 'block';
    });
	
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

});
});



