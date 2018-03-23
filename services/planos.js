const { Client } = require( 'pg' )

const update = ( params, items ) => {
  return new Promise( async ( resolve, reject ) => {
    let client
    try {
      client = new Client( params )
      await client.connect()
      await client.query( 'select a.id_empresa, a.fantasia from ncm_helper.cad_empresas as a;')
      resolve()
    } catch ( err ) {
      reject ( err )
    } finally {
      client.end()
    }
  } )
}

module.exports = {
  update
}
