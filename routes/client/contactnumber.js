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

router11.get('/:contactNumber', (request, response, next) => {
    const { contactNumber } = request.params
    pool.query('SELECT *  FROM client WHERE contactNumber = ($1)', [contactNumber], (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING LIST BY contactNumber');
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

router11.put('/:contactNumber', (request, response, next) => {
    const { contactNumber } = request.params;
    const keys = ['accountName', 'priorityClient', 'dateExpired', 'activeContract', 'contactEmail', 'contactNumber', 'noCases'];
    const fields = [];

    keys.forEach(key => {
        if (request.body[key]) fields.push(key);
    });

    //partial updating
    fields.forEach((field, index) => {
        pool.query(
            `UPDATE client SET ${field} = ($1) WHERE contactNumber =($2)`, [request.body[field], contactNumber],
            (err, res) => {
                if (err) return next(err);

                console.log('UPDATED client record');

                if (index === fields.length - 1) response.redirect('/client');
            }
        )
    });
});

router11.delete('/:contactNumber', (request, response, next) => {
    const { contactNumber } = request.params;

    pool.query(
        'DELETE FROM client WHERE contactNumber = ($1)', [contactNumber],
        (err, res) => {
            if (err) return next(err);

            console.log('deleted record from client');
            response.redirect('/client');
        }
    );
});
module.exports = router11;