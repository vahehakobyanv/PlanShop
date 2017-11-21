const express = require('express');
const UsersRouter = express.Router();

const UsersService = require('./service');

UsersRouter.get('/', (req, res) => {
    let result = UsersService.getUsers();
    res.send(result);
});

module.exports = UsersRouter;
