'use strict';
const db = require('../models/index');
const User = db.user;
const fetch = require('node-fetch');
const { Op } = require('sequelize');
const imgDefault = require('../../../utils/items/item-img.js');
const EmailService = require('../../../utils/services/email.service');
const DataBaseService = require('../../../utils/services/database.service');
const PaginateService = require('../../../utils/services/paginate.service');
const crypto = require('crypto');

const { diver_admin } = require('../../../utils/config/roles.config');
// Control errors
const errorsGen = require('../../../utils/errors/general.error');
const errorsUser = require('../../../utils/errors/autorization.error');
const KeycloakServices = require('../../microservices/divergenti/keycloak.service');
const rolesConfig = require('../../../utils/config/roles.config');

// Inicializamos clases de microservicios
const emailService = new EmailService();
const dbService = new DataBaseService();
const paginateService = new PaginateService();
const keycloakService = new KeycloakServices();

module.exports = class UserService {
  /**
   * Crear User
   * @param {*} req
   * @param {*} res
   */
  async save(req, res) {
    try {
      const { user, email } = req.body;
      const data = {
        user,
        email,
      };
      const result = await dbService.create(User, data, 'Usuario');
      res
        .status(result.code)
        .send({ Usuario: result.data, message: result.message });
    } catch (error) {
      if (error.code) res.status(error.code).send(error.message);
      res.status(500).send(errorsGen.gen_internal);
    }
  }

  /**
   * Actualizar User
   * @param {*} req
   * @param {*} res
   */
  async update(req, res) {
    try {
      const { user, email } = req.body;
      const id = req.params.id;
      const findData = await User.findByPk(id);
      if (!findData) return res.status(400).send(errorsGen.gen_no_data);
      const where = { id };
      const data = {
        user,
        email,
      };
      const result = await dbService.update(User, data, where, 'Usuario');
      res.status(result.code).send({ message: result.message });
    } catch (error) {
      if (error.code) res.status(error.code).send(error.message);
      res.status(500).send(errorsGen.gen_internal);
    }
  }

  /**
   * Encontrar todos los Users
   * @param {*} req
   * @param {*} res
   * @param {*} where Opcional
   * @param {*} include Opcional
   */
  async findAll(req, res, where, include) {
    try {
      const paramsQuery = dbService.getParamsQuery(req.query);
      const list = await paginateService.paginate(
        User,
        paramsQuery.page,
        paramsQuery.limit,
        paramsQuery.search,
        paramsQuery.order,
        where,
        include
      );
      res.send(list);
    } catch (error) {
      return res.status(500).send(errorsGen.gen_no_fetch);
    }
  }

  /**
   * Encontrar User por id
   * @param {*} req
   * @param {*} res
   */

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
      User.findByPk(req.params.id).then((data) => {
      res.send(data);
    });
  }
  /**
   * Encontrar User por id
   * @param {*} req
   * @param {*} res
   */
  findByIdUser(req, res) {
    User.findByPk(req.params.id)
      .then((data) => {
        res.status(200).send(true);
      })
      .catch((err) => {
        res.status(400).send(errorsUser.user_id_invalid);
      });
  }
  /**
   * Encontrar User por id
   * @param {*} req
   * @param {*} res
   */
  async findUserById(userId) {
    const data = User.findByPk(userId);
    if (data) return data;
    else return 0;
  }

  /**
   * Borrar User
   * @param {*} req
   * @param {*} res
   */
  async delete(req, res) {
    try {
      const id = req.params.id;
      const where = { id };
      const result = await dbService.delete(User, where, 'Usuario');
      res.status(result.code).send({ message: result.message });
    } catch (error) {
      if (error.code) res.status(error.code).send(error.message);
      else res.status(500).send(errorsGen.gen_internal);
    }
  }

  async CreateUsers(req, res) {
    try {
      const tokenByKeycloak = await getToken();

      const { email, cedula } = req.body;
      let enabled = true;
      let emailVerified = false;

      const body = {
        username: cedula,
        enabled: enabled,
        emailVerified: emailVerified,
        email: email,
      };

      if (req.body.firstName) {
        body.firstName = req.body.firstName;
      }

      if (req.body.lastName) {
        body.lastName = req.body.lastName;
      }

      if (req.body.password) {
        let password = req.body.password;
        body.credentials = [
          {
            type: 'password',
            value: password,
            temporary: false,
          },
        ];
      }

      const resKeycloak = await fetch(process.env.KEYCLOAK_USERS, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenByKeycloak}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (resKeycloak.status != 201)
        res.status(500).send(errorsUser.user_exist);
      let url = resKeycloak.headers.get('location');
      var arreglo_datos = url.split('/');

      const idKeycloak = arreglo_datos[arreglo_datos.length - 1];
      if (idKeycloak) {
        //AÑADIR ROL

        const idRole = await fetch(
          process.env.KEYCLOAK_ROLE + rolesConfig.diver_talent,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${tokenByKeycloak}`,
            },
          }
        ).then((response) => response.json());

        const bodyrole = [
          {
            id: idRole.id,
            name: rolesConfig.diver_talent,
          },
        ];

        //Asignar a role to user

        await fetch(
          process.env.KEYCLOAK_USERS + idKeycloak + '/role-mappings/realm',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${tokenByKeycloak}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyrole),
          }
        );

        // Create user on database divergenti
        const usuarioCreado = User.create({
          id: idKeycloak,
          user: cedula,
          nombres: req.body.firstName,
          apellidos: req.body.lastName,
          role: rolesConfig.diver_talent,
          email: email,
        })
          .then((users) => {
            res.status(200).json({
              users: users,
              message:
                'Usuario registrado correctamente, verifique su email para que esta cuenta sea valida',
            });
          })
          .catch((err) => {
            res.send(err);
          });
      }
    } catch (error) {
      // return res.status(500).json({
      //     data: error.message
      // });
      console.log('Error', 'Error interno al procesar datos ');
    }
  }
  async updateUsers(req, res) {
    try {
      const id = req.params.id;
      const findData = await User.findByPk(id);
      if (!findData) return res.status(400).send(errorsGen.gen_no_data);
      const tokenByKeycloak = await getToken();
      const body = {};

      if (req.body.username) {
        body.firstName = req.body.username;
      }
      if (req.body.firstName) {
        body.firstName = req.body.firstName;
      }

      if (req.body.lastName) {
        body.lastName = req.body.lastName;
      }
      if (req.body.email) {
        body.lastName = req.body.email;
      }
      
      const resKeycloak = await fetch(process.env.KEYCLOAK_USERS + id, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${tokenByKeycloak}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (resKeycloak.status != 204)
        res.status(500).send(errorsUser.user_exist);

      // // Create user on database divergenti
      const where = { id };
      const data = {
          user: req.body.username,
          nombres: req.body.firstName,
          apellidos: req.body.lastName,
          email: req.body.email
      }
      const result = await dbService.update(User, data, where, 'Usuario');
      res.status(result.code).send({ message: result.message });
    } catch (error) {
      // return res.status(500).json({
      //     data: error.message
      // });
      console.log('Error', 'Error interno al procesar datos ');
    }
  }

  async createUserBySocial(req, res) {
    try {
      const { role, userId } = req.body;
      if (role != rolesConfig.diver_pyme && role != rolesConfig.diver_talent) {
        return res.status(400).send(errorsGen.gen_bad_request);
      }
      const userRoles = keycloakService.getUserIdRoles(req.headers);
      if (userRoles.userId != userId) {
        return res.status(400).send(errorsGen.gen_bad_request);
      }

      const result = await db.sequelize.transaction(async (t) => {
        const tokenByKeycloak = await getToken();

        //AÑADIR ROL
        const responseRole = await fetch(process.env.KEYCLOAK_ROLE + role, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tokenByKeycloak}`,
          },
        });
        const responseUser = await fetch(process.env.KEYCLOAK_USERS + userId, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tokenByKeycloak}`,
          },
        });
        if (responseRole.status != 200 && responseUser.status != 200) {
          res.status(400).send(errorsGen.gen_bad_request);
        }
        const roleData = await responseRole.json();
        const user = await responseUser.json();
        const bodyrole = [
          {
            id: roleData.id,
            name: role,
          },
        ];

        const data = {
          id: userId,
          user: user.username,
          role: role,
          email: user.email,
        };
        // Create user on database divergenti
        const resultCreate = await User.create(data, { transaction: t });

        // Asignar a role to user
        const resultRoleMapping = await fetch(
          process.env.KEYCLOAK_USERS + userId + '/role-mappings/realm',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${tokenByKeycloak}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyrole),
          }
        );
        if (
          resultRoleMapping.status != 200 &&
          resultRoleMapping.status != 204
        ) {
          res.status(500).send(errorsGen.gen_internal);
        }
        return resultCreate;
      });
      res.status(200).send({ user: result, message: 'Usuario registrado' });
    } catch (error) {
      console.log(error);
      return res.status(500).send(errorsGen.gen_internal);
    }
  }

  //====================================
  //Update Password
  //====================================
  async updatePassword(req, res) {
    try {
      const userNameOrEmail = req.params.idUser;
      let password = req.body.password;
      let confirmPassword = req.body.confirmPassword;

      const tokenByKeycloak = await getToken();

      if (password !== undefined && confirmPassword !== undefined) {
        let userPss = await User.findOne({
          where: {
            id: userNameOrEmail,
          },
          attributes: ['id'],
        });
        let userId2 = userPss.id;
        if (password === confirmPassword) {
          const body = {
            credentials: [
              {
                type: 'password',
                value: password,
                temporary: false,
              },
            ],
          };
          if (req.body.userid === false) {
            const user = await User.findOne({
              where: { id: userId2 },
            });
            userId2 = user.id;
          }

          const resKeycloak = await fetch(
            process.env.KEYCLOAK_USERS + userId2,
            {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${tokenByKeycloak}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            }
          );
          await res.status(200).send({
            message: 'Contraseña Actualizada Correctamente',
          });

          if (resKeycloak.status != 204) {
            const error = await resKeycloak.json();
            return res.status(resKeycloak.status).json(error);
          }
        } else {
          await res.status(400).send({
            message: 'Contraseña de confirmación incorrecta',
          });
        }
      } else {
        let userId;
        let userSearch = await User.findOne({
          where: {
            [Op.or]: [{ user: userNameOrEmail }, { email: userNameOrEmail }],
          },
          attributes: ['email', 'user', 'id'],
        });
        if (userSearch) {
          userId = userSearch.id;
          const resGet = await fetch(process.env.KEYCLOAK_USERS + userId, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${tokenByKeycloak}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
          const userKey = await resGet.json();
          const url = req.headers.referer;

          if (userKey) {
            let resetToken = await crypto.randomBytes(32).toString('hex');
            // const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));
            const link =
              url + 'auth/reset-password?token=' + resetToken + '&id=' + userId;
            const content =
              'Para continuar el proceso de cambio de contraseña, haga clic en el siguiente enlace: <br> ' +
              link;
            const send = await emailService.send(
              userKey.email,
              'Password Reset Request',
              content
            );
            console.log('send message', send);
            const mail1 = userKey.email.slice(0, 2);
            const mail2 = userKey.email.split('@')[1];
            const mail = mail1 + '*****@' + mail2;
            return res.status(200).json({
              message:
                'Se ha enviado un link para restablecer su contraseña al correo electrónico:',
              mail: mail,
            });
          } else {
            return res.status(400).json({
              message: 'ERROR',
              data: error.message,
            });
          }
        } else {
          return res.status(400).json({
            message: 'No existe el usuario o email ingresado',
          });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'ERROR',
        data: error.message,
      });
    }
  }
};

async function getToken() {
  const paramsByToken = new URLSearchParams();
  paramsByToken.append('grant_type', process.env.KEYCLOAK_GRANTYPE);
  paramsByToken.append('client_id', process.env.KEYCLOAK_CLIENTID);
  paramsByToken.append('client_secret', process.env.KEYCLOAK_CLIENTSECRET);

  const resToken = await fetch(process.env.TOKEN, {
    method: 'POST',
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
