let praeparate = [];

const container = document.getElementById("praeparate");
const suchfeld = document.getElementById("suchfeld");
const anzahl = document.getElementById("anzahl");

// Elemente für das Modal-Fenster
const modal = document.getElementById("detail-modal");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close");

// Modal schließen
if (modalClose) {
    modalClose.onclick = () => modal.classList.add("hidden");
}

window.onclick = (event) => {
    if (event.target === modal) {
        modal.classList.add("hidden");
    }
};

// Funktion zum Befüllen & Öffnen des Modals
function zeigeDetails(praeparat) {
    if (!modal || !modalBody) return;

    const tags = (praeparat.stichwoerter || [])
        .map(stichwort => `<span class="tag">${stichwort}</span>`)
        .join("");

    modalBody.innerHTML = `
        <h2>${praeparat.name || "Unbenannt"}</h2>
        <p style="color: #666; margin-top: -5px;"><strong>ID:</strong> ${praeparat.id || "Keine ID"}</p>
        
        ${praeparat.bild ? `<img src="${praeparat.bild}" alt="${praeparat.name}" class="modal-bild">` : ""}
        
        <p class="ort">📍 ${praeparat.ort || "Kein Standort"}</p>
        <div class="stichwoerter">🏷️ ${tags}</div>
    `;

    modal.classList.remove("hidden");
}

// Daten aus daten.json laden und CMS-Struktur glätten
fetch("./daten.json")
    .then(response => response.json())
    .then(daten => {
        const rohdaten = daten.praeparate || [];

        praeparate = rohdaten.map(eintrag => {
            return eintrag.praeparat ? eintrag.praeparat : eintrag;
        });

        anzeigen();
    })
    .catch(error => {
        console.error("Fehler beim Laden der Präparate:", error);
    });

// Präparate anzeigen
function anzeigen() {
    const suchbegriff = suchfeld.value.toLowerCase().trim();

    // Nach Suchbegriff filtern
    const ergebnisse = praeparate.filter(praeparat => {
        const name = praeparat.name || "";
        const ort = praeparat.ort || "";
        const stichwoerter = praeparat.stichwoerter || [];

        const gesamterText = (name + " " + ort + " " + stichwoerter.join(" ")).toLowerCase();

        return gesamterText.includes(suchbegriff);
    });

    // Ergebnisanzahl anzeigen
    anzahl.textContent = `${ergebnisse.length} Präparat${ergebnisse.length !== 1 ? "e" : ""} gefunden`;

    // Alten Inhalt löschen
    container.innerHTML = "";

    // Keine Ergebnisse
    if (ergebnisse.length === 0) {
        container.innerHTML = `
            <div class="keine-ergebnisse">
                <h2>Keine Ergebnisse</h2>
                <p>Zu deiner Suche wurde kein Präparat gefunden.</p>
            </div>
        `;
        return;
    }

    // Ergebnisse anzeigen
    ergebnisse.forEach(praeparat => {
        const karte = document.createElement("div");
        karte.className = "praeparat";

        const tags = (praeparat.stichwoerter || [])
            .map(stichwort => `<span class="tag">${stichwort}</span>`)
            .join("");

        karte.innerHTML = `
            <img src="${praeparat.bild}" alt="${praeparat.name}">
            <h2>${praeparat.name}</h2>
            <p class="ort">📍 ${praeparat.ort}</p>
            <div class="stichwoerter">🏷️ ${tags}</div>
        `;

        // Klick-Event sauber binden
        karte.addEventListener("click", () => zeigeDetails(praeparat));

        container.appendChild(karte);
    });
}

// Suche bei jeder Eingabe aktualisieren
suchfeld.addEventListener("input", anzeigen);
