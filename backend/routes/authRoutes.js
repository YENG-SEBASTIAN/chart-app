const express = require('express');
const router = express.Router();
const userController = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new user
 *     description: Register a new user in the system
 *     parameters:
 *       - name: username
 *         in: body
 *         description: Username of the new user
 *         required: true
 *         schema:
 *           type: string
 *       - name: email
 *         in: body
 *         description: Email of the new user
 *         required: true
 *         schema:
 *           type: string
 *       - name: password
 *         in: body
 *         description: Password of the new user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/users/register', userController.register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Login a user
 *     description: Login a user and return a JWT token
 *     parameters:
 *       - name: username
 *         in: body
 *         description: Username of the user
 *         required: true
 *         schema:
 *           type: string
 *       - name: password
 *         in: body
 *         description: Password of the user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Bad request
 */
router.post('/users/login', userController.login);

module.exports = router;
