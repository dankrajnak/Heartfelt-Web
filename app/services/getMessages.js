if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}
const path = require('path');
const storage = require('azure-storage');


export default class MessageService {
  constructor() {
    this.blobService = storage.createBlobService();
    this.containerName = 'messages';
  }

  createContainer() {
    return new Promise((resolve, reject) => {
      this.blobService.createContainerIfNotExists(this.containerName, { publicAccessLevel: 'blob' }, err => {
        if (err) {
          reject(err);
        } else {
          resolve({
            message: `Container '${this.containerName}' created`
          });
        }
      });
    });
  }

  stream(name, stream){
    return new Promise((resolve, reject) =>{
      this.blobService.createBlockBlobFromStream(this.containerName, name, stream, 999999, err => {
        if (err) {
          reject(err);
        } else {
          resolve({
            message: `Upload of '${name}' complete`
          });
        }
      });
    });
  }

  upload(filePath) {
    const blobName = path.basename(filePath);
    return new Promise((resolve, reject) => {
      this.blobService.createBlockBlobFromLocalFile(this.containerName, blobName, filePath, err => {
        if (err) {
          reject(err);
        } else {
          resolve({
            message: `Upload of '${blobName}' complete`
          });
        }
      });
    });
  }

  list() {
    return new Promise((resolve, reject) => {
      this.blobService.listBlobsSegmented(this.containerName, null, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            message: `Items in container '${this.containerName}':`,
            data: data
          });
        }
      });
    });
  };

  delete(containerName, blobName) {
    return new Promise((resolve, reject) => {
      this.blobService.deleteBlobIfExists(containerName, blobName, err => {
        if (err) {
          reject(err);
        } else {
          resolve({
            message: `Block blob '${blobName}' deleted`
          });
        }
      });
    });
  }

  getUri(blobName, permissions){
    let connString = process.env.AzureWebJobsStorage;

    // Create a SAS token that expires in an hour
    // Set start time to five minutes ago to avoid clock skew.
    let startDate = new Date();
    startDate.setMinutes(startDate.getMinutes() - 5);
    let expiryDate = new Date(startDate);
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

  deleteAll() {
    list.then(res => data.forEach((message)))
  }


}
