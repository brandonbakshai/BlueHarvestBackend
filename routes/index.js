import express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => res.render('index', { title: 'Blue Harvest' }));

export default router;

