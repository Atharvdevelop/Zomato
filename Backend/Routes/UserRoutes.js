const { CreateUser, GetAllUser, DeleteUser, LoginUser } = require('../Controller/UserController');
const express = require('express');
const router = express.Router();

router.post('/signup', CreateUser);
router.get('/all', GetAllUser);
router.delete('/:id', DeleteUser);
router.post('/login', LoginUser);

module.exports = router;