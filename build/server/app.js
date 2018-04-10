'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _getMessages = require('../services/getMessages');

var _getMessages2 = _interopRequireDefault(_getMessages);

var _streamRecieve = require('../services/streamRecieve');

var _streamRecieve2 = _interopRequireDefault(_streamRecieve);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var messageService = new _getMessages2.default();

var sendMessage = function sendMessage(filePath) {
  messageService.upload(filePath);
};

var port = process.env.PORT || 9001;

var streamRecieve = new _streamRecieve2.default(port, sendMessage);

app.use(_express2.default.static(_path2.default.join(__dirname, '../public')));

app.set('view engine', 'ejs');
app.set('views', _path2.default.join(__dirname, '../views'));

//Get root
app.get('/', function (req, res) {

  messageService.createContainer().then(function () {
    messageService.list().then(function (lis) {
      // Message names are stored as the number of miliseconds since January 1st, 1970
      // to when the message was created.  We can this to sort them based
      // on their creation time.
      lis.data.entries.sort(function (a, b) {
        return parseInt(b.name.slice(0, -4)) - parseInt(a.name.slice(0, -4));
      });
      var messages = lis.data.entries.map(function (entry, index) {
        return {
          name: 'Message ' + (lis.data.entries.length - index),
          link: messageService.getUri(entry.name).uri
        };
      });
      res.render('index', { messages: messages });
    });
  });
});

//Get record
app.get('/record', function (req, res) {
  res.render('record');
});

exports.default = app;