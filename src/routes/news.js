'use strict';

import express from 'express';
import NewsItem from '../models/NewsItem';

const router = express.Router();

router.get('/', (req, res, next) => {
  NewsItem.fetchNewsItems(res)
    .then(result => console.log(result))
    .catch(err => next(err));
});

router.get('/generate', (req, res, next) => {
  NewsItem.generateData(res)
    .then(result => console.log(result))
    .catch(err => next(err));
});

export default router;
