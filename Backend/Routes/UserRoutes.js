const { CreateUser, GetAllUser, DeleteUser, LoginUser, GetUserById, UpdateUser } = require('../Controller/UserController');
const express = require('express');
const router = express.Router();

router.post('/signup', CreateUser);
router.get('/all', GetAllUser);
router.get('/:id', GetUserById);
router.put('/:id', UpdateUser);
router.delete('/:id', DeleteUser);
router.post('/login', LoginUser);

module.exports = router;