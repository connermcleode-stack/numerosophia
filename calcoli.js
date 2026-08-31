// ============================================================================
// FORMATTAZIONE E VALIDAZIONE DINAMICA DELLA DATA
// ============================================================================

/**
 * Intercetta l'input della data durante la digitazione, formattandolo in GG/MM/AAAA
 * ed evitando che il cursore salti in modo anomalo ad ogni carattere.
 * @param {HTMLInputElement} input - L'elemento input del DOM
 */
function formattaEValidaData(input) {
    let cursorPosition = input.selectionStart;
    let originalLength = input.value.length;

    let v = input.value.replace(/\D/g, '').slice(0, 8);
    
    if (v.length >= 2) {
        let giorno = parseInt(v.slice(0, 2), 10);
        if (giorno > 31) v = '31' + v.slice(2);
        if (giorno === 0) v = '01' + v.slice(2);
    }
    
    if (v.length >= 4) {
        let mese = parseInt(v.slice(2, 4), 10);
        if (mese > 12) v = v.slice(0, 2) + '12' + v.slice(4);
        if (mese === 0) v = v.slice(0, 2) + '01' + v.slice(4);
    }
    
    if (v.length >= 5) {
        input.value = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
    } else if (v.length >= 3) {
        input.value = `${v.slice(0, 2)}/${v.slice(2)}`;
    } else {
        input.value = v;
    }

    let newLength = input.value.length;
    cursorPosition = cursorPosition + (newLength - originalLength);
    input.setSelectionRange(cursorPosition, cursorPosition);
}

// ============================================================================
// MOTORE DI CALCOLO NUMEROLOGICO PITAGORICO
// ============================================================================

const tabellaPitagorica = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
    'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
};

if (!window.databaseArchetipi) {
    window.databaseArchetipi = {};
}

/**
 * Riduce un numero mantenendo i Numeri Maestri (11, 22, 33) e,
 * se si tratta di dati anagrafici o calcoli speciali abilitati, i Numeri Karmici (13, 14, 16, 19).
 */
function riduciNumero(numero, isDatiAnagrafici = false) {
    const maestri = [11, 22, 33];
    const karmici = [13, 14, 16, 19];
    
    if (numero <= 9 || maestri.includes(numero) || (isDatiAnagrafici && karmici.includes(numero))) {
        return numero;
    }
    
    let somma = numero.toString().split('').reduce((acc, cifra) => acc + parseInt(cifra, 10), 0);
    return riduciNumero(somma, isDatiAnagrafici);
}

/**
 * Riduce un numero a una sola cifra (da 1 a 9) in modo stretto,
 * senza interruzioni per Maestri o Karmici.
 */
function riduciMonocifraStretta(numero) {
    if (numero <= 9) return numero;
    let somma = numero.toString().split('').reduce((acc, cifra) => acc + parseInt(cifra, 10), 0);
    return riduciMonocifraStretta(somma);
}

/**
 * Pulisce il testo rimuovendo accents, caratteri speciali e spazi.
 */
function pulisciTesto(testo) {
    if (!testo) return "";
    return testo.normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toUpperCase()
                .replace(/[^A-Z]/g, "");
}

/**
 * Calcola separatamente i valori di Anima, Persona ed Espressione da una stringa.
 */
function calcolaStringaNumerica(testo) {
    const testoPulito = pulisciTesto(testo);
    const vocaliSet = ['A', 'E', 'I', 'O', 'U'];
    let sAnima = 0, sPersona = 0, sEspressione = 0;
    
    for (let l of testoPulito) {
        let v = tabellaPitagorica[l] || 0;
        if (v > 0) {
            sEspressione += v;
            if (vocaliSet.includes(l)) { 
                sAnima += v; 
            } else { 
                sPersona += v; 
            }
        }
    }
    
    return {
        anima: riduciNumero(sAnima, true),
        persona: riduciNumero(sPersona, true),
        espressione: riduciNumero(sEspressione, true)
    };
}

// ============================================================================
// REGISTA CENTRALE: ESEGUI CALCOLO COMPLETO (TAVOLA SINGOLA)
// ============================================================================
let testoCopiaGlobale = "";

function eseguiCalcoloCompleto() {
    // 1. Recupero Input dal DOM
    const nome = document.getElementById('nome').value.trim();
    const cognome = document.getElementById('cognome').value.trim();
    const soprannome = document.getElementById('soprannome')?.value.trim() || "";
    const dataRaw = document.getElementById('dataNascita').value.trim();
    let haCalcolatoQualcosa = false;

    if (dataRaw && dataRaw.length < 10) {
        alert("Per favore, inserisci una data di nascita completa (GG/MM/AAAA) oppure svuota il campo.");
        return;
    }

    let dataNascita = dataRaw ? dataRaw : "";
    const annoTarget = parseInt(document.getElementById('anno')?.value || document.getElementById('annoCorrente')?.value) || 2026;

    if (!nome && !cognome && !soprannome && !dataNascita) {
        alert("Inserisci almeno un campo per generare la tavola.");
        return;
    }

    function format(num) {
        if (!num) return "";
        if ([11, 22, 33, 13, 14, 16, 19].includes(num)) return `${num}/${riduciMonocifraStretta(num)}`;
        return num;
    }

    function estraiNomeArchetipo(num) {
        if (!num) return "Archetipo";
        let base = riduciMonocifraStretta(num);
        return (window.databaseArchetipi[num] || window.databaseArchetipi[base] || { nome: "Archetipo" }).nome;
    }

    const compilaSchedaSicura = (typeof compilaScheda === 'function') ? compilaScheda : function(n) { return ""; };

    testoCopiaGlobale = "--- QUADRO NUMEROLOGICO PITAGORICO COMPLETO ---\n\n";
    if (nome || cognome) testoCopiaGlobale += `Analisi per: ${nome} ${cognome}\n`;
    if (soprannome) testoCopiaGlobale += `Firma Alternativa: ${soprannome}\n`;
    if (dataNascita) testoCopiaGlobale += `Data di Nascita: ${dataNascita}\n`;
    testoCopiaGlobale += `----------------------------------------------\n\n`;


    // 2. Calcoli sul Nome e Cognome (Dati Anagrafici)
    let datiTesto = { anima: "", persona: "", espressione: "" };
    if (nome || cognome) {
        const nomeCompleto = `${nome} ${cognome}`;
        datiTesto = calcolaStringaNumerica(nomeCompleto);

        if (document.getElementById('numAnima')) document.getElementById('numAnima').innerText = format(datiTesto.anima);
        if (document.getElementById('descAnima')) document.getElementById('descAnima').innerHTML = compilaSchedaSicura(datiTesto.anima);
        
        if (document.getElementById('numPersona')) document.getElementById('numPersona').innerText = format(datiTesto.persona);
        if (document.getElementById('descPersona')) document.getElementById('descPersona').innerHTML = compilaSchedaSicura(datiTesto.persona);
        
        if (document.getElementById('numEspressione')) document.getElementById('numEspressione').innerText = format(datiTesto.espressione);
        if (document.getElementById('descEspressione')) document.getElementById('descEspressione').innerHTML = compilaSchedaSicura(datiTesto.espressione);

        testoCopiaGlobale += `Numero dell'Anima (Intimo): ${format(datiTesto.anima)}\n`;
        testoCopiaGlobale += `Numero della Persona (Pubblico): ${format(datiTesto.persona)}\n`;
        testoCopiaGlobale += `Numero dell'Io (Espressione Anagrafica): ${format(datiTesto.espressione)}\n`;
        
        if (document.getElementById('bloccoAnagrafica')) document.getElementById('bloccoAnagrafica').style.display = 'block';
        haCalcolatoQualcosa = true;
    } else {
        if (document.getElementById('bloccoAnagrafica')) document.getElementById('bloccoAnagrafica').style.display = 'none';
    }

    // ============================================================================
    // 3. Calcoli sulla Data di Nascita
    // ============================================================================
    let giornoIsolato = "", destino = "", annoPersonale = "", giornoPersonale = "";
    let cForm = "", cProd = "", cConc = "";
    let p1 = "", p2 = "", p3 = "", p4 = "";
    let oGiov = "", oMat = "", oPrinc = "";

    if (dataNascita && dataNascita.length === 10) {
        const parti = dataNascita.split('/');
        const g = parseInt(parti[0], 10);
        const m = parseInt(parti[1], 10);
        const a = parseInt(parti[2], 10);

        if (!isNaN(g) && !isNaN(m) && !isNaN(a)) {
            const rGiorno = riduciNumero(g, true);
            const rMese = riduciNumero(m, true);
            const rAnno = riduciNumero(a, true);

            const rGiornoStretto = riduciMonocifraStretta(g);
            const rMeseStretto = riduciMonocifraStretta(m);
            const rAnnoStretto = riduciMonocifraStretta(a);

            giornoIsolato = rGiorno;
            
            const cifreData = dataNascita.replace(/[^0-9]/g, ''); 
            let sommaLineareDestino = 0;
            for (let i = 0; i < cifreData.length; i++) {
                sommaLineareDestino += parseInt(cifreData[i], 10);
            }
            destino = riduciNumero(sommaLineareDestino, true);

            cForm = rMese;
            cProd = rGiorno;
            cConc = rAnno;

            p1 = riduciNumero(rMeseStretto + rGiornoStretto, true);
            p2 = riduciNumero(rGiornoStretto + rAnnoStretto, true);
            p3 = riduciNumero(p1 + p2, true);
            p4 = riduciNumero(rMeseStretto + rAnnoStretto, true);

            oGiov = Math.abs(rMeseStretto - rGiornoStretto);
            oMat = Math.abs(rGiornoStretto - rAnnoStretto);
            oPrinc = Math.abs(oGiov - oMat);

            annoPersonale = riduciNumero(rGiornoStretto + rMeseStretto + riduciMonocifraStretta(annoTarget), false);
            
            const oggi = new Date();
            const rOggiGiorno = riduciMonocifraStretta(oggi.getDate());
            const rOggiMese = riduciMonocifraStretta(oggi.getMonth() + 1);
            
           // FORZATURA GIORNO PERSONALE (Solo cifre da 1 a 9, senza Maestri né Karmici)
	   giornoPersonale = riduciMonocifraStretta(riduciMonocifraStretta(annoPersonale) + rOggiGiorno + rOggiMese);

// ============================================================================
// RENDERING GIORNO DI NASCITA (ANTEPRIMA E MODALE CORRETTA)
// ============================================================================
if (document.getElementById('numGiornoIsolato')) {
    document.getElementById('numGiornoIsolato').innerText = g; // Es. 27
}

const sorgenteTesti = window.TESTI_PITAGORA || TESTI_PITAGORA;

if (document.getElementById('descGiornoIsolato') && sorgenteTesti && sorgenteTesti.GIORNI_NASCITA && sorgenteTesti.GIORNI_NASCITA[g]) {
    const datiG = sorgenteTesti.GIORNI_NASCITA[g];
    const archetipoG = sorgenteTesti.ARCHETIPI_GIORNI[g] || "";

    // Calcolo del numero della carta
    let numeroCarta = g;
    const karmiciEMaestri = [11, 13, 14, 16, 19, 22, 33, 44];

    if (!karmiciEMaestri.includes(g) && g > 9) {
        let somma = g;
        while (somma > 9 && !karmiciEMaestri.includes(somma)) {
            somma = String(somma).split('').reduce((acc, digit) => acc + parseInt(digit), 0);
        }
        numeroCarta = somma;
    }

// Percorso blindato: cartella "carte/", nome numerico, formato ".png"
const archetipoGFormattato = (archetipoG || '').replace(/\s*\(/, '<br>(');

document.getElementById('descGiornoIsolato').innerHTML = `
    <div class="anteprima-card" onclick="apriModalGiorno(${g})">
        <img src="carte/${numeroCarta}.png" alt="${archetipoG}" class="img-carta" onerror="this.style.display='none';">
        <h4 class="titolo-archetipo">Archetipo: ${archetipoGFormattato}</h4>
        <p class="testo-clicca">➔ Clicca qui per leggere l'analisi completa</p>
    </div>
`;
}

function apriModalGiorno(giorno) {
    const sorgenteTesti = window.TESTI_PITAGORA || TESTI_PITAGORA;
    if (!sorgenteTesti || !sorgenteTesti.GIORNI_NASCITA || !sorgenteTesti.GIORNI_NASCITA[giorno]) return;

    const t = sorgenteTesti.GIORNI_NASCITA[giorno];
    const archetipo = sorgenteTesti.ARCHETIPI_GIORNI[giorno] || "";
    const archetipoFormattato = archetipo.replace(/\s*\(/, '<br>(');

    let numeroCarta = giorno;
    const karmiciEMaestri = [11, 13, 14, 16, 19, 22, 33, 44];
    if (!karmiciEMaestri.includes(giorno) && giorno > 9) {
        let somma = giorno;
        while (somma > 9 && !karmiciEMaestri.includes(somma)) {
            somma = String(somma).split('').reduce((acc, digit) => acc + parseInt(digit), 0);
        }
        numeroCarta = somma;
    }

    // Impostiamo direttamente il titolo e i contenuti usando gli ID nativi della modale del tuo sito
    const titoloModale = document.getElementById('modaleTitolo');
    const sottotitoloModale = document.getElementById('modaleSottotitolo');
    const contenutoModale = document.getElementById('modaleContenuto');
    const modaleContainer = document.getElementById('modaleApprofondimento');

    if (titoloModale) {
        titoloModale.innerText = `Giorno di Nascita ${giorno}`;
    }
    
    if (sottotitoloModale) {
        sottotitoloModale.innerHTML = "";
    }

    if (contenutoModale) {
        contenutoModale.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="carte/${numeroCarta}.png" alt="${archetipo}" style="max-width: 130px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
            </div>

            <h3 class="archetipo-nome">
                Archetipo: ${archetipoFormattato}
            </h3>

            <div style="background: rgba(212, 175, 55, 0.06); border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 8px; padding: 15px; margin-bottom: 15px; text-align: center;">
                <h4 style="color: #d4af37; margin-top: 0; margin-bottom: 8px; font-size: 0.95em; text-transform: uppercase;">Doti</h4>
                <p style="margin: 0; font-style: italic; opacity: 0.9; font-size: 0.95em; line-height: 1.4;">${t.sottotitolo}</p>
            </div>

            <div style="background: rgba(30, 58, 138, 0.25); border: 1px solid rgba(59, 130, 246, 0.35); border-radius: 8px; padding: 15px; margin-bottom: 15px; text-align: center;">
                <h4 style="color: #60a5fa; margin-top: 0; margin-bottom: 8px; font-size: 0.95em; text-transform: uppercase;">Significato</h4>
                <p style="margin: 0; line-height: 1.5; font-size: 0.95em;">${t.introduzione}</p>
            </div>

            <div style="background: rgba(185, 28, 28, 0.15); border: 1px solid rgba(239, 68, 68, 0.35); border-radius: 8px; padding: 15px; margin-bottom: 15px; text-align: left;">
                <h4 style="color: #f87171; margin-top: 0; margin-bottom: 8px; font-size: 0.95em;">PUNTI DEBOLI</h4>
                <p style="margin: 0; line-height: 1.5; font-size: 0.95em;">${t.puntiDeboli}</p>
            </div>

            <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(52, 211, 153, 0.35); border-radius: 8px; padding: 15px; text-align: left;">
                <h4 style="color: #34d399; margin-top: 0; margin-bottom: 8px; font-size: 0.95em;">PROFESSIONI IDEALI</h4>
                <p style="margin: 0; line-height: 1.5; font-size: 0.95em;">${t.professioniIdeali}</p>
            </div>
        `;
    }

    if (modaleContainer) {
        modaleContainer.style.display = 'flex';
    }
}

window.apriModalGiorno = apriModalGiorno;
            if (document.getElementById('numCammino')) document.getElementById('numCammino').innerText = format(destino);
            if (document.getElementById('descCammino')) document.getElementById('descCammino').innerHTML = compilaSchedaSicura(destino);
            
            if (document.getElementById('numAnnoPers')) document.getElementById('numAnnoPers').innerText = format(annoPersonale);
            if (document.getElementById('descAnnoPers')) document.getElementById('descAnnoPers').innerHTML = compilaSchedaSicura(annoPersonale);
            
            if (document.getElementById('numGiornoPers')) document.getElementById('numGiornoPers').innerText = format(giornoPersonale);
            if (document.getElementById('descGiornoPers')) document.getElementById('descGiornoPers').innerHTML = compilaSchedaSicura(giornoPersonale);

            const fineC1 = 36 - riduciMonocifraStretta(destino);
            const fineC2 = fineC1 + 9;
            const fineC3 = fineC2 + 9;
            if (document.getElementById('etaCicloForm')) document.getElementById('etaCicloForm').innerText = `Da 0 a ${fineC1} anni`;
	    if (document.getElementById('etaCicloProd')) document.getElementById('etaCicloProd').innerText = `Da ${fineC1 + 1} a ${fineC2} anni`;
	    if (document.getElementById('etaCicloConc')) document.getElementById('etaCicloConc').innerText = `Da ${fineC2 + 1} anni in poi`;

            if (document.getElementById('numCicloForm')) document.getElementById('numCicloForm').innerText = format(cForm);
            if (document.getElementById('descCicloForm')) document.getElementById('descCicloForm').innerHTML = compilaSchedaSicura(cForm);

            if (document.getElementById('numCicloProd')) document.getElementById('numCicloProd').innerText = format(cProd);
            if (document.getElementById('descCicloProd')) document.getElementById('descCicloProd').innerHTML = compilaSchedaSicura(cProd);

            if (document.getElementById('numCicloConc')) document.getElementById('numCicloConc').innerText = format(cConc);
            if (document.getElementById('descCicloConc')) document.getElementById('descCicloConc').innerHTML = compilaSchedaSicura(cConc);

// ============================================================================
// ANNO PERSONALE: FUNZIONE MODALE
// ============================================================================
function apriModalAnnoPersonale(anno) {
    const srcTesti = window.TESTI_PITAGORA || window.TESTI_CICLI || (typeof TESTI_CICLI !== 'undefined' ? TESTI_CICLI : null);
    const tMap = srcTesti?.annoPersonale || srcTesti?.ANNI_PERSONALI;
    
    if (!tMap || !tMap[anno]) return;

    const t = tMap[anno];
    const archetipo = t.nome || "";
    const archetipoFormattato = (archetipo || '').replace(/\s*\(/, '<br>(');

    const titoloModale = document.getElementById('modaleTitolo');
    const sottotitoloModale = document.getElementById('modaleSottotitolo');
    const contenutoModale = document.getElementById('modaleContenuto');
    const modaleContainer = document.getElementById('modaleApprofondimento');

    if (titoloModale) titoloModale.innerText = `Anno Personale ${anno}`;
    if (sottotitoloModale) sottotitoloModale.innerHTML = "";

    if (contenutoModale) {
        contenutoModale.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="carte/${anno}.png" alt="${archetipo}" style="max-width: 130px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
            </div>

            <h3 class="archetipo-nome">${archetipoFormattato}</h3>

            ${t.sottotitolo ? `
            <div style="background: rgba(212, 175, 55, 0.06); border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 8px; padding: 15px; margin-bottom: 15px; text-align: center;">
                <h4 style="color: #d4af37; margin-top: 0; margin-bottom: 8px; font-size: 0.95em; text-transform: uppercase;">Doti & Energia</h4>
                <p style="margin: 0; font-style: italic; opacity: 0.9; font-size: 0.95em; line-height: 1.4;">${t.sottotitolo}</p>
            </div>
            ` : ''}

            ${t.introduzione ? `
            <div style="background: rgba(30, 58, 138, 0.25); border: 1px solid rgba(59, 130, 246, 0.35); border-radius: 8px; padding: 15px; margin-bottom: 15px; text-align: center;">
                <h4 style="color: #60a5fa; margin-top: 0; margin-bottom: 8px; font-size: 0.95em; text-transform: uppercase;">Significato dell'Anno</h4>
                <p style="margin: 0; line-height: 1.5; font-size: 0.95em;">${t.introduzione}</p>
            </div>
            ` : ''}

            ${t.opportunita ? `
            <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(52, 211, 153, 0.35); border-radius: 8px; padding: 15px; margin-bottom: 15px; text-align: left;">
                <h4 style="color: #34d399; margin-top: 0; margin-bottom: 8px; font-size: 0.95em;">OPPORTUNITÀ</h4>
                <p style="margin: 0; line-height: 1.5; font-size: 0.95em;">${t.opportunita}</p>
            </div>
            ` : ''}

            ${t.sfide ? `
            <div style="background: rgba(185, 28, 28, 0.15); border: 1px solid rgba(239, 68, 68, 0.35); border-radius: 8px; padding: 15px; margin-bottom: 15px; text-align: left;">
                <h4 style="color: #f87171; margin-top: 0; margin-bottom: 8px; font-size: 0.95em;">SFIDE</h4>
                <p style="margin: 0; line-height: 1.5; font-size: 0.95em;">${t.sfide}</p>
            </div>
            ` : ''}

            ${t.consigliPratici ? `
            <div style="background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(192, 132, 252, 0.35); border-radius: 8px; padding: 15px; text-align: left;">
                <h4 style="color: #c084fc; margin-top: 0; margin-bottom: 8px; font-size: 0.95em;">CONSIGLI PRATICI</h4>
                <p style="margin: 0; line-height: 1.5; font-size: 0.95em;">${t.consigliPratici}</p>
            </div>
            ` : ''}
        `;
    }

    if (modaleContainer) modaleContainer.style.display = 'flex';
}
window.apriModalAnnoPersonale = apriModalAnnoPersonale;

// ============================================================================
// ANNO PERSONALE: RENDERING ANTEPRIMA CARD
// ============================================================================
if (document.getElementById('numAnnoPers')) {
    document.getElementById('numAnnoPers').innerText = format(annoPersonale);
}

if (document.getElementById('descAnnoPers')) {
    const srcText = window.TESTI_PITAGORA || window.TESTI_CICLI || (typeof TESTI_CICLI !== 'undefined' ? TESTI_CICLI : null);
    const mapData = srcText?.annoPersonale || srcText?.ANNI_PERSONALI;

    if (mapData && mapData[annoPersonale]) {
        const datiAP = mapData[annoPersonale];
        const archetipoAP = datiAP.nome || "";
        const archetipoAPFormattato = (archetipoAP || '').replace(/\s*\(/, '<br>(');

        document.getElementById('descAnnoPers').innerHTML = `
            <div class="anteprima-card" onclick="apriModalAnnoPersonale(${annoPersonale})">
                <img src="carte/${annoPersonale}.png" alt="${archetipoAP}" class="img-carta" onerror="this.style.display='none';">
                <h4 class="titolo-archetipo">${archetipoAPFormattato}</h4>
                <p class="testo-clicca">➔ Clicca qui per leggere l'analisi completa</p>
            </div>
        `;
    } else {
        document.getElementById('descAnnoPers').innerHTML = compilaSchedaSicura(annoPersonale);
    }
}

// FORZATURA RENDERING GIORNO PERSONALE
const numGP = parseInt(giornoPersonale, 10);

if (document.getElementById('numGiornoPers')) {
    document.getElementById('numGiornoPers').innerText = numGP;
}

const mappaGiorniGP = (window.TESTI_PITAGORA || TESTI_PITAGORA)?.giornoPersonale || 
                      (window.TESTI_PITAGORA || TESTI_PITAGORA)?.GIORNI_PERSONALI;

// Cerchiamo sia come numero che come stringa per sicurezza
const datiGP = mappaGiorniGP ? (mappaGiorniGP[numGP] || mappaGiorniGP[String(numGP)]) : null;

if (document.getElementById('descGiornoPers') && datiGP) {
    const archetipoGP = datiGP.archetipo || "";
    const archetipoGPFormattato = (archetipoGP || '').replace(/\s*\(/, '<br>(');

    document.getElementById('descGiornoPers').innerHTML = `
        <div class="anteprima-card" onclick="apriModalGiornoPersonale(${numGP})">
            <img src="carte/${numGP}.png" alt="${archetipoGP}" class="img-carta" onerror="this.style.display='none';">
            <h4 class="titolo-archetipo">${archetipoGPFormattato}</h4>
            <p class="testo-clicca">➔ Clicca qui per leggere l'analisi completa</p>
        </div>
    `;
} else if (document.getElementById('descGiornoPers')) {
    // Se finisce qui, significa che i dati non sono stati trovati nell'oggetto!
    console.error("Dati non trovati in mappaGiorniGP per il giorno:", numGP, mappaGiorniGP);
}

// ============================================================================
// GIORNO PERSONALE (FUNZIONE MODALE)
// ============================================================================
function apriModalGiornoPersonale(giorno) {
    // 1. Forzatura riduzione a numero compreso tra 1 e 9
    let giornoRidotto = parseInt(giorno, 10);
    while (giornoRidotto > 9) {
        giornoRidotto = giornoRidotto.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
    }

    // 2. Recupero mappa dei dati (cerca prima giornoPersonale, poi GIORNI_PERSONALI)
    const srcTesti = window.TESTI_PITAGORA || TESTI_PITAGORA;
    const tMap = srcTesti?.giornoPersonale || srcTesti?.GIORNI_PERSONALI;
    
    if (!tMap || !tMap[giornoRidotto]) {
        console.warn("Testi Giorno Personale non trovati per il numero:", giornoRidotto);
        return;
    }

    const t = tMap[giornoRidotto];
    const archetipo = t.archetipo || t.nome || "";
    const archetipoFormattato = (archetipo || '').replace(/\s*\(/, '<br>(');

    // 3. Recupero elementi DOM della modale
    const titoloModale = document.getElementById('modaleTitolo');
    const sottotitoloModale = document.getElementById('modaleSottotitolo');
    const contenutoModale = document.getElementById('modaleContenuto');
    const modaleContainer = document.getElementById('modaleApprofondimento');

    if (titoloModale) titoloModale.innerText = `Giorno Personale ${giornoRidotto}`;
    if (sottotitoloModale) sottotitoloModale.innerHTML = "";

    // 4. Iniezione del layout specifico per il Giorno Personale
    if (contenutoModale) {
        contenutoModale.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="carte/${giornoRidotto}.png" alt="${archetipo}" style="max-width: 130px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
            </div>

            <h3 class="archetipo-nome">${archetipoFormattato}</h3>

            ${t.paroleChiave ? `
            <div style="background: rgba(212, 175, 55, 0.06); border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 8px; padding: 15px; margin-bottom: 15px; text-align: center;">
                <h4 style="color: #d4af37; margin-top: 0; margin-bottom: 8px; font-size: 0.95em; text-transform: uppercase;">Qualità</h4>
                <p style="margin: 0; font-style: italic; opacity: 0.9; font-size: 0.95em; line-height: 1.4;">${t.paroleChiave}</p>
            </div>
            ` : ''}

            ${t.descrizione ? `
            <div style="background: rgba(30, 58, 138, 0.25); border: 1px solid rgba(59, 130, 246, 0.35); border-radius: 8px; padding: 15px; margin-bottom: 15px; text-align: center;">
                <h4 style="color: #60a5fa; margin-top: 0; margin-bottom: 8px; font-size: 0.95em; text-transform: uppercase;">ENERGIA DEL GIORNO</h4>
                <p style="margin: 0; line-height: 1.5; font-size: 0.95em;">${t.descrizione}</p>
            </div>
            ` : ''}

            ${t.lavoro ? `
            <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(52, 211, 153, 0.35); border-radius: 8px; padding: 15px; margin-bottom: 15px; text-align: left;">
                <h4 style="color: #34d399; margin-top: 0; margin-bottom: 8px; font-size: 0.95em;">LAVORO</h4>
                <p style="margin: 0; line-height: 1.5; font-size: 0.95em;">${t.lavoro}</p>
            </div>
            ` : ''}

            ${t.amore ? `
            <div style="background: rgba(236, 72, 153, 0.12); border: 1px solid rgba(244, 114, 182, 0.35); border-radius: 8px; padding: 15px; margin-bottom: 15px; text-align: left;">
                <h4 style="color: #f472b6; margin-top: 0; margin-bottom: 8px; font-size: 0.95em;">AMORE</h4>
                <p style="margin: 0; line-height: 1.5; font-size: 0.95em;">${t.amore}</p>
            </div>
            ` : ''}

            ${t.daEvitare ? `
            <div style="background: rgba(185, 28, 28, 0.15); border: 1px solid rgba(239, 68, 68, 0.35); border-radius: 8px; padding: 15px; text-align: left;">
                <h4 style="color: #f87171; margin-top: 0; margin-bottom: 8px; font-size: 0.95em;">DA EVITARE</h4>
                <p style="margin: 0; line-height: 1.5; font-size: 0.95em;">${t.daEvitare}</p>
            </div>
            ` : ''}
        `;
    }

    if (modaleContainer) modaleContainer.style.display = 'flex';
}
window.apriModalGiornoPersonale = apriModalGiornoPersonale;
// ============================================================================
// RENDERING ANTEPRIMA NUMERO DEL DESTINO
// ============================================================================
let numDestinoVal = 0;

if (typeof numeroDestino !== 'undefined' && numeroDestino) {
    numDestinoVal = parseInt(numeroDestino, 10);
} else if (window.numeroDestino) {
    numDestinoVal = parseInt(window.numeroDestino, 10);
} else if (document.getElementById('numCammino') && document.getElementById('numCammino').innerText) {
    numDestinoVal = parseInt(document.getElementById('numCammino').innerText, 10);
}

if (numDestinoVal && !isNaN(numDestinoVal)) {

    // 1. Aggiorna il numero in alto nella card
    if (document.getElementById('numCammino')) {
        document.getElementById('numCammino').innerText = numDestinoVal;
    }

    // 2. Recupero sorgente dati (priorità assoluta a DESTINO_ANIMA)
    const mappaDestino = window.DESTINO_ANIMA?.destino || 
                         (window.TESTI_PITAGORA || TESTI_PITAGORA)?.destino;

    const datiDestino = mappaDestino ? (mappaDestino[numDestinoVal] || mappaDestino[String(numDestinoVal)]) : null;

    // 3. Iniezione dell'anteprima cliccabile dentro descCammino
    if (document.getElementById('descCammino') && datiDestino) {
        const nomeDestino = datiDestino.nome || "";
        const nomeFormattato = (nomeDestino || '').replace(/\s*\(/, '<br>(');

        document.getElementById('descCammino').innerHTML = `
            <div class="anteprima-card" onclick="apriModalDestino(${numDestinoVal})">
                <img src="carte/${numDestinoVal}.png" alt="${nomeDestino}" class="img-carta" onerror="this.style.display='none';">
                <h4 class="titolo-archetipo">${nomeFormattato}</h4>
                <p class="testo-clicca">➔ Clicca qui per leggere l'analisi completa</p>
            </div>
        `;
    }
}

// ============================================================================
// NUMERO DEL DESTINO (FUNZIONE MODALE)
// ============================================================================
function apriModalDestino(numero) {
    const num = parseInt(numero, 10);

    // Diamo PRIORITÀ assoluta al nuovo file DESTINO_ANIMA
    const srcTesti = window.DESTINO_ANIMA || window.TESTI_DESTINO_ANIMA || window.TESTI_PITAGORA;
    const tMap = srcTesti?.destino;
    
    if (!tMap || !tMap[num]) {
        console.warn("Testi Destino non trovati per il numero:", num);
        return;
    }

    const t = tMap[num];
    const nomeArchetipo = t.nome || "";
    const nomeFormattato = (nomeArchetipo || '').replace(/\s*\(/, '<br>(');

    // Contenitori DOM
    const titoloModale = document.getElementById('modaleTitolo');
    const sottotitoloModale = document.getElementById('modaleSottotitolo');
    const contenutoModale = document.getElementById('modaleContenuto');
    const modaleContainer = document.getElementById('modaleApprofondimento');

    if (titoloModale) titoloModale.innerText = `DESTINO ${num}`;
    if (sottotitoloModale) sottotitoloModale.innerHTML = "";

    // Iniezione con la nuova struttura (introduzione, opportunita, sfide, consigliPratici, carriera)
    if (contenutoModale) {
        contenutoModale.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="carte/${num}.png" alt="${nomeArchetipo}" style="max-width: 130px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.4);" onerror="this.style.display='none';">
            </div>

            <h3 class="archetipo-nome" style="text-align: center; margin-bottom: 15px;">${nomeFormattato}</h3>

            ${t.sottotitolo ? `
	    <div style="background: rgba(212, 175, 55, 0.06); border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 8px; padding: 12px; margin-bottom: 15px; text-align: center;">
    	    <h4 style="color: #d4af37; margin-top: 0; margin-bottom: 6px; font-size: 0.95em; text-transform: uppercase;">QUALITÀ</h4>
   	    <p style="margin: 0; font-style: italic; color: #d4af37; font-size: 0.95em; line-height: 1.4;">${t.sottotitolo}</p>
	    </div>
	    ` : ''}

            ${t.introduzione ? `
            <div style="background: rgba(30, 58, 138, 0.25); border: 1px solid rgba(59, 130, 246, 0.35); border-radius: 8px; padding: 15px; margin-bottom: 15px; text-align: left;">
                <h4 style="color: #60a5fa; margin-top: 0; margin-bottom: 8px; font-size: 0.95em; text-transform: uppercase;">SCOPO E CAMMINO DI VITA</h4>
                <p style="margin: 0; line-height: 1.5; font-size: 0.95em;">${t.introduzione}</p>
            </div>
            ` : ''}

            ${t.opportunita ? `
            <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(52, 211, 153, 0.35); border-radius: 8px; padding: 15px; margin-bottom: 15px; text-align: left;">
                <h4 style="color: #34d399; margin-top: 0; margin-bottom: 8px; font-size: 0.95em; text-transform: uppercase;">POTENZIALI E PUNTI DI FORZA</h4>
                <p style="margin: 0; line-height: 1.5; font-size: 0.95em;">${t.opportunita}</p>
            </div>
            ` : ''}

            ${t.sfide ? `
            <div style="background: rgba(185, 28, 28, 0.15); border: 1px solid rgba(239, 68, 68, 0.35); border-radius: 8px; padding: 15px; margin-bottom: 15px; text-align: left;">
                <h4 style="color: #f87171; margin-top: 0; margin-bottom: 8px; font-size: 0.95em; text-transform: uppercase;">SFIDE E TENDENZE DA SUPERARE</h4>
                <p style="margin: 0; line-height: 1.5; font-size: 0.95em;">${t.sfide}</p>
            </div>
            ` : ''}

            ${t.consigliPratici ? `
            <div style="background: rgba(147, 51, 234, 0.12); border: 1px solid rgba(192, 132, 252, 0.35); border-radius: 8px; padding: 15px; margin-bottom: 15px; text-align: left;">
                <h4 style="color: #c084fc; margin-top: 0; margin-bottom: 8px; font-size: 0.95em; text-transform: uppercase;">CONSIGLI EVOLUTIVI</h4>
                <p style="margin: 0; line-height: 1.5; font-size: 0.95em;">${t.consigliPratici}</p>
            </div>
            ` : ''}

            ${t.carriera ? `
            <div style="background: rgba(234, 179, 8, 0.12); border: 1px solid rgba(250, 204, 21, 0.35); border-radius: 8px; padding: 15px; text-align: left;">
                <h4 style="color: #facc15; margin-top: 0; margin-bottom: 8px; font-size: 0.95em; text-transform: uppercase;">CARRIERA E AMBITI FAVORITI</h4>
                <p style="margin: 0; line-height: 1.5; font-size: 0.95em;">${t.carriera}</p>
            </div>
            ` : ''}
        `;
    }

    if (modaleContainer) modaleContainer.style.display = 'flex';
}
window.apriModalDestino = apriModalDestino;

// --- 1° CICLO DI REALIZZAZIONE (p1) ---
if (document.getElementById('numCiclo1')) document.getElementById('numCiclo1').innerText = format(p1);
if (document.getElementById('etaCiclo1')) document.getElementById('etaCiclo1').innerText = `Da 0 a ${fineC1} anni`;
if (document.getElementById('descCiclo1')) {
    const anteprima = compilaSchedaSicura(p1);
    const testoEsteso = ottieniTestoEstesoCiclo(p1, 'ciclo1');
    document.getElementById('descCiclo1').innerHTML = anteprima;
    
    const card = document.getElementById('descCiclo1').closest('.card');
    if (card) {
        const vecchio = card.querySelector('.testo-segreto');
        if (vecchio) vecchio.remove();
        card.insertAdjacentHTML('beforeend', `<div class="testo-segreto" style="display:none;">${testoEsteso}</div>`);
    }
}

// --- 2° CICLO DI REALIZZAZIONE (p2) ---
if (document.getElementById('numCiclo2')) document.getElementById('numCiclo2').innerText = format(p2);
if (document.getElementById('etaCiclo2')) document.getElementById('etaCiclo2').innerText = `Da ${fineC1 + 1} a ${fineC2} anni`;
if (document.getElementById('descCiclo2')) {
    const anteprima = compilaSchedaSicura(p2);
    const testoEsteso = ottieniTestoEstesoCiclo(p2, 'ciclo2');
    document.getElementById('descCiclo2').innerHTML = anteprima;
    
    const card = document.getElementById('descCiclo2').closest('.card');
    if (card) {
        const vecchio = card.querySelector('.testo-segreto');
        if (vecchio) vecchio.remove();
        card.insertAdjacentHTML('beforeend', `<div class="testo-segreto" style="display:none;">${testoEsteso}</div>`);
    }
}

// --- 3° CICLO DI REALIZZAZIONE (p3) ---
if (document.getElementById('numCiclo3')) document.getElementById('numCiclo3').innerText = format(p3);
if (document.getElementById('etaCiclo3')) document.getElementById('etaCiclo3').innerText = `Da ${fineC2 + 1} a ${fineC3} anni`;
if (document.getElementById('descCiclo3')) {
    const anteprima = compilaSchedaSicura(p3);
    const testoEsteso = ottieniTestoEstesoCiclo(p3, 'ciclo3');
    document.getElementById('descCiclo3').innerHTML = anteprima;
    
    const card = document.getElementById('descCiclo3').closest('.card');
    if (card) {
        const vecchio = card.querySelector('.testo-segreto');
        if (vecchio) vecchio.remove();
        card.insertAdjacentHTML('beforeend', `<div class="testo-segreto" style="display:none;">${testoEsteso}</div>`);
    }
}

// --- 4° CICLO DI REALIZZAZIONE (p4) ---
if (document.getElementById('numCiclo4')) document.getElementById('numCiclo4').innerText = format(p4);
if (document.getElementById('etaCiclo4')) document.getElementById('etaCiclo4').innerText = `Da ${fineC3 + 1} anni in poi`;
if (document.getElementById('descCiclo4')) {
    const anteprima = compilaSchedaSicura(p4);
    const testoEsteso = ottieniTestoEstesoCiclo(p4, 'ciclo4');
    document.getElementById('descCiclo4').innerHTML = anteprima;
    
    const card = document.getElementById('descCiclo4').closest('.card');
    if (card) {
        const vecchio = card.querySelector('.testo-segreto');
        if (vecchio) vecchio.remove();
        card.insertAdjacentHTML('beforeend', `<div class="testo-segreto" style="display:none;">${testoEsteso}</div>`);
    }
}
function ottieniNomeImmagineOmbra(valoreOmbra) {
    return (valoreOmbra === 0 || valoreOmbra === 9) ? 'ombra9' : 'ombra' + valoreOmbra;
}

// Mappa diretta per i nomi delle ombre se i database non sono pronti
const nomiOmbreDefault = {
    1: "Il Ribelle (L'ombra del Guerriero)",
    2: "L'Orfano (L'ombra del Fanciullo)",
    3: "Lo Straniero (L'ombra del Giullare)",
    4: "Il Prigioniero (L'ombra del Costruttore)",
    5: "Il Girovago (L'ombra del Cercatore)",
    6: "Il Martire (L'ombra dell'Angelo Custode)",
    7: "Il Solitario (L'ombra del Saggio)",
    8: "Il Tiranno (L'ombra del Sovrano)",
    9: "L'Angelo caduto (L'ombra del Liberatore)"
};

/**
 * Restituisce il contenuto HTML completo ed esteso per il Modal del Ciclo.
 * Gestisce correttamente percorsi immagini, fallback su base monocifra e numeri karmici/maestri.
 */
function ottieniTestoEstesoCiclo(valoreNumero, chiaveCiclo) {
    try {
        const CARTELLA = 'carte/';

        const tPitagora = window.TESTI_PITAGORA || window.TESTI_CICLI || (typeof TESTI_PITAGORA !== 'undefined' ? TESTI_PITAGORA : null);
        const valStr = String(valoreNumero || '').trim();
        if (!valStr) return compilaSchedaSicura(valoreNumero);

        // Estrazione parti (es. "13/4" -> numOriginale: "13", baseMonocifra: "4")
        let numOriginale = valStr;
        let baseMonocifra = valStr;

        if (valStr.includes('/')) {
            const parti = valStr.split('/');
            numOriginale = parti[0].trim();
            baseMonocifra = parti[1].trim();
        } else if (valStr.length > 1 && !['11', '22', '33'].includes(valStr)) {
            const somma = valStr.split('').reduce((a, b) => parseInt(a || 0) + parseInt(b || 0), 0);
            baseMonocifra = String(somma);
        }

        if (!tPitagora) return compilaSchedaSicura(valoreNumero);

        const sorgente = tPitagora.cicli || tPitagora;

        // Cerca l'archetipo nei testi
        let archetipo = sorgente[valStr] || 
                        sorgente[numOriginale] || 
                        sorgente[parseInt(numOriginale, 10)] || 
                        sorgente[baseMonocifra] || 
                        sorgente[parseInt(baseMonocifra, 10)];

        if (!archetipo) return compilaSchedaSicura(valoreNumero);

        // Cerca il blocco del ciclo specifico
        let c = archetipo.cicli ? archetipo.cicli[chiaveCiclo] : null;

        if (!c && numOriginale !== baseMonocifra) {
            const archetipoBase = sorgente[baseMonocifra] || sorgente[parseInt(baseMonocifra, 10)];
            if (archetipoBase && archetipoBase.cicli) {
                c = archetipoBase.cicli[chiaveCiclo];
            }
        }

        if (!c) return compilaSchedaSicura(valoreNumero);

        // Costruzione percorsi immagini
        const srcPrincipale = CARTELLA ? `${CARTELLA}${numOriginale}.png` : `${numOriginale}.png`;
        const srcFallback = CARTELLA ? `${CARTELLA}${baseMonocifra}.png` : `${baseMonocifra}.png`;

        // Formattazione nome Archetipo con a capo automatico prima della parentesi
        const nomeBr = (archetipo.nome || '').replace(/\s*\(/, '<br>(');
        const stringaNumero = valStr.includes('/') ? ` (${valStr})` : '';

        return `
            <div class="modal-ciclo-esteso">
                <div style="margin-bottom: 15px; text-align: center;">
                    <img src="${srcPrincipale}" 
                         onerror="this.onerror=null; this.src='${srcFallback}';" 
                         alt="Carta ${archetipo.nome}" 
                         style="max-width: 130px; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
                </div>

                <h3 class="archetipo-nome" style="text-align: center; margin-bottom: 6px;">
                    Archetipo: ${nomeBr}${stringaNumero}
                </h3>

                ${archetipo.sottotitolo ? `
                <h5 style="text-align: center; color: #d4af37; font-style: italic; margin-top: 0; margin-bottom: 15px; font-size: 0.95em;">
                    ${archetipo.sottotitolo}
                </h5>` : ''}

                <!-- BOX 1: SIGNIFICATO (Blu) -->
                ${archetipo.introduzione ? `
                <div style="background: rgba(30, 58, 138, 0.25); border: 1px solid rgba(59, 130, 246, 0.35); border-radius: 8px; padding: 15px; margin-bottom: 15px; text-align: center;">
                    <h4 style="color: #60a5fa; margin-top: 0; margin-bottom: 8px; font-size: 0.95em; text-transform: uppercase;">SIGNIFICATO</h4>
                    <p style="margin: 0; line-height: 1.5; font-size: 0.95em; color: #e8e3d9;">
                        ${archetipo.introduzione}
                    </p>
                </div>` : ''}

                <!-- BOX 2: LEZIONI E POTENZIALI (Verde) -->
                <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(52, 211, 153, 0.35); border-radius: 8px; padding: 15px; text-align: left;">
                    <h4 style="color: #34d399; margin-top: 0; margin-bottom: 8px; font-size: 0.95em; text-transform: uppercase; text-align: center;">
                        ${c.titolo || 'Lezioni e Potenziali'}
                    </h4>
                    ${c.lezioni ? `
                    <p style="margin: 0 0 8px 0; line-height: 1.5; font-size: 0.95em; color: #e8e3d9;">
                        <strong>Lezioni:</strong> ${c.lezioni}
                    </p>` : ''}
                    ${c.potenziali ? `
                    <p style="margin: 0; line-height: 1.5; font-size: 0.95em; color: #e8e3d9;">
                        <strong>Potenziali:</strong> ${c.potenziali}
                    </p>` : ''}
                </div>
            </div>
        `;
    } catch (e) {
        console.error("Errore ottieniTestoEstesoCiclo:", e);
        return compilaSchedaSicura(valoreNumero);
    }
}

function estraiEtichettaOmbra(valore) {
    let num = parseInt(valore, 10);
    
    // 1. Controlla prima se esiste nei database trasversali
    let d = (window.databaseOmbreMazzo && (window.databaseOmbreMazzo[num] || window.databaseOmbreMazzo[valore])) || 
            (window.databaseArchetipi && (window.databaseArchetipi[num] || window.databaseArchetipi[valore])) || null;

    if (d) {
        let nome = d.nome || "";
        let titolo = d.titolo || d.sottotitolo || "";
        
        // Se d ha sia nome sia titolo e nome non è genericamente "Ombra X"
        if (nome && !nome.toLowerCase().includes("ombra")) {
            return titolo ? `${nome} (${titolo})` : nome;
        }
    }

    // 2. Se il database non restituisce un testo valido, usa la mappa predefinita integrata
    return nomiOmbreDefault[num] || `Ombra ${num}`;
}

const ombreSetup = [
    { idNum: 'numOmbraGiov', idDesc: 'descOmbraGiov', valore: oGiov },
    { idNum: 'numOmbraMat', idDesc: 'descOmbraMat', valore: oMat },
    { idNum: 'numOmbraPrinc', idDesc: 'descOmbraPrinc', valore: oPrinc }
];

ombreSetup.forEach(ombra => {
    const imgNome = ottieniNomeImmagineOmbra(ombra.valore);
    const etichettaCompleta = estraiEtichettaOmbra(ombra.valore);
    
    // Inserisce il <br> prima della parentesi aperta
    const etichettaFormattata = etichettaCompleta ? etichettaCompleta.replace(/\s*\(/, '<br>(') : '';

    if (document.getElementById(ombra.idNum)) {
        document.getElementById(ombra.idNum).innerText = ombra.valore;
    }

    const containerDesc = document.getElementById(ombra.idDesc);
    if (containerDesc) {
        containerDesc.innerHTML = `
            <div class="anteprima-card" style="cursor: pointer;">
                <img src="carte/${imgNome}.png" 
                     onerror="this.onerror=null; this.src='carte/ombra9.png';" 
                     alt="Ombra ${ombra.valore}" 
                     class="img-carta">
                <h4 class="titolo-archetipo">Archetipo: ${etichettaFormattata}</h4>
                <p class="testo-clicca">➔ Clicca qui per leggere l'analisi completa</p>
            </div>

            <div class="testo-segreto" style="display: none;">
                <img src="carte/${imgNome}.png" 
                     onerror="this.onerror=null; this.src='carte/ombra9.png';" 
                     alt="Ombra ${ombra.valore}" 
                     class="img-carta-modale">
                ${typeof compilaSchedaOmbra === 'function' ? compilaSchedaOmbra(ombra.valore) : 'Sfida evolutiva.'}
            </div>
        `;

        // Attacca l'evento di Apertura Popup direttamente all'elemento creato
        containerDesc.onclick = function() {
            const contenutoModal = this.querySelector('.testo-segreto').innerHTML;
            
            if (typeof apriModal === 'function') {
                apriModal(contenutoModal);
            } else if (typeof mostraPopup === 'function') {
                mostraPopup(contenutoModal);
            } else {
                const modalElement = document.getElementById('modalOmbra') || document.getElementById('modalGenerico');
                if (modalElement) {
                    const modalBody = modalElement.querySelector('.modal-body') || modalElement;
                    modalBody.innerHTML = contenutoModal;
                    modalElement.style.display = 'block';
                }
            }
        };
    }
});

            testoCopiaGlobale += `Giorno di Nascita Isolato: ${format(giornoIsolato)}\n`;
            testoCopiaGlobale += `Numero del Destino (Cammino di Vita): ${format(destino)}\n`;
            testoCopiaGlobale += `--------------------------------------------------\n`;
            testoCopiaGlobale += `Grandi Cicli Evolutivi -> Formativo: ${format(cForm)} | Produttivo: ${format(cProd)} | Conclusivo: ${format(cConc)}\n`;
            testoCopiaGlobale += `Cicli di Realizzazione -> 1°: ${format(p1)} | 2°: ${format(p2)} | 3°: ${format(p3)} | 4°: ${format(p4)}\n`;
            testoCopiaGlobale += `Ombre Numerologiche   -> Giovinezza: ${oGiov} | Maturità: ${oMat} | Principale: ${oPrinc}\n`;
            testoCopiaGlobale += `--------------------------------------------------\n`;
            testoCopiaGlobale += `Anno Personale: ${format(annoPersonale)} | Giorno Personale: ${format(giornoPersonale)}\n`;
            
            if (document.getElementById('bloccoData')) document.getElementById('bloccoData').style.display = 'block';
            haCalcolatoQualcosa = true;
        }
    } else {
        if (document.getElementById('bloccoData')) document.getElementById('bloccoData').style.display = 'none';
    }

    // 4. Calcolo della Quintessenza
    let quintessenza = "";
    if (datiTesto.espressione && destino) {
        const espStretta = riduciMonocifraStretta(datiTesto.espressione);
        const destStretto = riduciMonocifraStretta(destino);
        quintessenza = riduciNumero(espStretta + destStretto, true);
    }

    if (quintessenza) {
        if (document.getElementById('numQuintessenza')) document.getElementById('numQuintessenza').innerText = format(quintessenza);
        if (document.getElementById('descQuintessenza')) document.getElementById('descQuintessenza').innerHTML = compilaSchedaSicura(quintessenza);
        if (document.getElementById('sezioneQuintessenza')) document.getElementById('sezioneQuintessenza').style.display = 'block';
        testoCopiaGlobale += `Quintessenza: ${format(quintessenza)} (${estraiNomeArchetipo(quintessenza)})\n`;
    } else {
        if (document.getElementById('sezioneQuintessenza')) document.getElementById('sezioneQuintessenza').style.display = 'none';
    }

    // 5. SOPRANNOME / FIRMA ALTERNATIVA
    if (soprannome) {
        const soprannomePulito = pulisciTesto(soprannome);
        const datiSoprannome = calcolaStringaNumerica(soprannomePulito);

        if (document.getElementById('numAnimaSop')) document.getElementById('numAnimaSop').innerText = format(datiSoprannome.anima);
        if (document.getElementById('descAnimaSop')) document.getElementById('descAnimaSop').innerHTML = compilaSchedaSicura(datiSoprannome.anima);
        
        if (document.getElementById('numPersonaSop')) document.getElementById('numPersonaSop').innerText = format(datiSoprannome.persona);
        if (document.getElementById('descPersonaSop')) document.getElementById('descPersonaSop').innerHTML = compilaSchedaSicura(datiSoprannome.persona);
        
        if (document.getElementById('numEspressioneSop')) document.getElementById('numEspressioneSop').innerText = format(datiSoprannome.espressione);
        if (document.getElementById('descEspressioneSop')) document.getElementById('descEspressioneSop').innerHTML = compilaSchedaSicura(datiSoprannome.espressione);

        if (document.getElementById('sezioneSoprannome')) document.getElementById('sezioneSoprannome').style.display = 'block';
        
        testoCopiaGlobale += `\nENERGIA ACQUISITA (SOPRANNOME):\n`;
        testoCopiaGlobale += `- Anima Soprannome: ${format(datiSoprannome.anima)}\n`;
        testoCopiaGlobale += `- Persona Soprannome: ${format(datiSoprannome.persona)}\n`;
        testoCopiaGlobale += `- Espressione Soprannome: ${format(datiSoprannome.espressione)}\n`;
        
        haCalcolatoQualcosa = true;
    } else {
        if (document.getElementById('sezioneSoprannome')) document.getElementById('sezioneSoprannome').style.display = 'none';
    }

    // Aggiornamento dello stato visivo globale dei Risultati
    if (haCalcolatoQualcosa) {
        if (document.getElementById('risultati')) document.getElementById('risultati').style.display = 'block';
        if (document.getElementById('btnCopia')) document.getElementById('btnCopia').style.display = 'block';
        if (document.getElementById('btnSalva')) document.getElementById('btnSalva').style.display = 'block';
    } else {
        if (document.getElementById('risultati')) document.getElementById('risultati').style.display = 'none';
    }
}

/**
 * Funzione globale per copiare negli appunti il testo generato
 */
function copiaMappaInAppunti() {
    if (!testoCopiaGlobale) return;

    navigator.clipboard.writeText(testoCopiaGlobale).then(() => {
        alert("Analisi copiata correttamente negli appunti!");
    }).catch(err => {
        console.error("Errore durante la copia: ", err);
        alert("Impossibile copiare automaticamente. Seleziona il testo manualmente.");
    });
}

// ============================================================================
// REGISTA CENTRALE: MOTORE DI CALCOLO ESCLUSIVO PER COMPATIBILITÀ (SINASTRIA)
// ============================================================================

/**
 * Funzione pura per l'elaborazione numerologica della compatibilità di due persone.
 * Nessuna manipolazione del DOM all'interno di questo blocco.
 * 
 * @param {Object} p1 - Dati persona 1 {nome, cognome, data}
 * @param {Object} p2 - Dati persona 2 {nome, cognome, data}
 * @returns {Object} Risultati formattati e numerici per ciascun livello
 */
function calcolaCompatibilitaEsclusiva(p1, p2) {
    function formatLocale(num) {
        if (!num) return "-";
        if ([11, 22, 33, 13, 14, 16, 19].includes(num)) return `${num}/${riduciMonocifraStretta(num)}`;
        return num;
    }

    // Estrazione dinamica del nome dell'Archetipo dal database centralizzato
    function getArchetipo(num) {
        if (!num) return "Archetipo";
        let base = riduciMonocifraStretta(num);
        return (window.databaseArchetipi[num] || window.databaseArchetipi[base] || { nome: "Archetipo" }).nome;
    }

    // Funzione interna per il calcolo lineare del destino da stringa GG/MM/AAAA
    function calcolaDestinoDato(dataStr) {
        if (!dataStr || dataStr.length !== 10) return 0;
        const cifre = dataStr.replace(/[^0-9]/g, '');
        let somma = 0;
        for (let i = 0; i < cifre.length; i++) {
            somma += parseInt(cifre[i], 10);
        }
        return riduciNumero(somma, true);
    }

    let report = {
        io: { calcolabile: false, p1Val: "-", p2Val: "-", p1Arch: "", p2Arch: "", p1Num: 0, p2Num: 0 },
        anima: { calcolabile: false, p1Val: "-", p2Val: "-", p1Arch: "", p2Arch: "", p1Num: 0, p2Num: 0 },
        destino: { calcolabile: false, p1Val: "-", p2Val: "-", p1Arch: "", p2Arch: "", p1Num: 0, p2Num: 0 }
    };

    // 1. Calcolo Livello Io e Anima (da Nome Completo)
    if ((p1.nome || p1.cognome) && (p2.nome || p2.cognome)) {
        const d1 = calcolaStringaNumerica(`${p1.nome} ${p1.cognome}`);
        const d2 = calcolaStringaNumerica(`${p2.nome} ${p2.cognome}`);

        report.io = {
            calcolabile: true,
            p1Val: formatLocale(d1.espressione),
            p2Val: formatLocale(d2.espressione),
            p1Arch: getArchetipo(d1.espressione),
            p2Arch: getArchetipo(d2.espressione),
            p1Num: d1.espressione,
            p2Num: d2.espressione
        };

        report.anima = {
            calcolabile: true,
            p1Val: formatLocale(d1.anima),
            p2Val: formatLocale(d2.anima),
            p1Arch: getArchetipo(d1.anima),
            p2Arch: getArchetipo(d2.anima),
            p1Num: d1.anima,
            p2Num: d2.anima
        };
    }

    // 2. Calcolo Livello Destino (da Data di Nascita)
    if (p1.data && p2.data && p1.data.length === 10 && p2.data.length === 10) {
        const dest1 = calcolaDestinoDato(p1.data);
        const dest2 = calcolaDestinoDato(p2.data);

        report.destino = {
            calcolabile: true,
            p1Val: formatLocale(dest1),
            p2Val: formatLocale(dest2),
            p1Arch: getArchetipo(dest1),
            p2Arch: getArchetipo(dest2),
            p1Num: dest1,
            p2Num: dest2
        };
    }

    return report;
}

// ============================================================================
// ESPOSIZIONE DELLE FUNZIONI A LIVELLO GLOBALE
// ============================================================================
window.formattaEValidaData = formattaEValidaData;
window.riduciNumero = riduciNumero;
window.riduciMonocifraStretta = riduciMonocifraStretta;
window.pulisciTesto = pulisciTesto;
window.calcolaStringaNumerica = calcolaStringaNumerica;
window.eseguiCalcoloCompleto = eseguiCalcoloCompleto;
window.copiaMappaInAppunti = copiaMappaInAppunti;
window.calcolaCompatibilitaEsclusiva = calcolaCompatibilitaEsclusiva;

// ============================================================================
// CALCOLI E DIZIONARI PER RELAZIONI KARMICHE (CON ESPANSIONI)
// ============================================================================

/**
 * Riduce un numero preservando Karmici (13,14,16,19) e Maestri (11,22)
 */
function riduciNumeroKarmico(num) {
  let n = parseInt(num, 10);
  if (isNaN(n) || n === 0) return 0;
  while (n > 9 && ![11, 22, 13, 14, 16, 19].includes(n)) {
    n = String(n).split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
  }
  return n;
}

/**
 * Riduce in singola cifra o numero maestro (11, 22)
 */
function riduciInSingolaOCifraMaestra(num) {
  let n = parseInt(num, 10);
  if (isNaN(n) || n === 0) return 0;
  while (n > 9 && ![11, 22].includes(n)) {
    n = String(n).split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
  }
  return n;
}

/**
 * Calcola il Destino mantenendo i numeri karmici e maestri
 */
function calcolaDestino(dataStr) {
  let cifre = dataStr.replace(/\D/g, '');
  if (cifre.length < 8) return 0;
  let somma = cifre.split('').reduce((acc, val) => acc + parseInt(val, 10), 0);
  return riduciNumeroKarmico(somma);
}

/**
 * Metodo 4: Numero di Ciclo/Vita della Relazione
 * Somma tutti i numeri di entrambe le date di nascita
 */
function calcolaCicloRelazione(dataA, dataB) {
  let cifreA = dataA.replace(/\D/g, '');
  let cifreB = dataB.replace(/\D/g, '');
  let sommaA = cifreA.split('').reduce((acc, v) => acc + parseInt(v, 10), 0);
  let sommaB = cifreB.split('').reduce((acc, v) => acc + parseInt(v, 10), 0);
  
  let sommaTotale = sommaA + sommaB;
  return riduciNumeroKarmico(sommaTotale);
}

// Significati generali per il numero di Destino della coppia
const DESCRIZIONI_LEGAME = {
  13: {
    titolo: "Karma del Lavoro e della Fatica Condivisa",
    badge: "Legame Karmico Attivo",
    badgeClass: "badge-karmic",
    testo: "Questa relazione raramente segue percorsi semplici. Le difficoltà che emergono non sono punizioni, ma occasioni per costruire fondamenta solide attraverso costanza, responsabilità e collaborazione. La coppia può attraversare periodi in cui tutto sembra richiedere più impegno del previsto, ma proprio questa fatica diventa lo strumento per sviluppare fiducia reciproca e maturità. Quando entrambi imparano a sostenersi invece di accusarsi, il legame acquista una forza capace di resistere anche alle prove più impegnative.",
    chiave: "La vostra forza nasce da ciò che scegliete di costruire insieme."
  },

  14: {
    titolo: "Karma di Libertà, Dipendenza e Confini",
    badge: "Legame Karmico Attivo",
    badgeClass: "badge-karmic",
    testo: "L'incontro porta spesso a vivere un delicato equilibrio tra vicinanza e bisogno di autonomia. Possono alternarsi momenti di intensa unione e fasi di distanza, creando dinamiche di 'tira e molla'. La lezione consiste nell'imparare che amare non significa possedere né rinunciare alla propria individualità. Quando ciascuno rispetta i confini dell'altro senza alimentare controllo o dipendenza emotiva, la relazione diventa uno spazio di crescita e libertà condivisa.",
    chiave: "Amarsi significa lasciare spazio anche al respiro dell'altro."
  },

  16: {
    titolo: "Karma del Crollo dell'Ego e Risveglio",
    badge: "Legame Karmico Attivo",
    badgeClass: "badge-karmic",
    testo: "Questo è uno dei legami più trasformativi della numerologia. L'incontro tende a mettere in discussione convinzioni profonde, aspettative e immagini costruite su sé stessi o sull'altro. Le crisi possono apparire improvvise, ma hanno lo scopo di eliminare ciò che non è autentico. Se affrontate con consapevolezza, diventano il punto di partenza per una relazione più sincera, fondata sull'umiltà, sulla verità e su una maggiore maturità spirituale.",
    chiave: "Ogni crisi può diventare una porta verso una relazione più autentica."
  },

  19: {
    titolo: "Karma di Potere, Autonomia e Identità",
    badge: "Legame Karmico Attivo",
    badgeClass: "badge-karmic",
    testo: "Questa relazione porta in primo piano il rapporto con il potere personale e con l'indipendenza. Possono emergere competizione, bisogno di affermarsi o difficoltà nel chiedere aiuto. Il vero insegnamento consiste nel riconoscere il valore di sé senza oscurare quello dell'altro. Quando entrambi imparano a collaborare anziché competere, il legame diventa una scuola di rispetto reciproco, forza interiore e autentica autonomia.",
    chiave: "Due luci brillano di più quando nessuna cerca di spegnere l'altra."
  },

  11: {
    titolo: "Legame Evolutivo Spirituale",
    badge: "Legame Spirituale",
    badgeClass: "badge-spiritual",
    testo: "L'incontro risveglia sensibilità, intuizione e una forte percezione di avere qualcosa di importante da condividere. È una relazione che spesso genera ispirazione reciproca e stimola un percorso di crescita interiore. Proprio per la sua intensità può però favorire idealizzazioni o aspettative elevate. Coltivando dialogo, autenticità e concretezza, questo legame diventa una preziosa occasione di evoluzione sia personale che spirituale.",
    chiave: "Ascoltate l'intuizione, ma lasciate che sia il dialogo a guidare il cammino."
  },

  22: {
    titolo: "Legame di Costruzione Destinica",
    badge: "Legame Destinico",
    badgeClass: "badge-spiritual",
    testo: "Questa relazione possiede un forte potenziale costruttivo. Insieme è possibile dare forma a progetti importanti, creare una famiglia, sviluppare un'attività o lasciare un'impronta significativa nella vita degli altri. Il rischio è trasformare il rapporto in un insieme di doveri e responsabilità, dimenticando il lato emotivo. Quando cuore e concretezza procedono nella stessa direzione, la coppia può realizzare risultati di grande valore.",
    chiave: "I sogni diventano destino quando vengono costruiti giorno dopo giorno."
  },

  6: {
    titolo: "Responsabilità e Cura Reciproca",
    badge: "Karma di Riequilibrio",
    badgeClass: "badge-soft",
    testo: "Questo legame invita a sperimentare il valore dell'accoglienza, della protezione e della responsabilità reciproca. La relazione tende a creare un forte senso di famiglia e di sostegno, ma può anche portare uno dei due partner a sacrificare eccessivamente i propri bisogni. La vera armonia nasce quando il prendersi cura dell'altro non significa dimenticare sé stessi, ma trovare un equilibrio tra dare e ricevere.",
    chiave: "Prendersi cura dell'altro è prezioso, ma ricordate di nutrire anche voi stessi."
  },

  7: {
    titolo: "Legame Karmico Spirituale e Ricerca di Solitudine Condivisa",
    badge: "Legame Spirituale",
    badgeClass: "badge-spiritual",
    testo: "Questa relazione spinge entrambi a guardarsi dentro e a porsi domande profonde sul senso della vita e del legame stesso. Spesso l'incontro avviene per sviluppare una maggiore consapevolezza o per superare schemi mentali ed illusioni. È una connessione che richiede spazio, rispetto per i momenti di introspezione e un ascolto privo di giudizio. Il rischio principale è la chiusura o la difficoltà nell'esprimere le proprie emozioni, creando distanze inaspettate. Quando l'analisi lascia il posto alla fiducia autentica, la coppia diventa un rifugio di saggezza, intesa intellettuale e profonda sintonia spirituale.",
    chiave: "Cercare insieme la verità significa rispettare anche i silenzi dell'altro."
  },

  8: {
    titolo: "Legame di Potere ed Equilibrio",
    badge: "Test di Maturità",
    badgeClass: "badge-soft",
    testo: "Questa relazione mette alla prova il modo in cui entrambi gestiscono forza, ambizione e responsabilità. Possono emergere differenze nella gestione del denaro, del lavoro o delle decisioni importanti. Ogni confronto rappresenta un'opportunità per imparare il rispetto reciproco e la collaborazione. Quando il desiderio di prevalere lascia spazio alla fiducia, il rapporto sviluppa stabilità, solidità e una notevole capacità di affrontare insieme le sfide della vita.",
    chiave: "Il vero potere di una coppia nasce dall'equilibrio, non dal controllo."
  },

  9: {
    titolo: "Chiusura di un Ciclo Karmico e Compimento",
    badge: "Legame Karmico Attivo",
    badgeClass: "badge-karmic",
    testo: "L'incontro rappresenta il punto di arrivo di un lungo percorso evolutivo intrapreso dalle due anime. È un legame caratterizzato da un'intensa empatia, senso di compassione e spesso dalla sensazione di conoscersi da sempre. La lezione principale consiste nel saper lasciare andare vecchi risentimenti, schemi del passato o aspettative egoiche per completare un'antica promessa. Questa relazione invita a vivere un amore universale e disinteressato; quando si impara a non trattenere ma a donare con generosità, il legame offre una sensazione di profonda liberazione, guarigione interiore e compimento spirituale.",
    chiave: "La vera unione si compie quando si impara ad amare senza trattenere."
  }
};

// Significati per il Ciclo della Relazione (Metodo 4)
const DESCRIZIONI_CICLO = {
  7: "Ogni relazione attraversa momenti di silenzio. È proprio lì che l'anima impara ad ascoltare ciò che le parole non riescono a raccontare. Quando il cuore smette di cercare risposte immediate, la saggezza inizia lentamente a rivelarsi.",
  9: "Nessun incontro è davvero casuale. Alcune persone arrivano per chiudere capitoli rimasti aperti, altre per insegnarci il valore del perdono. Lasciare andare ciò che ha compiuto il proprio percorso non significa perdere qualcosa, ma creare lo spazio necessario perché possa nascere un nuovo inizio.",
  14: "La libertà non separa due anime autentiche, le rende capaci di incontrarsi ogni giorno per scelta. Quando il rispetto sostituisce il controllo, la relazione smette di essere una prigione e diventa un luogo in cui entrambi possono continuare a crescere.",
  16: "Ogni certezza che crolla lascia intravedere un orizzonte più ampio. Le relazioni più trasformative non arrivano per distruggere ciò che siamo, ma per liberarci da ciò che non ci appartiene più. Nel coraggio di accogliere il cambiamento nasce una nuova consapevolezza.",
  13: "Le grandi costruzioni non nascono dall'impeto di un giorno, ma dalla pazienza di chi posa un mattone dopo l'altro. Così anche una relazione diventa solida quando ogni difficoltà viene trasformata in un'occasione per crescere insieme.",
  11: "Quando due anime si riconoscono, non sempre servono molte parole. L'intuizione illumina il cammino, ma è la sincerità a renderlo stabile. Ogni ispirazione trova il suo valore solo quando riesce a trasformarsi in gesti concreti.",
  22: "Ogni sogno ha bisogno di mani che lo costruiscano e di cuori che continuino a crederci. Le relazioni destinate a lasciare un segno sono quelle che riescono a trasformare un ideale condiviso in una realtà vissuta, giorno dopo giorno.",
  6: "L'amore più autentico non nasce dal sacrificio, ma dall'equilibrio. Chi si prende cura dell'altro senza dimenticare sé stesso alimenta una fiamma che continua a riscaldare entrambi nel tempo.",
  8: "Il vero potere non consiste nell'avere ragione, ma nel saper creare armonia anche nelle differenze. Quando due persone imparano a mettere la propria forza al servizio della relazione, ogni sfida diventa una possibilità di crescita condivisa.",
  19: "La luce di una persona non diminuisce quella dell'altra. Due anime evolvono davvero quando imparano a brillare insieme, senza competere, senza nascondersi e senza temere il valore reciproco."
};


/**
 * Funzione principale esecutiva
 */
/**
 * Helper universale per estrarre il valore numerico da Anima/Io/Destino
 */
function estraiNumeroPuro(valore) {
  if (valore === null || valore === undefined) return null;
  
  // Se la funzione calcolaAnima/calcolaIo restituisce un oggetto (es. { numero: 5 } o { ridotto: 5 })
  if (typeof valore === 'object') {
    valore = valore.numero || valore.ridotto || valore.valore || Object.values(valore)[0];
  }

  // Se è già un numero o una stringa numerica
  let n = parseInt(valore, 10);
  if (isNaN(n) || n === 0) return null;

  // Riduzione a cifra singola o numero maestro (11, 22) / karmico
  while (n > 9 && ![11, 22, 33, 44, 13, 14, 16, 19].includes(n)) {
    n = String(n).split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
  }
  return n;
}

/**
 * Funzione autonoma che calcola Destino, Anima e Io direttamente
 */
function validaECalcolaRelazioneKarmica() {
  // 1. Lettura dei campi HTML
  const nomeAInput = document.getElementById('nomeA')?.value.trim() || '';
  const cognomeAInput = document.getElementById('cognomeA')?.value.trim() || '';
  const nomeBInput = document.getElementById('nomeB')?.value.trim() || '';
  const cognomeBInput = document.getElementById('cognomeB')?.value.trim() || '';

  const nomeCompletoA = `${nomeAInput} ${cognomeAInput}`.trim();
  const nomeCompletoB = `${nomeBInput} ${cognomeBInput}`.trim();

  const dataA = document.getElementById('dataA')?.value.trim();
  const dataB = document.getElementById('dataB')?.value.trim();

  if (!dataA || dataA.length < 10 || !dataB || dataB.length < 10) {
    alert("Inserisci entrambe le date di nascita nel formato completo GG/MM/AAAA.");
    return;
  }

  // --- CALCOLATORE PITAGORICO INTERNO (Anima e Io) ---
  const MAPPATURA_LETTERE = {
    A:1, J:1, S:1,  B:2, K:2, T:2,  C:3, L:3, U:3,
    D:4, M:4, V:4,  E:5, N:5, W:5,  F:6, O:6, X:6,
    G:7, P:7, Y:7,  H:8, Q:8, Z:8,  I:9, R:9
  };
  const VOCALI = ['A', 'E', 'I', 'O', 'U'];

function calcolaAnimaEIoDiretto(testoCompleto) {
    if (!testoCompleto) return { anima: null, io: null, persona: null };
    
    let sommaAnima = 0;   // Vocali
    let sommaPersona = 0; // Consonanti (Ciò che attualmente chiamavi sommaIo)
    let sommaIo = 0;      // Vocali + Consonanti (Nome Completo)

    const pulito = testoCompleto.toUpperCase().replace(/[^A-Z]/g, '');

    for (let char of pulito) {
      const val = MAPPATURA_LETTERE[char] || 0;
      sommaIo += val; // L'IO è la somma totale di TUTTE le lettere (Vocali + Consonanti)

      if (VOCALI.includes(char)) {
        sommaAnima += val; // L'ANIMA è la somma delle sole vocali
      } else {
        sommaPersona += val; // LA PERSONA è la somma delle sole consonanti
      }
    }

    const riduci = (n) => {
      if (!n) return null;
      while (n > 9 && ![11, 22, 33].includes(n)) {
        n = String(n).split('').reduce((a, b) => a + parseInt(b, 10), 0);
      }
      return n;
    };

    return {
      anima: riduci(sommaAnima),
      persona: riduci(sommaPersona), // Mantenuto separato per chiarezza
      io: riduci(sommaIo)             // ORA L'IO RITORNA IL VALORE REALE (11/2 per Chiara, 7 per Davide)!
    };
  }

  // Calcolo dei valori per Persona A e Persona B
  const calcoliA = calcolaAnimaEIoDiretto(nomeCompletoA);
  const calcoliB = calcolaAnimaEIoDiretto(nomeCompletoB);

  const animaA = calcoliA.anima;
  const ioA = calcoliA.io;
  const animaB = calcoliB.anima;
  const ioB = calcoliB.io;

  const destinoA = estraiNumeroPuro(calcolaDestino(dataA));
  const destinoB = estraiNumeroPuro(calcolaDestino(dataB));

  console.log("--- NUOVO CALCOLO AUTONOMO ---");
  console.log(`Persona A (${nomeCompletoA}): Destino=${destinoA}, Anima=${animaA}, Io=${ioA}`);
  console.log(`Persona B (${nomeCompletoB}): Destino=${destinoB}, Anima=${animaB}, Io=${ioB}`);

// ==========================================================================
  // CALCOLO E RENDERING INTEGRATO (Con priorità personalizzata sui numeri)
  // ==========================================================================
  const sommaDestini = (destinoA || 0) + (destinoB || 0);
  const sommaAnime = (animaA || 0) + (animaB || 0);
  const sommaIo = (ioA || 0) + (ioB || 0);

  // Calcolo dei cicli specifici
  const cicloDestino = calcolaCicloRelazione(dataA, dataB);
  const cicloAnima = riduciNumeroKarmico(sommaAnime);
  const cicloIo = riduciNumeroKarmico(sommaIo);

  // Funzione per calcolare il livello di priorità di un numero
  const calcolaPesoPriorita = (numero) => {
    const num = Number(numero);
    if ([13, 14, 16, 19].includes(num)) return 1; // 1°: Karmici
    if ([11, 22, 33].includes(num)) return 2;     // 2°: Maestri
    if ([6, 7, 8, 9].includes(num)) return 3;     // 3°: 6, 7, 8, 9
    return 4;                                     // 4°: Tutti gli altri
  };

  const costruisciDatiSezione = (sommaImpronta, numCiclo, etichetta, prioritaBase) => {
    // Gestione Impronta
    let numImp = riduciNumeroKarmico(sommaImpronta);
    if (!DESCRIZIONI_LEGAME[numImp]) {
      numImp = riduciInSingolaOCifraMaestra(numImp);
    }
    const infoImp = DESCRIZIONI_LEGAME[numImp] || {
      titolo: "Incontro di Affinità",
      badge: "Legame di Esperienza",
      badgeClass: "badge-soft",
      testo: "Questa combinazione rappresenta un percorso di apprendimento libero da pesi o debiti del passato."
    };

    // Gestione Ciclo
    let numCic = DESCRIZIONI_CICLO[numCiclo] ? numCiclo : riduciInSingolaOCifraMaestra(numCiclo);
    const descCic = DESCRIZIONI_CICLO[numCic] || `Numero di ciclo ${numCic}: definisce la frequenza evolutiva generale lungo il percorso comune della coppia.`;

    // Assegnazione del peso di priorità in base al numero dell'Impronta
    const peso = calcolaPesoPriorita(numImp);

    return {
      etichetta,
      impronta: { numero: numImp, ...infoImp },
      ciclo: { numero: numCic, testo: descCic },
      peso,
      prioritaBase // Preserva l'ordine naturale (Destino -> Anima -> Io) in caso di pari peso
    };
  };

  let sezioni = [
    costruisciDatiSezione(sommaDestini, cicloDestino, "DESTINO (Cammino Comune)", 1),
    costruisciDatiSezione(sommaAnime, cicloAnima, "ANIMA (Affinità Profonda)", 2),
    costruisciDatiSezione(sommaIo, cicloIo, "IO (Espressione e Azione)", 3)
  ];

  // ORDINAMENTO GERARCHICO RIGIDO
  sezioni.sort((a, b) => {
    if (a.peso !== b.peso) {
      return a.peso - b.peso; // Ordina prima per fascia di importanza (1, poi 2, poi 3, poi 4)
    }
    return a.prioritaBase - b.prioritaBase; // A parità di fascia, mantiene l'ordine Destino -> Anima -> Io
  });

  // Nasconde la card originaria del ciclo per evitare duplicati
  const elCiclo = document.getElementById('numeroCiclo');
  const cardCicloOriginale = elCiclo ? elCiclo.closest('.card') : null;
  if (cardCicloOriginale) {
    cardCicloOriginale.style.display = 'none';
  }

  // Cerca il contenitore dove inserire le card (o lo crea se non esiste)
  let contenitoreSintesi = document.getElementById('contenitoreSintesiDinamico');
  
  if (!contenitoreSintesi) {
    const elSintesi = document.getElementById('numeroSintesi');
    const cardOriginale = elSintesi ? elSintesi.closest('.card') : null;

    if (cardOriginale) {
      contenitoreSintesi = document.createElement('div');
      contenitoreSintesi.id = 'contenitoreSintesiDinamico';
      cardOriginale.parentNode.insertBefore(contenitoreSintesi, cardOriginale);
      cardOriginale.remove();
    }
  }

  // Genera ed eroga l'HTML fresco e ordinato ad ogni ricalcolo
  if (contenitoreSintesi) {
    let htmlGruppo = '';

    sezioni.forEach(s => {
      htmlGruppo += `
        <div class="card" style="text-align: center; margin-bottom: 25px; padding: 20px;">
          
          <!-- SEZIONE IMPRONTA -->
          <div class="card-title center">IMPRONTA DEL LEGAME - ${s.etichetta}</div>
          <h2 style="font-size: 2.8rem; color: var(--accent-gold); font-family: var(--font-title); margin: 6px 0;">${s.impronta.numero}</h2>
          <div>
            <span class="badge ${s.impronta.badgeClass}">${s.impronta.badge}</span>
            <strong style="display:block; margin-top:8px; color:var(--accent-gold-light); font-size:1.05rem;">${s.impronta.titolo}</strong>
          </div>
          <p style="margin-top: 14px; font-size: 0.9rem; color: var(--text-main); line-height: 1.5;">${s.impronta.testo}</p>

          <!-- SEPARATORE ELEGANTE -->
          <hr style="border: 0; height: 1px; background: linear-gradient(to right, transparent, rgba(212, 175, 55, 0.4), transparent); margin: 20px 0;">

          <!-- SEZIONE CICLO INTEGRATA -->
          <div class="card-title center" style="font-size: 0.85rem; opacity: 0.9;">CICLO DELLA RELAZIONE</div>
          <h3 style="font-size: 2rem; color: var(--accent-gold-light); font-family: var(--font-title); margin: 4px 0;">${s.ciclo.numero}</h3>
          <p style="margin-top: 8px; font-size: 0.88rem; color: var(--text-main); line-height: 1.45; font-style: italic;">${s.ciclo.testo}</p>

        </div>
      `;
    });

    contenitoreSintesi.innerHTML = htmlGruppo;
  }

  // MANTIENI LA RIGA DEL CICLO SUBITO DOPO:
  const numCiclo = calcolaCicloRelazione(dataA, dataB);

  // ==========================================================================
  // CONFRONTI E RISPECCHIAMENTI
  // ==========================================================================
  let coincidenze = [];
  const pA = nomeAInput || 'Persona A';
  const pB = nomeBInput || 'Persona B';

  const base = (n) => {
    if (!n) return null;
    let x = parseInt(n, 10);
    while (x > 9 && ![11, 22].includes(x)) {
      x = String(x).split('').reduce((s, d) => s + parseInt(d, 10), 0);
    }
    return x;
  };

  // 1. Stessi Aspetti (Destino=Destino, Anima=Anima, Io=Io)
  if (destinoA && destinoB && base(destinoA) === base(destinoB)) {
    coincidenze.push(`<strong>Stesso Destino (${destinoA}):</strong> ${pA} e ${pB} condividono la stessa direzione evolutiva.`);
  }
  if (animaA && animaB && base(animaA) === base(animaB)) {
    coincidenze.push(`<strong>Stessa Anima (${animaA}):</strong> ${pA} e ${pB} condividono gli stessi desideri e motivazioni profonde.`);
  }
  if (ioA && ioB && base(ioA) === base(ioB)) {
    coincidenze.push(`<strong>Stesso Io (${ioA}):</strong> ${pA} e ${pB} condividono la stessa modalità espressiva e personalità.`);
  }

  // 2. Anima <-> Destino
  if (animaA && destinoB && base(animaA) === base(destinoB)) {
    coincidenze.push(`L'<strong>Anima di ${pA}</strong> (${animaA}) = <strong>Destino di ${pB}</strong> (${destinoB})`);
  }
  if (animaB && destinoA && base(animaB) === base(destinoA)) {
    coincidenze.push(`L'<strong>Anima di ${pB}</strong> (${animaB}) = <strong>Destino di ${pA}</strong> (${destinoA})`);
  }

  // 3. Anima <-> Io
  if (animaA && ioB && base(animaA) === base(ioB)) {
    coincidenze.push(`L'<strong>Anima di ${pA}</strong> (${animaA}) = <strong>Io di ${pB}</strong> (${ioB})`);
  }
  if (animaB && ioA && base(animaB) === base(ioA)) {
    coincidenze.push(`L'<strong>Anima di ${pB}</strong> (${animaB}) = <strong>Io di ${pA}</strong> (${ioA})`);
  }

  // 4. Destino <-> Io
  if (destinoA && ioB && base(destinoA) === base(ioB)) {
    coincidenze.push(`Il <strong>Destino di ${pA}</strong> (${destinoA}) = <strong>Io di ${pB}</strong> (${ioB})`);
  }
  if (destinoB && ioA && base(destinoB) === base(ioA)) {
    coincidenze.push(`Il <strong>Destino di ${pB}</strong> (${destinoB}) = <strong>Io di ${pA}</strong> (${ioA})`);
  }

  // Rendering Box Rispecchiamento
  let boxRispecchiamento = document.getElementById('boxRispecchiamento');
  if (coincidenze.length > 0) {
    let htmlRispecchiamento = `
      <div style="background: rgba(212, 175, 55, 0.1); border-left: 4px solid #d4af37; padding: 14px; margin-top: 15px; border-radius: 6px;">
        <h4 style="margin:0 0 10px 0; color:#d4af37; font-size:1.1rem; display:flex; align-items:center; gap:6px;">
          <span>✨</span> Legame Pregresso (Rispecchiamento Numerico)
        </h4>
        <ul style="margin:0; padding-left:20px; font-size:0.95rem; line-height:1.5;">
          ${coincidenze.map(c => `<li style="margin-bottom:6px;">${c}</li>`).join('')}
        </ul>
      </div>
    `;

    if (!boxRispecchiamento) {
      boxRispecchiamento = document.createElement('div');
      boxRispecchiamento.id = 'boxRispecchiamento';
      const container = document.getElementById('risultati-container');
      container.appendChild(boxRispecchiamento);
    }
    boxRispecchiamento.innerHTML = htmlRispecchiamento;
    boxRispecchiamento.style.display = 'block';
  } else if (boxRispecchiamento) {
    boxRispecchiamento.style.display = 'none';
  }

  // Rendering Ciclo
  document.getElementById('numeroCiclo').innerText = numCiclo;
  let descCiclo = DESCRIZIONI_CICLO[numCiclo] || `Numero di ciclo ${numCiclo}: definisce la frequenza evolutiva generale lungo il percorso comune della coppia.`;
  document.getElementById('descrizioneCiclo').innerText = descCiclo;

  const containerRisultati = document.getElementById('risultati-container');
  containerRisultati.style.display = 'block';
  containerRisultati.scrollIntoView({ behavior: 'smooth' });
}
// ============================================================================
// LIGNAGGIO FAMILIARE - GESTIONE INTERFACCIA E LOGICA DI PRESENTAZIONE
// (Utilizza esclusivamente il motore centrale di calcolo da calcoli.js)
// ============================================================================

/**
 * Calcola l'impronta numerologica del Lignaggio Familiare
 * richiamando unicamente le funzioni esposte da calcoli.js
 * 
 * @param {Object} datiFamiglia - { cognomePaterno, cognomeMaterno }
 * @returns {Object} Risultato dell'analisi del lignaggio
 */
function calcolaLignaggioFamiliare(datiFamiglia) {
    const cognomeP = datiFamiglia.cognomePaterno || "";
    const cognomeM = datiFamiglia.cognomeMaterno || "";

    // Calcoli sui singoli rami tramite calcolaStringaNumerica di calcoli.js
    const ramoPaterno = window.calcolaStringaNumerica ? window.calcolaStringaNumerica(cognomeP) : { anima: 0, persona: 0, espressione: 0 };
    const ramoMaterno = window.calcolaStringaNumerica ? window.calcolaStringaNumerica(cognomeM) : { anima: 0, persona: 0, espressione: 0 };

    // Formattazione per la visualizzazione (mantiene Maestri e Karmici con / monocifra)
    function formattaValore(num) {
        if (!num) return "-";
        if ([11, 22, 33, 13, 14, 16, 19].includes(num) && window.riduciMonocifraStretta) {
            return `${num}/${window.riduciMonocifraStretta(num)}`;
        }
        return num;
    }

    // Estrazione dinamica dell'Archetipo dal database globale
    function estraiArchetipo(num) {
        if (!num) return "Archetipo";
        let base = window.riduciMonocifraStretta ? window.riduciMonocifraStretta(num) : num;
        const db = window.databaseArchetipi || {};
        return (db[num] || db[base] || { nome: "Archetipo" }).nome;
    }

    return {
        paterno: {
            cognome: cognomeP.toUpperCase(),
            lignaggioAnimico: formattaValore(ramoPaterno.anima),
            lignaggioPersonalita: formattaValore(ramoPaterno.persona),
            lignaggioFamiliare: formattaValore(ramoPaterno.espressione),
            archetipo: estraiArchetipo(ramoPaterno.espressione)
        },
        materno: {
            cognome: cognomeM.toUpperCase(),
            lignaggioAnimico: formattaValore(ramoMaterno.anima),
            lignaggioPersonalita: formattaValore(ramoMaterno.persona),
            lignaggioFamiliare: formattaValore(ramoMaterno.espressione),
            archetipo: estraiArchetipo(ramoMaterno.espressione)
        }
    };
}

/**
 * Legge gli input dell'interfaccia utente, invoca il calcolo e aggiorna il DOM.
 */
function eseguiCalcoloLignaggioUI() {
    const inputPaterno = document.getElementById('cognomePaterno');
    const inputMaterno = document.getElementById('cognomeMaterno');

    const cognomeP = inputPaterno ? inputPaterno.value.trim() : "";
    const cognomeM = inputMaterno ? inputMaterno.value.trim() : "";

    if (!cognomeP && !cognomeM) {
        alert("Inserisci almeno un cognome per calcolare il Lignaggio Familiare.");
        return;
    }

    // Elaborazione tramite motore esterno
    const risultato = calcolaLignaggioFamiliare({
        cognomePaterno: cognomeP,
        cognomeMaterno: cognomeM
    });

    // --- AGGIORNAMENTO DOM RAMO PATERNO ---
    if (document.getElementById('resCognomePaterno')) document.getElementById('resCognomePaterno').innerText = risultato.paterno.cognome || "-";
    if (document.getElementById('resAnimicoPaterno')) document.getElementById('resAnimicoPaterno').innerText = risultato.paterno.lignaggioAnimico;
    if (document.getElementById('resPersonalitaPaterno')) document.getElementById('resPersonalitaPaterno').innerText = risultato.paterno.lignaggioPersonalita;
    if (document.getElementById('resFamiliarePaterno')) document.getElementById('resFamiliarePaterno').innerText = risultato.paterno.lignaggioFamiliare;

    // --- AGGIORNAMENTO DOM RAMO MATERNO ---
    if (document.getElementById('resCognomeMaterno')) document.getElementById('resCognomeMaterno').innerText = risultato.materno.cognome || "-";
    if (document.getElementById('resAnimicoMaterno')) document.getElementById('resAnimicoMaterno').innerText = risultato.materno.lignaggioAnimico;
    if (document.getElementById('resPersonalitaMaterno')) document.getElementById('resPersonalitaMaterno').innerText = risultato.materno.lignaggioPersonalita;
    if (document.getElementById('resFamiliareMaterno')) document.getElementById('resFamiliareMaterno').innerText = risultato.materno.lignaggioFamiliare;

    // Mostra il contenitore dei risultati se presente
    const bloccoRisultati = document.getElementById('risultatiLignaggio');
    if (bloccoRisultati) bloccoRisultati.style.display = 'block';
}

// Esposizione funzioni al contesto globale
window.calcolaLignaggioFamiliare = calcolaLignaggioFamiliare;
window.eseguiCalcoloLignaggioUI = eseguiCalcoloLignaggioUI;