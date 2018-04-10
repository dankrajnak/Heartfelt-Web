'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BinarySend = function () {
  function BinarySend() {
    var _this = this;

    _classCallCheck(this, BinarySend);

    // this.socket = new WebSocket('ws://localhost:8080');
    // this.socket.binaryType = 'arraybuffer'
    this.open = false;
    this.stream = null;
    this.client = new BinaryClient('wss://heartfelt-installation.azurewebsites.net');

    this.client.on('open', function () {
      _this.open = true;
    });
  }

  _createClass(BinarySend, [{
    key: 'send',
    value: function send(data) {
      if (!this.stream && this.open) {
        this.stream = this.client.createStream();
      }
      this.stream.write(data);
    }
  }, {
    key: 'close',
    value: function close() {
      this.open = false;
      this.stream.end();
    }
  }]);

  return BinarySend;
}();