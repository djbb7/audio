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

//where to save telegram voice notes
const tmpDir = './audios/';

//mac duration of audio
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
.post('/', (req, res) => {
  //check if duration is not too long
  if(req.body.duration > maxDuration){
    //TODO: return error
  }

  //save converted audio to disk with unique name
  const audioFile = tmpDir + uuid.v4() + ".flac";
  
  //download and convert 
  ffmpeg(request(req.body.audioFileUrl))
    .output(audioFile)
    .outputOptions(['-ac 1', '-ar 16000']) //1 channel, sampleRate 16.000
    .on('error', function(err) {
      //TODO: how to handle error?
      console.log('An error occurred: ' + err.message);
    })
    .on('end', function() {
      //file converted, send to Google Speech
      syncRecognize(audioFile, function(results){
        //results is the string containing the interpreted audio

        //'edit' distance to find closest match
        let match = Restaurants.getClosestMatch(results);

        console.log("Google heard: '"+results+"', we matched '"+match.name+"'");

        res.send(match);

        //delete file
        fs.unlink(audioFile);
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
