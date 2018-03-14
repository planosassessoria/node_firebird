const Firebird = require( 'node-firebird' )
const fs = require( 'fs' )

const params = {
  host: '',
  port: 3050,
  database: '',
  user: '',
  password: '',
  role: null,
  pageSize: 4096
}

Firebird.attach( params, ( err, db ) => {
  if ( err ) throw err

  db.query( `
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
        b.cod_empresa = 2;`, ( err, data ) => {
          if ( err ) throw err

          try {
            const fileName = './produtos.csv'
            if ( fs.existsSync( fileName ) ) {
              fs.unlinkSync( fileName )
            }

            fs.writeFileSync( fileName, data.map( item => `${ item.COD_ITEM };${ item.COD_BARRAS };${ item.DESCRICAO.toString().trim() };${ item.QTD };${ item.CUSTO_MEDIO.toString().replace( '.', ',' ) };0;0;${ item.PRECO_ATACADO ? item.PRECO_ATACADO.replace( '.', ',' ) : 0 };0` ).join( '\n' ), 'utf-8' )
          } catch ( err ) {
            throw err
          }
          db.detach()
        } )
} )
