const { Router } = require('express');
const pool = require('../../db');

const router7 = Router();

router7.get('/', (request, response, next) => {
    pool.query('SELECT * from products', (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING ALL RECORDS FROM products TABLE');
        response.json(res.rows);
    });
});

router7.get('/:category', (request, response, next) => {
    const { category } = request.params
    pool.query('SELECT *  FROM products WHERE category = ($1)', [category], (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING LIST BY category');
        response.json(res.rows);
    });
});

router7.post('/', (request, response, next) => {
    const { productName, productLine, vendor, category } = request.body;

    pool.query(
        'INSERT INTO products( productName, productLine, vendor, category) VALUES($1, $2, $3, $4)', [productName, category, vendor, category],
        (err, res) => {
            if (err) return next(err);

            console.log('NEW PRODUCT CREATED');
            response.redirect('/products');
        }
    );
});

module.exports = router7;
//no delete and update because multiple products have the same category. will result in mass deletes