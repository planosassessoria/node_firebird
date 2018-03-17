#!/usr/bin/env node
const commander = require('commander')
const version = require('./package.json').version
const services = require('./services')

commander
  .version(version)
  .option('-h, --host <host>', 'Host address')
  .option('-H, --HOST <HOST>', 'Planos Host address')
  .option('-p, --port <port>', 'Database port')
  .option('-P, --PORT <PORT>', 'Planos Database port')
  .option('-d, --database <database>', 'Database name')
  .option('-D, --DATABASE <DATABASE>', 'Planos Database name')
  .option('-u, --user <user>', 'Database username')
  .option('-U, --USER <USER>', 'Planos Database username')
  .option('-w, --password <password>', 'Database password')
  .option('-W, --PASSWORD <PASSWORD>', 'Planos Database password')
  .option('-o, --output <outputPath>', 'Output path')
  .option('-E, --EMPRESA <EMPRESA>', 'CNPJ Empresa Database Planos')
  .option('-s, --system <systemName>', 'The system name. Example: fire, ciss')
  .parse(process.argv)

const start = async ( { host, HOST, port, PORT, database, DATABASE, user, USER, password, PASSWORD, EMPRESA } ) => {
  try {
    const params = { host, HOST, port, PORT, database, DATABASE, user, USER, password, PASSWORD, EMPRESA }
    const response = await services[ commander.system ].getReport( params, commander.output )
    console.log( response )
  } catch ( e ) {
    console.error( e )
  }
}

start(commander)
