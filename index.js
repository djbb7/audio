import express from 'express';
import multer from 'multer';
import bodyParser from 'body-parser';
import request from 'request';
import fs from 'fs';
import uuid from 'node-uuid';
import ffmpeg from 'fluent-ffmpeg';

import restaurants from './restaurants';

const speech = require('@google-cloud/speech')({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.KEY_FILENAME
});

// where to save telegram voice notes
const tmpDir = './audios/';

// max duration of audio in seconds
const maxDuration = 10;

const app = express();
const upload = multer();
const Restaurants = new restaurants();

app
.use(express.static('./public'))
.use(bodyParser.json())
.post('/file', upload.single('audio'), (req, res) => {
  console.log('Received files: ' + req.file)
  res.send('OK')
})
.post('/', (req, res, next) => {
  // check if duration is not too long
  if(req.body.duration > maxDuration){
    console.log('Error: duration exceeded');
    return next({code: 400, message: `The audio length should not exceed ${maxDuration} seconds.`});
  }

  // save converted audio to disk with unique name
  const audioFile = tmpDir + uuid.v4() + ".flac";
  
  // download and convert 
  ffmpeg(request(req.body.audioFileUrl))
    .output(audioFile)
    .outputOptions(['-ac 1', '-ar 16000']) //1 channel, sampleRate 16.000
    .on('error', function(err) {
      console.log('An error occurred: ' + err.message);
      return next({code: 400, message: 'Error converting audio.'});
    })
    .on('end', function() {
      // file converted, send to Google Speech
      syncRecognize(audioFile, function(result){
        // results is the string containing the interpreted audio

        // 'edit' distance to find closest match
        let match = Restaurants.getClosestMatch(result);

        console.log("Google heard: '"+result+"', we matched '"+match.name+"'");

        res.send({'id': match.id, 'name': match.name, 'heard': result});

        // delete file
        fs.unlink(audioFile);
      });
    })
    .run();

  })
.use((err, req, res, next) => {res.status(err.code).json(err) });

app.listen(process.env.PORT || 5000)


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
