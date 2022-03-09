'use strict';
const db = require('../../autorization/models/index');
const user = db.user;


const ProfileService = require('../services/profile.service');
const profileService = new ProfileService();

/**
 * Crear profile
 * @param {*} req
 * @param {*} res
 */
exports.save = (req, res) => {
    return profileService.save(req, res);
}

/**
 * Actualizar profile
 * @param {*} req
 * @param {*} res
 */
exports.update = (req, res) => {
    return profileService.update(req, res);
}
/**
 * Actualizar profile
 * @param {*} req
 * @param {*} res
 */
exports.updateProfileAndUser = (req, res) => {
    return profileService.updateUserWithProfile(req, res);
}

/**
 * Lista todos profile
 * @param {*} req
 * @param {*} res
 */
exports.findAll = (req, res) => {
    return profileService.findAll(req, res);
};

/**
 * Lista profile por id
 * @param {*} req
 * @param {*} res
 */
exports.findById = (req, res) => {
    return profileService.findById(req, res);
};


/**
 * Eliminar profile
 * @param {*} req
 * @param {*} res
 */
exports.delete = (req, res) => {
    return profileService.delete(req, res);
}

/**
* Lista Respuesta profile por id User
* @param {*} req
* @param {*} res
*/
exports.findProfileByIdUser = (req, res) => {
    const where = { userId: req.params.id };
    const include = [
        {
            model: user,
            required: true
        }
    ];
    return profileService.findAll(req, res, where, include);
};


/**
 * Lista contar todos los paises
 * @param {*} req
 * @param {*} res
 */
exports.findAllCountries = (req, res) => {
    return profileService.listCountries(req, res);
};

/**
 * Lista profile por id user
 * @param {*} req
 * @param {*} res
 */
exports.findByIdUser = (req, res) => {
    return profileService.findByIdUsuario(req, res);
};
/**
 * Contar profiles
 * @param {*} req
 * @param {*} res
 */
exports.countProfiles = (req, res) => {
    return profileService.countProfiles(req, res);
}