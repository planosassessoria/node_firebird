const Firebird = require( 'node-firebird' )
const fs = require( 'fs' )

const getReport = (params, output) => {
  return new Promise(async (resolve, reject) => {
    try {
      Firebird.attach( params, ( err, db ) => {
        if (err) reject(err)
        db.query(`
         select
           a.cod_item,
           b.cod_barras,
           a.descricao,
           c.qtd,
           c.custo_medio,
           c.preco_atacado
         from
           itens as a
         join
           barras as b on a.cod_item = b.cod_item
         join
           itens_estoque as c on a.cod_item = c.cod_item
         where
           b.cod_empresa = 2;`, function(err, items) {
          if (err) reject(err)
          const fileName = saveToFileSystem(items, output)
          db.detach()
          resolve(`Arquivo criado em: ${fileName}`)
        })
      })
    } catch (e) {
      reject(e)
    }
  })
}

const saveToFileSystem = (items, output) => {
  try {
    const fileName =`${output}/produtos.csv`
    if ( fs.existsSync( fileName ) ) {
      fs.unlinkSync( fileName )
    }
    const outputRaw = items.map(mapItems).join('\n')
    fs.writeFileSync(fileName, outputRaw)
    return fileName
  } catch ( err ) {
    throw err
  }
}

const mapItems = item => `${ item.COD_ITEM };${ item.COD_BARRAS };${ item.DESCRICAO.toString().trim() };${ item.QTD };${ item.CUSTO_MEDIO.toString().replace( '.', ',' ) };0;0;${ item.PRECO_ATACADO ? item.PRECO_ATACADO.replace( '.', ',' ) : 0 };0`


module.exports = {
  getReport
}
