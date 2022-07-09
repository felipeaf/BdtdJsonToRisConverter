# BdtdJsonToRisConverter

Este programa converte o formato JSON que pode ser exportado dos resultados de busca da Biblioteca Digital Brasileira de Teses e Dissertações (BDTD) para o formato RIS (https://en.wikipedia.org/wiki/RIS_(file_format)), que pode ser importado em outros softwares (por exemplo Zotero).

Para utilizar é necessário ter o node.js instalado

## Uso:

rode o comando abaixo:

```bash
node index.js arquivoDeEntrada.json arquivoDeSaida.ris
```

Arquivo de saída é opcional, se não passado a saída é enviada ao console.