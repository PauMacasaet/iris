const { Router } = require('express');
const pool = require('../../db');

const router10 = Router();

router10.get('/:activeContract', (request, response, next) => {
    const { activeContract } = request.params
    pool.query('SELECT *  FROM client WHERE activeContract = ($1)', [activeContract], (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING LIST BY active contract');
        response.json(res.rows);
    });
});

router10.post('/', (request, response, next) => {
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

module.exports = router10;
//no delete and update method because it will result to mass deletes and update