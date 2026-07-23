# Documentação técnica — Eu Produtei

> Última atualização: 2026-07-22

## 1. Visão geral da stack

O "Eu Produtei" é um site **100% estático**: HTML puro com CSS e JavaScript
inline/vanilla, sem build step, sem framework, sem gerenciador de pacotes.

- **Linguagens**: HTML5, CSS3 (inline em `<style>` por página), JavaScript
  vanilla (ES5/ES6 simples, sem transpilação).
- **Frameworks/bibliotecas**: nenhum. Não há React, Vue, Tailwind, jQuery
  etc. Não existe `package.json`, `node_modules` nem qualquer bundler
  (Webpack/Vite/Parcel).
- **Fontes**: Google Fonts carregado via `<link>` no `<head>` de cada
  página (Fraunces, Inter, IBM Plex Mono). `index.html` também carrega
  Anton, usada só no título "adesivo" da seção Indicações.
- **Analytics**: Google Analytics 4 (gtag.js), com o Measurement ID
  `G-XF33JMSZ0X`, instalado manualmente (copiado/colado) no `<head>` de
  **todas** as páginas — `index.html` e os 5 artigos.
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
botão) precisam ser replicadas manualmente em `index.html` **e** nos 5
arquivos de `articles/`.

## 3. Funcionalidades implementadas

### 3.1 Curtir / Não curtir nos artigos

**Onde vive**: `assets/reactions.js`, referenciado via
`<script src="../assets/reactions.js" defer></script>` no final do
`<body>` de cada um dos 5 artigos (não existe na home).

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
  manualmente no `<head>` de **todas** as 6 páginas do site.
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
- As categorias existentes hoje: `produto`, `comunicacao`, `lideranca`
  — atribuídas via `data-category="..."` em cada link de artigo dentro
  de `.article-list`. (Categorias antigas — `discovery`, `ia`,
  `dia-a-dia` — foram descontinuadas: `discovery` e `ia` viraram parte
  de `produto`; os 3 artigos que estavam em `dia-a-dia` foram
  redistribuídos individualmente entre `produto`, `comunicacao` e
  `lideranca`, conforme o tema de cada um.)
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
  (`produto`, `comunicacao` ou `lideranca`), o filtro correspondente já
  existe e aparece automaticamente. Se for uma categoria **nova** (além
  dessas 3), é preciso também adicionar o `<input type="radio">`, o
  `<label class="filter-pill">` e as 3 regras de CSS (estado ativo,
  visibilidade condicional via `:has()`, e a regra que esconde
  `.article-row` de outras categorias) seguindo o padrão das demais.

### 3.4 Busca de artigos

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

### 3.5 "Mais lidos" e "Indicações"

- `.mais-lidos`: lista estática de destaques dentro da seção de
  artigos — hoje só tem 1 item, hardcoded no HTML (`<a class="ml-item">`),
  sem lógica de "mais lido de verdade" (não é calculado a partir de
  dados reais de acesso).
- `#indicacoes`: seção de livros/podcasts. As colunas "Livros" e
  "Podcasts" já têm 2 indicações reais cada, todas em `.rec-card`
  (capa + `.rec-title` + `.rec-author` + `.rec-desc`) — layout
  hardcoded no HTML, sem CMS/dados externos. Não sobrou nenhum
  `.rec-empty` nessa seção; a classe continua no CSS caso uma coluna
  nova precise dela no futuro.
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
  correspondente, (3) remover o `.rec-empty` daquela coluna
  se for a primeira indicação dela.

### 3.6 Seção Sobre

- Bio de Paula Rodrigues em `index.html#sobre`, com foto embutida
  diretamente como `data:image/jpeg;base64,...` dentro do próprio HTML
  (não é um arquivo de imagem separado em `/assets`). Isso deixa o
  `index.html` com ~70 KB majoritariamente por causa dessa imagem
  embutida.
- **Título "Quem é 👀 essa tal de Paula?"** usa a classe
  `h2.collage-title`: mesma fonte (Anton) e mesma técnica de contorno
  (`text-shadow` em 8 direções + sombra) já usada no título adesivo de
  Indicações (`h2.sticker-title`, seção 3.5), mas aplicada **palavra
  por palavra** em vez de linha por linha. Cada
  palavra é um `<span class="cw cw-wine">` ou `<span class="cw
  cw-rose">`, com `transform:rotate(...) translateY(...)` inline
  definido individualmente por palavra (rotações entre -3 e 3 graus,
  deslocamento vertical pequeno e alternado), criando o efeito de
  "colagem". O emoji 👀 usa `cw-emoji` (mesma rotação inline, mas
  `text-shadow:none` — só o texto tem contorno). Para editar esse
  título no futuro, cada palavra precisa ser ajustada manualmente (não
  há geração automática de rotação via JS).

### 3.7 Meta tags para compartilhamento (Open Graph / Twitter Card)

- Todas as 6 páginas (`index.html` + os 5 artigos) têm no `<head>`,
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
