"use strict";
const db = require("../models/index");
const Talent = db.talent;
const TalentList = db.talentList;
const DataBaseService = require("./../../../utils/services/database.service");
const PaginateService = require("./../../../utils/services/paginate.service");

const errorsGen = require("../../../utils/errors/general.error");

const dbService = new DataBaseService();
const paginateService = new PaginateService();

module.exports = class TalentService {
  /**
   * Crear Talent
   * @param {*} req
   * @param {*} res
   */
  async save(req, res) {
    try {
      const { name, userId, talentId } = req.body;
      const data = {
        name,
        userId,
        talentId,
      };
      const result = await dbService.create(Talent, data, "Talento");
      res
        .status(result.code)
        .send({ Talento: result.data, message: result.message });
    } catch (error) {
      console.log(error);
      if (error.code) res.status(error.code).send(error.message);
      console.log(error);
      res.status(500).send(errorsGen.gen_internal);
    }
  }

  /**
   * Actualizar Talent
   * @param {*} req
   * @param {*} res
   */
  async update(req, res) {
    try {
      const { name, userId, talentId} = req.body;
      const id = req.params.id;
      const findData = await Talent.findByPk(id);
      if (!findData) return res.status(400).send(errorsGen.gen_no_data);
      const where = { id };
      const data = {
        name,
        userId,
        talentId
      };
      const result = await dbService.update(Talent, data, where, "Talento");
      res.status(result.code).send({ message: result.message });
    } catch (error) {
      console.log(error);
      if (error.code) res.status(error.code).send(error.message);
      res.status(500).send(errorsGen.gen_internal);
    }
  }

  /**
   * Encontrar todos los Intereses
   * @param {*} req
   * @param {*} res
   * @param {*} where Opcional
   * @param {*} include Opcional
   */
  async findAll(req, res, where, include) {
    try {
      const paramsQuery = dbService.getParamsQuery(req.query);
      const list = await paginateService.paginate(
        Talent,
        paramsQuery.page,
        paramsQuery.limit,
        paramsQuery.search,
        paramsQuery.order,
        where,
        include
      );
      res.send(list);
    } catch (error) {
      console.log("Failed to fetch ", error);
      return res.status(500).send(errorsGen.gen_no_fetch);
    }
  }
  /**
   * Encontrar todos los Intereses por el id del usuario
   * @param {*} req
   * @param {*} res
   * @param {*} where Opcional
   * @param {*} include Opcional
   */
  async findAllByIdUser(req, res) {
    try {
      const id = req.params.id;
      const list = await Talent.findAll({
        where: {
          userId: id,
        },
        include: TalentList
      });
      res.send(list);
    } catch (error) {
      console.log("Failed to fetch ", error);
      return res.status(500).send(errorsGen.gen_no_fetch);
    }
  }

  /**
   * Encontrar intereses
   * @param {*} req
   * @param {*} res
   */
   async findAllTalent(req, res) {
    try {
      // const interestList = await Interest.findAll()
      // for (let index = 0; index < interestList.length; index++) {
      //   const list = await InterestList.findAll();
      //   for (let j = 0; j < list.length; j++) {
      //     const elementA = list[j].dataValues;
      //     const elementB = interestList[index].dataValues;
      //     console.log('acsacas', elementA)
      //     console.log('acsadsdcsdcas', element)
      //   }
        
      // }
      const list = await TalentList.findAll({});
      res.send(list);
    } catch (error) {
      console.log("Failed to fetch ", error);
      return res.status(500).send(errorsGen.gen_no_fetch);
    }
  }

  /**
   * Encontrar interes por id
   * @param {*} req
   * @param {*} res
   */
  findById(req, res) {
    Talent.findByPk(req.params.id).then((data) => {
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
      const result = await dbService.delete(Talent, where, "Talento");
      res.status(result.code).send({ message: result.message });
    } catch (error) {
      console.log(error);
      if (error.code) res.status(error.code).send(error.message);
      else res.status(500).send(errorsGen.gen_internal);
    }
  }
};
