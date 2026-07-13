const { CreateUser, GetAllUser, DeleteUser, LoginUser, GetUserById, UpdateUser, AdminLoginUser } = require('../Controller/UserController');
const express = require('express');
const router = express.Router();

router.post('/signup', CreateUser);
router.get('/all', GetAllUser);
router.get('/:id', GetUserById);
router.put('/:id', UpdateUser);
router.delete('/:id', DeleteUser);
router.post('/login', LoginUser);
router.post('/admin-login', AdminLoginUser);

module.exports = router;