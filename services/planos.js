const { Client } = require( 'pg' )

const SQL = ( command, ...params ) => {
  return {
    text: command.reduce( ( prev, curr, index ) => prev + '$' + index + curr ),
    values: params
  }
}

const update = ( params, items ) => {
  return new Promise( async ( resolve, reject ) => {
    let client
    try {
      client = new Client( params )
      await client.connect()
      await client.query( 'begin;' )
      let idEmpresa = await client.query( SQL`select id_empresa from cad_empresa where cnpj = ${ params.cnpj }` )
      idEmpresa = idEmpresa.rows[ 0 ].id_empresa

      for ( const item of items ) {
        await client.query( SQL`
          insert into cad_produto
            (id_empresa, codg_produto, codg_barra, descricao, vl_atacado, vl_varejo, vl_custo_medio, qtd_atual)
          values
            ( ${ idEmpresa }, ${ item.codgProduto }, ${ item.codgBarra }, ${ item.descricao }, ${ item.vlAtacado }, ${ item.vlVarejo }, ${ item.vlCustoMedio }, ${ item.qtdAtual } )
          on conflict on constraint chave_produto_on_cad_produto
          do update set
            ( descricao, vl_atacado, vl_varejo, vl_custo_medio, qtd_atual ) =
            ( excluded.descricao, excluded.vl_atacado, excluded.vl_varejo, excluded.vl_custo_medio, excluded.qtd_atual );
        ` )
      }
      await client.query( 'commit;' )
      resolve()
    } catch ( err ) {
      await client.query( 'rollback;' )
      reject ( err )
    } finally {
      client.end()
    }
  } )
}

module.exports = {
  update
}
