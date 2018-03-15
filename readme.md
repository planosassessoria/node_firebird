# report-extractor

Projeto utilizado pela [Planos Assessoria](https://github.com/planosassessoria) para extrair dados de sistemas parceiros e inserir em nosso sistema de contagens.

## Instalação

Com NPM:
```sh
sudo npm install -g report-extractor
```
Com Yarn:
```sh
sudo yarn add global report-extractor
```

## Modo de usar

Usage: reportExtractor [options]

  Options:

    -V, --version              output the version number
    -H, --host <host>          Host address
    -p, --port <port>          Database port
    -d, --database <database>  Database name
    -u, --user <user>          Database username
    -P, --password <password>  Database password
    -o, --output <outputPath>  Output path
    -s, --system <systemName>  The system name. Example: fire, ciss
    -h, --help                 output usage information
