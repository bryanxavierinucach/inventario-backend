'use strict';
const db = require('../models/index');
const Profile = db.profile;
const User = db.user;
const ProfileCategory = db.profileCategory;
const fetch = require('node-fetch');

const KeycloakService = require('../../microservices/divergenti/keycloak.service');
const keycloakService = new KeycloakService();
const DataBaseService = require('../../../utils/services/database.service');
const PaginateService = require('../../../utils/services/paginate.service');

// Control errors
const errorsGen = require('../../../utils/errors/general.error');
const errorsAutorization = require('../../../utils/errors/autorization.error');

// Inicializamos clases de microservicios 

const dbService = new DataBaseService();
const paginateService = new PaginateService();

module.exports = class ProfileService {


    /**
     * Crear profile
     * @param {*} req 
     * @param {*} res 
     */
    async save(req, res) {
        try {
            const { id, country, city, economicSector, linkedin, instagram, telephone, userId,
                summary, website, github } = req.body;
            const data = {
                id,
                country,
                city,
                economicSector,
                linkedin,
                instagram,
                telephone,
                userId,
                summary,
                website,
                github
            };

            const result = await dbService.create(Profile, data, 'Profile');
            res.status(result.code).send({ Profile: result.data, message: result.message });
        } catch (error) {
            console.log(error);
            if (error.code) res.status(error.code).send(error.message);
            console.log(error);
            res.status(500).send(errorsGen.gen_internal);
        }
    }
    /**
     * Crear profile con categoria
     * @param {*} req 
     * @param {*} res 
     */
    async saveProfileWithCategory(req, res) {
        try {
            let categoryProfile;
            const { Category } = req.body;
            const { country, city, economicSector, linkedin, instagram, telephone, userId,
                summary, website, github } = req.body;
            const data = {
                country,
                city,
                economicSector,
                linkedin,
                instagram,
                telephone,
                userId,
                summary,
                website,
                github
            };
            const result = await db.sequelize.transaction(async (t) => {
                const profileResult = await Profile.create(data, { transaction: t });
                for (let i = 0; i < Category.length; i++) {
                    const category = Category[i];
                    if (category.id == null) delete category['id'];
                    category.profileId = profileResult.id;
                    categoryProfile = await ProfileCategory.create(category, { transaction: t });
                }
            });
            if (categoryProfile)
                res.status(200).send({ message: 'Profile y category creado correctamente' });
        } catch (error) {
            console.log(error);
            if (error.code) res.status(error.code).send(error.message);
            console.log(error);
            res.status(500).send(errorsGen.gen_internal);
        }
    }


    /**
     * Actualizar Profile, user and categoria
     * @param {*} req
     * @param {*} res
     */
    async updateProfileWithCategory(req, res) {
        try {
            //USER
            const id = req.params.id;
            const findDataUser = await User.findByPk(id);
            if (!findDataUser) return res.status(400).send(errorsGen.gen_no_data);
            const findData = await Profile.findAll({
                where: {
                    userId: findDataUser.id
                }
            });
            const dataProfile = findData[0].dataValues;
            if (!findData) return res.status(400).send(errorsGen.gen_no_data);
            const tokenByKeycloak = await getToken();
            let categoryProfile;
            const { Category } = req.body;
            const { country, city, economicSector, linkedin, instagram, telephone, userId,
                summary, website, github } = req.body;
            const data = {
                country,
                city,
                economicSector,
                linkedin,
                instagram,
                telephone,
                userId,
                summary,
                website,
                github
            };
            const result = await db.sequelize.transaction(async (t) => {
                const profileResult = await Profile.create(data, { transaction: t });
                for (let i = 0; i < Category.length; i++) {
                    const category = Category[i];
                    if (category.id == null) delete category['id'];
                    category.profileId = profileResult.id;
                    categoryProfile = await ProfileCategory.create(category, { transaction: t });
                }
            });
            if (categoryProfile)
                res.status(200).send({ message: 'Profile y category creado correctamente' });
        } catch (error) {
            console.log(error);
            if (error.code) res.status(error.code).send(error.message);
            console.log(error);
            res.status(500).send(errorsGen.gen_internal);
        }
    }


    /**
     * Actualizar Profile
     * @param {*} req
     * @param {*} res
     */
    async updateUserWithProfile(req, res) {

        try {

            //USER
            const id = req.params.id;
            const findDataUser = await User.findByPk(id);
            if (!findDataUser) return res.status(400).send(errorsGen.gen_no_data);
            const findData = await Profile.findAll({
                where: {
                    userId: findDataUser.id
                }
            });
            const dataProfile = findData[0].dataValues;
            if (!findData) return res.status(400).send(errorsGen.gen_no_data);
            const tokenByKeycloak = await getToken();

            const { country, city, economicSector, linkedin, instagram, telephone, userId,
                summary, website, github } = req.body;
            const body = {};
            let base64data

            if (!req.files || Object.keys(req.files).length === 0) {
                base64data = req.body.avatar
            } else {

                let archivo_subido = req.files.avatar.data;
                base64data = archivo_subido.toString('base64');
            }


            if (req.body.firstName) {
                body.firstName = req.body.firstName;
            }

            if (req.body.lastName) {
                body.lastName = req.body.lastName;
            }
            if (req.body.walletAddress) {
                body.walletAddress = req.body.walletAddress;
            }
            const resKeycloak = await fetch(process.env.KEYCLOAK_USERS + id, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${tokenByKeycloak}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body),
            });
            if (resKeycloak.status != 204)
                res.status(500).send(errorsUser.user_exist);

            // Create user on database divergenti
            const where = { id };
            const whereProfile = { id: dataProfile.id };
            const data = {
                country,
                city,
                economicSector,
                linkedin,
                instagram,
                telephone,
                userId,
                summary,
                website,
                github
            };
            const dataUser = {
                avatar: base64data
            }
            const result = await dbService.update(Profile, data, whereProfile, 'Profile');
            const resultUser = await dbService.update(User, dataUser, where, 'Usuario');
            res.status(result.code).send({ message: result.message, message: resultUser.message });

        } catch (error) {
            // return res.status(500).json({
            //     data: error.message
            // });
            console.log('Error', 'Error interno al procesar datos ')
        }

    }

    /**
    * Encontrar todas las Profile
    * @param {*} req
    * @param {*} res
    * @param {*} where Opcional
    * @param {*} include Opcional
    */
    async findAll(req, res, where, include) {
        try {

            const paramsQuery = dbService.getParamsQuery(req.query);
            const list = await paginateService.paginate(Profile, paramsQuery.page, paramsQuery.limit,
                paramsQuery.search, paramsQuery.order, where, include);
            res.send(list);
        } catch (error) {
            console.log('Failed to fetch ', error);
            return res.status(500).send(errorsGen.gen_no_fetch);
        }
    }
    /**
    * Encontrar todas las Profile category
    * @param {*} req
    * @param {*} res
    * @param {*} where Opcional
    * @param {*} include Opcional
    */
    async findAllProfileCategory(req, res, where, include) {
        try {

            const paramsQuery = dbService.getParamsQuery(req.query);
            const list = await paginateService.paginate(ProfileCategory, paramsQuery.page, paramsQuery.limit,
                paramsQuery.search, paramsQuery.order, where, include);
            res.send(list);
        } catch (error) {
            console.log('Failed to fetch ', error);
            return res.status(500).send(errorsGen.gen_no_fetch);
        }
    }

    /**
   * Encontrar profile por id
   * @param {*} req
   * @param {*} res
   */
    findById(req, res) {
        Profile.findByPk(req.params.id).then(data => {
            res.status(200).send(data);
        }).catch(err => {
            res.status(400).send(errorsAutorization.user_id_invalid);
        });
    }

    /**
        * Borrar profile
        * @param {*} req
        * @param {*} res
        */
    async delete(req, res) {
        try {
            const id = req.params.id;
            const where = { id };
            const result = await dbService.delete(Profile, where, 'Profile');
            res.status(result.code).send({ message: result.message });
        } catch (error) {
            console.log(error);
            if (error.code) res.status(error.code).send(error.message);
            else res.status(500).send(errorsGen.gen_internal);
        }
    }
    /**
    * Encontrar Profile por id
    * @param {*} req 
    * @param {*} res 
    */
    findByIdUsuario(req, res) {
        Profile.findAll({
            where: {
                userId: req.params.id
            }
        }).then(data => {
            res.send(data);
        });
    }
    /**
      * Metodo Contar todos los profiles
      * @param {*} req 
      * @param {*} res 
      */
    async countProfiles(req, res) {
        try {
            const result = await Profile.count().then(c => {
                res.status(200).send({
                    profile: c
                })
            }).catch(err => {
                err
            })
        } catch (error) {
            console.log(error);
            if (error.code) res.status(error.code).send(error.message);
            else res.status(500).send(errorsGen.gen_internal);
        }
    }
    /** Metodo para obtener los paises
     * @params req
     * @params res
    */

    async listCountries(req, res) {
        try {
            const getCountries = await fetch(process.env.COUNTRIES, {
                method: 'GET'
            }).then(response => response.json())
            await res.status(200).send(getCountries)
        } catch (error) {
            return res.status(500).json({
                message: "ERROR",
                data: error.message
            });
        }

    }
}
async function getToken() {
    const paramsByToken = new URLSearchParams();
    paramsByToken.append("grant_type", process.env.KEYCLOAK_GRANTYPE);
    paramsByToken.append("client_id", process.env.KEYCLOAK_CLIENTID);
    paramsByToken.append("client_secret", process.env.KEYCLOAK_CLIENTSECRET);

    const resToken = await fetch(process.env.TOKEN, {
        method: "POST",
        body: paramsByToken,
    });

    if (resToken.status != 200) {
        const error = await resToken.json();
        throw Error({
            message: error,
        });
    }

    const dataToken = await resToken.json();
    return dataToken.access_token;
}