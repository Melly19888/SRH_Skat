// Canvas und Kontexte definieren
const canvas = document.getElementById('canvas');
const canvasSecondary = document.getElementById('canvasSecondary');
const ctx = canvas.getContext('2d');
const ctxSecondary = canvasSecondary.getContext('2d');

// Button zum Anzeigen der Karten
const showCardsBtn = document.getElementById('showCards');

// Spieler Namen und Kartenmaße
let player1Name = "";
let player2Name = "";
let player3Name = "";
const cardWidth = 200;
const cardHeight = 280;

// Aktueller Spieler und Flagge für Spielerrollenwahl
let currentPlayer = "Vorhand";
let rolesChosenFlag = false; // Variable für die Bestätigung der Spielerrollen

// Startposition der Karten
const startY = canvas.height - cardHeight;

// Spieler Namen aus dem Local Storage entfernen
localStorage.removeItem('player1Name');
localStorage.removeItem('player2Name');
localStorage.removeItem('player3Name');
localStorage.removeItem('player4Name');
localStorage.removeItem('gameStarted');

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

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffle(cards);

// Karten für jeden Spieler erstellen
let player1Cards = cards.slice(0, 10);
let player2Cards = cards.slice(10, 20);
let player3Cards = cards.slice(20, 30);
let player4Cards = cards.slice(30, 32);

// Reizwerte definieren
const reizZahlen = [18, 20, 22, 24];

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
    playerCards.forEach((card, index) => {
        let posX = index * (cardWidth - 10) + 1;
        let posY = startY;

        // Positionierung der Karten für Spieler 4 in der Mitte des Canvas
        if (playerCards === player4Cards && (index === 0 || index === 1)) {
            posX = canvas.width / 2 - cardWidth / 2 + index * (cardWidth - 10);
            posY = canvas.height / 2 - cardHeight / 2;
        } else if (playerCards === player4Cards) {
            posX = canvas.width / 2 + cardWidth / 2 + index * (cardWidth - 10);
            posY = canvas.height / 2 - cardHeight / 2;
        }

        // Karte zeichnen
        drawCard(posX, posY, card);
    });
}

// Funktion zum Laden der benutzerdefinierten Karten
function loadCustomCard() {
    for (let i = 0; i < 10; i++) {
        if (i === 4 || i === 5) {
            drawCard(i * (cardWidth - 10) + 1, startY - 50, 'img/extraImage.gif');
        }
        drawCard(i * (cardWidth - 10) + 1, startY, 'img/card33.gif');
    }

    // Zwei Karten nebeneinander in der Mitte des Canvas laden
    drawCard(canvas.width / 2 - cardWidth / 2, canvas.height / 2 - cardHeight / 2, 'img/card341.gif');
    drawCard(canvas.width / 2 + cardWidth / 2 - 10, canvas.height / 2 - cardHeight / 2, 'img/card341.gif');
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

    ctxSecondary.fillStyle = "blue";
    ctxSecondary.font = "bold 40px Arial";
    ctxSecondary.textAlign = "center";

    const canvasWidth = canvasSecondary.width;
    const canvasHeight = canvasSecondary.height;
    const lineHeight = 60;
    const textOffset = lineHeight / 2;

    for (let i = 0; i < rolesArray.length; i++) {
        switch (rolesArray[i]) {
            case "Vorhand":
                ctxSecondary.fillText(`${player3Name}: Vorhand`, canvasWidth/2, lineHeight*(i*2+1) + textOffset);
                break;
            case "Mittelhand":
                ctxSecondary.fillText(`${player1Name}: Mittelhand`, canvasWidth/2, lineHeight*(i*2+1) + textOffset);
                break;
            case "Hinterhand":
                ctxSecondary.fillText(`${player2Name}: Hinterhand`, canvasWidth/2, lineHeight*(i*2+1) + textOffset);
                break;
            default:
                break;
        }
    }

    currentPlayer= rolesArray[0];

    document.getElementById("confirmGameBtn").style.display="block";
    document.getElementById("showCards").style.display="none";

    // Ändern des Textes im Sekundär-Canvas
    let textToShow = "";
    switch(currentPlayer) {
        case "Vorhand":
            textToShow = `${player3Name} du bist dran`;
            break;
        case "Mittelhand":
            textToShow = `${player1Name} du bist dran`;
            break;
        case "Hinterhand":
            textToShow = `${player2Name} du bist dran`;
            break;
        default:
            break;
    }

    ctxSecondary.fillStyle="red";
    ctxSecondary.font="bold 60px Arial";

    ctxSecondary.fillText(textToShow, canvasWidth/2 ,canvasHeight/2);

    if(currentPlayer==="Vorhand"){
        loadCustomCard();
    }
}

// Event Listener für den Button "confirmGameBtn"
document.getElementById("confirmGameBtn").addEventListener("click", function(){
    switch(currentPlayer){ case "Dummie":
            resetGame();
            currentPlayer = "Vorhand";
            break;		
        case "Vorhand":
            loadPlayerCards(player1Cards);
            currentPlayer = "Dummy";
            break;
        case "Dummy":
            resetGame();
            currentPlayer = "Mittelhand";
            break;
        case "Mittelhand":
            loadPlayerCards(player2Cards);
            currentPlayer = "Dumm";
            break;
        case "Dumm":
            resetGame();
            currentPlayer = "Hinterhand";
            break;
        case "Hinterhand":
            loadPlayerCards(player3Cards);
            currentPlayer = "Dum";
            break;
        case "Dum":
            resetGame();
            currentPlayer = "Skat";
            break;
        case "Skat":
            loadPlayerCards(player4Cards);
            currentPlayer = "Meiste gereizt";
            break; 
    }
});

function resetGame() {
    let lineHeight = 60; // Deklaration von lineHeight innerhalb der Funktion
    ctx.clearRect(0,0,canvas.width,canvas.height); // Altes Canvas löschen

    loadCustomCard();

    switch(currentPlayer) {
		 case "Dummie":
            currentPlayer = "Vorhand";
            break;
        case "Dummy":
            currentPlayer = "Mittelhand";
            break;
        case "Dumm":
            currentPlayer = "Hinterhand";
            break;
		case "Dum":
            currentPlayer = "Skat";
            break;
        default:
            break;
    }

    // Den Text im neuen Canvas anzeigen
    let textToShow = "";
    switch(currentPlayer) {
        case "Vorhand":
            textToShow = `${player3Name} du bist dran`;
            break;
        case "Mittelhand":
            textToShow = `${player1Name} du bist dran`;
            break;
        case "Hinterhand":
            textToShow = `${player2Name} du bist dran`;
            break;
        default:
            break;
    }

    ctxSecondary.clearRect(0, 0, canvasSecondary.width, canvasSecondary.height); // Altes Canvas löschen
    ctxSecondary.fillStyle="red";
    ctxSecondary.font="bold 60px Arial";
    ctxSecondary.fillText(textToShow, canvasSecondary.width/2 ,canvasSecondary.height/2);

    showPlayerRoles(); // Die Spielerrollen erneut anzeigen, um den Namen zu aktualisieren
}
// Funktion zum Anzeigen der Karten und Auswahl des Reizwerts
function showCardsAndChooseReiz() {
    if (rolesChosenFlag) {
        let selectedReiz;
        switch(currentPlayer) {
            case "Vorhand":
                player1Cards.forEach((card,index)=>{
                    drawCard(index*130+50,startY ,card)
                });
                currentPlayer= "Mittelhand";
                break;
            case "Mittelhand":
                player2Cards.forEach((card,index)=>{
                    drawCard(index*130+50,startY ,card)
                });
                currentPlayer= "Hinterhand";
                break;
            case "Hinterhand":
                player3Cards.forEach((card,index)=>{
                    drawCard(index*130+50,startY ,card)
                });
                currentPlayer= "Skat";
                break;
            case "Skat":
                player4Cards.forEach((card,index)=>{
                    drawCard(index*130+50,startY ,card)
                });
                currentPlayer= "Meistgereizte";
                break;
            default:
                break;
        }

        // Verzögerung für die Eingabe des Reizwerts
        setTimeout(() => {
             selectedReiz= prompt("Bitte wähle eine Reizzahl: "+reizZahlen.join(", "));
             // Hier können Sie die Logik für die Auswahl des Reizwerts implementieren
        },1000);
    } else {
        alert("Bitte bestätigen Sie zuerst die Spielerrollen.");
    }
}

// Event Listener für das Klicken auf den Canvas
document.addEventListener('click', function(event) {
    if (event.target.id === "showCards") {
        if (!rolesChosenFlag && (player1Name !== "" && player2Name !== "" && player3Name !== "")) {
            showPlayerRoles();
            rolesChosenFlag = true;
        } else if (rolesChosenFlag) {
           showCardsAndChooseReiz();
        } else {
           alert("Bitte geben Sie die Namen aller drei Spieler ein.");
       }
   }
});