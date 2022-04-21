const {Schema, model} = require("mongoose");

const noteSchema = new Schema({
    title:String,
    content:String,
    date: Date,
})
//el model serveix per crear a la DB la coleccio del nom que li assignes (en aquest cas notes, ho fa automàtic) i també és el canal de comunicació amb la col·lecció, tant x crear-hi nous documents com per recuperar-los.

const Note = model("Note", noteSchema);

module.exports = Note;

/* També es podria fer l'export així: 
    module.exports = model("Note", noteSchema),
*/