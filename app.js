document.addEventListener('DOMContentLoaded', () => {
    
    // 1. RECUPERO DEI DATI DAL CALCOLO PRECEDENTE
    // Assumiamo di salvare i dati nel localStorage quando l'utente fa il calcolo in "compatibilita.html"
    const datiCompatibilita = JSON.parse(localStorage.getItem('risultatoCompatibilita'));

    if (datiCompatibilita) {
        // Popoliamo le date e i nomi
        document.getElementById('data-lui').textContent = datiCompatibilita.dataLui || '--/--/----';
        document.getElementById('data-lei').textContent = datiCompatibilita.dataLei || '--/--/----';

        // Popoliamo la sezione IO (Carte e punteggi)
        // Ipotizzando che l'oggetto contenga il numero della carta (es. 7, 1)
        document.getElementById('img-io-lui').src = `Carte per APP/${datiCompatibilita.ioLui}.png`;
        document.getElementById('img-io-lei').src = `Carte per APP/${datiCompatibilita.ioLei}.png`;
        document.getElementById('score-io').textContent = `${datiCompatibilita.percentualeIo}%`;
        document.querySelector('#score-io ~ .progress-bar .progress-fill').style.width = `${datiCompatibilita.percentualeIo}%`;
        document.getElementById('desc-io').textContent = datiCompatibilita.descrizioneIo;

        // Popoliamo la sezione ANIMA
        document.getElementById('img-anima-lui').src = `Carte per APP/${datiCompatibilita.animaLui}.png`;
        document.getElementById('img-anima-lei').src = `Carte per APP/${datiCompatibilita.animaLei}.png`;
        document.getElementById('score-anima').textContent = `${datiCompatibilita.percentualeAnima}%`;
        document.querySelector('#score-anima ~ .progress-bar .progress-fill').style.width = `${datiCompatibilita.percentualeAnima}%`;
        document.getElementById('desc-anima').textContent = datiCompatibilita.descrizioneAnima;

        // Popoliamo la sezione DESTINO
        document.getElementById('img-destino-lui').src = `Carte per APP/${datiCompatibilita.destinoLui}.png`;
        document.getElementById('img-destino-lei').src = `Carte per APP/${datiCompatibilita.destinoLei}.png`;
        document.getElementById('score-destino').textContent = `${datiCompatibilita.percentualeDestino}%`;
        document.querySelector('#score-destino ~ .progress-bar .progress-fill').style.width = `${datiCompatibilita.percentualeDestino}%`;
        document.getElementById('desc-destino').textContent = datiCompatibilita.descrizioneDestino;

        // Popoliamo il totale complessivo
        document.getElementById('score-totale').textContent = `${datiCompatibilita.percentualeTotale}%`;
        document.getElementById('desc-totale').textContent = datiCompatibilita.descrizioneTotale;
    }

    // 2. LOGICA DI ESPORTAZIONE E CONDIVISIONE IMAGE
    const btnEsporta = document.getElementById('btn-esporta');
    
    btnEsporta.addEventListener('click', async () => {
        const elementoDaCatturare = document.getElementById('carta-compatibilita-export');
        
        btnEsporta.textContent = "Generazione in corso...";
        btnEsporta.disabled = true;

        try {
            // Utilizziamo html2canvas per fotografare l'elemento HTML
            // Usiamo scale: 2 per raddoppiare la definizione e renderla definita sugli schermi moderni
            const canvas = await html2canvas(elementoDaCatturare, {
                scale: 2,
                useCORS: true, // Permette di caricare le immagini locali senza blocchi di sicurezza
                backgroundColor: '#0d0d0d'
            });

            // Convertiamo il canvas in un file Blob (formato PNG)
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    alert("Errore durante la creazione dell'immagine.");
                    ripristinaBottone();
                    return;
                }

                const file = new File([blob], 'compatibilita-numerosophia.png', { type: 'image/png' });

                // Controlliamo se lo smartphone supporta la condivisione nativa dei file (Web Share API)
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            files: [file],
                            title: 'La nostra Compatibilità Numerologica',
                            text: 'Guarda la nostra compatibilità calcolata con Numerosophia!'
                        });
                    } catch (err) {
                        // Se l'utente annulla la condivisione non facciamo nulla
                        console.log("Condivisione annullata o non riuscita", err);
                    }
                } else {
                    // Soluzione di riserva per PC o browser vecchi: scarica direttamente il file
                    const URLCondivisione = URL.createObjectURL(blob);
                    const linkDownload = document.createElement('a');
                    linkDownload.href = URLCondivisione;
                    linkDownload.download = 'compatibilita-numerosophia.png';
                    document.body.appendChild(linkDownload);
                    linkDownload.click();
                    document.body.removeChild(linkDownload);
                    alert("Il tuo browser non supporta la condivisione diretta. L'immagine è stata salvata nei tuoi Download!");
                }
                
                ripristinaBottone();
            }, 'image/png');

        } catch (error) {
            console.error("Errore html2canvas:", error);
            alert("Si è verificato un errore durante la generazione della carta.");
            ripristinaBottone();
        }
    });

    function ripristinaBottone() {
        btnEsporta.textContent = "Esporta la Carta della Compatibilità";
        btnEsporta.disabled = false;
    }
});