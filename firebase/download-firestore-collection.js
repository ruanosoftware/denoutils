import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { parse } from 'https://deno.land/std/flags/mod.ts';
import {
  getDocs,
  getFirestore,
  collection,
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import { writeJsonSync } from 'https://deno.land/x/jsonfile/mod.ts';


// Read firebase config
const configFile = './env.json';
const firebaseConfig = JSON.parse(Deno.readTextFileSync(configFile));

if(!firebaseConfig) {
    console.error(`Could not read firebase config from ${configFile}`);
    Deno.exit(1);
}

console.log('config:', JSON.stringify(firebaseConfig, null, 2));


// Parsear los argumentos de la línea de comandos
const args = parse(Deno.args);
const collectionName = args.collection;

if (!collectionName) {
  console.log('No collection name provided');
  Deno.exit(1);
}

// Inicializar la aplicación de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get all documents in a collection
const docs = [];
const querySnapshot = await getDocs(collection(db, collectionName));
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
  docs.push({id: doc.id, ...doc.data()});
});

writeJsonSync(`./${collectionName}.json`, docs, { spaces: 2 }); // Write to file

Deno.exit(0);
