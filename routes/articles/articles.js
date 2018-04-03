const express = require('express');
const router = express.Router();
const jsonBot = require('./bot');
const multer = require('multer');
const fs = require("fs");
const config = require('../../config/database');
const Article = require('../../models/articles');

const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const natural_language_understanding = new NaturalLanguageUnderstandingV1({
  'username': 'addceb71-3818-4edf-ab98-745f1e260fa5',
  'password': 'lesiNMLoPDPj',
  'version_date': '2017-02-27'
});

const folder = 'C:/Users/pipe-_000/Desktop/PI2/proyecto/angular-src/uploads/';
var severalWords = false;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'angular-src/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

var upload = multer({ storage: storage })


router.post('/initChatbot', (req, res) => {
  var words = req.body.mensaje.split(',');
  var finalWords = [];
  words.forEach(word => finalWords.push(word.toUpperCase()));
  if(words.length > 1) {
    severalWords = true;
  } else {
    severalWords = false;
  }
  Article.getArticles(finalWords, (err, data) => {
    res.send(
      {
      'botMessage': getBotResponse(req.body.mensaje),
      'query':data
      }
    )
  })
});

router.post('/fileUpload', upload.array("uploads[]", 12), (req, res) => {
  res.send({'successful':'files uploaded succesfully'});
});

  
function getBotResponse(message) {
    var intent = '';
    var output = '';
    for(var i = 0; i < jsonBot.length; i++) {
      jsonBot[i].examples.forEach(ex => {
        if (ex.text.toUpperCase() === message.toUpperCase()) {
          intent = jsonBot[i].intent;
          output = jsonBot[i].description;
        }
      })
    }
    if(intent !== '' && output !== '') {
        return output
    } else {
      if(severalWords) {
        return 'Le resultó útil la búsqueda?'
      } else {
      return 'No se de que me esta hablando'
    }
  }
}


router.post('/processDocuments', (req, res) => {
  initDocumentProcessing(req.body.files);
  res.send({'successful': 'successful processing'});
});

function initDocumentProcessing(inputFiles) {
  fs.readdir(folder, (err, files) => {
    files.forEach(file => {
      if(inputFiles.includes(file)){
        const data = fs.readFileSync(folder + file, 'utf8');
        processDocument(data, file);
      }      
    });
  })
}

function processDocument(data, documentName) {
  var parameters = getParameters(data);
    natural_language_understanding.analyze(parameters, function(err, response) {
      if (err)
          console.log('error:', err);
      else
          var words = [];
          response.keywords.forEach(keyword => words.push(keyword.text.toUpperCase()));
          let newArticle = new Article({
            name: documentName,
            keywords: words
          });
          Article.addArticle(newArticle, (err, user) => {
            if(err) {
              console.log('Failed to save article');
              new Error(ex.toString());
            } else {
              console.log('Article registered');
            }
          });
      });
}

function getParameters(data) {
  return {
      'text': data,
      'features': {
        'entities': {
          'emotion': true,
          'sentiment': true,
          'limit': 2
        },
        'keywords': {
          'emotion': true,
          'sentiment': true,
          'limit': 10
        }
      }
    }
}

module.exports = router;