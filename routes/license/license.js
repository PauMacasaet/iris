const { Router } = require('express');
const pool = require('../../db');

const router3 = Router();

router3.get('/', (request, response, next) => {
    pool.query('SELECT * from license', (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING ALL RECORDS FROM LICENSE TABLE');
        response.json(res.rows);
    });
});

router3.get('/:license', (request, response, next) => {
    const { license } = request.params
    pool.query('SELECT *  FROM license WHERE license= ($1)', [license], (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING LIST BY LICENSE');
        response.json(res.rows);
    });
});

router3.post('/', (request, response, next) => {
    const { product, license } = request.body;

    pool.query(
        'INSERT INTO license( product, license ) VALUES($1, $2)', [product, license],
        (err, res) => {
            if (err) return next(err);

            console.log('license created');
            response.redirect('/license');
        }
    );
});

router3.put('/:product', (request, response, next) => {
    const { product } = request.params;
    const keys = ['product', 'license'];
    const fields = [];

    keys.forEach(key => {
        if (request.body[key]) fields.push(key);
    });

    //partial updating
    fields.forEach((field, index) => {
        pool.query(
            `UPDATE license SET ${field} = ($1) WHERE product =($2)`, [request.body[field], product],
            (err, res) => {
                if (err) return next(err);

                console.log('UPDATING license record');

                if (index === fields.length - 1) response.redirect('/license');
            }
        )
    });
});

router3.delete('/:product', (request, response, next) => {
    const { product } = request.params;

    pool.query(
        'DELETE FROM license WHERE product = ($1)', [product],
        (err, res) => {
            if (err) return next(err);

            response.redirect('/license');
        }
    );
});
module.exports = router3;