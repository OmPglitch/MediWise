'use strict';

const router = require('express').Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { register, login, getProfile, listUsers } = require('../controllers/authController');

router.post('/register', asyncHandler(register));
router.post('/login',    asyncHandler(login));
router.get('/profile',   asyncHandler(getProfile));
router.get('/users',     asyncHandler(listUsers));

module.exports = router;
