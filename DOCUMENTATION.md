# Documentação técnica — Eu Produtei

> Última atualização: 2026-09-09

## 1. Visão geral da stack

O "Eu Produtei" é um site **100% estático**: HTML puro com CSS e JavaScript
inline/vanilla, sem build step, sem framework, sem gerenciador de pacotes.

- **Linguagens**: HTML5, CSS3 (inline em `<style>` por página), JavaScript
  vanilla (ES5/ES6 simples, sem transpilação).
- **Frameworks/bibliotecas**: nenhum. Não há React, Vue, Tailwind, jQuery
  etc. Não existe `package.json`, `node_modules` nem qualquer bundler
  (Webpack/Vite/Parcel).
- **Fontes**: Google Fonts carregado via `<link>` no `<head>` de cada
  página (Fraunces, Parkinsans, IBM Plex Mono). `index.html` também
  carrega Anton, usada só no título "adesivo" da seção Indicações.
  Cada página tem dois `<link rel="preconnect">` (`fonts.googleapis.com`
  e `fonts.gstatic.com`, este com `crossorigin`) — o par recomendado
  pelo próprio Google Fonts. **Parkinsans é a fonte de corpo** (texto
  em `body`, botões de curtir/não curtir, campo de busca); antes disso
  era Inter, trocada em 2026-09-09. A troca foi só de família — mesmos
  tamanhos, pesos e entrelinhas de antes — e não exigiu nenhum ajuste
  de alinhamento: testado renderizando as duas fontes lado a lado com
  os arquivos reais (baixados do Google Fonts) nos mesmos tamanhos do
  site, a altura calculada de botão, campo de busca e parágrafo saiu
  idêntica entre Inter e Parkinsans.
- **Paleta de cores (variáveis CSS)**: definida em `:root`, duplicada em
  cada uma das 7 páginas (mesma lógica de duplicação do resto do CSS,
  ver seção 2). As variáveis se dividem em **cores oficiais da
  identidade visual** e **tons auxiliares do site** — a distinção está
  registrada também num comentário dentro do próprio CSS de cada
  página, pra não se perder.

  **Cores oficiais da identidade visual** (só mudam se a identidade
  mudar):

  | Variável             | Valor     | Onde é usada hoje |
  |----------------------|-----------|-------------------|
  | `--wine`             | `#511527` | Bordô oficial. Fundo do hero, wordmark, títulos de seção, "Ver todos os artigos" do rodapé dos artigos, entre outros. |
  | `--laranja`          | `#B7622E` | Laranja oficial. Quatro usos, listados abaixo. |
  | `--off-white-marca`  | `#D4CDBE` | Off white oficial, pra fundos escuros e peças de marca. Existe como variável desde 2026-09-09 mas **ainda não está aplicado a nenhum elemento** do site. |

  **Tons auxiliares do site** (decisões de layout/leitura, não fazem
  parte da identidade): `--wine-dark` (`#3A1420`, texto de corpo e
  bordas), `--rose` (`#D98C96`), `--blush` (`#F2CFC9`), `--beige`
  (`#EFE2CE`), `--cream` (`#FBF5EA`, fundo de página — mais leve para
  leitura longa), `--ink` (`#2A1620`) e `--paper-line`
  (`rgba(58,20,32,0.06)`, linhas divisórias).

  **Onde o laranja é aplicado** (introduzido em 2026-09-09; a lista é
  fechada de propósito — o laranja não é usado como fundo de seção,
  nem no hero, nem em títulos):
  1. `.art-body a` — links dentro do corpo dos artigos, sempre com
     `text-decoration:underline`. O sublinhado é obrigatório: a cor
     sozinha não pode ser o único indicador de que algo é clicável.
     Hoje nenhum artigo tem link no corpo, então a regra está no CSS
     mas ainda não aparece na tela.
  2. `nav ul li a:hover` — hover do menu do topo (só em `index.html`;
     as páginas de artigo não têm menu, só o wordmark).
  3. `.back-link` — o "← Voltar pros artigos" no topo de cada artigo:
     texto laranja e `border-bottom` laranja (era `--rose` até
     2026-09-09).
  4. `.footer-back` — o "← Ver todos os artigos" no rodapé de cada
     artigo, com exatamente o mesmo tratamento do `.back-link` (texto
     laranja + `border-bottom` laranja + `padding-bottom:2px`), de
     propósito: os dois são o mesmo tipo de link de volta e precisam
     parecer iguais. Antes era só texto bordô, sem sublinhado.
  5. `.react-btn[aria-pressed="true"]` — estado ativo dos botões de
     curtir/não curtir: fundo `--cream`, **borda e ícone** em laranja,
     **texto e contador em `--wine-dark`**. O estado inativo continua
     fundo `--beige` com borda, ícone e texto em `--wine-dark`. Ou
     seja: no estado ativo o laranja aparece só na borda e no ícone —
     é ele que sinaliza o estado — e o texto fica escuro por
     legibilidade. O porquê está logo abaixo.

  **Contraste do botão ativo**: a razão de contraste da WCAG é
  **simétrica** entre as duas cores comparadas — trocar o que é fundo
  e o que é texto não altera o número. Laranja `#B7622E` com `--cream`
  dá ≈4.03:1 tanto com o laranja no fundo quanto no texto, e como o
  texto do botão é 14px/peso 600 (não conta como "texto grande"), isso
  ficava abaixo do mínimo AA de 4.5:1 nas duas versões anteriores. A
  solução adotada em 2026-09-09 foi tirar o laranja **do texto**, não
  invertê-lo:

  | Elemento do estado ativo | Cores | Razão | Régua WCAG |
  |---|---|---|---|
  | Texto "Curti"/"Não curti" | `--wine-dark` sobre `--cream` | ≈14.9:1 | 4.5:1 (texto) ✅ |
  | Contador (com `opacity:0.85`) | `--wine-dark` sobre `--cream` | ≈9.7:1 | 4.5:1 (texto) ✅ |
  | Borda e ícone | `--laranja` sobre `--cream` | ≈4.03:1 | 3:1 (componente de interface) ✅ |

  O contador precisou mudar junto com o texto: em laranja, com o
  `opacity:0.85` que ele já tinha, a razão efetiva caía para ≈3.2:1.

  Histórico das três versões, porque a razão de ser da atual só faz
  sentido com ele: (1) fundo laranja + texto creme → 4.03:1;
  (2) fundo creme + texto laranja → os mesmos 4.03:1, pela simetria
  acima; (3) atual, fundo creme + borda/ícone laranja + texto escuro →
  passa em tudo. Se um dia alguém quiser o texto em laranja de novo, o
  único jeito de passar em AA é escurecer o próprio tom (a partir de
  ≈`#A85526`), o que significaria usar um laranja diferente do oficial
  nesse componente.
- **Analytics**: Google Analytics 4 (gtag.js), com o Measurement ID
  `G-XF33JMSZ0X`, instalado manualmente (copiado/colado) no `<head>` de
  **todas** as páginas — `index.html` e os 6 artigos.
- **Hospedagem/deploy**: repositório GitHub
  (`paulasantospereira31-web/euprodutei`) conectado ao **Netlify**, que
  publica automaticamente a cada push na branch `main`. O domínio
  público é **euprodutei.com.br**.
  - Não há `netlify.toml`, `_redirects` nem pasta de Netlify Functions
    no repositório — a configuração de build/publish (site estático,
    sem comando de build, diretório de publicação = raiz do repo) vive
    inteiramente no painel do Netlify, não versionada em código.
  - Não há workflow do GitHub Actions (`.github/workflows`) nem arquivo
    `CNAME` — ou seja, o deploy não é feito via GitHub Pages, é o
    Netlify que observa o repositório e republica sozinho.
  - **Limitação desta documentação**: não foi possível inspecionar os
    cabeçalhos HTTP do site em produção nem o painel do Netlify
    diretamente (o ambiente onde esta documentação foi gerada não tem
    acesso de rede irrestrito à internet pública). As afirmações acima
    sobre Netlify refletem o que foi informado por quem mantém o
    projeto; a única coisa 100% verificada por inspeção do repositório
    é: push em `main` → o conteúdo em `main` é o que deve ir ao ar.

## 2. Estrutura de pastas

```
euprodutei/
├── index.html                  # Página inicial (home) — única página com todas as seções
├── assets/
│   ├── reactions.js             # JS compartilhado do widget de curtir/não curtir
│   ├── search.js                # JS da busca de artigos (só carregado por index.html)
│   ├── sort-articles.js         # ordena os artigos por data (só carregado por index.html)
│   ├── books/                   # Capas dos livros indicados na seção Indicações
│   │   ├── inspirado.jpg
│   │   └── jornada-transicao-produtos.jpg
│   ├── podcasts/                # Capas dos podcasts indicados na seção Indicações
│   │   ├── mulheres-de-produto.webp        # imagem original (share card do Spotify, não usada diretamente)
│   │   ├── mulheres-de-produto-cover.jpg   # recorte quadrado da capa, usado no site
│   │   ├── product-gurus.webp              # imagem original (share card do Spotify, não usada diretamente)
│   │   └── product-gurus-cover.jpg         # recorte quadrado da capa, usado no site
│   └── og/
│       └── og-image.jpg         # imagem de compartilhamento (Open Graph/Twitter Card), 1200x630
└── articles/                   # Uma página HTML por artigo (sem template/gerador — cada
    │                            # arquivo é escrito à mão e duplica o <head>/CSS do index)
    ├── chorei-feedback.html
    ├── decepcionar-quase-toda-semana.html
    ├── dez-minutos-scroll-manha-duvida.html
    ├── feedback-opiniao-fato.html
    ├── gerenciar-produto-nao-e-backlog.html
    └── perguntas-produtivo.html
```

Não há `/docs`, `/src`, `/public` ou qualquer outra convenção de projeto
com build — os arquivos servidos são exatamente os arquivos do
repositório, sem transformação.

Cada página de artigo repete integralmente o bloco `<style>` do
`index.html` (as variáveis de cor `--wine`, `--rose`, `--beige` etc. e as
classes tipográficas), porque não há um arquivo CSS compartilhado nem
processo de build que permitisse extrair isso — é HTML copiado/colado
com o conteúdo do artigo trocado. Alterações visuais (ex.: cor de um
botão) precisam ser replicadas manualmente em `index.html` **e** nos 6
arquivos de `articles/`.

## 3. Funcionalidades implementadas

### 3.1 Curtir / Não curtir nos artigos

**Onde vive**: `assets/reactions.js`, referenciado via
`<script src="../assets/reactions.js" defer></script>` no final do
`<body>` de cada um dos 6 artigos (não existe na home).

**Como funciona, passo a passo**:

1. Cada artigo tem um bloco `<div class="reactions" data-article="<slug>">`
   com dois botões (`.react-like` e `.react-dislike`), cada um com um
   ícone SVG de joinha e um `<span class="react-count">`.
2. Ao carregar a página, o script:
   - Lê do `localStorage` a chave `euprodutei-reactions`, um único JSON
     que guarda a contagem de like/dislike de **todos** os artigos,
     indexado pelo slug (`data-article`).
   - Lê também `euprodutei-vote-<slug>`, que guarda se **este
     navegador** já votou like/dislike naquele artigo específico.
3. Ao clicar em um botão, a contagem local é incrementada/decrementada
   (com toggle: clicar de novo remove o voto; trocar de like pra
   dislike remove o voto anterior e soma no novo) e tudo é regravado no
   `localStorage`.
4. Se `window.gtag` existir (ou seja, se o Google Analytics carregou), o
   clique também dispara um evento GA4 (`curtir_artigo` ou
   `nao_curtir_artigo`, com parâmetros `artigo` = slug e `acao` =
   `adicionar`/`remover`).

**Onde os dados realmente ficam — ponto crítico**:

- **Os números que aparecem no botão (`0`, `1`, etc.) são armazenados
  exclusivamente no `localStorage` do navegador de quem está lendo.**
  Não há banco de dados, não há Netlify Blobs/Functions, não há API.
- Isso significa que **cada visitante vê apenas a própria contagem**.
  Se 10 pessoas diferentes curtirem o mesmo artigo, cada uma vai ver
  "Curti 1" no seu próprio navegador — os votos **não são somados nem
  compartilhados entre visitantes**, e Paula (a autora) não consegue
  ver esses números de contagem em lugar nenhum.
- O único registro que **agrega dados de todos os visitantes** é o
  Google Analytics (seção 3.2), através dos eventos `curtir_artigo` /
  `nao_curtir_artigo` — é lá, e não no botão em si, que dá pra saber
  quantas pessoas no total curtiram ou não curtiram cada artigo.
- Se no futuro for necessário um contador público e agregado (visível
  igual para todo mundo), será preciso adicionar um backend real — por
  exemplo Netlify Functions + Netlify Blobs (ou outro banco), já que
  hoje não existe nenhuma peça de servidor no projeto.

### 3.2 Google Analytics (GA4)

- Snippet padrão do `gtag.js` (Measurement ID `G-XF33JMSZ0X`) colado
  manualmente no `<head>` de **todas** as 7 páginas do site.
- Rastreia automaticamente page views (`page_view`) em cada página.
- Rastreia os eventos customizados `curtir_artigo` e `nao_curtir_artigo`
  disparados pelo `assets/reactions.js` (ver 3.1).
- Painel de consulta: [analytics.google.com](https://analytics.google.com),
  propriedade "Eu Produtei" → Relatórios → Tempo real (dados quase
  instantâneos) ou Relatórios → Envolvimento → Eventos (dados
  consolidados, com atraso de algumas horas).

### 3.3 Filtro de artigos por categoria

- Implementado **sem nenhum JavaScript**, só CSS: um grupo de
  `<input type="radio" name="catfilter">` ocultos (`.filter-radio`) mais
  seletores `:checked ~` no CSS que escondem `.article-row` cujo
  `data-category` não bate com o filtro selecionado.
- As categorias existentes hoje: `produto`, `comunicacao`, `lideranca`,
  `dia-a-dia` — atribuídas via `data-category="..."` em cada link de
  artigo dentro de `.article-list`. (Categorias antigas `discovery` e
  `ia` foram descontinuadas e viraram parte de `produto`; já
  `dia-a-dia` chegou a ser removida — os 3 artigos que estavam nela
  foram redistribuídos entre `produto`, `comunicacao` e `lideranca` —
  mas foi **reintroduzida depois** como categoria própria, ao publicar
  "Dez minutos de scroll, uma manhã inteira de dúvida".)
- **Visibilidade condicional dos filtros**: cada `label.filter-pill`
  (exceto "Todos", que é sempre visível) começa com `display:none` e só
  volta a `display:inline-block` se existir, em algum lugar dentro de
  `#artigos`, um `.article-row[data-category="..."]` correspondente —
  verificado via seletor CSS `:has()`
  (`#artigos:has(.article-row[data-category="produto"]) .filter-pill[for="f-produto"]`).
  Isso é 100% CSS, sem JavaScript: assim que o primeiro artigo de uma
  categoria nova (ex.: `lideranca`) for publicado com o
  `data-category` certo, o botão de filtro correspondente aparece
  sozinho — e se todos os artigos de uma categoria forem removidos, o
  filtro correspondente volta a desaparecer sozinho.
- Ao adicionar um novo artigo, é preciso: (1) criar o HTML do artigo,
  (2) adicionar um `<a class="article-row" data-category="...">`
  apontando pra ele em `index.html`. Se for uma categoria já existente
  (`produto`, `comunicacao`, `lideranca` ou `dia-a-dia`), o filtro
  correspondente já existe e aparece automaticamente. Se for uma
  categoria **nova** (além dessas 4), é preciso também adicionar o
  `<input type="radio">`, o `<label class="filter-pill">` e as 3
  regras de CSS (estado ativo, visibilidade condicional via `:has()`,
  e a regra que esconde `.article-row` de outras categorias) seguindo
  o padrão das demais.

### 3.4 Ordenação dos artigos por data de publicação

- **Onde vive**: `assets/sort-articles.js`, referenciado só por
  `index.html`, antes de `assets/search.js` no final do `<body>`.
- **Campo usado como critério de ordenação**: o atributo
  `data-date="AAAA-MM-DD"` em cada `<a class="article-row">` — **não**
  é o texto visível `.art-date` (que só mostra "JUL 2026" e não tem
  granularidade de dia) nem a ordem de inserção no HTML/data de criação
  do arquivo. `data-date` é um campo próprio, textual, só pra
  ordenação — parecido em espírito com `data-category`.
- **Como funciona**: ao carregar a página, o script pega todos os
  `.article-row[data-date]` dentro da lista de artigos (excluindo o
  container da busca, que também usa a classe `.article-list`),
  ordena em ordem decrescente de `data-date` (string ISO, então
  comparação de texto já ordena cronologicamente) e reinsere os
  elementos no DOM nessa ordem. Isso acontece **antes** de qualquer
  filtro por categoria ou busca rodar — como filtro e busca não mudam
  a ordem relativa dos itens (só escondem os que não combinam ou
  renderizam uma lista separada), o resultado já sai ordenado em
  ambos os casos, sem lógica extra de ordenação em `search.js` ou no
  CSS dos filtros.
- Artigos com a mesma `data-date` (os 5 originais, todos
  `2026-07-16`) mantêm a ordem relativa em que aparecem no HTML — o
  sort é estável (`Array.prototype.sort`), então isso é
  determinístico, não aleatório.
- **Ao publicar um novo artigo**: basta adicionar o `data-date` correto
  (formato `AAAA-MM-DD`) no `<a class="article-row">` dele. Não é
  preciso reordenar manualmente o HTML — o script já coloca o artigo
  na posição certa (mais recente primeiro) sozinho, em qualquer
  navegador, a cada carregamento da página.

### 3.5 Busca de artigos

- **Onde vive**: `assets/search.js`, referenciado só por `index.html`
  (não existe busca nas páginas individuais de artigo). Input de busca
  em `#article-search`, dentro da seção `#artigos`.
- **Como funciona**: ao digitar, o script busca o termo tanto no
  título quanto no **corpo completo** de cada artigo. Como o texto
  completo não está na home, o script faz `fetch()` do HTML de cada
  artigo (mesma origem, sem necessidade de servidor/API) na primeira
  busca, guarda o texto em memória (cache simples, só dura enquanto a
  página está aberta) e reutiliza nas buscas seguintes.
- A busca ignora acentuação (compara removendo diacríticos com
  `normalize('NFD')`), então "voce" encontra "você".
- O termo encontrado é destacado com `<mark class="search-hit">`,
  estilizado na cor `--rose`, dentro de um trecho (snippet) do corpo do
  artigo ao redor do ponto onde o termo aparece.
- Quando há termo de busca ativo, a lista normal (`.article-list`) e os
  filtros de categoria (`.filter-row`) ficam ocultos, e os resultados
  aparecem em `#search-results`. Limpar o campo de busca volta ao modo
  normal (lista + filtros). Se nenhum artigo bater com o termo, mostra
  a mensagem "Nenhum resultado encontrado. Tente utilizar outra palavra
  ou termo relacionado." em vez da lista.
- **Nota técnica**: existe uma regra global `[hidden]{display:none
  !important;}` no CSS, necessária porque `.article-list` e
  `.filter-row` definem `display:flex` via classe, que teria
  especificidade maior que o `display:none` que o navegador aplica por
  padrão ao atributo HTML `hidden` — sem essa regra, o atributo
  `hidden` não escondia esses elementos.

### 3.6 "Mais lidos" e "Indicações"

- `.mais-lidos`: lista estática de destaques dentro da seção de
  artigos — hoje só tem 1 item, hardcoded no HTML (`<a class="ml-item">`),
  sem lógica de "mais lido de verdade" (não é calculado a partir de
  dados reais de acesso).
- `#indicacoes`: seção de livros/podcasts. As subseções "Livros" e
  "Podcasts" já têm 2 indicações reais cada, todas em `.rec-card`
  (capa + `.rec-title` + `.rec-author` + `.rec-desc`) — layout
  hardcoded no HTML, sem CMS/dados externos. Existiu um placeholder
  tracejado (`.rec-empty`) enquanto as colunas estavam vazias; ele saiu
  do HTML quando as indicações reais entraram, e a regra CSS órfã foi
  removida em 2026-09-09 (ver seção 3.9).
  - **Layout (`.rec-grid` e `.rec-cards`)**: no desktop, `.rec-grid`
    empilha as subseções "Livros" e "Podcasts" em largura total, uma
    embaixo da outra (`grid-template-columns:1fr`) — não ficam mais
    lado a lado. Dentro de cada subseção (`.rec-col`), os cards ficam
    num grid próprio, `.rec-cards` (`grid-template-columns:1fr 1fr`),
    aproveitando a largura total disponível. No mobile
    (`max-width:720px`), só `.rec-cards` muda para 1 coluna — a
    estrutura de `.rec-grid` já era empilhada em qualquer largura,
    então o mobile não foi alterado por essa mudança.
  - Capas de livro usam a classe `.rec-cover` (proporção retrato,
    76×108 no desktop / 88×125 no mobile).
  - Capas de podcast usam `.rec-cover.rec-cover-square` (proporção
    quadrada, 88×88 no desktop / 100×100 no mobile) — a segunda classe
    só sobrescreve `width`/`height` do `.rec-cover` base.
  - **Nota sobre as imagens de podcast**: os arquivos que chegaram
    (`mulheres-de-produto.webp`, `product-gurus.webp`) eram os cards de
    compartilhamento completos do Spotify (retrato, com fundo colorido
    e texto), não a capa quadrada isolada. Antes de usar, a capa
    quadrada foi recortada de dentro de cada imagem (via script Python
    com Pillow, identificando a borda do quadrado por análise de
    pixel) e salva como `*-cover.jpg` — são esses arquivos `-cover.jpg`
    que o site realmente usa; os `.webp` originais ficaram no repo só
    de referência.
- Ao adicionar uma nova indicação: (1) salvar a capa em `assets/books/`
  ou `assets/podcasts/` (usando uma imagem já recortada no formato
  certo — retrato para livro, quadrada para podcast), (2) copiar o
  padrão de um `.rec-card` existente dentro do `.rec-col`
  correspondente.

### 3.7 Seção Sobre

- Bio de Paula Rodrigues em `index.html#sobre`, com foto embutida
  diretamente como `data:image/jpeg;base64,...` dentro do próprio HTML
  (não é um arquivo de imagem separado em `/assets`). Isso deixa o
  `index.html` com ~70 KB majoritariamente por causa dessa imagem
  embutida.
- **Título "Quem é 👀 essa tal de Paula?"** usa a classe
  `h2.collage-title`: mesma fonte (Anton) e mesma técnica de contorno
  (`text-shadow` em 8 direções + sombra) já usada no título adesivo de
  Indicações (`h2.sticker-title`, seção 3.6), mas aplicada **palavra
  por palavra** em vez de linha por linha. Cada
  palavra é um `<span class="cw cw-wine">` ou `<span class="cw
  cw-rose">`, com `transform:rotate(...) translateY(...)` inline
  definido individualmente por palavra (rotações entre -3 e 3 graus,
  deslocamento vertical pequeno e alternado), criando o efeito de
  "colagem". O emoji 👀 usa `cw-emoji` (mesma rotação inline, mas
  `text-shadow:none` — só o texto tem contorno). Para editar esse
  título no futuro, cada palavra precisa ser ajustada manualmente (não
  há geração automática de rotação via JS).

### 3.8 Meta tags para compartilhamento (Open Graph / Twitter Card)

- Todas as 7 páginas (`index.html` + os 6 artigos) têm no `<head>`,
  logo após o `<title>`: `meta name="description"`, o conjunto completo
  de `og:*` (`title`, `description`, `image`, `image:width`,
  `image:height`, `url`, `type`, `site_name`, `locale`) e o conjunto de
  `twitter:*` (`card`, `title`, `description`, `image`). Isso controla
  a prévia que aparece ao colar um link do site no LinkedIn, Instagram,
  WhatsApp, etc.
- **`index.html`**: `og:title` = "Eu Produtei — A casa de quem vive
  Produto", `og:type` = `website`, `og:url` =
  `https://euprodutei.com.br`.
- **Cada artigo**: título/descrição próprios (reaproveitando o mesmo
  texto do `<title>` da página e o `.art-excerpt` já usado no card do
  artigo em `index.html`), `og:type` = `article` (em vez de `website`,
  por ser tecnicamente mais correto para uma página de post), `og:url`
  apontando para a URL daquele artigo específico
  (`https://euprodutei.com.br/articles/<arquivo>.html`).
- **Imagem** (`assets/og/og-image.jpg`, 1200×630px, formato recomendado
  pelo Facebook/LinkedIn): mesma imagem para todas as páginas — não há
  imagem própria por artigo. Foi criada renderizando um HTML próprio
  (fundo vinho com a textura de pontos do Hero, o carimbo "Dados viram
  decisões. Decisões viram produto." e "Eu Produtei" em destaque, com
  as fontes reais do site — Fraunces e IBM Plex Mono — baixadas e
  embutidas) e tirando um screenshot via Playwright; esse processo de
  geração não faz parte do site em si e não precisa ser repetido a
  menos que a imagem precise mudar.
- Ao criar um novo artigo, é preciso copiar esse bloco de meta tags
  para o novo arquivo e trocar `og:title`/`twitter:title`,
  `og:description`/`twitter:description`, `og:url` e o `<meta
  name="description">` para o título/resumo/URL daquele artigo — não
  há nenhuma automação que gera isso.

### 3.9 Limpeza de CSS órfão (2026-09-09)

Como o CSS mora inline em cada página e nada faz "tree shaking", regras
que deixam de ser usadas ficam paradas no arquivo. Nessa data foram
removidas do `index.html`, depois de confirmar por busca em todo o repo
que nenhum HTML e nenhum JS as referenciava:

- `.cardstock` — textura de pontinhos que não estava aplicada a nenhum
  elemento (o hero tem a própria textura, em outra regra).
- `.example-flag` — selo "exemplo" que sobrou de uma versão antiga da
  seção de artigos.
- `.rec-empty` — placeholder tracejado das colunas de Indicações, sem
  uso desde que as indicações reais entraram (seção 3.6).
- A variável `--gold` (`#C79A56`), que só era usada pelo
  `.example-flag` e não faz parte da identidade visual.

Nenhuma dessas remoções muda a aparência do site — todas eram regras
sem elemento correspondente no HTML.

## 4. Deploy contínuo

Fluxo hoje, na prática:

1. Alterações são feitas localmente nos arquivos HTML/JS.
2. `git add` + `git commit` + `git push` para a branch `main` do
   repositório `paulasantospereira31-web/euprodutei` no GitHub.
3. O Netlify está configurado (fora do repositório, no painel do
   Netlify) para observar a branch `main` e publicar automaticamente
   qualquer novo commit nela — sem etapa de build (site estático puro),
   apenas copiando os arquivos para o CDN do Netlify.
4. O domínio customizado **euprodutei.com.br** aponta para esse site no
   Netlify (configuração de DNS/domínio feita no painel do Netlify,
   também fora do repositório).

Não existe ambiente de staging/preview automatizado documentado neste
repositório — o fluxo observado nas sessões anteriores foi: trabalhar
numa branch separada (`claude/...`), validar localmente servindo os
arquivos com um servidor HTTP simples (ex. `python3 -m http.server`) e
tirando screenshots com Playwright, e só então dar fast-forward/merge
na `main` para ir ao ar.
