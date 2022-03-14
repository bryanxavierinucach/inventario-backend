'use strict';
const db = require('../models/index');
const Empleado = db.empleado;
const DataBaseService = require('./../../../utils/services/database.service');
const PaginateService = require('./../../../utils/services/paginate.service');
const { diver_admin } = require('../../../utils/config/roles.config');
const errorsGen = require('../../../utils/errors/general.error');

//Microservicio desde el keyloak control de roles
const KeycloakService = require('../../microservices/divergenti/keycloak.service');
const keycloakService = new KeycloakService();
const dbService = new DataBaseService();
const paginateService = new PaginateService();

module.exports = class EmpleadoService {
  /**
   * Crear empleado
   * @param {*} req
   * @param {*} res
   */
  async save(req, res) {
    try {
      // Verficar si existe el rol de admin
      const {
        userId,
        fechaNacimiento,
        domicilio,
        telefono,
        estadoVacunacion,
        tipoVacuna,
        fechaVacunacion,
        nroDocis,
      } = req.body;
      const data = {
        userId,
        fechaNacimiento,
        domicilio,
        telefono,
        estadoVacunacion,
        tipoVacuna,
        fechaVacunacion,
        nroDocis,
      };
      console.log(data);
      const result = await dbService.create(Empleado, data, 'Empleado');
      res
        .status(result.code)
        .send({ Empleado: result.data, message: result.message });
    } catch (error) {
      if (error.code) res.status(error.code).send(error.message);
      res.status(500).send(errorsGen.gen_internal);
    }
  }

  /**
   * Actualizar Interest
   * @param {*} req
   * @param {*} res
   */
  async update(req, res) {
    try {
      const {
        userId,
        fechaNacimiento,
        domicilio,
        telefono,
        estadoVacunacion,
        tipoVacuna,
        fechaVacunacion,
        nroDocis,
      } = req.body;
      const id = req.params.id;
      const findData = await Empleado.findByPk(id);
      if (!findData) return res.status(400).send(errorsGen.gen_no_data);
      const where = { id };
      const data = {
        userId,
        fechaNacimiento,
        domicilio,
        telefono,
        estadoVacunacion,
        tipoVacuna,
        fechaVacunacion,
        nroDocis,
      };
      const result = await dbService.update(Empleado, data, where, 'Empleado');
      res.status(result.code).send({ message: result.message });
    } catch (error) {
      if (error.code) res.status(error.code).send(error.message);
      res.status(500).send(errorsGen.gen_internal);
    }
  }

  /**
   * Encontrar todos los Empleados
   * @param {*} req
   * @param {*} res
   * @param {*} where Opcional
   * @param {*} include Opcional
   */
  async findAll(req, res, where, include) {
    try {
      const paramsQuery = dbService.getParamsQuery(req.query);
      const list = await paginateService.paginate(
        Empleado,
        paramsQuery.page,
        paramsQuery.limit,
        paramsQuery.search,
        paramsQuery.order,
        where,
        include
      );
      res.send(list);
    } catch (error) {
      console.log('Failed to fetch ', error);
      return res.status(500).send(errorsGen.gen_no_fetch);
    }
  }
  //   /**
  //    * Encontrar todos los Empleado por el id del usuario
  //    * @param {*} req
  //    * @param {*} res
  //    * @param {*} where Opcional
  //    * @param {*} include Opcional
  //    */
  //   async findAllByIdUser(req, res) {
  //     try {
  //       const id = req.params.id;
  //       const list = await Interest.findAll({
  //         where: {
  //           userId: id,
  //         },
  //         include: InterestList,
  //       });
  //       res.send(list);
  //     } catch (error) {
  //       console.log('Failed to fetch ', error);
  //       return res.status(500).send(errorsGen.gen_no_fetch);
  //     }
  //   }

  /**
   * Encontrar intereses
   * @param {*} req
   * @param {*} res
   */
  async findAllEmpleado(req, res) {
    try {
      // Verficar si existe el rol de admin
      const userRoles = keycloakService.getUserIdRoles(req.headers);
      if (!keycloakService.isExistRole(userRoles.roles, diver_admin))
        return res.status(401).send(errorsGen.gen_no_auth);
      const list = await Empleado.findAll({});
      res.send(list);
    } catch (error) {
      console.log('Failed to fetch ', error);
      return res.status(500).send(errorsGen.gen_no_fetch);
    }
  }

  /**
   * Encontrar interes por id
   * @param {*} req
   * @param {*} res
   */
  findById(req, res) {
    // Verficar si existe el rol de admin
    const userRoles = keycloakService.getUserIdRoles(req.headers);
    if (!keycloakService.isExistRole(userRoles.roles, diver_admin))
      return res.status(401).send(errorsGen.gen_no_auth);
    Empleado.findByPk(req.params.id).then((data) => {
      res.send(data);
    });
  }

  /**
   * Borrar interes
   * @param {*} req
   * @param {*} res
   */
  async delete(req, res) {
    try {
      const id = req.params.id;
      const where = { id };
      // Verficar si existe el rol de admin
      const userRoles = keycloakService.getUserIdRoles(req.headers);
      if (!keycloakService.isExistRole(userRoles.roles, diver_admin))
        return res.status(401).send(errorsGen.gen_no_auth);
      const result = await dbService.delete(Empleado, where, 'Empleado');
      res.status(result.code).send({ message: result.message });
    } catch (error) {
      console.log(error);
      if (error.code) res.status(error.code).send(error.message);
      else res.status(500).send(errorsGen.gen_internal);
    }
  }
};
