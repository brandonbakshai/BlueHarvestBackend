'use strict';

import express from 'express';
import NewsItem from '../models/Story';

const router = express.Router();

router.get('/', (req, res) => {
  NewsItem.fetchNewsItems(res)
    .then(result => console.log("success"))
    .catch(err => console.log(err));
});

router.get('/live', (req, res) => {
  NewsItem.getFreshNewsItems(res)
    .then(insertedValues => res.send(insertedValues))
    .catch(err => console.log(err));
});

export default router;
