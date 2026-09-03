// ============================================================================
// LE 3 INFLUENZE FONDAMENTALI (MESE, GIORNO, ANNO)
// ============================================================================

// Assicuriamoci che l'oggetto globale esista
window.TESTI_PITAGORA = window.TESTI_PITAGORA || {};

// Creiamo l'oggetto con le 3 sezioni delle influenze
window.INFLUENZE = {
    mese: {
        1: {
            titolo: "INFLUENZA EMOTIVA 1: L'INDIPENDENZA AFFETTIVA",
            testo: "L'energia dell'1 nel Mese di Nascita forma una struttura emotiva definita da una spinta verso l'autonomia e la protezione della propria individualità. Chi possiede questa influenza tende a percepire e gestire i sentimenti con forte senso di autosufficienza, evitando di mostrare vulnerabilità o dipendenza. Nel legame affettivo cerca rispetto, spazio per affermarsi e un partner che ne valorizzi la determinazione. Il bisogno profondo è imparare a mostrare la propria fragilità senza temere di perdere la propria identità."
        },
        2: {
            titolo: "INFLUENZA EMOTIVA 2: L'ACCOGLIENZA E LA SENSIBILITÀ",
            testo: "Il Mese 2 dona una straordinaria recettività emotiva e una profonda risonanza con gli stati d'animo altrui. La sfera affettiva è vissuta all'insegna del bisogno di armonia, ascolto e fusione empatica. Chi ha questa impronta è incline a prendersi cura dell'altro e a cercare costante rassicurazione nelle relazioni. La sfida emotiva di fondo risiede nell'imparare a stabilire confini sani, evitando di assorbire le tensioni ambientali o di annullare i propri bisogni per compiacere chi ama."
        },
        3: {
            titolo: "INFLUENZA EMOTIVA 3: L'ESPRESSIONE E LA GIOIA CONDIVISA",
            testo: "Con l'energia del 3 nel Mese, le emozioni cercano una via di sfogo solare, creativa e comunicativa. L'universo affettivo viene nutrito dallo scambio verbale, dal gioco, dalla leggerezza e dalla condivisione delle passioni. In ambito relazionale necessita di stimoli continui e soffre le atmosfere cupe o troppo rigide. Il percorso interiore richiede di non usare l'ottimismo o la battuta come difesa, imparando ad accogliere anche le sfumature emotive più dense e complesse."
        },
        4: {
            titolo: "INFLUENZA EMOTIVA 4: LA STABILITÀ E IL RADICAMENTO",
            testo: "Il Mese 4 caratterizza un filtro emotivo basato sul bisogno prioritario di sicurezza, lealtà e continuità. Le emozioni vengono elaborate in modo pacato e contenute entro strutture solide. Chiede tempi lunghi per concedere la propria fiducia, ma quando la accorda costruisce legami duraturi e protettivi. La lezione evolutiva sul piano affettivo è superare la rigidità o la paura del cambiamento, permettendo al cuore di aprirsi alla spontaneità senza esigere garanzie assolute."
        },
        5: {
            titolo: "INFLUENZA EMOTIVA 5: LA LIBERTÀ E L'ESPLORAZIONE RELAZIONALE",
            testo: "Un Mese di Nascita 5 porta un vissuto emotivo dinamico, curioso e desideroso di continua trasformazione. L'affettività si nutre di esperienze stimolanti, viaggi, scoperte e libertà di movimento. Nelle relazioni ricerca complicità mentale e spazio personale, fuggendo dalle routine soffocanti. La sfida principale sul piano del sentimento consiste nel trasformare l'irrequietezza interiore in profonda presenza, imparando che l'impegno emotivo non limita la libertà, ma la arricchisce."
        },
        6: {
            titolo: "INFLUENZA EMOTIVA 6: IL NUTRIMENTO E L'ARMONIA FAMILIARE",
            testo: "Il Mese 6 orienta il vissuto emotivo verso la ricerca di armonia, bellezza e appartenenza. Chi possiede questa frequenza sente una forte spinta al nutrimento affettivo, all'accudimento e alla protezione delle persone amate. Il nido e la famiglia rappresentano punti di riferimento centrali. La lezione evolutiva risiede nel bilanciare il senso di responsabilità: occorre evitare di farsi carico dei problemi altrui o di scambiare il controllo e l'idealizzazione dell'altro con il vero amore libero."
        },
        7: {
            titolo: "INFLUENZA EMOTIVA 7: LA PROFONDITÀ E IL RIFUGIO INTERIORE",
            testo: "L'energia del 7 nel Mese di Nascita caratterizza una sensibilità emotiva riservata, analitica e profonda. I sentimenti vengono elaborati al riparo da sguardi indiscreti e richiedono momenti di solitudine e silenzio per essere decodificati. Nelle relazioni si cerca una sintonia prima di tutto intellettuale e spirituale. La sfida principale è superare la diffidenza istintiva e la tendenza a erigere barriere difensive, permettendo al cuore di fidarsi della vulnerabilità."
        },
        8: {
            titolo: "INFLUENZA EMOTIVA 8: L'INTENSITÀ E IL POTERE AFFETTIVO",
            testo: "Un Mese 8 conferisce una carica emotiva forte, passionale e orientata al radicamento materiale e protettivo. Le relazioni sono vissute con grande intensità e rigore: chi ha questa impronta desidera essere un pilastro di forza per i propri cari. La sfida evolutiva consiste nel non gestire i sentimenti attraverso la dinamica del controllo o del potere, imparando a separare il valore personale dal successo e consentendo alla dolcezza di emergere senza timore di perdere autorità."
        },
        9: {
            titolo: "INFLUENZA EMOTIVA 9: L'EMPATIA UNIVERSALE E IL RILASCIO",
            testo: "Con il 9 nel Mese, la sfera emotiva si espande verso una profonda empatia e comprensione della natura umana. C'è una spinta innata verso la compassione e l'aiuto disinteressato. Il filtro emotivo registra tutto con grande intensità, rendendo la persona sensibile al dolore altrui. Il percorso interiore richiede di apprendere l'arte del distacco sano e del perdono, evitando di trattenere nostalgie del passato o di vivere le relazioni in chiave di sacrificio."
        },

        // --- NUMERI MAESTRI ---
        11: {
            titolo: "INFLUENZA EMOTIVA 11/2: L'INTUIZIONE E LA SENSIBILITÀ MAESTRA",
            testo: "Il Mese 11 porta una percezione emotiva amplificata, quasi telepatica, capace di cogliere le sfumature sottili e non dette dell'ambiente circostante. La vita affettiva è guidata da una ricerca di unione ideale e da una profonda vocazione all'ispirazione reciproca. La sfida è canalizzare l'alta tensione nervosa e la super-sensibilità in intuizione luminosa, senza farsi travolgere dall'ansia o dalle oscillazioni emotive legate al doppio 1."
        },
        22: {
            titolo: "INFLUENZA EMOTIVA 22/4: LA COSTRUZIONE DELL'ARMONIA SPECIALE",
            testo: "Un Mese 22 unisce la profonda sensibilità relazionale del 2 alla capacità di strutturare visioni ampie del 4. Le emozioni cercano uno sbocco concreto: la persona desidera costruire progetti affettivi o comunitari di grande portata che offrano sicurezza e valore al mondo. La lezione è integrare l'imponente spinta interiore con la pazienza quotidiana, evitando che il peso dell'aspettativa schiacci la spontaneità dei sentimenti."
        },
        33: {
            titolo: "INFLUENZA EMOTIVA 33/6: L'AMORE INCONDIZIONATO E IL SERVIZIO",
            testo: "L'influenza del 33 nel Mese esprime la vibrazione dell'amore universale e della cura disinteressata. Il filtro emotivo è tarato sulla guarigione, l'accoglienza e la guida affettiva per gli altri. C'è una forte tendenza a farsi carico del benessere collettivo. La sfida evolutiva è proteggere il proprio campo energetico, imparando ad amare sé stessi con la stessa devozione con cui ci si dedica al mondo."
        },

        // --- NUMERI KARMICI ---
        13: {
            titolo: "INFLUENZA EMOTIVA 13/4: LA TRASFORMAZIONE DEI NODI AFFETTIVI",
            testo: "Il Mese 13 indica una memoria emotiva legata al tema del cambiamento profondo e del lasciar andare. La persona può sperimentare una resistenza interiore alle trasformazioni affettive o una paura inconscia della perdita. La lezione è comprendere che la vera sicurezza non nasce dal trattenere, ma dalla capacità di rigenerarsi e di ristrutturare le proprie fondamenta emotive con pazienza e costanza."
        },
        14: {
            titolo: "INFLUENZA EMOTIVA 14/5: IL BILANCIAMENTO TRA LIBERTÀ E LEGAME",
            testo: "Con il 14 nel Mese, la sfera emotiva oscilla tra la ricerca di forti stimoli/libertà e il bisogno di stabilità. Possono emergere tendenze agli eccessi o all'irrequietezza nei legami come difesa dal sentirsi ingabbiati. Il karma richiede di trovare la misura, la disciplina interiore e l'equilibrio nei piaceri e nelle relazioni, imparando la presenza costante."
        },
        16: {
            titolo: "INFLUENZA EMOTIVA 16/7: IL RISVEGLIO DEL CUORE E IL CROLLO DELLE ILLUSIONI",
            testo: "Il Mese 16 porta un filtro emotivo che spinge alla ricerca di verità autentica, abbattendo le maschere o le idealizzazioni affettive. La persona può aver sviluppato difese rigide per proteggere un cuore fragile. La lezione evolutiva è consentire alla struttura dell'Ego di ammorbidirsi, scoprendo che la vera forza risiede nell'autenticità e nella fiducia profonda, al di là dell'orgoglio."
        },
        19: {
            titolo: "INFLUENZA EMOTIVA 19/1: IL SUPERAMENTO DELL'ISOLAMENTO E L'APERTURA",
            testo: "Un Mese 19 riflette una memoria affettiva segnata dal tema dell'autosufficienza forzata o della fatica nel chiedere aiuto. La persona tende a contare solo su di sé, vivendo i sentimenti in modo solitario. Il compito evolutivo è sciogliere l'orgoglio o la paura del giudizio, imparando a condividere il proprio potere interiore e ad accogliere l'amore dell'altro su un piano di parità."
        }
    },

    giorno: {
        1: {
            titolo: "INFLUENZA OPERATIVA 1: L'INIZIATIVA E IL TALENTO LEADER",
            testo: "Il Giorno 1 dona una spinta all'azione diretta, autonoma e pionieristica. Di fronte alle sfide quotidiane, chi possiede questa frequenza reagisce prendendo il comando e cercando soluzioni immediate e originali. È il talento dell'intraprendenza: una capacità naturale di aprire nuove strade senza attendere l'approvazione altrui. La lezione operativa risiede nell'evitare l'impulsività o l'autoritarismo, imparando a calibrare la determinazione con la pazienza."
        },
        2: {
            titolo: "INFLUENZA OPERATIVA 2: LA DIPLOMAZIA E LA COLLABORAZIONE",
            testo: "Con il Giorno 2, lo stile d'azione è fluido, pacificatore e orientato alla cooperazione. Chi ha questa impronta opera al meglio in squadra o in coppia, agendo da mediatore e facilitatore delle relazioni. Il talento pratico si manifesta nell'ascolto, nella cura dei dettagli e nella capacità di armonizzare i contrasti. Sul piano operativo occorre fare attenzione a non scivolare nell'indecisione o nella passività, sviluppando sicurezza nel far valere le proprie idee."
        },
        3: {
            titolo: "INFLUENZA OPERATIVA 3: LA COMUNICAZIONE E LA CREATIVITÀ",
            testo: "L'energia del 3 nel Giorno di Nascita si traduce in un'azione brillante, dinamica ed espressiva. Le sfide quotidiane vengono affrontate con ottimismo, spigliatezza e intuito creativo. È il talento della parola, dell'arte e della connessione sociale: la persona risolve i problemi attraverso la negoziazione, il carisma e il pensiero laterale. La sfida pratica risiede nell'evitare la dispersione di energie e la tendenza a lasciare i progetti a metà."
        },
        4: {
            titolo: "INFLUENZA OPERATIVA 4: LA PRAGMATICITÀ E IL METODO",
            testo: "Il Giorno 4 caratterizza una modalità d'azione concreta, strutturata e instancabile. Di fronte ai compiti quotidiani, la risposta è l'organizzazione, la disciplina e la costruzione passo dopo passo. È il talento del costruttore: una capacità innata di dare forma solida alle idee. La lezione operativa consiste nel non farsi imbrigliare dalla rigidità o dalla paura del rischio, mantenendo la flessibilità necessaria per adattarsi agli imprevisti."
        },
        5: {
            titolo: "INFLUENZA OPERATIVA 5: L'INNOVAZIONE E LA VERSATILITÀ",
            testo: "Il Giorno 5 conferisce un talento d'azione rapido, eclettico e privo di schemi rigidi. Di fronte ai problemi, la persona reagisce con grande spirito di adattamento, curiosità e capacità di improvvisazione. Amante della dinamicità e del cambiamento, sa gestire più situations contemporaneamente con mente snella. Il punto di attenzione operativo è la tendenza all'insofferenza o alla superficialità quando l'attività richiede pazienza e routine."
        },
        6: {
            titolo: "INFLUENZA OPERATIVA 6: LA RESPONSABILITÀ E IL SERVIZIO PRATICO",
            testo: "Il Giorno 6 dona una modalità d'azione mossa dal senso del dovere, dall'armonia e dal supporto concreto verso la comunità o la famiglia. Di fronte ai problemi, la risposta è pragmatica e orientata al ripristino dell'ordine, dell'estetica e del benessere comune. È il talento dell'accudimento efficiente e della mediazione pratica. Sul piano operativo occorre fare attenzione a non caricarsi di troppe responsabilità altrui, evitando di perfezionare i dettagli a discapito dei tempi d'azione."
        },
        7: {
            titolo: "INFLUENZA OPERATIVA 7: L'ANALISI STRATEGICA E LA MAESTRIA",
            testo: "L'energia del 7 nel Giorno di Nascita caratterizza un'azione ponderata, metodica e guidata dall'osservazione profonda. Chi possiede questo talento non agisce d'impulso: analizza, studia, cerca la verità tecnica o concettuale prima di muoversi. È l'attitudine dello specialista, del ricercatore e dello stratega. La sfida pratica consiste nel superare l'iper-criticità o la paralisi da analisi, imparando a tradurre il pensiero teorico in azione concreta anche in assenza di condizioni perfette."
        },
        8: {
            titolo: "INFLUENZA OPERATIVA 8: L'AUTORITÀ E LA GESTIONE STRUTTURATA",
            testo: "Un Giorno 8 conferisce una spinta operativa determinata, ambiziosa e fortemente orientata ai risultati tangibili. Le sfide quotidiane vengono affrontate con pragmatismo, capacità organizzativa e visione strategica del potere o delle risorse economiche. È il talento della leadership esecutiva e del coordinamento. Il punto di attenzione risiede nell'evitare l'intransigenza o l'eccesso di controllo, ricordando che la vera autorevolezza include la flessibilità e il rispetto dei tempi altrui."
        },
        9: {
            titolo: "INFLUENZA OPERATIVA 9: LA VISIONE AMPIA E IL VOCAZIONALE",
            testo: "Con il 9 nel Giorno, la risposta pratica alle situazioni si distingue per generosità, ampiezza di vedute e vocazione all'impatto collettivo. La persona opera al meglio in progetti di ampio respiro, capaci di integrare competenze diverse per il bene comune. È il talento del promotore e del formatore. La sfida operativa risiede nel mantenere la concretezza sui dettagli del quotidiano, evitando di disperdere le risorse in troppe iniziative prive di radicamento immediato."
        },

        // --- NUMERI MAESTRI ---
        11: {
            titolo: "INFLUENZA OPERATIVA 11/2: L'ISPIRAZIONE E LA VISIONE INTUITIVA",
            testo: "Il Giorno 11 dona un'azione illuminata, guidata da intuizioni fulminee e spiccata capacità di ispirare gli altri. Di fronte alle sfide, la risposta supera la logica ordinaria per attingere a una comprensione immediata della situazione. È il talento dell'innovatore carismatico. La lezione pratica è imparare a gestire la scarica energetica e la tensione nervosa, strutturando le idee intuitive in passi operativi concreti e sostenibili."
        },
        22: {
            titolo: "INFLUENZA OPERATIVA 22/4: LA GRANDE ARCHITETTURA PRATICA",
            testo: "Un Giorno 22 esprime il talento del mastro costruttore: la capacità di tradurre grandi visioni o ideali complessi in progetti concreti e strutture durature. Sul piano pratico unisce la lungimiranza alla disciplina rigorosa del 4. La sfida operativa risiede nell'evitare di farsi schiacciare dalla dimensione degli obiettivi prescelti, procedendo con metodo ed evitando che la rigidità blocchi il processo di realizzazione."
        },
        33: {
            titolo: "INFLUENZA OPERATIVA 33/6: LA GUIDA OPERATIVA E IL SOSTEGNO",
            testo: "L'influenza del 33 nel Giorno caratterizza una modalità d'azione orientata alla guida formativa, alla cura e al servizio elevato per la collettività. Chi possiede questa energia risolve i problemi concreti mettendo sempre al centro il valore umano e la rigenerazione. La lezione sul piano dell'azione consiste nel dosare le proprie forze, evitando di esaurire le risorse personali in una dedizione priva di confini operativi sani."
        },

        // --- NUMERI KARMICI ---
        13: {
            titolo: "INFLUENZA OPERATIVA 13/4: IL LAVORO COSTANTE E LA RISTRUTTURAZIONE",
            testo: "Il Giorno 13 richiede un'operatività basata sulla pazienza, sul superamento della pigrizia e sulla ricostruzione metodica. Di fronte agli ostacoli, il talento si sviluppa imparando a rimodellare la propria routine d'azione con disciplina e perseveranza. Il karma pratico consiste nel trasformare la sensazione di fatica o di blocco in una spinta rigorosa alla concretezza, senza cercare scorshortcut."
        },
        14: {
            titolo: "INFLUENZA OPERATIVA 14/5: L'AUTODISCIPLINA E LA FLESSIBILITÀ",
            testo: "Con il 14 nel Giorno, la modalità d'azione affronta il tema del cambiamento rapido e della gestione degli imprevisti. La persona possiede versatilità, ma può tendere alla dispersione o alla reazione impulsiva. La lezione operativa risiede nel coltivare la disciplina personale e la continuità, imparando a canalizzare la spinta all'innovazione senza cedere al disordine o alla frammentazione dei compiti."
        },
        16: {
            titolo: "INFLUENZA OPERATIVA 16/7: IL RIGORE ETICO E LA RIFONDAZIONE",
            testo: "Il Giorno 16 richiede un'azione fondata sull'autenticità e sul ridimensionamento dell'orgoglio professionale o pratico. Quando le strutture operative consolidate crollano o non funzionano più, la persona è chiamata a ricostruire con basi più veritiere ed essenziali. Il compito evolutivo è sviluppare un'operatività priva di rigidità e aperta al continuo affinamento della propria maestria."
        },
        19: {
            titolo: "INFLUENZA OPERATIVA 19/1: L'AUTONOMIA E LA COOPERAZIONE PRATICA",
            testo: "Un Giorno 19 porta il tema dell'indipendenza e dell'uso corretto dell'autorità sul piano dell'azione. Chi possiede questa impronta tende a voler fare tutto da solo, rifiutando il supporto altrui per affermare il proprio valore. La lezione operativa consiste nel superare l'individualismo rigido, imparando a dirigere le iniziative con leadership equilibrata e aperta al contributo degli altri."
        }
    },

    anno: {
        1: {
            titolo: "INFLUENZA GENERAZIONALE 1: IL RINNOVAMENTO E L'AUTONOMIA",
            testo: "L'energia dell'1 nell'Anno di Nascita rappresenta una spinta maturativa volta all'indipendenza e all'affermazione della propria unicità. Sul piano generazionale e a lungo termine, la persona è chiamata a sviluppare una visione pionieristica, aprendo nuove strade e superando i condizionamenti ereditati. La lezione di fondo consiste nell'assumersi la piena responsabilità del proprio cammino, diventando un punto di riferimento autonomo e consapevole senza cedere al risentimento o all'isolamento."
        },
        2: {
            titolo: "INFLUENZA GENERAZIONALE 2: LA MEDIAZIONE E LA COESIONE",
            testo: "L'Anno 2 porta con sé una spinta di fondo orientata alla cooperazione, all'integrazione degli opposti e alla costruzione di ponti relazionali. Nel percorso di vita a lungo termine, la maturazione passa attraverso l'apprendimento della pazienza, della diplomazia e del rispetto dei ritmi naturali. La lezione evolutiva risiede nell'affinare la capacità di collaborare e creare armonia nei contesti sociali o familiari, mantenendo sempre saldo il proprio centro d'identità."
        },
        3: {
            titolo: "INFLUENZA GENERAZIONALE 3: L'ESPRESSIONE E IL RINNOVAMENTO CULTURALE",
            testo: "Con l'energia del 3 nell'Anno, la traiettoria di vita è segnata dalla ricerca di espressione, creatività e circolazione delle idee. Sul piano generazionale rappresenta il talento di alleggerire le rigidità sociali attraverso la comunicazione, l'arte, il gioco e l'ottimismo. Il compito evolutivo a lungo termine è trasformare l'espressività superficiale in un messaggio profondo, capaci di ispirare ed elevare l'ambiente circostante."
        },
        4: {
            titolo: "INFLUENZA GENERAZIONALE 4: LA STRUTTURA E LA COSTRUZIONE DUREVOLE",
            testo: "L'Anno 4 conferisce un impronta generazionale fondata sui valori del lavoro, del radicamento e della costruzione di basi solide per il futuro. La visione a lungo termine è orientata alla stabilità, al rispetto delle regole e alla creazione di opere o sistemi destinati a durare nel tempo. La sfida di fondo consiste nel non rimanere prigionieri della rigidità o della resistenza al cambiamento, integrando la tradizione con la flessibilità."
        },
        5: {
            titolo: "INFLUENZA GENERAZIONALE 5: LA TRASFORMAZIONE E LA LIBERTÀ DI PENSIERO",
            testo: "Un Anno di Nascita 5 riflette una spinta evolutiva orientata all'espansione dei confini, all'esplorazione e alla rottura degli schemi obsoleti. A livello di sfondo, la persona partecipa a un'epoca o a una visione di forte transizione e progresso. La lezione a lungo termine risiede nell'imparare a gestire il cambiamento con disciplina interiore, trasformando il bisogno di libertà in un'opportunità di evoluzione consapevole per sé e per gli altri."
        },
        6: {
            titolo: "INFLUENZA GENERAZIONALE 6: L'ARMONIA SOCIALE E LA RESPONSABILITÀ ETICA",
            testo: "L'Anno 6 caratterizza un'impronta di fondo orientata al miglioramento della qualità della vita, alla custodia della bellezza e alla difesa dei valori comunitari o familiari. Nel tempo, la persona matura una spinta etica verso la giustizia, la guarigione e il benessere collettivo. La lezione evolutiva consiste nel bilanciare l'ideale di perfezione con l'accettazione della realtà, offrendo sostegno senza giudizio né rigidità."
        },
        7: {
            titolo: "INFLUENZA GENERAZIONALE 7: LA RICERCA DELLA VERITÀ E LA SAPIENZA",
            testo: "L'energia vibratoria del 7 nell'Anno orienta la maturazione interiore verso lo studio, l'indagine filosofica, scientifica o spirituale e la ricerca di senso profondo. Rappresenta una spinta a non accontentarsi delle risposte di superficie. La sfida generazionale e a lungo termine è integrare il sapere teorico e la contemplazione con la partecipazione attiva alla vita quotidiana, evitando il distacco cinico o l'isolamento."
        },
        8: {
            titolo: "INFLUENZA GENERAZIONALE 8: IL GIUSTO USO DEL POTERE E DELLA MATERIA",
            testo: "Un Anno 8 riflette una spinta evolutiva legata all'organizzazione delle risorse, al rigore gestionale e alla realizzazione di grandi progetti concreti. A livello di sfondo, spinge a confrontarsi con i temi dell'autorevolezza, dell'economia e della giustizia materiale. La lezione di vita fondamentale è apprendere l'uso etico e bilanciato del potere e dell'abbondanza, intesi come strumenti di servizio e non di sopraffazione."
        },
        9: {
            titolo: "INFLUENZA GENERAZIONALE 9: LA COSCIENZA UNIVERSALE E IL COMPIMENTO",
            testo: "Con il 9 nell'Anno, la traiettoria di vita è contrassegnata da una visione ad ampio raggio, orientata alla chiusura di vecchi cicli e all'apertura verso l'umanitarismo. La spinta di fondo spinge a superare i confini individuali per abbracciare cause collettive o ideali elevati. Il compito a lungo termine è praticare il distacco sano, il perdono e la trasmissione della propria esperienza alle generazioni future."
        },

        // --- NUMERI MAESTRI ---
        11: {
            titolo: "INFLUENZA GENERAZIONALE 11/2: L'ILLUMINAZIONE E LA GUIDA SPIRITUALE",
            testo: "L'Anno 11 esprime un'impronta generazionale di elevata frequenza, legata al risveglio delle coscienze, all'intuizione profonda e all'innovazione ideale. Nel corso della vita, la persona è chiamata a fungere da canale d'ispirazione per il proprio ambiente. La lezione fondamentale è radicare le intuizioni elevate nella realtà di tutti i giorni, senza farsi sopraffare dalla tensione o dall'idealismo utopico."
        },
        22: {
            titolo: "INFLUENZA GENERAZIONALE 22/4: LA COSTRUZIONE DI UN NUOVO MONDO",
            testo: "Un Anno 22 porta con sé la vocazione del grande architetto sociale o comunitario. La spinta maturativa di fondo riguarda la capacità di coniugare grandi visioni ideali con una straordinaria concretezza realizzativa per il bene della collettività. La lezione a lungo termine è procedere con costanza, trasformando la grande responsabilità in un'opera strutturata e condivisa."
        },
        33: {
            titolo: "INFLUENZA GENERAZIONALE 33/6: IL SERVIZIO ELEVATO E LA GUARIGIONE",
            testo: "L'influenza del 33 nell'Anno rappresenta la vibrazione della cura incondizionata e della guida caritatevole su vasta scala. A lungo termine, la persona matura una profonda vocazione al servizio per l'elevazione spirituale ed emotiva degli altri. La sfida principale è proteggere il proprio equilibrio personale, ricordando che la vera guarigione parte dall'amore e dal rispetto per sé stessi."
        },

        // --- NUMERI KARMICI ---
        13: {
            titolo: "INFLUENZA GENERAZIONALE 13/4: LA RIGENERAZIONE E LA RISTRUTTURAZIONE",
            testo: "L'Anno 13 indica una lezione evolutiva di fondo incentrata sul superamento delle resistenze al cambiamento e sulla capacità di rimettere in discussione le vecchie strutture di vita. Il percorso a lungo termine richiede di sviluppare resilienza, operosità e pazienza, imparando che ogni trasformazione profonda è la premessa per una costruzione più solida e autentica."
        },
        14: {
            titolo: "INFLUENZA GENERAZIONALE 14/5: IL BILANCIAMENTO E LA MISURA",
            testo: "Con il 14 nell'Anno, la spinta maturativa affronta il tema dell'equilibrio dinamico tra stabilità e cambiamento, evitando gli eccessi e la dispersione. A lungo termine, la persona è chiamata a sviluppare autodisciplina e presenza, imparando ad accogliere la varietà della vita senza perdersi nella ricerca di stimoli superficiali."
        },
        16: {
            titolo: "INFLUENZA GENERAZIONALE 16/7: IL RISVEGLIO ETICO E LA VERITÀ ESSENZIALE",
            testo: "Un Anno 16 riflette una traiettoria evolutiva che passa attraverso la purificazione dell'Ego e l'abbattimento di false certezze o illusioni materiali. Il compito a lungo termine è ricostruire la propria visione dell'esistenza su basi spirituali ed etiche autentiche, scoprendo che la vera stabilità nasce dall'integrità interiore."
        },
        19: {
            titolo: "INFLUENZA GENERAZIONALE 19/1: L'AUTONOMIA CONSAPEVOLE E IL SERVIZIO",
            testo: "L'Anno 19 porta la lezione evolutiva di superare l'orgoglio e l'autosufficienza isolata, imparando a utilizzare le proprie risorse individuali per il bene comune. Il cammino di maturazione insegna a esercitare la leadership e l'indipendenza in uno spirito di cooperazione e condivisione su basi di assoluta parità."
        }
    } // chiusura di anno
}; // chiusura di window.INFLUENZE

// 1. Alias di comodo per accedere direttamente alle influenze
window.TESTI_INFLUENZE = window.INFLUENZE;

// 2. Integrazione dentro TESTI_PITAGORA (database unificato)
window.TESTI_PITAGORA.mese = window.INFLUENZE.mese;
window.TESTI_PITAGORA.giorno = window.INFLUENZE.giorno;
window.TESTI_PITAGORA.anno = window.INFLUENZE.anno;