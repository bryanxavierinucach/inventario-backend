'use strict'

const { Op } = require("sequelize");

module.exports = class PaginateService {

    /**
     * Paginación
     * @param {*} entity 
     * @param {*} pageSize 
     * @param {*} pageLimit 
     * @param {*} search 
     * @param {*} order 
     * @param {*} where Opcional
     * @param {*} include Opcional
     */

    paginate = async (entity, pageSize, pageLimit, search = {}, order = [], where, include) => {
        try {
            const limit = parseInt(pageLimit, 10) || 10;
            const page = parseInt(pageSize, 10) || 1;

            // create an options object
            let options = {
                distinct: true,
                offset: this.#getOffset(page, limit),
                limit: limit,
            };

            // check if the search object is empty

            if (Object.keys(search).length) {
                options = { ...search, ...options };
            }

            // check if the order array is empty
            if (order && order.length) {
                options['order'] = order;
            }
            if (where)
                if (Object.keys(search).length)
                    options.where = {
                        [Op.and]: {
                            ...options.where,
                            ...where
                        }
                    };
                else
                    options.where = where;
            if (include)
                options.include = include;
            // take in the entity, take in the options
            let { count, rows } = await entity.findAndCountAll(options);

            return {
                previousPage: this.#getPreviousPage(page),
                currentPage: page,
                nextPage: this.#getNextPage(page, limit, count),
                total: count,
                limit: limit,
                data: rows
            }
        } catch (error) {
            console.log(error);
            throw new Error('No fetch data');
        }
    }

    /**
     * 
     * @param {*} entity 
     * @param {*} pageSize 
     * @param {*} pageLimit 
     * @param {*} search 
     * @param {*} order 
     * @param {*} transform no requerido, sino se envia las propiedades son las mismas
     */
    paginateTransform = async (entity, pageSize, pageLimit, search = {}, order = [], transform) => {
        try {
            const limit = parseInt(pageLimit, 10) || 10;
            const page = parseInt(pageSize, 10) || 1;

            // create an options object
            let options = {
                distinct: true,
                offset: this.#getOffset(page, limit),
                limit: limit,
            };

            // check if the search object is empty

            if (Object.keys(search).length) {
                options = { ...search, ...options };
            }

            // check if the order array is empty
            if (order && order.length) {
                options['order'] = order;
            }

            // take in the entity, take in the options
            let { count, rows } = await entity.findAndCountAll(options);

            // check if the transform is a function and is not null, sino se envia transform los field son por defecto
            if (transform && typeof transform === 'function') {
                rows = transform(rows);
            }

            return {
                previousPage: this.#getPreviousPage(page),
                currentPage: page,
                nextPage: this.#getNextPage(page, limit, count),
                total: count,
                limit: limit,
                data: rows
            }
        } catch (error) {
            console.log(error);
            throw new Error('No fetch data');
        }
    }


    /**
     * Se obtiene las opciones para la paginación
     * @param {*} pageSize 
     * @param {*} pageLimit 
     * @param {*} search 
     * @param {*} order 
     */
    pageable = async (pageSize, pageLimit, search = {}, order = []) => {
        //console.log("page");

        const limit = parseInt(pageLimit, 10) || 10;
        const page = parseInt(pageSize, 10) || 1;

        // create an options object
        let options = {
            offset: this.#getOffset(page, limit),
            limit: limit,
        };

        // check if the search object is empty
        if (Object.keys(search).length) {
            options = { ...options, ...search };
        }

        // check if the order array is empty
        if (order && order.length) {
            options['order'] = order;
        }

        const pageOptions = {
            'options': options,
            'pageable': {
                'page': page,
                'limit': limit,
            }
        }

        return pageOptions;

    }

    findAndCountAll = async (entity, pageOptions, transform) => {

        try {

            // take in the entity, take in the options
            let { count, rows } = await entity.findAndCountAll(pageOptions.options);

            // check if the transform is a function and is not null
            if (transform && typeof transform === 'function') {
                rows = transform(rows);
            }

            return {
                previousPage: this.#getPreviousPage(pageOptions.pageable.page),
                currentPage: pageOptions.pageable.page,
                nextPage: this.#getNextPage(
                    pageOptions.pageable.page,
                    pageOptions.pageable.limit,
                    count
                ),
                total: count,
                limit: pageOptions.pageable.limit,
                data: rows
            }
        } catch (error) {
            console.log(error);
        }
    }

    #getOffset = (page, limit) => {
        return (page * limit) - limit;
    }

    #getNextPage = (page, limit, total) => {
        if ((total / limit) > page) {
            return page + 1;
        }
        return null
    }

    #getPreviousPage = (page) => {
        if (page <= 1) {
            return null
        }
        return page - 1;
    }
}