const express = require('express');
const app = new express();
const path = require('path');
const cors = require('cors')
const db = require('./store/index');
const swaggerjsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'eRent api',
            description: 'Gestion de inquilinosa api',
            contact: {
                name: 'Yamil Martinez'
            }
        }
    },
    apis: [
        'components/auth/index.js'
    ]
}

const swaggerDocs = swaggerjsdoc(swaggerOptions);

const authRoute = require('./components/auth/route');
const errors = require('./network/errors');

//db connection method
db.connect();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const pathFile = path.join(__dirname, 'dist' );
app.use(express.static(pathFile));

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/auth', authRoute);

app.use(errors);

module.exports = app;