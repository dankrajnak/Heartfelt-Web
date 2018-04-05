'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var wav = require('wav');
var BinaryServer = require('binaryjs').BinaryServer;
// const fs = require('fs');
var streamRecieve = BinaryServer({ port: 9001 });

streamRecieve.on('connection', function (client) {
  console.log('Binary Connection');
  var fileWriter = new wav.FileWriter('./messages/' + Date.now() + '.wav', {
    channels: 1,
    bitDepth: 16
  });

  client.on('stream', function (stream, meta) {
    stream.pipe(fileWriter);

    stream.on('end', function () {
      fileWriter.end();
      console.log('Wrote to file');
    });
  });
});

exports.default = streamRecieve;