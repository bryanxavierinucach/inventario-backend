const EmpleadoService = require('../services/empleado.service.js');
const db = require('../../autorization/models/index');
const empleadoService = new EmpleadoService();
const user = db.user;

/**
 * Crear empleado
 * @param {*} req 
 * @param {*} res 
 */
exports.save = (req, res) => {
    return empleadoService.save(req, res);
}

/**
 * Actualizar empleado
 * @param {*} req 
 * @param {*} res 
 */
exports.update = (req, res) => {
    return empleadoService.update(req, res);
}

/**
 * Lista todos empleado
 * @param {*} req 
 * @param {*} res 
 */
exports.findAll = (req, res) => {
    return empleadoService.findAll(req, res);
};
/**
 * Lista todos empleado preasignados
 * @param {*} req 
 * @param {*} res 
 */
exports.findAllempleadot = (req, res) => {
    return empleadoService.findAllEmpleado(req, res);
};

/**
 * Lista empleado por id
 * @param {*} req 
 * @param {*} res 
 */
exports.findById = (req, res) => {
    return empleadoService.findById(req, res);
};


/**
 * Eliminar empleado
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = (req, res) => {
    return empleadoService.delete(req, res);
}
/**
* Lista Respuesta profile por id User
* @param {*} req
* @param {*} res
*/
exports.findEmpleadoByIdUser = (req, res) => {
    const where = { userId: req.params.id };
    const include = [
        {
            model: user,
            required: true
        }
    ];
    return empleadoService.findAll(req, res, where, include);
};