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
  var clients = [];

  io.on('connection', function (socket) {
    console.log('Binary Connection');

    socket.on('startAudio', function (from, msg) {
      console.log('startAudio');
      console.log('from', socket.id);
      clients.push(socket);
    });

    ss(socket).on('audioMessage', function (stream, meta) {
      console.log('stream');
      var deleteAudio = false;
      var filePath = Date.now() + '.wav';
      var writer = new wav.Writer({
        channels: 1,
        bitDepth: 16
      });

      messageService.stream(filePath, stream.pipe(writer)).then(function () {
        if (deleteAudio) messageService.delete(filePath).then(function () {
          console.log(filePath, 'deleted');
        });
      });

      socket.on('finishAudio', function () {
        writer.end();
        console.log('Wrote to file');
      });

      socket.on('deleteAudio', function () {
        console.log('marked for delete');
        deleteAudio = true;
      });
    });
  });

  io.on('disconnect', function (something) {
    console.log('DISCONNECT');
    console.log(something);
  });
};

exports.default = StreamRecieve;