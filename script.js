let praeparate = [];

const container = document.getElementById("praeparate");
const suchfeld = document.getElementById("suchfeld");
const anzahl = document.getElementById("anzahl");


// Daten aus daten.json laden

fetch("daten.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("daten.json konnte nicht geladen werden.");
        }

        return response.json();
    })

    .then(daten => {
        praeparate = daten;

        anzeigen();
    })

    .catch(error => {
        console.error(error);

        container.innerHTML = `
            <div class="keine-ergebnisse">
                <h2>Fehler beim Laden</h2>
                <p>
                    Die Präparate-Daten konnten nicht geladen werden.
                </p>
            </div>
        `;
    });


// Präparate anzeigen

function anzeigen() {

    const suchbegriff = suchfeld.value
        .toLowerCase()
        .trim();


    // Nach Suchbegriff filtern

    const ergebnisse = praeparate.filter(praeparat => {

        const name = praeparat.name || "";
        const ort = praeparat.ort || "";

        const stichwoerter =
            praeparat.stichwoerter || [];


        const gesamterText = (

            name + " " +
            ort + " " +
            stichwoerter.join(" ")

        ).toLowerCase();


        return gesamterText.includes(suchbegriff);
    });


    // Ergebnisanzahl anzeigen

    anzahl.textContent =
        `${ergebnisse.length} Präparat` +
        (ergebnisse.length !== 1 ? "e" : "") +
        " gefunden";


    // Alten Inhalt löschen

    container.innerHTML = "";


    // Keine Ergebnisse

    if (ergebnisse.length === 0) {

        container.innerHTML = `
            <div class="keine-ergebnisse">
                <h2>Keine Ergebnisse</h2>
                <p>
                    Zu deiner Suche wurde kein Präparat gefunden.
                </p>
            </div>
        `;

        return;
    }


    // Ergebnisse anzeigen

    ergebnisse.forEach(praeparat => {

        const karte = document.createElement("div");

        karte.className = "praeparat";


        // Stichwort-Tags erstellen

        const tags =
            (praeparat.stichwoerter || [])
            .map(stichwort => {

                return `
                    <span class="tag">
                        ${stichwort}
                    </span>
                `;

            })
            .join("");


        // Karte erstellen

        karte.innerHTML = `

            <img
                src="${praeparat.bild}"
                alt="${praeparat.name}"
            >

            <h2>
                ${praeparat.name}
            </h2>

            <p class="ort">
                📍 ${praeparat.ort}
            </p>

            <div class="stichwoerter">
                🏷️ ${tags}
            </div>

        `;


        container.appendChild(karte);
    });
}


// Suche bei jeder Eingabe aktualisieren

suchfeld.addEventListener("input", anzeigen);