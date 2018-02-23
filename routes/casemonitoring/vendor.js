const { Router } = require('express');
const pool = require('../../db');

const router8 = Router();

router8.get('/', (request, response, next) => {
    pool.query('SELECT * from case_monitoring', (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING ALL RECORDS FROM case monitoring TABLE');
        response.json(res.rows);
    });
});

router8.get('/:vendor', (request, response, next) => {
    const { vendor } = request.params
    pool.query('SELECT *  FROM case_monitoring WHERE vendor = ($1)', [vendor], (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING LIST BY case description');
        response.json(res.rows);
    });
});

router8.post('/', (request, response, next) => {
    const { glocalId, vendorCaseId, dateIdCreated, dateRaised, caseTitle, caseDescription, severity, vendor, customer, productLine, customerName, systemsEngineerLead, assignedAccountManager, assignedSystemsEngineer } = request.body;

    pool.query(
        'INSERT INTO case_monitoring(glocalId, vendorCaseId, dateIdCreated, dateRaised, caseTitle, caseDescription, severity, vendor, customer, productLine, customerName, systemsEngineerLead, assignedAccountManager, assignedSystemsEngineer) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)', [glocalId, vendorCaseId, dateIdCreated, dateRaised, caseTitle, caseDescription, severity, vendor, customer, productLine, customerName, systemsEngineerLead, assignedAccountManager, assignedSystemsEngineer],
        (err, res) => {
            if (err) return next(err);

            console.log('NEW case CREATED');
            response.redirect('/severity');
        }
    );
});

router8.put('/:vendor', (request, response, next) => {
    const { vendor } = request.params;
    const keys = ['glocalId', 'vendorCaseId', 'dateIdCreated', 'dateRaised', 'caseTitle', 'caseDescription', 'severity', 'vendor', 'customer', 'productLine', 'customerName', 'systemsEngineerLead', 'assignedAccountManager', 'assignedSystemsEngineer'];
    const fields = [];

    keys.forEach(key => {
        if (request.body[key]) fields.push(key);
    });

    //partial updating
    fields.forEach((field, index) => {
        pool.query(
            `UPDATE case_monitoring SET ${field} = ($1) WHERE vendor =($2)`, [request.body[field], vendor],
            (err, res) => {
                if (err) return next(err);

                console.log('UPDATED client record');

                if (index === fields.length - 1) response.redirect('/vendor');
            }
        )
    });
});

router8.delete('/:vendor', (request, response, next) => {
    const { vendor } = request.params;

    pool.query(
        'DELETE FROM case_monitoring WHERE vendor = ($1)', [vendor],
        (err, res) => {
            if (err) return next(err);

            console.log('deleted record from case monitoring');
            response.redirect('/vendor');
        }
    );
});
module.exports = router8;