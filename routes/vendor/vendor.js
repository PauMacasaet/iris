const { Router } = require('express');
const pool = require('../../db');

const router4 = Router();

router4.get('/', (request, response, next) => {
    pool.query('SELECT * from vendor', (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING ALL RECORDS FROM VENDOR TABLE');
        response.json(res.rows);
    });
});

router4.get('/:principal', (request, response, next) => {
    const { principal } = request.params
    pool.query('SELECT *  FROM vendor WHERE principal = ($1)', [principal], (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING LIST BY principal');
        response.json(res.rows);
    });
});

router4.post('/', (request, response, next) => {
    const { principal } = request.body;

    pool.query(
        'INSERT INTO vendor(principal) VALUES($1)', [principal],
        (err, res) => {
            if (err) return next(err);

            console.log('vendor created');
            response.redirect('/vendor');
        }
    );
});

router4.put('/:principal', (request, response, next) => {
    const { principal } = request.params;
    const keys = ['principal'];
    const fields = [];

    keys.forEach(key => {
        if (request.body[key]) fields.push(key);
    });

    //partial updating
    fields.forEach((field, index) => {
        pool.query(
            `UPDATE vendor SET ${field} = ($1) WHERE principal =($2)`, [request.body[field], principal],
            (err, res) => {
                if (err) return next(err);

                console.log('UPDATING vendor record');

                if (index === fields.length - 1) response.redirect('/vendor');
            }
        )
    });
});

router4.delete('/:principal', (request, response, next) => {
    const { principal } = request.params;

    pool.query(
        'DELETE FROM vendor WHERE principal = ($1)', [principal],
        (err, res) => {
            if (err) return next(err);

            console.log('Deleting Record from Vendor table');
            response.redirect('/vendor');
        }
    );
});
module.exports = router4;