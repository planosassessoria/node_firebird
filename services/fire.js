const Firebird = require( 'node-firebird' )
const { saveToFileSystem } = require('./utils')

const getReport = (params, output) => {
  return new Promise(async (resolve, reject) => {
    let db
    try {
      db = await getDb(params)
      const items = await query(db, `
       select
         a.cod_item,
         b.cod_barras,
         a.descricao,
         c.qtd,
         c.custo_medio,
         c.preco_atacado,
         c.preco_venda
       from
         itens as a
       join
         barras as b on a.cod_item = b.cod_item
       join
         itens_estoque as c on a.cod_item = c.cod_item
       where
         b.cod_empresa = 2;`)
      const parsedItems = items.map(mapItems).join('\n')
      const fileName = saveToFileSystem(parsedItems, output)
      resolve(`Arquivo criado em: ${fileName}`)
    } catch (e) {
      reject(e)
    } finally {
      db.detach()
    }
  })
}

const getDb = (params) => {
  return new Promise((resolve, reject) => {
    Firebird.attach( params, ( err, db ) => {
      if (err) reject(err)
      resolve(db)
    })
  })
}

const query = (db, queryRaw) => {
  return new Promise((resolve, reject) => {
    db.query(queryRaw, function(err, items) {
      if (err) reject(err)
      resolve(items)
    })
  })
}

const mapItems = ({ COD_ITEM, COD_BARRAS, DESCRICAO, QTD, CUSTO_MEDIO, PRECO_ATACADO, PRECO_VENDA }) => {
  COD_BARRAS = COD_BARRAS.toString()
  DESCRICAO = DESCRICAO.toString().trim()
  CUSTO_MEDIO = CUSTO_MEDIO.toFixed(2).toString().replace( '.', ',' )
  PRECO_ATACADO = PRECO_ATACADO ? PRECO_ATACADO.toFixed(2).toString().replace( '.', ',' ) : 0
  PRECO_VENDA = PRECO_VENDA ? PRECO_VENDA.toString().replace( '.', ',' ) : 0
  return `${ COD_ITEM };${ COD_BARRAS };${ DESCRICAO };${ QTD };${ PRECO_VENDA };${ PRECO_VENDA };${ PRECO_VENDA };${ PRECO_VENDA };${ PRECO_VENDA }`
}


module.exports = {
  getReport
}
