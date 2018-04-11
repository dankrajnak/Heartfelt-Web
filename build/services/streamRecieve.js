'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var wav = require('wav');
var ss = require('socket.io-stream');

var StreamRecieve = function StreamRecieve(httpServer, callback) {
  _classCallCheck(this, StreamRecieve);

  var io = require('socket.io')(httpServer);

  io.on('connection', function (socket) {
    console.log('Binary Connection');

    var fileWriter = void 0;
    ss(socket).on('audioMessage', function (stream, meta) {
      console.log('stream');
      var filePath = './messages/' + Date.now() + '.wav';
      fileWriter = new wav.FileWriter(filePath, {
        channels: 1,
        bitDepth: 16
      });

      stream.pipe(fileWriter);
      // stream.pipe(process.stdout);

      stream.on('finish', function () {
        fileWriter.end();
        console.log('Wrote to file');
        // callback(filePath);
      });
    });
    //
    // ss(socket).on('end', (stream, meta)=>{
    //   fileWriter.end();
    //   console.log('Wrote to file');
    //   callback(filePath);
    // })
  });
};

exports.default = StreamRecieve;