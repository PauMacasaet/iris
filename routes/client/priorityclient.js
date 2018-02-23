const { Router } = require('express');
const pool = require('../../db');

const router9 = Router();

router9.get('/:priorityClient', (request, response, next) => {
    const { priorityClient } = request.params
    pool.query('SELECT *  FROM client WHERE priorityClient = ($1)', [priorityClient], (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING LIST BY priority client');
        response.json(res.rows);
    });
});

router9.post('/', (request, response, next) => {
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

module.exports = router9;
//no delete and update method because it will result to mass deletes and update