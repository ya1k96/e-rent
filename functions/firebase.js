require('dotenv').config();
var firebase = require('firebase');

const config = {
    apiKey: process.env.apiKeyFire,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURLFire,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId,
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

module.exports = firebase;