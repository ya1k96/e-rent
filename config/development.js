require('dotenv').config();

module.exports = {
    SECRET: process.env.SECRET,
    PORT: process.env.PORT || 3000,
    DBURL: process.env.DBURL,
    DBUSER: process.env.DBUSER,
    DBPASSWORD: process.env.DBPASSWORD,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN,
    PUBLIC_KEY: process.env.PUBLIC_KEY,
    PUBLICKEYPUSH: process.env.PUBLICKEYPUSH,
    PRIVATEKEYPUSH: process.env.PRIVATEKEYPUSH,
    apiKeyFire: process.env.apiKeyFire,
    authDomain: process.env.authDomain,
    databaseURLFire: process.env.databaseURLFire,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    privateKeyId: process.env.privateKeyId,
    clientId: process.env.clientId,
    clientEmail: process.env.clientEmail,
    SECRET: process.env.SECRET,
    MAIL: process.env.MAIL,
    PASSWORDMAIL: process.env.PASSWORDMAIL,
    PRODUCTION: process.env.PRODUCTION || false
}

