const sql = require('mssql')
const gsandConfig = require('./cis410-fa20-gsand-api/config.js')
const config = {
    user: gsandConfig.DB.user,
    password: gsandConfig.DB.password,
    server:gsandConfig.DB.server, // You can use 'localhost\\instance' to connect to named instance
    database: gsandConfig.DB.database,
}


async function executeQuery(aQuery){
    var connection = await sql.connect(config)
    var result = await connection.query(aQuery)
   return result.recordset
}
module.exports ={executeQuery:executeQuery}
