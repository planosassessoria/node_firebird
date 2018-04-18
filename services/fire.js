const Firebird = require( 'node-firebird' )
const { saveToFileSystem } = require('./utils')
const { update } = require( './planos' )

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

      await update( {
        host: params.HOST,
        port: params.PORT,
        database: params.DATABASE,
        user: params.USER,
        password: params.PASSWORD,
        cnpj: params.EMPRESA
      }, items.map( item => {
        return {
          codgProduto: item.COD_ITEM,
          codgBarra: item.COD_BARRAS.toString().trim(),
          descricao: item.DESCRICAO.toString().trim(),
          qtdAtual: item.QTD || .0,
          vlCustoMedio: item.CUSTO_MEDIO || .0,
          vlAtacado: item.PRECO_ATACADO || .0,
          vlVarejo: item.PRECO_VENDA || .0
        }
      } ) )

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
    db.query( queryRaw, ( err, items ) => {
      if ( err ) reject( err )
      resolve( items )
    } )
  } )
}

const mapItems = item => {
  return `${ item.COD_ITEM };${ item.COD_BARRAS };${ item.DESCRICAO.toString().trim() };${ item.QTD };${ item.CUSTO_MEDIO.toString().replace( '.', ',' ) };0;0;${ item.PRECO_ATACADO ? item.PRECO_ATACADO.replace( '.', ',' ) : 0 };0`
}


module.exports = {
  getReport
}
