var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');

var speech = require('@google-cloud/speech')({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.KEY_FILENAME
});

var ffmpeg = require('fluent-ffmpeg');
var uuid = require('node-uuid');

//where to save telegram voice notes
var tmpDir = './audios/';

const opts = {
  key: process.env.SPEECH_API_KEY
}

const app = express()
const upload = multer()

app
.use(express.static('./public'))
.use(bodyParser.json())
.post('/file', upload.single('audio'), (req, res) => {
  console.log('Received files: ' + req.file)
  res.send('OK')
})
.post('/', (req, res) => {
  //download voicenote to disk with unique name
  var output = tmpDir + uuid.v4() + ".flac";
  console.log("target file: "+output);
  console.log("received url: "+req.body.audioFileUrl);
  ffmpeg(request(req.body.audioFileUrl))
    .output(output)
    .outputOptions(['-ac 1', '-ar 16000']) //1 channel, sampleRate 16.000
    .on('error', function(err) {
      console.log('An error occurred: ' + err.message);
    })
    .on('end', function() {
      //file downloaded, send to Google Speech
      syncRecognize(output, function(results){
        //results is the string containing the interpreted audio
        console.log(results);

        //TODO: hamming distance to find closest match?

        //TODO: respond with closest match
        
        //delete file
        fs.unlink(output);
      });
    })
    .run();

  })
.listen(process.env.PORT || 5000)


/*
 * Taken from https://github.com/GoogleCloudPlatform/nodejs-docs-samples
 */
function asyncRecognize (filename, callback) {
  // Detect speech in the audio file, e.g. "./resources/audio.raw"
  speech.startRecognition(filename, {
    encoding: 'FLAC',
    sampleRate: 16000,
    languageCode: 'fi-FI'
  }, (err, operation) => {
    if (err) {
      callback(err);
      return;
    }

    operation
      .on('error', callback)
      .on('complete', (results) => {
        callback(results);
      });
  });
}

function syncRecognize (filename, callback) {
  // Detect speech in the audio file, e.g. "./resources/audio.raw"
  speech.recognize(filename, {
    encoding: 'FLAC',
    sampleRate: 16000,
    languageCode: 'fi-FI'
  }, (err, results) => {
    if (err) {
      callback(err);
      return;
    }

    callback(results);
  });
}
