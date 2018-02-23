const { Router } = require('express');
const pool = require('../../db');

const router5 = Router();

router5.get('/', (request, response, next) => {
    pool.query('SELECT * from products', (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING ALL RECORDS FROM products TABLE');
        response.json(res.rows);
    });
});

router5.get('/:productName', (request, response, next) => {
    const { productName } = request.params
    pool.query('SELECT *  FROM products WHERE productName= ($1)', [productName], (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING LIST BY productName');
        response.json(res.rows);
    });
});

router5.post('/', (request, response, next) => {
    const { productName, productLine, vendor, category } = request.body;

    pool.query(
        'INSERT INTO products( productName, productLine, vendor, category) VALUES($1, $2, $3, $4)', [productName, productLine, vendor, category],
        (err, res) => {
            if (err) return next(err);

            console.log('products created');
            response.redirect('/products');
        }
    );
});

router5.put('/:productName', (request, response, next) => {
    const { productName } = request.params;
    const keys = ['productName', 'productLine', 'vendor', 'category'];
    const fields = [];

    keys.forEach(key => {
        if (request.body[key]) fields.push(key);
    });

    //partial updating
    fields.forEach((field, index) => {
        pool.query(
            `UPDATE products SET ${field} = ($1) WHERE productName =($2)`, [request.body[field], productName],
            (err, res) => {
                if (err) return next(err);

                console.log('UPDATING products record');

                if (index === fields.length - 1) response.redirect('/products');
            }
        )
    });
});

router5.delete('/:productName', (request, response, next) => {
    const { productName } = request.params;

    pool.query(
        'DELETE FROM products WHERE productName = ($1)', [productName],
        (err, res) => {
            if (err) return next(err);

            console.log('deleted record from products');
            response.redirect('/products');
        }
    );
});
module.exports = router5;