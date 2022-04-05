//
// Script para bajar el contenido de una coleccion en firebase y grabarla en un archivo json
// Es necesario tener localmente un archivo env.json con las credeciales del proyecto firebase
//
// archivo env.json:
//         {
//           "apiKey": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
//           "projectId": "XXXXXXXXXXXX",
//           "storageBucket": "XXXXXXXXXXXXXXXXXXXXXXXXX",
//           "messagingSenderId": "XXXXXXXXXXXX",
//           "appId": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
//         }
// Ej: deno run -A https://raw.githubusercontent.com/ruanosoftware/denoutils/main/firebase/download-firestore-collection.js --collection cursos
//
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { parse } from 'https://deno.land/std/flags/mod.ts';
import {
  getDocs,
  getFirestore,
  collection,
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import { writeJsonSync } from 'https://deno.land/x/jsonfile/mod.ts';

// Parsear los argumentos de la línea de comandos
const args = parse(Deno.args);
const collectionName = args.collection;
const configFile = args.config || './env.json';

if (!collectionName) {
  console.log('No collection name provided');
  Deno.exit(1);
}

// Read firebase config
const firebaseConfig = JSON.parse(Deno.readTextFileSync(configFile));
if(!firebaseConfig) {
    console.error(`Could not read firebase config from ${configFile}`);
    Deno.exit(1);
}

console.log(firebaseConfig);

// Inicializar la aplicación de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get all documents in a collection
const docs = [];
const querySnapshot = await getDocs(collection(db, collectionName));
querySnapshot.forEach((doc) => {
  docs.push({id: doc.id, ...doc.data()});
});

writeJsonSync(`./${collectionName}.json`, docs, { spaces: 2 }); // Write to file

Deno.exit(0);
