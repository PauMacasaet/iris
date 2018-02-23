const { Router } = require('express');
const pool = require('../../db');

const router3 = Router();

router3.get('/', (request, response, next) => {
    pool.query('SELECT * from activities', (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING ALL RECORDS FROM ACTIVITIES TABLE');
        response.json(res.rows);
    });
});

router3.get('/:score', (request, response, next) => {
    const { score } = request.params
    pool.query('SELECT *  FROM activities WHERE score= ($1)', [score], (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING LIST BY SCORE');
        response.json(res.rows);
    });
});

router3.post('/', (request, response, next) => {
    const { trackingNo, timeIn, timeOuts, productCode, client, contactCustomer, addres, typeOfActivity, purposeOfVisit, activityPerformed, nextActivity, recommendations, engid, engineerName, score } = request.body;

    pool.query(
        'INSERT INTO activities( trackingNo, timeIn, timeOuts, productCode, client, contactCustomer, addres, typeOfActivity, purposeOfVisit, activityPerformed, nextActivity, recommendations,engid, engineerName, score ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)', [trackingNo, timeIn, timeOuts, productCode, client, contactCustomer, addres, typeOfActivity, purposeOfVisit, activityPerformed, nextActivity, recommendations, engid, engineerName, score],
        (err, res) => {
            if (err) return next(err);

            console.log('activity created');
            response.redirect('/score'); //yung route mismo
        }
    );
});

router3.put('/:score', (request, response, next) => {
    const { score } = request.params;
    const keys = ['trackingNo', 'timeIn', 'timeOuts', 'productCode', 'client', 'contactCustomer', 'addres', 'typeOfActivity', 'purposeOfVisit', 'activityPerformed', 'nextActivity', 'recommendations', 'engid', 'engineerName', 'score'];
    const fields = [];

    keys.forEach(key => {
        if (request.body[key]) fields.push(key);
    });

    //partial updating
    fields.forEach((field, index) => {
        pool.query(
            `UPDATE activities SET ${field} = ($1) WHERE score =($2)`, [request.body[field], score],
            (err, res) => {
                if (err) return next(err);

                console.log('UPDATING activity record');

                if (index === fields.length - 1) response.redirect('/score'); //route mismo
            }
        )
    });
});

router3.delete('/:score', (request, response, next) => {
    const { score } = request.params;

    pool.query(
        'DELETE FROM activities WHERE score = ($1)', [score],
        (err, res) => {
            if (err) return next(err);

            response.redirect('/score'); //route mismo
        }
    );
});
module.exports = router3;