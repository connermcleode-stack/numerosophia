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

  8: {
    titolo: "Legame di Potere ed Equilibrio",
    badge: "Test di Maturità",
    badgeClass: "badge-soft",
    testo: "Questa relazione mette alla prova il modo in cui entrambi gestiscono forza, ambizione e responsabilità. Possono emergere differenze nella gestione del denaro, del lavoro o delle decisioni importanti. Ogni confronto rappresenta un'opportunità per imparare il rispetto reciproco e la collaborazione. Quando il desiderio di prevalere lascia spazio alla fiducia, il rapporto sviluppa stabilità, solidità e una notevole capacità di affrontare insieme le sfide della vita.",
    chiave: "Il vero potere di una coppia nasce dall'equilibrio, non dal controllo."
  }
};

// Significati per il Ciclo della Relazione (Metodo 4)
// Messaggi Numerosophici del Ciclo della Relazione

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
function validaECalcolaRelazioneKarmica() {
  const nomeA = document.getElementById('nomeA').value.trim() || 'Persona A';
  const nomeB = document.getElementById('nomeB').value.trim() || 'Persona B';
  const dataA = document.getElementById('dataA').value.trim();
  const dataB = document.getElementById('dataB').value.trim();

  if (!dataA || dataA.length < 10 || !dataB || dataB.length < 10) {
    alert("Inserisci entrambe le date di nascita nel formato completo GG/MM/AAAA.");
    return;
  }

  // 1. Destini Personali e Analisi Singola
  const destinoA = calcolaDestino(dataA);
  const destinoB = calcolaDestino(dataB);

  // 2. Metodo 2: Somma dei Destini della Coppia
  const sommaDestini = destinoA + destinoB;
  let numeroSintesi = riduciNumeroKarmico(sommaDestini);
  if (!DESCRIZIONI_LEGAME[numeroSintesi]) {
    numeroSintesi = riduciInSingolaOCifraMaestra(numeroSintesi);
  }

  // 3. Metodo 4: Numero di Ciclo della Relazione
  const numCiclo = calcolaCicloRelazione(dataA, dataB);

  // --- RENDERING DEI RISULTATI ---

  // Impronta Principale
  document.getElementById('numeroSintesi').innerText = numeroSintesi;
  const info = DESCRIZIONI_LEGAME[numeroSintesi] || {
    titolo: "Incontro di Affinità",
    badge: "Legame di Esperienza",
    badgeClass: "badge-soft",
    testo: "Questa combinazione non presenta un karma attivo primario o un numero maestro sulla somma dei destini, ma rappresenta un percorso di apprendimento libero da pesi o debiti del passato."
  };

  document.getElementById('badgeContenitore').innerHTML = `
    <span class="badge ${info.badgeClass}">${info.badge}</span>
    <strong style="display:block; margin-top:8px; color:var(--accent-gold-light); font-size:1.05rem;">${info.titolo}</strong>
  `;
  document.getElementById('descrizioneSintesi').innerText = info.testo;

  // ESPANSIONE 1: Karma Personali Singoli (Metodo 1)
  let htmlKarmiciSingoli = "";
  const karmiciValidi = [13, 14, 16, 19, 11, 22];

  if (karmiciValidi.includes(destinoA)) {
    htmlKarmiciSingoli += `<li style="margin-bottom:6px;"><strong>${nomeA}</strong> porta il Destino <strong>${destinoA}</strong> (karma/energia attiva personale).</li>`;
  }
  if (karmiciValidi.includes(destinoB)) {
    htmlKarmiciSingoli += `<li style="margin-bottom:6px;"><strong>${nomeB}</strong> porta il Destino <strong>${destinoB}</strong> (karma/energia attiva personale).</li>`;
  }

  const boxKarmici = document.getElementById('boxKarmiciSingoli');
  if (htmlKarmiciSingoli !== "") {
    document.getElementById('listaKarmiciSingoli').innerHTML = htmlKarmiciSingoli;
    boxKarmici.style.display = 'block';
  } else {
    boxKarmici.style.display = 'none';
  }

  // ESPANSIONE 2: Ciclo della Relazione (Metodo 4)
  document.getElementById('numeroCiclo').innerText = numCiclo;
  let descCiclo = DESCRIZIONI_CICLO[numCiclo] || `Numero di ciclo ${numCiclo}: definisce la frequenza evolutiva generale lungo il percorso comune della coppia.`;
  document.getElementById('descrizioneCiclo').innerText = descCiclo;

  // Mostra il contenitore e scrolla
  const containerRisultati = document.getElementById('risultati-container');
  containerRisultati.style.display = 'block';
  containerRisultati.scrollIntoView({ behavior: 'smooth' });
}