import { container } from '@common/ioc/inversify.config';
import { withAccessAuth } from '@modules/user/application/utils/authUtils';
import { Router } from 'express';
import UserController from '../controllers/UserController';
import { createUserValidation } from '../validations/userValidations';

const userRouter = Router();
const userController = container.resolve(UserController);

/**
 * @openapi
 * /user:
 *   get:
 *     tags:
 *       - user
 *     summary: Retorna todos os usuários.
 *     description: Esse endpoint é responsável por retornar uma lista de todos os usuários com paginação.
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/perPageParam'
 *       - $ref: '#/components/parameters/orderByParam'
 *     responses:
 *       200:
 *         description: A requisição foi bem sucedida.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginationInfo'
 *                 - type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
userRouter.get('/', withAccessAuth, userController.getAll.bind(userController));

/**
 * @openapi
 * /user:
 *   post:
 *     tags:
 *       - user
 *     summary: Cria um novo usuário.
 *     description: Esse endpoint é responsável por criar um novo usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       204:
 *         $ref: '#/components/responses/NoContent'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         description: Contratante informado não encontrado.
 *       409:
 *         description: Já existe um usuário com o email informado.
 */
userRouter.post('/', withAccessAuth, createUserValidation, userController.create.bind(userController));

/**
 * @openapi
 * /user/{userId}:
 *   get:
 *     tags:
 *       - user
 *     summary: Retorna um usuário pelo ID.
 *     description: Esse endpoint é responsável por retornar um usuário pelo ID específico.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: O ID do usuário.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A requisição foi bem sucedida.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
userRouter.get('/:id', withAccessAuth, userController.getById.bind(userController));

/**
 * @openapi
 * /user/{userId}:
 *   put:
 *     tags:
 *       - user
 *     summary: Atualiza um usuário pelo ID.
 *     description: Esse endpoint é responsável por atualizar um usuário pelo ID específico.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: O ID do usuário.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       204:
 *         $ref: '#/components/responses/NoContent'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         description: Usuário ou contratante não encontrado.
 */
userRouter.put('/:id', withAccessAuth, userController.update.bind(userController));

/**
 * @openapi
 * /user/{userId}:
 *   delete:
 *     tags:
 *       - user
 *     summary: Deleta um usuário pelo ID.
 *     description: Esse endpoint é responsável por deletar um usuário pelo ID específico.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: O ID do usuário.
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         $ref: '#/components/responses/NoContent'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         description: Usuário não encontrado.
 */
userRouter.delete('/:id', withAccessAuth, userController.delete.bind(userController));

export default userRouter;
