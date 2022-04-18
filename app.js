
//  1.npm init -y per gobernar el projecte amb npm
//  2.npm i express per instal·lar el mòdul d'express
//  3.npm i nodemon -D per instal·lar en fase de development el mòdul nodemon
//  4.Configurar el package.json "dev":"nodemon app.js", "start":"node app.js"
//  5.Crear app.js


//  Requerim el mòdul express per poder crear un servidor

const express = require('express');
const mongoose = require("mongoose");
require('dotenv').config()
const{URI} = process.env;

// Creem el servidor
const app = express();

//npm install cors i requerim cors. Això farà q la API sigui accessible desde qualsevol origen.  
const cors = require("cors");
console.log(URI)
app.use(cors());

// Això serveix per fer "operatives" les dades JSON que rebem en el body. Sense això, no podem llegir res del body.
app.use(express.json());

async function main(){
  await mongoose.connect(URI)
}
try{
  main()
  console.log("connectat a la base de dades");
}catch(err){
  console.log(err);
}

let notes = [
  {
    'id': 1,
    'title': 'Title1',
    'content': 'Content',
  },
  {
    'id': 2,
    'title': 'Title2',
    'content': 'Content',
  },
  {
    'id': 3,
    'title': 'Title3',
    'content': 'Content',
  },
];

// Configurem les peticions als paths i què fer en cas del tipus de petició

// Quan es faci un get a "/", retornar-li "Hola!";
app.get('/', (req, res)=>{
  res.send('Hola!');
});

// Quan es faci un get a "/notes", retornem l'array de notes.
app.get('/notes', (req, res)=>{
  res.json(notes); // el res.json és per enviar al client un array o un objecte que estan en format json, i l'utilitzes x indicar-li el tipus de dada.
});

// Utilitzem els : quan es tracta d'una ruta dinàmica. Ens servirà per mostrar les notes separades una a una.
app.get('/notes/:id', (req, res) => {
  const id = Number(req.params.id); // Aquesta és la manera d'obtenir el paràmetre dinàmic. Això és equivalent a -> const {id} = req.params;
  // req.params és un objecte que inclou tots els paràmetres afegits a la ruta de manera dinàmica
  const note = notes.find((note) => note.id === id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});


// Per veure si els deletes, posts, etc funcionen, utilitzem insomnia i alla configurem les requests per veure si les dades s'actualitzen o no
app.delete('/notes/:id', (req, res) => {
  const id = req.params.id;
  notes = notes.filter((note) => note.id != id);
  res.send('it\'s deleted!');
});

app.post('/notes', (req, res) => {
  const note = req.body;
  if (!note) {
    const newNote = {
      id: 4,
      title: note.title,
      content: note.content,
    };
    notes = [...notes, newNote];
    res.json(newNote); // això es fa perquè quan un post ha anat bé, se li retorna l'objecte perquè així el del frontend pugui utilitzar-lo.
  } else {
    req.status(400).end();
  }
});



app.use((req,res) => res.status(404)) //middleware per cobrir les peticions a rutes inexistents

// Li diem que el servidor corri en el port 3000.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('server running'));
