let admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = require('../public/scripts/client.json');
serviceAccount.project_id = process.env.projectId;
serviceAccount.private_key_id = process.env.privateKeyId;
serviceAccount.client_email = process.env.clientEmail;
serviceAccount.client_id = process.env.clientId;

admin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let storage = admin.storage();

function getBucket(){
    return new Promise(resolve => {
        if(this.admin) {
          setStorage();
        }
        ;
        resolve(storage.bucket('gs://e-rent-16ae4.appspot.com'));
    })
  
}

function setStorage(){
    this.admin = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    this.storage = admin.storage();
}

module.exports = {getBucket, admin};