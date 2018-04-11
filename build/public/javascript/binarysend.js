'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var io = require('socket.io-client');
var ss = require('socket.io-stream');
var Readable = require('stream').Readable;

var BinarySend = function () {
  function BinarySend() {
    var _this = this;

    _classCallCheck(this, BinarySend);

    // this.socket = new WebSocket('ws://localhost:8080');
    // this.socket.binaryType = 'arraybuffer'
    this.sending = false;
    this.socket = io.connect('localhost:8080');
    this.stream = ss.createStream({ objectMode: true });
    this.audioStream = new Readable({ objectMode: true });
    this.buffer = [];
    // OK.  So, this may be a reaaally dumb way to do this, but uhh, it's late,
    // and I need this to work. The basic problem is that each time _read is called,
    // it needs to push something into the stream.  Sometimes the audio isn't sampled
    // fast enough and the buffer is empty.  So, if it's empty, we'll just wait a little bit.
    this.audioStream._read = function () {
      var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'does not matter';

      if (_this.sending || _this.buffer.length > 0) {
        console.log(_this.buffer.length);
        if (_this.buffer.length > 0) {
          setTimeout(function () {
            return _this.audioStream.push(_this.buffer.pop());
          }, 10);
        } else {
          setTimeout(function () {
            return _this.audioStream._read();
          }, 10);
        }
      }
    };
  }

  _createClass(BinarySend, [{
    key: 'send',
    value: function send(data) {
      this.buffer.unshift(data);
      if (!this.sending) {
        this.sending = true;
        ss(this.socket).emit('audioMessage', this.stream);
        this.audioStream.pipe(this.stream);
      }
    }
  }, {
    key: 'close',
    value: function close() {
      this.sending = false;
      console.log('CLOSED');
      this.buffer.unshift(null);
      this.stream.end();
      console.log('END');
    }
  }]);

  return BinarySend;
}();

exports.default = BinarySend;