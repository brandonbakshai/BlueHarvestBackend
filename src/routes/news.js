'use strict';

import express from 'express';
import NewsItem from '../models/NewsItem';

const router = express.Router();

router.get('/', (req, res) => {
  NewsItem.fetchNewsItems(res)
    .then(result => console.log("success"))
    .catch(err => console.log(err));
});

router.get('/live', (req, res) => {
  NewsItem.generateData(res)
    .then(insertedValues => res.send(insertedValues))
    .then(result => console.log("success"))
    .catch(err => console.log(err));
});

export default router;
