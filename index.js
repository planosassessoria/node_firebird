#!/usr/bin/env node
const commander = require('commander')
const version = require('./package.json').version
const services = require('./services')

commander
  .version(version)
  .option('-H, --host <host>', 'Host address')
  .option('-p, --port <port>', 'Database port')
  .option('-d, --database <database>', 'Database name')
  .option('-u, --user <user>', 'Database username')
  .option('-P, --password <password>', 'Database password')
  .option('-o, --output <outputPath>', 'Output path')
  .option('-s, --system <systemName>', 'The system name. Example: fire, ciss')
  .parse(process.argv)

const start = async ({host, port, database, user, password}) => {
  try {
    const params = { host, port, database, user, password }
    const response = await services[commander.system].getReport(params, commander.output)
    console.log(response)
  } catch (e) {
    console.error(e)
  }
}

start(commander)
