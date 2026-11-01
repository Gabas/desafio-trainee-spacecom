# Desafio Spacecom

### Gabriel Ast dos Santos

Solução em **TypeScript (Node.js)** para o primeiro desafio técnico do Programa Trainee Tech Spacecom 2027. O programa lê os dados de geolocalização de monitorados (tornozeleira) e vítimas (rastreador portátil) e detecta os encontros físicos entre eles, em três tipos: `generico`, `faccao` e `protetiva`.

## Como executar

**Requisitos:** Node.js 22 ou superior (testado com as versões 22 e 25) e npm. Rode os comandos na raiz do projeto.

```bash
npm install          # instala só as ferramentas de desenvolvimento (typescript e @types/node)
npm run build        # compila src/ para dist/
npm start -- 1       # processa data/dataset1.txt e grava output/resultado1.json
```

- **Entrada por número ou por caminho.** `npm start -- 3` lê `data/dataset3.txt`. Também é possível passar o caminho de um arquivo: `npm start -- /outra/pasta/dataset3.txt`. Um arquivo `datasetN.txt` gera `output/resultadoN.json`, e outros nomes geram `output/<nome>.json`. Se o arquivo não existir, o programa avisa e encerra com código de erro.
- **Datasets.** Os datasets 1 e 2 estão em `data/`. Os datasets 3 a 7 não estão no repositório por causa do tamanho (até 638 MB). Coloque-os em `data/` como `dataset3.txt` a `dataset7.txt`, ou informe o caminho.
- **Todos de uma vez:** `for n in 1 2 3 4 5 6 7; do npm start -- $n; done`
- **Conferência com o gabarito** (datasets 1 e 2): `npm run comparar -- 1` compara `output/resultado1.json` com o gabarito fornecido (`output/respostas1.json`) e mostra encontros corretos, incorretos, faltantes e o score.
- **Sem dependências em tempo de execução:** o programa compilado usa só o Node.

## Estrutura

| Caminho | Conteúdo |
|---|---|
| `src/index.ts` | Programa principal: recebe o número do dataset ou o caminho do arquivo e grava o JSON |
| `src/processar.ts` | Junta as etapas: lê as linhas, agrupa por instante, detecta e devolve os encontros |
| `src/leitor.ts` | Leitura do arquivo em pedaços e conversão de cada linha em `Registro` |
| `src/detector.ts` | Pares próximos dentro de um instante e classificação do tipo de encontro |
| `src/haversine.ts` | Distância em metros pela fórmula de Haversine (raio da Terra de 6.371.000 m) |
| `src/tipos.ts` | Tipos `Registro` (uma linha do dataset) e `Encontro` (formato do JSON de saída) |
| `src/comparar.ts` | Compara um resultado com o gabarito e calcula o score |
| `data/` | Datasets de entrada |
| `output/` | Gabaritos fornecidos (`respostas1.json`, `respostas2.json`) e resultados gerados (`resultado1.json` a `resultado7.json`) |
| `notebooks/eda.ipynb` | Análise exploratória em Python (opcional, não faz parte da solução) |

## Como funciona

1. **Leitura em pedaços.** O arquivo é lido em blocos de 8 MB, e o fim de cada bloco (uma linha cortada ao meio) é emendado no começo do seguinte. Ler tudo de uma vez não funciona nos maiores datasets: o `dataset7.txt` tem 638 MB e passa do limite de string do Node (cerca de 512 MB), e o `dataset6.txt` esgota a memória ao guardar 8 milhões de registros.
2. **Agrupamento por instante.** Só se comparam posições com o mesmo timestamp. Os arquivos estão ordenados por timestamp, então as linhas de um instante ficam seguidas. Quando o timestamp muda, o instante anterior está completo: ele é processado e descartado. A memória guarda só um instante por vez (no máximo 120 pessoas nos datasets fornecidos).
3. **Pares dentro do instante.** Dois laços com `j = i + 1` testam cada par uma única vez. Isso garante a unicidade por par e timestamp e evita comparar uma pessoa com ela mesma.
4. **Filtro por latitude.** Antes da Haversine, descarta-se o par cuja diferença de latitude já excede 20 m. Isso é seguro porque a distância pela superfície da esfera nunca é menor que o arco norte-sul entre os dois pontos. Uma folga de 0,1% protege contra arredondamento. O filtro só descarta pares: a decisão final é sempre da Haversine.
5. **Haversine.** Distância em metros com R = 6.371.000. É encontro quando a distância é **estritamente menor** que 20 m.
6. **Classificação.** Cada par recebe um único tipo, nesta ordem de precedência:
   - `protetiva`: um dos dois é vítima e o outro está na lista de agressores dela;
   - `faccao`: os dois são monitorados e têm a mesma facção (não vazia);
   - `generico`: qualquer outro par de monitorados.
7. **Saída.** Um array JSON com `tipo`, `monitoradosEncontro`, `timestamp`, `posicoes` e `distanciaMetros`, no formato do enunciado.

## Decisões e premissas

- **Análise exploratória.** Antes de implementar o algoritmo, explorei os datasets no notebook `notebooks/eda.ipynb` (Python com pandas, opcional e fora da solução) para entender o formato, a qualidade e o perfil dos dados. O notebook aceita qualquer um dos 7 datasets pela variável `N`.
- **Facção vazia não é facção em comum.** Duas pessoas sem facção têm o mesmo valor (vazio) e não formam par de facção. Isso importa: boa parte dos encontros `generico` é entre pessoas sem facção.
- **Vítima perto de alguém que não é o agressor dela não conta como encontro.** Interpretei `generico` como encontro entre monitorados (tornozeleira) e `protetiva` como o encontro entre agressor e a respectiva vítima. Essa situação não ocorre em nenhum dos 7 datasets.
- **Entrada ordenada por timestamp.** Conferi que os 7 datasets estão ordenados. Se uma linha com timestamp menor que o anterior aparecer, o programa para com erro explícito, em vez de gerar um resultado errado em silêncio.
- **Linhas bem formadas.** O leitor trata aspas e campos vazios, mas assume que cada linha tem os 7 campos, como em todos os datasets fornecidos. Não há tratamento de linhas corrompidas.

## Validação

- **Datasets 1 e 2** (com gabarito): 4 de 4 e 6 de 6 encontros corretos, nenhum incorreto ou faltante. Score 4 e 6.
- **Otimizações sem mudar o resultado:** antes e depois do filtro por latitude e da leitura em pedaços, os JSONs dos datasets 1 a 5 ficaram idênticos byte a byte.

## Resultados

| Dataset | Registros | Encontros | generico | faccao | protetiva |
|---|---|---|---|---|---|
| 1 | 5.000 | 4 | 2 | 1 | 1 |
| 2 | 25.000 | 6 | 3 | 2 | 1 |
| 3 | 100.000 | 10 | 5 | 3 | 2 |
| 4 | 400.020 | 15 | 7 | 5 | 3 |
| 5 | 1.000.000 | 21 | 10 | 7 | 4 |
| 6 | 8.000.000 | 27 | 12 | 9 | 6 |
| 7 | 12.000.000 | 35 | 15 | 12 | 8 |

## Por que esta abordagem

- **Correção primeiro.** Todo par de um mesmo instante é considerado, e a decisão final é sempre da Haversine exata. O filtro por latitude só poupa trabalho e não altera nenhum resultado: os JSONs dos datasets 1 a 5 ficaram idênticos antes e depois dele.
- **Memória limitada.** Como o processamento é feito instante a instante, o uso de memória não cresce com o tamanho do arquivo. É isso que permite rodar o dataset de 12 milhões de linhas.
- **Desempenho proporcional ao problema.** Com até 120 pessoas por instante (7.140 pares), comparar todos os pares é barato, e o filtro por latitude elimina quase todas as chamadas à Haversine.
- **Alternativa considerada:** um índice espacial (grade ou varredura ordenada por latitude) reduziria o custo por instante, mas só compensa com milhares de pessoas por instante. Nos dados fornecidos, a complexidade extra não traria ganho.
- **Simples de explicar e de verificar:** poucas funções pequenas, sem bibliotecas externas, cada uma testável isoladamente.