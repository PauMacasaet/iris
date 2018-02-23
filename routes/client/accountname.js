const { Router } = require('express');
const pool = require('../../db');

const router8 = Router();

router8.get('/', (request, response, next) => {
    pool.query('SELECT * from client', (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING ALL RECORDS FROM client TABLE');
        response.json(res.rows);
    });
});

router8.get('/:accountName', (request, response, next) => {
    const { accountName } = request.params
    pool.query('SELECT *  FROM client WHERE accountName = ($1)', [accountName], (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING LIST BY accountName');
        response.json(res.rows);
    });
});

router8.post('/', (request, response, next) => {
    const { accountName, priorityClient, dateExpired, activeContract, contactEmail, contactNumber, noCases } = request.body;

    pool.query(
        'INSERT INTO client(accountName, priorityClient, dateExpired, activeContract, contactEmail, contactNumber, noCases) VALUES($1, $2, $3, $4, $5, $6, $7)', [accountName, priorityClient, dateExpired, activeContract, contactEmail, contactNumber, noCases],
        (err, res) => {
            if (err) return next(err);

            console.log('NEW client CREATED');
            response.redirect('/client');
        }
    );
});

router8.put('/:accountName', (request, response, next) => {
    const { accountName } = request.params;
    const keys = ['accountName', 'priorityClient', 'dateExpired', 'activeContract', 'contactEmail', 'contactNumber', 'noCases'];
    const fields = [];

    keys.forEach(key => {
        if (request.body[key]) fields.push(key);
    });

    //partial updating
    fields.forEach((field, index) => {
        pool.query(
            `UPDATE client SET ${field} = ($1) WHERE accountName =($2)`, [request.body[field], accountName],
            (err, res) => {
                if (err) return next(err);

                console.log('UPDATED client record');

                if (index === fields.length - 1) response.redirect('/client');
            }
        )
    });
});

router8.delete('/:accountName', (request, response, next) => {
    const { accountName } = request.params;

    pool.query(
        'DELETE FROM products WHERE accountName = ($1)', [accountName],
        (err, res) => {
            if (err) return next(err);

            console.log('deleted record from client');
            response.redirect('/client');
        }
    );
});
module.exports = router8;