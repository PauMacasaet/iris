const { Router } = require('express');
const pool = require('../../db');

const router2 = Router();

router2.get('/', (request, response, next) => {
    pool.query('SELECT * from engineer ORDER BY engId ASC', (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING ALL RECORDS FROM ENGINEER TABLE');
        response.json(res.rows);
    });
});

router2.get('/:lastName', (request, response, next) => {
    const { lastName } = request.params
    pool.query('SELECT *  FROM engineer WHERE lastName = ($1)', [lastName], (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING LIST BY last name');
        response.json(res.rows);
    });
});

router2.post('/', (request, response, next) => {
    const { engId, department, firstName, lastName } = request.body;

    pool.query(
        'INSERT INTO engineer( engId, department, firstName, lastName) VALUES($1, $2, $3, $4)', [engId, department, firstName, lastName],
        (err, res) => {
            if (err) return next(err);

            console.log('engineer created');
            response.redirect('/engineer');
        }
    );
});

router2.put('/:engId', (request, response, next) => {
    const { engId } = request.params;
    const keys = ['engId', 'department', 'firstName', 'lastName'];
    const fields = [];

    keys.forEach(key => {
        if (request.body[key]) fields.push(key);
    });

    //partial updating
    fields.forEach((field, index) => {
        pool.query(
            `UPDATE engineer SET ${field} = ($1) WHERE engId =($2)`, [request.body[field], engId],
            (err, res) => {
                if (err) return next(err);

                console.log('UPDATING engineer record');

                if (index === fields.length - 1) response.redirect('/engineer');
            }
        )
    });
});

router2.delete('/:engId', (request, response, next) => {
    const { engId } = request.params;

    pool.query(
        'DELETE FROM engineer WHERE engId = ($1)', [engId],
        (err, res) => {
            if (err) return next(err);

            response.redirect('/engineer');
        }
    );
});
module.exports = router2;