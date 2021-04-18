var express = require('express');
var router = express.Router();

// mongoose is a API wrapper overtop of mongodb, just like
// .ADO.Net is a wrapper over raw SQL server interface
const mongoose = require("mongoose");

const Comics = require("../Comics");

// edited to include my non-admin, user level account and PW on mongo atlas
// and also to include the name of the mongo DB that the collection
const dbURI =
 "mongodb+srv://ServerUser:Stillbuffering1@ambercluster.ju9pn.mongodb.net/ToDo?retryWrites=true&w=majority";

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10
};

mongoose.connect(dbURI, options).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);



/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile('index.html');
});

/* GET all ToDos */
router.get('/Comics', function(req, res) {
  // find {  takes values, but leaving it blank gets all}
  Comics.find({}, (err, AllComics) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(AllComics);
  });
});




/* post a new ToDo and push to Mongo */
router.post('/NewComic', function(req, res) {

    let oneNewComic = new Comics(req.body);  // call constuctor in ToDos code that makes a new mongo ToDo object
    console.log(req.body);
    oneNewComic.save((err, comic) => {
      if (err) {
        res.status(500).send(err);
      }
      else {
      console.log(comic);
      res.status(201).json(comic);
      }
    });
});


router.delete('/DeleteComic/:id', function (req, res) {
  Comics.deleteOne({ _id: req.params.id }, (err, note) => { 
    if (err) {
      res.status(404).send(err);
    }
    res.status(200).json({ message: "Comic successfully deleted" });
  });
});


router.put('/UpdateComic/:id', function (req, res) {
  Comics.findOneAndUpdate(
    { _id: req.params.id },
    { title: req.body.title, publisher: req.body.publisher, rating: req.body.rating },
   { new: true },
    (err, comic) => {
      if (err) {
        res.status(500).send(err);
    }
    res.status(200).json(comic);
    })
  });


  /* GET one ToDos */
router.get('/FindComic/:id', function(req, res) {
  console.log(req.params.id );
  Comics.find({ _id: req.params.id }, (err, oneComic) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(oneComic);
  });
});

module.exports = router;
