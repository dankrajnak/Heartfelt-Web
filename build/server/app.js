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

var streamRecieve = new _streamRecieve2.default(9001, sendMessage);

app.use(_express2.default.static(_path2.default.join(__dirname, '../public')));

app.set('view engine', 'ejs');
app.set('views', _path2.default.join(__dirname, '../views'));

//Get root
app.get('/', function (req, res) {
  messageService.createContainer().then(function () {
    messageService.list().then(function (lis) {
      var messages = lis.data.entries.map(function (entry) {
        return {
          name: entry.name,
          link: messageService.getUri(entry.name).uri
        };
      });
      res.render('index', { messages: messages });
    });
  });
});

exports.default = app;