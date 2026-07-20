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

            annoPersonale = riduciNumero(rGiornoStretto + rMeseStretto + riduciMonocifraStretta(annoTarget), true);
            
            const oggi = new Date();
            const rOggiGiorno = riduciMonocifraStretta(oggi.getDate());
            const rOggiMese = riduciMonocifraStretta(oggi.getMonth() + 1);
            
            giornoPersonale = riduciNumero(riduciMonocifraStretta(annoPersonale) + rOggiGiorno + rOggiMese, true);

            if (document.getElementById('numGiornoIsolato')) document.getElementById('numGiornoIsolato').innerText = format(giornoIsolato);
            if (document.getElementById('descGiornoIsolato')) document.getElementById('descGiornoIsolato').innerHTML = compilaSchedaSicura(giornoIsolato);
            
            if (document.getElementById('numCammino')) document.getElementById('numCammino').innerText = format(destino);
            if (document.getElementById('descCammino')) document.getElementById('descCammino').innerHTML = compilaSchedaSicura(destino);
            
            if (document.getElementById('numAnnoPers')) document.getElementById('numAnnoPers').innerText = format(annoPersonale);
            if (document.getElementById('descAnnoPers')) document.getElementById('descAnnoPers').innerHTML = compilaSchedaSicura(annoPersonale);
            
            if (document.getElementById('numGiornoPers')) document.getElementById('numGiornoPers').innerText = format(giornoPersonale);
            if (document.getElementById('descGiornoPers')) document.getElementById('descGiornoPers').innerHTML = compilaSchedaSicura(giornoPersonale);

            const fineC1 = 36 - riduciMonocifraStretta(destino);
            const fineC2 = fineC1 + 9;
            const fineC3 = fineC2 + 9;
            if (document.getElementById('infoEtaGrandiCicli')) {
                document.getElementById('infoEtaGrandiCicli').innerText = `Fasce: Formativo (0 a ${fineC1} anni) | Produttivo (${fineC1 + 1} a ${fineC2} anni) | Conclusivo (da ${fineC2 + 1} anni)`;
            }

            if (document.getElementById('numCicloForm')) document.getElementById('numCicloForm').innerText = format(cForm);
            if (document.getElementById('descCicloForm')) document.getElementById('descCicloForm').innerHTML = compilaSchedaSicura(cForm);

            if (document.getElementById('numCicloProd')) document.getElementById('numCicloProd').innerText = format(cProd);
            if (document.getElementById('descCicloProd')) document.getElementById('descCicloProd').innerHTML = compilaSchedaSicura(cProd);

            if (document.getElementById('numCicloConc')) document.getElementById('numCicloConc').innerText = format(cConc);
            if (document.getElementById('descCicloConc')) document.getElementById('descCicloConc').innerHTML = compilaSchedaSicura(cConc);

            if (document.getElementById('numCiclo1')) document.getElementById('numCiclo1').innerText = format(p1);
            if (document.getElementById('etaCiclo1')) document.getElementById('etaCiclo1').innerText = `Da 0 a ${fineC1} anni`;
            if (document.getElementById('descCiclo1')) document.getElementById('descCiclo1').innerHTML = compilaSchedaSicura(p1);

            if (document.getElementById('numCiclo2')) document.getElementById('numCiclo2').innerText = format(p2);
            if (document.getElementById('etaCiclo2')) document.getElementById('etaCiclo2').innerText = `Da ${fineC1 + 1} a ${fineC2} anni`;
            if (document.getElementById('descCiclo2')) document.getElementById('descCiclo2').innerHTML = compilaSchedaSicura(p2);

            if (document.getElementById('numCiclo3')) document.getElementById('numCiclo3').innerText = format(p3);
            if (document.getElementById('etaCiclo3')) document.getElementById('etaCiclo3').innerText = `Da ${fineC2 + 1} a ${fineC3} anni`;
            if (document.getElementById('descCiclo3')) document.getElementById('descCiclo3').innerHTML = compilaSchedaSicura(p3);

            if (document.getElementById('numCiclo4')) document.getElementById('numCiclo4').innerText = format(p4);
            if (document.getElementById('etaCiclo4')) document.getElementById('etaCiclo4').innerText = `Da ${fineC3 + 1} anni in poi`;
            if (document.getElementById('descCiclo4')) document.getElementById('descCiclo4').innerHTML = compilaSchedaSicura(p4);

            function ottieniNomeImmagineOmbra(valoreOmbra) {
                return (valoreOmbra === 0 || valoreOmbra === 9) ? 'ombra9' : 'ombra' + valoreOmbra;
            }
            const dbOmbre = window.databaseOmbreMazzo || {};
            const nomeGiov = dbOmbre[oGiov] ? dbOmbre[oGiov].nome : 'Ombra';
            const nomeMat = dbOmbre[oMat] ? dbOmbre[oMat].nome : 'Ombra';
            const nomePrinc = dbOmbre[oPrinc] ? dbOmbre[oPrinc].nome : 'Ombra';

            const ombreSetup = [
                { idNum: 'numOmbraGiov', idDesc: 'descOmbraGiov', valore: oGiov, nome: nomeGiov },
                { idNum: 'numOmbraMat', idDesc: 'descOmbraMat', valore: oMat, nome: nomeMat },
                { idNum: 'numOmbraPrinc', idDesc: 'descOmbraPrinc', valore: oPrinc, nome: nomePrinc }
            ];

            ombreSetup.forEach(ombra => {
                const imgNome = ottieniNomeImmagineOmbra(ombra.valore);
                if (document.getElementById(ombra.idNum)) document.getElementById(ombra.idNum).innerText = ombra.valore;
                if (document.getElementById(ombra.idDesc)) {
                    document.getElementById(ombra.idDesc).innerHTML = `
                        <img src="carte/${imgNome}.png" alt="Ombra ${ombra.valore}" style="width: 70px; display: block; margin: 8px auto; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.5);">
                        <div style="text-align: center; margin-top: 10px; font-style: italic; font-weight: bold; color: #c5a059; font-size: 13px;">
                            Archetipo: ${ombra.nome}
                        </div>
                        <div style="text-align: center; font-size: 11px; color: #888; margin-top: 4px; font-style: italic;">
                            → Clicca qui per leggere l'analisi completa
                        </div>
                        <div class="testo-segreto" style="display: none;">
                            <img src="carte/${imgNome}.png" alt="Ombra ${ombra.valore}" style="width: 140px; display: block; margin: 10px auto; border-radius: 6px; box-shadow: 0 4px 8px rgba(0,0,0,0.5);">
                            ${typeof compilaSchedaOmbra === 'function' ? compilaSchedaOmbra(ombra.valore) : 'Sfida evolutiva.'}
                        </div>
                    `;
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