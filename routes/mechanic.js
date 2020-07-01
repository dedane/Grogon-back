const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')
const Mechanic = require('../models/mechanic');
