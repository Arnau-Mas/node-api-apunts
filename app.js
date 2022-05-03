
//  1.npm init -y per gobernar el projecte amb npm

//  2.npm i express per instal·lar el mòdul d'express

//  3.npm i nodemon -D per instal·lar en fase de development el mòdul nodemon

//  4.Configurar el package.json "dev":"nodemon app.js", "start":"node app.js"

//  5.Crear app.js

//Millor treballar amb promises pq async await estas convertit tot el controller en una promesa i a vegades pot crear eerrors a l'hora de retornar coses

//  Requerim el mòdul express per poder crear un servidor
const main = require("./database.js");
const express = require('express');
const mongoose = require("mongoose");
const Note = require("./models/Note");
try{
  main()
  console.log("connectat a la base de dades");
}catch(err){
  console.log(err);
}

// Creem el servidor
const app = express();

//npm install cors i requerim cors. Això farà q la API sigui accessible desde qualsevol origen. Desde qualsevol IP.
const cors = require("cors");

app.use(cors());

// Això serveix per fer "operatives" les dades JSON que rebem en el body. Sense això, no podem llegir res del body.
app.use(express.json());

// Configurem les peticions als paths i què fer en cas del tipus de petició
let notes = [];
// Quan es faci un get a "/", retornar-li "Hola!";
app.get('/', (req, res)=>{
  res.send('Hola!');
});

// Quan es faci un get a "/notes", retornem l'array de notes.
app.get('/notes', async (req, res)=>{
  try{
    let notesDb = await Note.find();
    if(notesDb){
      res.json(notesDb)
    }
    console.log("fet")
  }catch(err){
    console.log(err)
  }

  // res.json(notes); el res.json és per enviar al client un array o un objecte que estan en format json, i l'utilitzes x indicar-li el tipus de dada.
});

// Utilitzem els : quan es tracta d'una ruta dinàmica. Ens servirà per mostrar les notes separades una a una.
app.get('/notes/:id', (req, res) => {
  const id = Number(req.params.id); // Aquesta és la manera d'obtenir el paràmetre dinàmic. Això és equivalent a -> const {id} = req.params;
  // req.params és un objecte que inclou tots els paràmetres afegits a la ruta de manera dinàmica
  const note = Note.find((note) => note.id === id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});


// Per veure si els deletes, posts, etc funcionen, utilitzem insomnia i alla configurem les requests per veure si les dades s'actualitzen o no
app.delete('/notes/:id', (req, res) => {
  const id = req.params.id;
  notes = Note.filter((note) => note.id != id);
  res.send('it\'s deleted!');
});

app.post('/notes', async (req, res) => {
  const data = req.body;
  if (data) {
    const note = new Note({
      title: data.title,
      content: data.content,
      date: new Date()
    });
    await note.save();
    notes = [...notes, note];
    res.json(note); // això es fa perquè quan un post ha anat bé, se li retorna l'objecte perquè així el del frontend pugui utilitzar-lo.
  } else {
    req.status(400).end();
  }
});

/* middleware per errors:
SUPER IMPORTANT POSAR ELS MIDDLEWARES AQUESTS AL FINAL XQ NO INTERFEREIXIN AMB EL PROCÉS DE LECTURA DELS ALTRES MIDDLEWARES (de dalt a abaix)  
als altres get, posts etc, quan fas un catch(err) (osigui, sempre q fas algo a la db)
has de ficar next(err), per a que arribi al middleware de gestió d'errors i puguis tractar-lo 
app.use((error, req, res, next) => {
  if(error == X)
})
https://expressjs.com/es/guide/error-handling.html */

app.use((req,res) => res.status(404)) //middleware per cobrir les peticions a rutes inexistents

// Li diem que el servidor corri en el port 3000.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('server running'));
