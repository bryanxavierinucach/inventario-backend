'use strict';
const KeycloakServices = require('./keycloak.service');
const keycloakService = new KeycloakServices();

/**
 * Lista todos los grupos del keycloak
 * @param {*} req 
 * @param {*} res 
 */
exports.findAllGroup = (req, res) => {
    return keycloakService.findGroupsKeycloak(req, res);
};
/**
 * Lista todos los grupos de sectores economigos del keycloak
 * @param {*} req 
 * @param {*} res 
 */
exports.findAllEconomicSector = (req, res) => {
    return keycloakService.findSectorEconomicoKeycloak(req, res);
};
/**
 * Obtener el talento por su id del grupo keycloak
 * @param {*} req 
 * @param {*} res 
 */
exports.findByTalent = (req, res) => {
    return keycloakService.findByTalent(req, res);
};
/**
 * Obtener el talento por su name del grupo keycloak
 * @param {*} req 
 * @param {*} res 
 */
exports.findByTalentName = (req, res) => {
    return keycloakService.findByTalentNombre(req, res);
};


