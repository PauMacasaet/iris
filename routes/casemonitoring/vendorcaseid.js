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

router8.get('/:vendorCaseId', (request, response, next) => {
    const { vendorCaseId } = request.params
    pool.query('SELECT *  FROM case_monitoring WHERE vendorCaseId = ($1)', [vendorCaseId], (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING LIST BY vendorCaseId');
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
            response.redirect('/glocalid');
        }
    );
});

router8.put('/:vendorCaseId', (request, response, next) => {
    const { vendorCaseId } = request.params;
    const keys = ['glocalId', 'vendorCaseId', 'dateIdCreated', 'dateRaised', 'caseTitle', 'caseDescription', 'severity', 'vendor', 'customer', 'productLine', 'customerName', 'systemsEngineerLead', 'assignedAccountManager', 'assignedSystemsEngineer'];
    const fields = [];

    keys.forEach(key => {
        if (request.body[key]) fields.push(key);
    });

    //partial updating
    fields.forEach((field, index) => {
        pool.query(
            `UPDATE case_monitoring SET ${field} = ($1) WHERE vendorCaseId =($2)`, [request.body[field], vendorCaseId],
            (err, res) => {
                if (err) return next(err);

                console.log('UPDATED client record');

                if (index === fields.length - 1) response.redirect('/vendorcaseid');
            }
        )
    });
});

router8.delete('/:vendorCaseId', (request, response, next) => {
    const { vendorCaseId } = request.params;

    pool.query(
        'DELETE FROM case_monitoring WHERE vendorCaseId = ($1)', [vendorCaseId],
        (err, res) => {
            if (err) return next(err);

            console.log('deleted record from case monitoring');
            response.redirect('/vendorcaseid');
        }
    );
});
module.exports = router8;