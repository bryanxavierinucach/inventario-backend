'use strict';
const UserService = require('../services/user.service.js');
const userService = new UserService();
const KeycloakServices = require('../../microservices/divergenti/keycloak.service.js');
const keycloakService = new KeycloakServices();


/**
 * Crear User
 * @param {*} req 
 * @param {*} res 
 */
exports.save = (req, res) => {
    return userService.save(req, res);
}
/**
 * Buscar usuario
 * @param {*} req 
 * @param {*} res 
 */
exports.findUserById = (req, res) => {
    return userService.findByIdUser(req, res);
}
/**
 * Crear User db and keycloak
 * @param {*} req 
 * @param {*} res 
 */
exports.saveUser = (req, res) => {
    return userService.CreateUsers(req, res);
}

/**
 * Crear User db y agregar rol a keyloak, cuando se registra por redes sociales
 * @param {*} req 
 * @param {*} res 
 */
 exports.saveUserSocial = (req, res) => {
    return userService.createUserBySocial(req, res);
}

/**
 * Actualizar user
 * @param {*} req 
 * @param {*} res 
 */
exports.update = (req, res) => {
    return userService.update(req, res);
}
/**
 * Actualizar user
 * @param {*} req 
 * @param {*} res 
 */
exports.updateUsers = (req, res) => {
    return userService.updateUsers(req, res);
}

/**
 * Lista todos user
 * @param {*} req 
 * @param {*} res 
 */
exports.findAll = (req, res) => {
    return userService.findAll(req, res);
};

/**
 * Lista user por id
 * @param {*} req 
 * @param {*} res 
 */
exports.findById = (req, res) => {
    return userService.findById(req, res);
};


/**
 * Eliminar user
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = (req, res) => {
    return userService.delete(req, res);
}


/**
* Lista Respuesta encuentras por id User
* @param {*} req 
* @param {*} res 
*/
exports.findUserByProfile = (req, res) => {
    const where = { id: req.params.id };
    return userService.findAll(req, res, where);
};

/**
* Lista Respuesta usuarios keycloak
* @param {*} req 
* @param {*} res 
*/
exports.findUserKeycloak = async (req, res) => {
    return keycloakService.findUsersKeycloak(req, res);
}
/**
* Lista Respuesta usuarios keycloak
* @param {*} req 
* @param {*} res 
*/
exports.findUserKeycloakById = async (req, res) => {
    return keycloakService.findUsersKeycloakById(req, res);
}

/**
* Lista Respuesta usuarios keycloak por el rol
* @param {*} req 
* @param {*} res 
*/
exports.getUsersByRolOnlyKey = async (req, res) => {
    return keycloakService.getUsersByRolOnlyKey(req, res);
}

/**
* Obtiene user id y roles desde el header
* @param {*} req 
* @param {*} res 
*/
exports.getUserIdRol = async (req, res) => {
    return keycloakService.getUserIdRoles(req, res);
}

/**
* Reenvia el email de verifiación al usuario mediante el email
* @param {*} req 
* @param {*} res 
*/
exports.verifierEmail = async (req, res) => {
    return keycloakService.resendEmailVerifier(req, res);
}


/**
* Reenvia el email de verifiación al usuario mediante el email
* @param {*} req 
* @param {*} res 
*/
exports.getLinkedin = async (req, res) => {
    return keycloakService.getUserInfoById(req, res);
}

/**
* Cambiar contraseña
* @param {*} req 
* @param {*} res 
*/
exports.changePassword = async (req, res) => {
    return userService.updatePassword(req, res);
}




