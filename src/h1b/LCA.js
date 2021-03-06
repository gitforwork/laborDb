'use strict'

const SqlServerRepository = require('../repository/SqlServer.repository').SqlServerRepository;//import can be used instead
const repo = new SqlServerRepository();
var h1bDTOs = require('./H1bDtos');

module.exports = {
    countNumberOfH1b: countNumberOfH1b,
    getAggregateForEmployer: getAggregateForEmployer,
    getAggregateForEmployerByTitle
};

function countNumberOfH1b(employer) {
    return new Promise(function (resolve, reject) {
        repo.findAll('select count(*) count from dbo.H1b')
            .then(result => resolve(result[0].count))
            .catch(err => reject(err));
    });
}

function getAggregateForEmployerByTitle(employer) {
    return new Promise(function (resolve, reject) {
        repo.findAll(
            `select JOB_TITLE, count(case_number) case_count, AVG((WAGE_RATE_OF_PAY_FROM+WAGE_RATE_OF_PAY_TO)/2) AVG_WAGE 
            from dbo.H1B 
            where 
            EMPLOYER_NAME = '${employer}'
            group by JOB_TITLE
            order by count(case_number) desc
            `)
            .then(result => {
                let aggregates = result.map(e =>
                    new h1bDTOs.H1bTitleAggregate(
                        e.case_count,
                        e.AVG_WAGE,
                        e.JOB_TITLE))
                resolve(aggregates)
            })
            .catch(err => reject(err));
    });
}

function getAggregateForEmployer(employer) {
    return new Promise(function (resolve, reject) {
        repo.findAll(
            `select FISCAL_YEAR, count(case_number) case_count,
             AVG((WAGE_RATE_OF_PAY_FROM+WAGE_RATE_OF_PAY_TO)/2) AVG_WAGE 
            from dbo.H1B 
            where 
            EMPLOYER_NAME = '${employer}'
            group by FISCAL_YEAR`)
            .then(result => {
                let aggregates = result.map(e =>
                    new h1bDTOs.H1bAggregate(
                        e.case_count,
                        e.AVG_WAGE,
                        e.FISCAL_YEAR))
                resolve(aggregates)
            })
            .catch(err => reject(err));
    });
}