const { Router } = require('express');
const pool = require('../../db');

const router3 = Router();

router3.get('/', (request, response, next) => {
    pool.query('SELECT * from case_monitoring', (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING ALL RECORDS FROM CASE MONITORING TABLE');
        response.json(res.rows);
    });
});

router3.get('/:trackingNo', (request, response, next) => {
    const { trackingNo } = request.params
    pool.query('SELECT assignedSystemsEngineer FROM case_monitoring WHERE glocalId = ($1)', [trackingNo], (err, res) => {
        if (err) return next(err);

        console.log('RETRIEVING LIST BY ASSIGNED SE');
        response.json(res.rows);
    });
});

router3.post('/', (request, response, next) => {
    const { glocalId, vendorCaseId, dateIdCreated, dateRaised, caseTitle, caseDescription, severity, vendor, customer, productLine, customerName, systemsEngineerLead, assignedAccountManager, assignedSystemsEngineer } = request.body;

    pool.query(
        'INSERT INTO case_monitoring( glocalId, vendorCaseId, dateIdCreated, dateRaised, caseTitle, caseDescription, severity, vendor, customer, productLine, customerName, systemsEngineerLead, assignedAccountManager, assignedSystemsEngineer ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)', [glocalId, vendorCaseId, dateIdCreated, dateRaised, caseTitle, caseDescription, severity, vendor, customer, productLine, customerName, systemsEngineerLead, assignedAccountManager, assignedSystemsEngineer],
        (err, res) => {
            if (err) return next(err);

            console.log('case monitoring created');
            response.redirect('/assignedSystemsEngineer'); //yung route mismo
        }
    );
});

router3.put('/:assignedSystemsEngineer', (request, response, next) => {
    const { assignedSystemsEngineer } = request.params;
    const keys = ['glocalId', 'vendorCaseId', 'dateIdCreated', 'dateRaised', 'caseTitle', 'caseDescription', 'severity', 'vendor', 'customer', 'productLine', 'customerName', 'systemsEngineerLead', 'assignedAccountManager', 'assignedSystemsEngineer'];
    const fields = [];

    keys.forEach(key => {
        if (request.body[key]) fields.push(key);
    });

    //partial updating
    fields.forEach((field, index) => {
        pool.query(
            `UPDATE case_monitoring SET ${field} = ($1) WHERE assignedSystemsEngineer =($2)`, [request.body[field], assignedSystemsEngineer],
            (err, res) => {
                if (err) return next(err);

                console.log('UPDATING case_monitoring record');

                if (index === fields.length - 1) response.redirect('/assignedSystemsEngineer');
            }
        )
    });
});

router3.delete('/:assignedSystemsEngineer', (request, response, next) => {
    const { assignedSystemsEngineer } = request.params;

    pool.query(
        'DELETE FROM case_monitoring WHERE assignedSystemsEngineer = ($1)', [assignedSystemsEngineer],
        (err, res) => {
            if (err) return next(err);

            response.redirect('/assignedSystemsEngineer');
        }
    );
});
module.exports = router3;