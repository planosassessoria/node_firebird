const Firebird = require( 'node-firebird' )

const params = {
  host: '',
  port: 3050,
  database: '',
  user: '',
  password: '',
  lowercase_key: false,
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
      c.custo_medio,
      .0,
      .0,
      c.valor_atacado,
      .0
    from
      itens as a
    join
      barras as b on a.cod_item = b.cod_item
    join
      itens_estoque as c on a.cod_item = c.cod_item
    where
      b.cod_empresa = 2
  `, ( err, data ) => {
    if ( err ) throw err

    console.log( data )
    db.detach()
  } )
} )
