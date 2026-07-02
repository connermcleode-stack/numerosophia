// db.js - Gestione Archivio Numerologia con IndexedDB

const DB_NAME = 'NumerologiaDB';
const DB_VERSION = 1;
let db;

// Inizializza il Database
const request = indexedDB.open(DB_NAME, DB_VERSION);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    // Crea un "magazzino" per i clienti se non esiste
    if (!db.objectStoreNames.contains('clienti')) {
        // Usiamo una chiave auto-incrementante (ID)
        const store = db.createObjectStore('clienti', { keyPath: 'id', autoIncrement: true });
        // Creiamo degli indici per cercare velocemente per nome o data
        store.createIndex('by_nome', 'nome_completo', { unique: false });
    }
};

request.onsuccess = function(event) {
    db = event.target.result;
    console.log("Database d'archivio pronto.");
};

request.onerror = function(event) {
    console.error("Errore nell'apertura del database:", event.target.error);
};

// Funzione per salvare un quadro numerologico
function salvaQuadro(quadroData) {
    const transaction = db.transaction(['clienti'], 'readwrite');
    const store = transaction.objectStore('transaction');
    
    // Esempio di struttura quadroData: 
    // { nome_completo: "Mario Rossi", data_nascita: "1980-01-01", tipo: "Pitagora", risultati: { ... } }
    const request = store.add(quadroData);
    
    request.onsuccess = function() {
        alert("Quadro salvato con successo nell'archivio!");
    };
    
    request.onerror = function() {
        console.error("Errore durante il salvataggio:", request.error);
    };
}