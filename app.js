const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyparser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');