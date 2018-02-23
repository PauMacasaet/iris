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

router3.get('/:typeOfActivity', (request, response, next) => {
    const { typeOfActivity } = request.params
    pool.query('SELECT *  FROM activities WHERE typeOfActivity= ($1)', [typeOfActivity], (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING LIST BY ACTIVITY TYPE');
        response.json(res.rows);
    });
});

router3.post('/', (request, response, next) => {
    const { trackingNo, timeIn, timeOuts, productCode, client, contactCustomer, addres, typeOfActivity, purposeOfVisit, activityPerformed, nextActivity, recommendations, engid, engineerName, score } = request.body;

    pool.query(
        'INSERT INTO activities( trackingNo, timeIn, timeOuts, productCode, client, contactCustomer, addres, typeOfActivity, purposeOfVisit, activityPerformed, nextActivity, recommendations, engid, engineerName, score ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)', [trackingNo, timeIn, timeOuts, productCode, client, contactCustomer, addres, typeOfActivity, purposeOfVisit, activityPerformed, nextActivity, recommendations, engid, engineerName, score],
        (err, res) => {
            if (err) return next(err);

            console.log('activity created');
            response.redirect('/typeOfActivity'); //yung route mismo
        }
    );
});

router3.put('/:typeOfActivity', (request, response, next) => {
    const { typeOfActivity } = request.params;
    const keys = ['trackingNo', 'timeIn', 'timeOuts', 'productCode', 'client', 'contactCustomer', 'addres', 'typeOfActivity', 'purposeOfVisit', 'activityPerformed', 'nextActivity', 'recommendations', 'engid', 'engineerName', 'score'];
    const fields = [];

    keys.forEach(key => {
        if (request.body[key]) fields.push(key);
    });

    //partial updating
    fields.forEach((field, index) => {
        pool.query(
            `UPDATE activities SET ${field} = ($1) WHERE typeOfActivity =($2)`, [request.body[field], typeOfActivity],
            (err, res) => {
                if (err) return next(err);

                console.log('UPDATING activity record');

                if (index === fields.length - 1) response.redirect('/typeOfActivity');
            }
        )
    });
});

router3.delete('/:typeOfActivity', (request, response, next) => {
    const { typeOfActivity } = request.params;

    pool.query(
        'DELETE FROM activities WHERE typeOfActivity = ($1)', [typeOfActivity],
        (err, res) => {
            if (err) return next(err);

            response.redirect('/typeOfActivity');
        }
    );
});
module.exports = router3;