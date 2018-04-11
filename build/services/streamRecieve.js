'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getMessages = require('../services/getMessages');

var _getMessages2 = _interopRequireDefault(_getMessages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var wav = require('wav');
var ss = require('socket.io-stream');

var StreamRecieve = function StreamRecieve(httpServer) {
  _classCallCheck(this, StreamRecieve);

  var messageService = new _getMessages2.default();

  var io = require('socket.io')(httpServer);

  io.on('connection', function (socket) {
    console.log('Binary Connection');

    ss(socket).on('audioMessage', function (stream, meta) {
      console.log('stream');
      var filePath = Date.now() + '.wav';
      var writer = new wav.Writer({
        channels: 1,
        bitDepth: 16
      });

      messageService.stream(filePath, stream.pipe(writer));

      stream.on('finish', function () {
        writer.end();
        console.log('Wrote to file');
      });
    });
  });
};

exports.default = StreamRecieve;