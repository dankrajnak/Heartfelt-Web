'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}
var path = require('path');
var storage = require('azure-storage');

var MessageService = function () {
  function MessageService() {
    _classCallCheck(this, MessageService);

    this.blobService = storage.createBlobService();
    this.containerName = 'messages';
  }

  _createClass(MessageService, [{
    key: 'createContainer',
    value: function createContainer() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.blobService.createContainerIfNotExists(_this.containerName, { publicAccessLevel: 'blob' }, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              message: 'Container \'' + _this.containerName + '\' created'
            });
          }
        });
      });
    }
  }, {
    key: 'stream',
    value: function stream(name, _stream) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.blobService.createBlockBlobFromStream(_this2.containerName, name, _stream, 999999, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              message: 'Upload of \'' + name + '\' complete'
            });
          }
        });
      });
    }
  }, {
    key: 'upload',
    value: function upload(filePath) {
      var _this3 = this;

      var blobName = path.basename(filePath);
      return new Promise(function (resolve, reject) {
        _this3.blobService.createBlockBlobFromLocalFile(_this3.containerName, blobName, filePath, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              message: 'Upload of \'' + blobName + '\' complete'
            });
          }
        });
      });
    }
  }, {
    key: 'list',
    value: function list() {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        _this4.blobService.listBlobsSegmented(_this4.containerName, null, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve({
              message: 'Items in container \'' + _this4.containerName + '\':',
              data: data
            });
          }
        });
      });
    }
  }, {
    key: 'delete',
    value: function _delete(containerName, blobName) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        _this5.blobService.deleteBlobIfExists(containerName, blobName, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              message: 'Block blob \'' + blobName + '\' deleted'
            });
          }
        });
      });
    }
  }, {
    key: 'getUri',
    value: function getUri(blobName, permissions) {
      var connString = process.env.AzureWebJobsStorage;

      // Create a SAS token that expires in an hour
      // Set start time to five minutes ago to avoid clock skew.
      var startDate = new Date();
      startDate.setMinutes(startDate.getMinutes() - 5);
      var expiryDate = new Date(startDate);
      expiryDate.setMinutes(startDate.getMinutes() + 60);

      permissions = permissions || storage.BlobUtilities.SharedAccessPermissions.READ;

      var sharedAccessPolicy = {
        AccessPolicy: {
          Permissions: permissions,
          Start: startDate,
          Expiry: expiryDate
        }
      };

      var sasToken = this.blobService.generateSharedAccessSignature(this.containerName, blobName, sharedAccessPolicy, {
        contentType: 'audio/wav'
      });

      return {
        token: sasToken,
        uri: this.blobService.getUrl(this.containerName, blobName, sasToken, true)
      };
    }
  }, {
    key: 'deleteAll',
    value: function deleteAll() {
      list.then(function (res) {
        return data.forEach(message);
      });
    }
  }]);

  return MessageService;
}();

exports.default = MessageService;