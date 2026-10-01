let praeparate = [];

// DOM-Elemente von der Hauptseite
const container = document.getElementById("praeparate");
const suchfeld = document.getElementById("suchfeld");
const anzahl = document.getElementById("anzahl");

// DOM-Elemente für das Detail-Modal (Punkt 3)
const modal = document.getElementById("detail-modal");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close");

// Modal schließen bei Klick auf das 'X' oder außerhalb der Box
if (modalClose) {
    modalClose.onclick = () => modal.classList.add("hidden");
}
window.onclick = (event) => {
    if (event.target === modal) {
        modal.classList.add("hidden");
    }
};

// Funktion: Öffnet das Detail-Fenster für ein bestimmtes Präparat
function zeigeDetails(item) {
    const stichwoerter = Array.isArray(item.stichwoerter) 
        ? item.stichwoerter.join(", ") 
        : (item.stichwoerter || "Keine Tags");

    modalBody.innerHTML = `
        <h2>${item.name || "Unbenanntes Präparat"}</h2>
        <p style="color: #666; margin-top: -8px;"><strong>ID:</strong> ${item.id || "Keine ID"}</p>
        
        ${item.bild ? `<img src="${item.bild}" alt="${item.name}" style="width: 100%; max-height: 280px; object-fit: cover; border-radius: 8px; margin: 12px 0;">` : ""}
        
        <div style="background: #f8f9fa; padding: 12px; border-radius: 6px; margin-top: 10px;">
            <p style="margin: 4px 0;"><strong>Standort / Aufbewahrung:</strong> ${item.ort || "Nicht angegeben"}</p>
            <p style="margin: 4px 0;"><strong>Stichwörter:</strong> ${stichwoerter}</p>
        </div>
    `;
    
    modal.classList.remove("hidden");
}

// Daten laden & aufbereiten
fetch("./daten.json")
    .then(response => response.json())
    .then(daten => {
        const rohdaten = daten.praeparate || [];

        // Wandelt verschachtelte Decap-CMS-Daten falls nötig flach um
        praeparate = rohdaten.map(eintrag => {
            return eintrag.praeparat ? eintrag.praeparat : eintrag;
        });

        anzeigen();
    })
    .catch(error => {
        console.error("Fehler beim Laden:", error);
    });

// Event-Listener für Suchfeld (Echtzeit-Suche)
if (suchfeld) {
    suchfeld.addEventListener("input", anzeigen);
}

// Hauptfunktion zum Rendern der Kärtchen
function anzeigen() {
    if (!container) return;
    
    container.innerHTML = "";
    const suchbegriff = suchfeld ? suchfeld.value.toLowerCase().trim() : "";

    // Nach Suchbegriff filtern
    const ergebnisse = praeparate.filter(praeparat => {
        const name = praeparat.name || "";
        const ort = praeparat.ort || "";
        const stichwoerter = praeparat.stichwoerter || [];

        const gesamterText = (
            name + " " +
            ort + " " +
            (Array.isArray(stichwoerter) ? stichwoerter.join(" ") : stichwoerter)
        ).toLowerCase();

        return gesamterText.includes(suchbegriff);
    });

    // Kärtchen auf der Seite aufbauen
    ergebnisse.forEach(item => {
        const karte = document.createElement("div");
        karte.className = "praeparat-karte";
        
        karte.innerHTML = `
            <h3>${item.name || "Unbenannt"}</h3>
            <p><strong>Standort:</strong> ${item.ort || "-"}</p>
        `;

        // PUNKT 3: Klick-Event anhängen, damit sich die Detailansicht öffnet!
        karte.onclick = () => zeigeDetails(item);

        container.appendChild(karte);
    });

    if (anzahl) {
        anzahl.textContent = ergebnisse.length;
    }
}
