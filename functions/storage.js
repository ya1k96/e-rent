let admin = require('firebase-admin');

const serviceAccount = require('../public/scripts/client.json');
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

module.exports = getBucket;