const swaggerjsdoc = require('swagger-jsdoc');
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'eRent api',
            description: 'Control y gestion de inquilinos',
            contact: {
                name: 'Yamil Martinez'
            }
        }
    },
    apis: [
        './components/auth/route.js'
    ]
}

const swaggerDocs = swaggerjsdoc(swaggerOptions);

module.exports = {
    serve: swaggerUi.serve, 
    setup: swaggerUi.setup(swaggerDocs)
};