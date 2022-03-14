'use strict';
require("dotenv").config();
//const morgan = require('morgan');
const express = require('express');
const fileUpload = require('express-fileupload')
let cors = require('cors')
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const oauth = require('./src/middleware/oauth');

const app = express();
let router = express.Router();
app.use(cors());
app.options('*', cors());

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
app.use(express.json({ limit: '50mb', extended: true }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use('/api', oauth);
app.use(fileUpload());
//app.use(morgan('dev'));
app.use('/', router);

// Routes of usuarios
require('./src/modules/autorization/routes/user.routes.js')(app);
require('./src/modules/autorization/routes/empleado.routes.js')(app);
require('./src/modules/autorization/routes/oauth.routes.js')(app);


//Route keycloak

require('./src/modules/microservices/divergenti/keycloak.routes.js')(app);


const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "MICROSERVICE - INVENTARIO",
            version: "1.0.0",
            description:
                "Documentación de servicios REST",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
                oauth2: {
                    type: 'oauth2',
                    flows: {
                        password: {
                            tokenUrl: process.env.TOKEN
                        }
                    }
                },
            },

        }, security: [{
            bearerAuth: [],
            oauth2: []
        }]
    },
    apis: [
        './src/modules/autorization/routes/*.js',
        './src/modules/autorization/swagger/*.yml',
    ],
};
const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: false })
);


const PORT = process.env.PORT || 3005;

app.listen(PORT, () => console.log('Server working on port : ' + PORT + '\x1b[32m%s\x1b[0m', ' Online'))
