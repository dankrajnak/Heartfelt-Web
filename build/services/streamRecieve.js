'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var wav = require('wav');
var BinaryServer = require('binaryjs').BinaryServer;

var StreamRecieve = function StreamRecieve(port, callback) {
  _classCallCheck(this, StreamRecieve);

  this.server = BinaryServer({ port: port });

  this.server.on('connection', function (client) {
    console.log('Binary Connection');

    client.on('stream', function (stream, meta) {
      console.log('stream');
      var filePath = './messages/' + Date.now() + '.wav';
      var fileWriter = new wav.FileWriter(filePath, {
        channels: 1,
        bitDepth: 16
      });
      stream.pipe(fileWriter);

      stream.on('end', function () {
        fileWriter.end();
        console.log('Wrote to file');
        callback(filePath);
      });
    });
  });
};

exports.default = StreamRecieve;