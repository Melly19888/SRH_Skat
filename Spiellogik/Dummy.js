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

	let Aray ="";
	
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
    switch(currentPlayer){ 
			
        case "Vorhand":
			 textToShow = `${player3Name} du bist dran`;
            loadPlayerCards(player1Cards);
            currentPlayer = "Dummy";
            break;
        case "Dummy":
            resetGame();
			 textToShow = `${player1Name} du bist dran`;
            currentPlayer = "Mittelhand";
            break;
        case "Mittelhand":
            loadPlayerCards(player2Cards);
			ctxSecondary.clearRect(0, 0, canvasSecondary.width, canvasSecondary.height);
            currentPlayer = "Dumm";
            break;
        case "Dumm":
            resetGame();
			  textToShow = `${player2Name} du bist dran`;
            currentPlayer = "Hinterhand";
            break;
        case "Hinterhand":
            loadPlayerCards(player3Cards);
			ctxSecondary.clearRect(0, 0, canvasSecondary.width, canvasSecondary.height);
            currentPlayer = "Dum";
            break;
        case "Dum":
            resetGame();
            currentPlayer = "Skat";
			ctxSecondary.clearRect(0, 0, canvasSecondary.width, canvasSecondary.height);
            break;
        case "Skat":
            loadPlayerCards(player4Cards);
            currentPlayer = "Meiste gereizt";
            break; 
    }
	 ctxSecondary.clearRect(0, 0, canvasSecondary.width, canvasSecondary.height); // Altes Canvas löschen
    ctxSecondary.fillStyle="red";
    ctxSecondary.font="bold 60px Arial";
    ctxSecondary.fillText(textToShow, canvasSecondary.width/2 ,canvasSecondary.height/2);
});

function resetGame() {
    let lineHeight = 60; // Deklaration von lineHeight innerhalb der Funktion
   

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