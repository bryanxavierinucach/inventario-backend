'use strict'
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

module.exports = class KeycloakServices {

    /**
    * Obtener todos los usuarios por rol
    * @param {*} req 
    * @param {*} res 
    */
    getUsersByRolOnlyKey = async (req, res) => {
        try {
            const tokenByKeycloak = await getToken();

            const { first, max } = req.query;
            let roleName = req.params.roleName;
            let path = process.env.KEYCLOAK_ROLE + roleName + '/users?';
            if (first && max) {
                path += 'first=' + first + '&max=' + max;
            }

            const resKeycloak = await fetch(path, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${tokenByKeycloak}`,
                }
            }).then(response => response.json())

            res.status(200).send(resKeycloak)

        } catch (error) {
            return res.status(500).json({
                message: "ERROR",
                data: error.message
            });
        }
    }

    /**
     * Obtiene user id y roles desde el header
     * @param {*} headers 
     * @return {object} {userId, roles} o null cuando el token esta incorrecto
     */
    getUserIdRoles(headers) {
        const authHeader = headers.authorization;
        if (!authHeader) return null;
        let token = authHeader.replace('Bearer', '').trim();
        if (!token) return null
        token = jwt.decode(token);
        const userId = token.sub;
        const roles = token.realm_access.roles;
        if (!userId && !roles) return null;
        return { userId, roles };
    }

    /**
     * Verificar si existe rol
     * @param {Array} roles Lista de roles
     * @param {string} role Rol a verificar
     * @return {boolean} true si existe, false no existe
     */
    isExistRole(roles, role) {
        const roleFind = roles.find(element => element == role);
        if (roleFind) return true;
        else return false;
    }


    /**
    * Consultar usuarios del keyloak
    * @param {*} req 
    * @param {*} res 
    */
    async findUsersKeycloakById(req, res) {
        try {
            const id = req.params.id;
            const {
                headers
            } = req;
            const tokenByKeycloak = await getToken();

            const obtenetUsuarios = await fetch(process.env.KEYCLOAK_USERS + id, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${tokenByKeycloak}`,
                }
            }).then(response => response.json())
            await res.status(200).send(obtenetUsuarios)

        } catch (error) {
            return res.status(500).json({
                message: "ERROR",
                data: error.message
            });
        }
    }
    /**
    * Consultar usuarios del keyloak
    * @param {*} req 
    * @param {*} res 
    */
    async findUsersKeycloak(req, res) {
        try {

            const {
                headers
            } = req;
            const tokenByKeycloak = await getToken();

            const obtenetUsuarios = await fetch(process.env.KEYCLOAK_USERS, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${tokenByKeycloak}`,
                }
            }).then(response => response.json())
            await res.status(200).send(obtenetUsuarios)

        } catch (error) {
            return res.status(500).json({
                message: "ERROR",
                data: error.message
            });
        }
    }
    /**
    * Consultar resend verify email del keyloak
    * @param {*} req 
    * @param {*} res 
    */
    async resendEmailVerifier(req, res) {
        try {
            const email = req.params.email;
            const {
                headers
            } = req;
            const tokenByKeycloak = await getToken();

            const responseUser = await fetch(process.env.KEYCLOAK_USERS + '?email=' + email, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${tokenByKeycloak}`,
                }
            }).then(response => response.json());
            if (responseUser && responseUser.length > 0) {
                const idUser = responseUser[0].id
                const emailVerificador = await fetch(process.env.KEYCLOAK_USERS + idUser + '/send-verify-email', {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${tokenByKeycloak}`,
                    }
                });

                return res.status(200).json({
                    message: 'Sí el email existe se envía un email'
                })
            } else {
                return res.status(200).json({
                    message: 'Si el email existe se envía un email',
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "ERROR",
                data: error.message
            });
        }
    }

    /**
    * Consultar grupos de talentos del keyloak
    * @param {*} req 
    * @param {*} res 
    */
    async findGroupsKeycloak(req, res) {
        try {

            const {
                headers
            } = req;
            const tokenByKeycloak = await getToken();

            const obtenetUsuarios = await fetch(process.env.KEYCLOAK_GROUPS_TALENT, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${tokenByKeycloak}`,
                }
            }).then(response => response.json())
            await res.status(200).send(obtenetUsuarios)

        } catch (error) {
            return res.status(500).json({
                message: "ERROR",
                data: error.message
            });
        }
    }
    /**
    * Consultar grupos de sector económico del keyloak
    * @param {*} req 
    * @param {*} res 
    */
    async findSectorEconomicoKeycloak(req, res) {
        try {

            const {
                headers
            } = req;
            const tokenByKeycloak = await getToken();

            const obtenetUsuarios = await fetch(process.env.KEYCLOAK_GROUPS_PYME, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${tokenByKeycloak}`,
                }
            }).then(response => response.json())
            await res.status(200).send(obtenetUsuarios)

        } catch (error) {
            return res.status(500).json({
                message: "ERROR",
                data: error.message
            });
        }
    }
    /**
    * Consultar el talento por el id del grupo del keyloak
    * @param {*} req 
    * @param {*} res 
    */
    async findByTalent(req, res) {
        try {
            const id = req.params.id
            const {
                headers
            } = req;
            const tokenByKeycloak = await getToken();

            const obtenetUsuarios = await fetch(process.env.KEYCLOAK_GROUPS + id, {
                method: 'GET',
                attributes: 'id, name',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${tokenByKeycloak}`,
                }
            }).then(response => response.json())
            await res.status(200).send(obtenetUsuarios)

        } catch (error) {
            return res.status(500).json({
                message: "ERROR",
                data: error.message
            });
        }
    }

    /**
    * Consultar el talento por el id del grupo del keyloak
    * @param {*} req 
    * @param {*} res 
    */
    async findByTalentNombre(req, res) {
        try {
            const name = req.params.name
            const {
                headers
            } = req;
            const tokenByKeycloak = await getToken();

            const obtenetUsuarios = await fetch(process.env.KEYCLOAK_GROUPS_TALENT, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${tokenByKeycloak}`,
                }
            }).then(response => response.json())
            const talento = obtenetUsuarios.subGroups

            console.log(talento);
            let options = [];
            for (let t = 0; t < talento.length; t++) {
                const talent = talento[t];

                if (talent.name === name)
                    options.push({ talentos: talent.name });
            }
            await res.status(200).send(options)
            console.log(options);
        } catch (error) {
            return res.status(500).json({
                message: "ERROR",
                data: error.message
            });
        }
    }
    /**
    * Consultar usuarios por el correo o usuario
    * @param {*} req
    * @param {*} res
    */
    async getUserInfoById(req, res) {
        try {
            const tokenByKeycloak = await getToken();

            if (req.user) {
                const name = req.user.name.givenName;
                const family = req.user.name.familyName;
                const photo = req.user.photos[0].value;
                const email = req.user.emails[0].value;
                res.send({
                    name,
                    family,
                    photo,
                    email
                }).then()
            } else {
                res.send(`<center style="font-size:160%"> <p>This is Home Page </p>
            <p>User is not Logged In</p>
            <img style="cursor:pointer;"  onclick="window.location='/auth/linkedIn'" src="http://www.bkpandey.com/wp-content/uploads/2017/09/linkedinlogin.png"/>
            </center>`);
            }

            const obtenetUsuarios = await fetch(process.env.KEYCLOAK_USERS_EMAIL = email, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${tokenByKeycloak}`,
                }
            }).then(response => response.json())
            const user = obtenetUsuarios

            console.log(user);
            await res.status(200).send(user)
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