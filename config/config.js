const promise = require('bluebird')
const options = { promiseLib: promise, query: (e) => { } }
const pgp = require('pg-promise')(options)
const types = pgp.pg.types
types.setTypeParser(1114, function (stringValue) { return stringValue })
const databaseConfig = {
    'host': 'ec2-54-227-248-71.compute-1.amazonaws.com',
    'port': 5432,
    'database': 'dfum28dim8pm3r',
    'user': 'hdxtimgalaqozo',
    'password': '9585dccda36860b8fe0a6d085d1781490b5e8258aa4e820fcebf15a8d95f5d44',
    'ssl': { rejectUnauthorized: false }
}
const db = pgp(databaseConfig)
module.exports = db