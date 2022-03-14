'use strict'
const errorsGen = require('../errors/general.error');
const ParamsQuery = require('./models/params-query');
const { Op } = require("sequelize");

module.exports = class DataBaseService {

    /**
     * Eliminar registro de una entidad
     * @param {*} entity Entidad
     * @param {object} where {id:id}
     * @param {string} entityShowName Nombre de la tabla (en español) para mostrar en mensaje de exito
     */
    delete(entity, where, entityShowName) {
        return new Promise((resolve, reject) => {
            entity.findOne({
                where: where
            }).then(data => {
                if (!data) reject({ code: 400, message: errorsGen.gen_no_data });
                data.destroy().then(result => {
                    resolve({ code: 200, message: entityShowName + ' eliminado correctamente' });
                }).catch(err => {
                    reject({ code: 500, message: errorsGen.gen_no_delete });
                });
            }).catch(err => {
                console.log(err);
                reject({ code: 500, message: errorsGen.gen_internal });
            });
        });
    }


    /**
     * Actualizar registro de una entidad
     * @param {*} entity Entidad
     * @param {object} data {field:value, field2:value}
     * @param {object} where {id:id}
     * @param {string} entityShowName Nombre de la tabla (en español) para mostrar en mensaje de exito
     */
    update(entity, data, where, entityShowName) {
        return new Promise((resolve, reject) => {
            entity.update(data, { where: where }).then(resCreate => {
                resolve({
                    code: 200,
                    message: entityShowName + ' actualizado correctamente'
                });
            }).catch(error => {
                console.log(error);
                reject({ code: 400, message: errorsGen.gen_no_update });
            });
        });
    }

    /**
     * Crear registro de una entidad
     * @param {*} entity Entidad
     * @param {object} data {field:value, field2:value}
     * @param {string} entityShowName Nombre de la tabla (en español) para mostrar en mensaje de exito
     */
    create(entity, data, entityShowName) {
        return new Promise((resolve, reject) => {
            entity.create(data).then(resCreate => {
                resolve({
                    code: 200,
                    data, resCreate,
                    message: entityShowName + ' creado correctamente'
                });
            }).catch(error => {
                console.log(error);
                reject({ code: 400, message: errorsGen.gen_no_create });
            });
        });
    }

    /**
     * Obtiene params para paginación, ordenar y buscar
     * @param {*} query 
     * @return {ParamsQuery} {page, limit, search, order}
     */
    getParamsQuery(query) {
        const { q, page, limit, orderBy, orderDirection } = query;
        let { field } = query;
        let search;
        let order = [];
        if (q && field) {
            const optField = field.split('.');
            if (optField.length > 1)
                field = `$${optField[0]}.${optField[1]}$`
            search = {
                where: {
                    [field]: {
                        [Op.like]: `%${q}%`
                    }
                },
            };
        }
        if (orderBy && orderDirection) {
            const optOrder = orderBy.split('.');
            if (optOrder.length > 1) order.push([optOrder[0], optOrder[1], orderDirection]);
            else order.push([orderBy, orderDirection]);
        }
        return new ParamsQuery(page, limit, search, order);
    }
}