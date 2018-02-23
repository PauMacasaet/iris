const { Router } = require('express');
const pool = require('../../db');

const router11 = Router();

router11.get('/', (request, response, next) => {
    pool.query('SELECT client, personName AS Contact_Person from contact_person', (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING ALL RECORDS FROM contact person TABLE');
        response.json(res.rows);
    });
});

router11.get('/:personName', (request, response, next) => {
    const { personName } = request.params
    pool.query('SELECT client, personName AS Contact_Person FROM contact_person WHERE personName = ($1)', [personName], (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING LIST BY personName');
        response.json(res.rows);
    });
});

router11.post('/', (request, response, next) => {
    const { client, personName } = request.body;

    pool.query(
        'INSERT INTO client(client, personName) VALUES($1, $2)', [client, personName],
        (err, res) => {
            if (err) return next(err);

            console.log('NEW contact person created CREATED');
            response.redirect('/contactp');
        }
    );
});

router11.put('/:contactPerson', (request, response, next) => {
    const { contactPerson } = request.params;
    const keys = ['client', 'contactPerson'];
    const fields = [];

    keys.forEach(key => {
        if (request.body[key]) fields.push(key);
    });

    //partial updating
    fields.forEach((field, index) => {
        pool.query(
            `UPDATE contact_person SET ${field} = ($1) WHERE contactPerson =($2)`, [request.body[field], contactPerson],
            (err, res) => {
                if (err) return next(err);

                console.log('UPDATED contact person record');

                if (index === fields.length - 1) response.redirect('/contactp');
            }
        )
    });
});

router11.delete('/:contactPerson', (request, response, next) => {
    const { contactPerson } = request.params;

    pool.query(
        'DELETE FROM client WHERE contact_person = ($1)', [contactPerson],
        (err, res) => {
            if (err) return next(err);

            console.log('deleted record from client');
            response.redirect('/contactp');
        }
    );
});
module.exports = router11;