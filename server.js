const sql = require('mssql')

var mssqlAdapter = require('./src/db/SQLServerAdapter.js');

function readDb() {
    var results = mssqlAdapter.query('select top 1 * from dbo.H1B');
    console.dir(results);
}

function readDb2() {
    //let's see if the file is auto saved and formatted
    mssqlAdapter.queryWithPromise('select top 1 * from dbo.H1B')
        .then(result => console.log(result))
        .catch(err => console.error(err));
}

function hell() { 
    return 'hellp';
}

readDb2();