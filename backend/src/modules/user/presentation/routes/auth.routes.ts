import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { withRefreshAuth } from '@modules/user/application/utils/authUtils';
import { container } from '@common/ioc/inversify.config';

const authRouter = Router();
const authController = container.resolve(AuthController);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - auth
 *     summary: Autentica um usuário.
 *     description: Esse endpoint é responsável por autenticar um usuário.
 *     security: []
 *     requestBody:
 *       required: true
 *       description: Um objeto JSON contendo o email e senha do usuário a ser autenticado.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: O email do usuário.
 *               password:
 *                 type: string
 *                 description: A senha do usuário.
 *     responses:
 *       200:
 *         description: A requisição foi bem sucedida.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: O token de autenticação.
 *         headers:
 *           Cookie:
 *             description: O refreshToken utilizado para renovar o accessToken.
 *             schema:
 *               type: string
 *               example: 'softica-refresh-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Usuário não encontrado.
 */
authRouter.post('/login', authController.login.bind(authController));

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags:
 *       - auth
 *     summary: Renova o accessToken.
 *     description: >
 *       Esse endpoint é responsável por renovar o accessToken do usuário e enviar um novo refreshToken ao client. <br/>
 *       **Observação** O client deve ter um refreshToken válido obtido no endpoint <b>/auth/login<b/>.
 *     security: []
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         required: true
 *         description: O refreshToken do usuário.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         allOf:
 *           - $ref: '#/components/responses/NoContent'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: O novo token de autenticação.
 *         headers:
 *           Cookie:
 *             description: O novo refresh token.
 *             schema:
 *               type: string
 *               example: 'softica-refresh-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: Não autorizado. O refreshToken enviado como cookie é inválido ou não foi encontrado.
 *       404:
 *         description: Usuário não encontrado.
 */
authRouter.post('/refresh', withRefreshAuth, authController.refresh.bind(authController));

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - auth
 *     summary: Expira a autenticação do usuário.
 *     description: >
 *       Esse endpoint é responsável por deslogar o usuário, invalidando o refreshToken.
 *     security: []
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         required: true
 *         description: O refreshToken do usuário.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         $ref: '#/components/responses/NoContent'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: Não autorizado. O refreshToken enviado como cookie é inválido ou não foi encontrado.
 *       404:
 *         description: Usuário não encontrado.
 */
authRouter.post('/logout', withRefreshAuth, authController.logout.bind(authController));

export default authRouter;
