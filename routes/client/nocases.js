const { Router } = require('express');
const pool = require('../../db');

const router11 = Router();

router11.get('/', (request, response, next) => {
    pool.query('SELECT * from client', (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING ALL RECORDS FROM client TABLE');
        response.json(res.rows);
    });
});

router11.get('/:noCases', (request, response, next) => {
    const { noCases } = request.params
    pool.query('SELECT *  FROM client WHERE noCases = ($1)', [noCases], (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING LIST BY noCases');
        response.json(res.rows);
    });
});

router11.post('/', (request, response, next) => {
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


module.exports = router11;

//no update and delete because multiple records will be edited/deleted