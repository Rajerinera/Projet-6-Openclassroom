const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Thing = require('./models/Things');


mongoose.connect('mongodb+srv://adrienP6:abcdefgh@cluster0.mdvgq.mongodb.net/Cluster0?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('connexion à MongoDB fait'))
    .catch(() => console.log('connexion à MongoDB fail'));


const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(express.json());

app.post('/api/stuff', (req, res, next) => {
    delete req.body._id;
    const thing = new Thing({
        ...req.body
    });
    thing.save()
    .then(() => res.status(201).json({message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({error}));
});

app.put('/api/stuff/:id', (req, res, next) => {
    Thing.updateOne({ _id: req.params.id},{...req.body, _id: req.params.id})
    .then(()=> res.status(200).json({message: "L'objet a reçu une modif"}))
    .catch(error => res.status(404).json({ error }));
    });


app.delete('/api/stuff/:id', (req, res, next) => {
    Thing.deleteOne({_id: req.params.id})
    .then(()=> res.status(200).json({message: "L'objet est supprimégi"}))
    .catch(error => res.status(404).json({ error }));
});

app.use((req, res, next) => {
    console.log('Le stuff mis en place');
    next();
});
app.get('/api/stuff/:id', (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
      .then(thing => res.status(200).json(thing))
      .catch(error => res.status(404).json({ error }));
  });

app.get('/api/stuff', (req, res, next) => {
    Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({error}));
});

module.exports = app;