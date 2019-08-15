const express = require('express');
const { MongoError } = require('mongodb');
const { categoriesController, questionsController } = require('../controllers');

const router = express.Router();

module.exports = router;

router.get('/categories', categoriesController.getCategories);

router.post('/questions', questionsController.postQuestion);
