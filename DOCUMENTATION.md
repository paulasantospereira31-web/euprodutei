# Documentação técnica — Eu Produtei

> Última atualização: 2026-09-17

## 1. Visão geral da stack

O "Eu Produtei" é um site **100% estático**: HTML puro com CSS e JavaScript
inline/vanilla, sem build step, sem framework, sem gerenciador de pacotes.

- **Linguagens**: HTML5, CSS3 (inline em `<style>` por página), JavaScript
  vanilla (ES5/ES6 simples, sem transpilação).
- **Frameworks/bibliotecas**: nenhum. Não há React, Vue, Tailwind, jQuery
  etc. Não existe `package.json`, `node_modules` nem qualquer bundler
  (Webpack/Vite/Parcel).
- **Fontes**: desde 2026-09-17 as fontes vêm de **duas origens**, e o
  detalhamento completo está na **seção 3.11**:
  - **Arquivos `.woff2` do próprio site**, em `assets/brand/`, com
    `@font-face` declarado no `<style>` de cada página: **Coolvetica**
    (fonte de títulos) e **Vintage Rotter** (script ornamental, um
    único componente: a classe `.rose-word`).
  - **Google Fonts** via `<link>` no `<head>`: **Parkinsans** (fonte de
    corpo), **IBM Plex Mono** (etiquetas, datas, textos em caixa alta)
    e **Fraunces**, esta última reduzida a **um único uso** — ver a
    exceção na seção 3.11. **Anton foi removida** em 2026-09-17, junto
    com os pesos não-itálicos da Fraunces.

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
  cada uma das 8 páginas (mesma lógica de duplicação do resto do CSS,
  ver seção 2). As variáveis se dividem em **cores oficiais da
  identidade visual** e **tons auxiliares do site** — a distinção está
  registrada também num comentário dentro do próprio CSS de cada
  página, pra não se perder.

  **Cores oficiais da identidade visual** (só mudam se a identidade
  mudar):

  | Variável             | Valor     | Onde é usada hoje |
  |----------------------|-----------|-------------------|
  | `--wine`             | `#511527` | Bordô oficial. Fundo do hero, `.eyebrow`, `.section-sub`, "Ver todos os artigos" do rodapé dos artigos, entre outros. (O logo do header não usa a variável — é um SVG com a cor embutida no arquivo.) |
  | `--laranja`          | `#B7622E` | Laranja oficial. Sete usos, listados abaixo. |
  | `--rosa-escuro`      | `#942F4D` | Rosa escuro oficial. Dois usos, os dois herdados do `--rose` por causa de contraste: a classe `.rose-word` (a palavra "Paula", seção 3.7) e o `.rec-author` (nomes de autor nos cards de Indicações, seção 3.6). |
  | `--pessego`          | `#D9A27F` | Pêssego oficial. Um uso: fundo da seção Indicações (`.section-pessego`), ver seção 3.6. Entrou em 2026-09-17 no lugar do bege. |
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
     as outras 7 páginas não têm menu, só o logo).
  3. `.back-link` — o "← Voltar pros artigos" no topo de cada artigo:
     texto laranja e `border-bottom` laranja (era `--rose` até
     2026-09-09).
  4. `.footer-back` — o "← Ver todos os artigos" no rodapé de cada
     artigo, com exatamente o mesmo tratamento do `.back-link` (texto
     laranja + `border-bottom` laranja + `padding-bottom:2px`), de
     propósito: os dois são o mesmo tipo de link de volta e precisam
     parecer iguais. Antes era só texto bordô, sem sublinhado.
  5. `.chamada-link` — o link "Quem escreve →" da chamada na home
     (seção 3.7), com o mesmo tratamento do `.back-link`/`.footer-back`.
     É a mesma família de componente: link que leva de uma página a
     outra. A diferença é só a seta, que aponta pra frente.
  6. `.art-body .brand` — o nome "Eu Produtei" quando aparece dentro do
     corpo da `quem-escreve.html` (seção 3.7). Retoma a intenção da
     antiga `.about-text .brand`, que destacava o nome da marca no
     texto e era bordô. É a única exceção à regra "o laranja marca
     navegação ou estado": aqui ele marca **a própria marca**, que é
     justamente de onde a cor vem. **Não** se aplica ao `.art-q` ("Por
     que existe a Eu Produtei?"), que fica na cor do corpo por decisão
     explícita, nem a nomes de empresa no texto.
  7. `.react-btn[aria-pressed="true"]` — estado ativo dos botões de
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
  **todas** as páginas — `index.html`, `quem-escreve.html` e os 6 artigos.
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
├── index.html                  # Página inicial (home): hero, artigos, indicações, chamada do Quem escreve, contato
├── quem-escreve.html           # Página do "Quem escreve" (ver seção 3.7). Fica na raiz, e não em
│                               # articles/, porque é página de nível superior do menu, não artigo
├── assets/
│   ├── reactions.js             # JS compartilhado do widget de curtir/não curtir
│   ├── search.js                # JS da busca de artigos (só carregado por index.html)
│   ├── sort-articles.js         # ordena os artigos por data (só carregado por index.html)
│   ├── paula-rodrigues.jpg      # foto de perfil, 375x500. Era base64 dentro do index.html até 2026-09-17
│   ├── brand/                   # Arquivos oficiais da marca (logos e favicon: seção 3.10; fontes: seção 3.11)
│   │   ├── EuProdutei_Logotipoprincipal_bordo.svg   # logo horizontal, 1200x400 (proporção 3:1)
│   │   ├── EuProdutei_Logotiporeduzido_bordo.svg    # logo reduzido, 1000x1000 (quadrado)
│   │   ├── favicon.svg                              # ícone do site, 1200x1200
│   │   ├── apple-touch-icon.png                     # 180x180, rasterizado a partir do favicon.svg
│   │   ├── Coolvetica-Regular.woff2                 # fonte de títulos, peso 400
│   │   ├── CoolveticaEl-Regular.woff2               # mesma família, peso 250 (ExtraLight) — declarada, sem uso hoje
│   │   ├── VintageRotterPersonalUseOnl-R.woff2      # script ornamental, peso 400 — um único uso ("Paula", seção 3.7)
│   │   └── Parkinsans-Light.woff2                   # NÃO USADO: a Parkinsans vem do Google Fonts (ver seção 3.11)
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
  manualmente no `<head>` de **todas** as 8 páginas do site.
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
  - **Fundo pêssego (desde 2026-09-17)**: a seção usa
    `.section-pessego{background:var(--pessego)}` (`#D9A27F`). Antes era
    `.section-beige` (`#EFE2CE`); como a Indicações era a **única** seção
    que ainda usava aquela classe (a outra, `#sobre`, saiu em
    2026-09-17), a `.section-beige` foi substituída e não duplicada —
    ela não existe mais. A variável `--beige` continua em uso em outros
    lugares (nav das páginas de artigo, fundo de `blockquote`, estado
    inativo dos botões de curtir).
  - Os `.rec-card` **já tinham** `background:var(--cream)` desde que
    foram criados. Não foi preciso mudar nada neles: como o creme é bem
    mais claro que o pêssego, os cards passaram a se destacar **mais**
    do que se destacavam do bege. A separação card/fundo saiu de 1,18:1
    (praticamente invisível) para 2,05:1.
  - **Título e subtítulo (desde 2026-09-17)**: o título é
    "Esses eu empresto. (Na teoria.)" num `h2.section-title` comum,
    exatamente o mesmo componente do "De produteira pra produteira" da
    seção Artigos. Antes era um título "adesivo" com contorno, sombra e
    rotação (`h2.sticker-title`), removido junto com suas 4 regras de
    CSS (ver seção 3.9).
  - **Contraste dentro da seção**: a troca do bege pelo pêssego escureceu
    o fundo, então todos os textos perderam contraste. Medido:

    | Texto | Fundo | Antes (bege) | Depois (pêssego) | Régua |
    |---|---|---|---|---|
    | `.eyebrow` ("INDICAÇÕES") | seção | 11,06:1 | 6,34:1 | 4,5:1 ✅ |
    | `.section-title` | seção | 11,06:1 | 7,25:1 | 3:1 (texto grande) ✅ |
    | `.section-sub` (hoje `--wine`, sem opacity) | seção | 5,75:1 | **6,34:1** | 4,5:1 ✅ |
    | `.rec-col h3` ("LIVROS"/"PODCASTS") | seção | 11,06:1 | 6,34:1 | 4,5:1 ✅ |
    | `.rec-title` | card creme | 14,88:1 | 14,88:1 | 4,5:1 ✅ |
    | `.rec-author` (hoje `--rosa-escuro`) | card creme | 2,38:1 | **6,98:1** | 4,5:1 ✅ |
    | `.rec-desc` (`--wine-dark` com `opacity:0.85`) | card creme | 9,66:1 | 9,66:1 | 4,5:1 ✅ |

    Os dois valores marcados em negrito mudaram **depois** da troca de
    fundo, num segundo passo no mesmo dia, porque com o pêssego eles não
    passavam:

    - **`.section-sub`**: a `opacity:0.72` saiu do componente e a cor
      passou a ser explícita, `var(--wine)`. Detalhes abaixo, porque isso
      afeta o site inteiro, não só esta seção.
    - **`.rec-author`**: os nomes de autor saíram do `--rose` (2,38:1,
      que já era o valor **antes** de qualquer mudança aqui, por estarem
      sobre o creme do card) para o `--rosa-escuro` que já existia,
      chegando a 6,98:1. Continua sendo um rosa, só que legível.
  - **O componente `.section-sub` mudou para o site inteiro** (não só
    aqui), em 2026-09-17. Era
    `color:var(--wine-dark);opacity:0.72;` e passou a
    `color:var(--wine);` sem opacity. O motivo: a opacidade era o que
    dava ao subtítulo o ar de texto secundário, mas ela **depende do
    fundo** — sobre o creme claro entregava 6,30:1, e sobre o pêssego
    caía para 4,12:1. Cor explícita não tem esse problema.

    Por que `--wine` e não `--wine-dark`: entre as variáveis do projeto
    que passam 4,5:1 nos dois fundos onde o subtítulo aparece, `--wine`
    é a mais clara. As alternativas ficariam mais pesadas ainda
    (`--wine-dark` 14,88:1 no creme, `--ink` 15,68:1), e as mais claras
    não passam sobre o pêssego (`--rosa-escuro` 3,40:1, `--laranja`
    1,96:1).

    | Onde aparece | Fundo | Antes | Depois |
    |---|---|---|---|
    | `#artigos` ("Sem enfeite, sem polimento...") | creme | 6,30:1 | **13,02:1** |
    | `#indicacoes` ("Essa lista muda junto comigo...") | pêssego | 4,12:1 | **6,34:1** |
    | `quem-escreve.html` (subtítulo da página) | creme | 6,30:1 | **13,02:1** |

    **Consequência assumida**: sobre o creme o subtítulo ficou cerca de
    duas vezes mais escuro do que era. A hierarquia entre título e
    subtítulo agora é feita **por tamanho e por família** (título em
    Coolvetica 36px, subtítulo em Parkinsans 15,5px) e por um tom de
    bordô diferente, não mais por desbotamento.

    Atenção: a regra `.search-empty` (mensagem de "nenhum resultado" da
    busca, seção 3.5) **ainda usa `opacity:0.72`**. Ela não foi tocada
    porque só aparece sobre o creme, onde dá 6,30:1 e passa.
  - A regra `.rec-meta` continua no CSS **sem nenhum elemento usando**.
    Se um dia for usada, atenção: em `opacity:0.6` sobre o creme ela dá
    4,30:1, abaixo de 4,5:1.
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

### 3.7 Quem escreve (página própria + chamada na home)

Até 2026-09-17 a bio ficava num bloco `#sobre` **dentro da home**, com
um título "colagem" ("Quem é 👀 essa tal de Paula?") e a foto embutida
como `data:image/jpeg;base64,...` no próprio HTML. Nessa data isso foi
refatorado: a bio virou **página própria** e na home ficou só uma
chamada curta.

#### A página `quem-escreve.html`

Fica **na raiz do repositório**, não em `articles/`, porque é página de
nível superior do menu e não artigo. Por isso os caminhos dela são
relativos à raiz (`assets/...`), e não `../assets/...` como nos
artigos.

**O CSS dela é o das páginas de artigo, copiado integralmente**, então
ela herda de graça: mesmo header, mesmo rodapé, mesma coluna de 720px
(`.wrap`), mesma tipografia, `.back-link`, `.footer-back`,
`.art-body p`. Só três coisas foram acrescentadas:

| Acréscimo | Por quê |
|---|---|
| `.section-sub` | Copiada do `index.html` sem alteração, para o subtítulo da página. Os artigos não tinham componente de subtítulo. |
| `.avatar` e `.avatar img` | Copiadas do `index.html` sem alteração, mais um `margin:0 0 32px` (32px é o valor que o `.reactions` dos artigos já usa no `padding-top`). |
| `h1.art-title{margin-bottom:14px}` | Só para reproduzir o espaçamento título → subtítulo que o `index.html` já tem entre `.section-title` (margin-bottom 14px) e `.section-sub`. Sem isso o subtítulo caía a 36px do título. |
| `.rose-word` | Copiada do `index.html`, idêntica, para a palavra "Paula" do primeiro parágrafo. |
| `.art-body .brand` | O nome "Eu Produtei" em laranja dentro do corpo. Ver abaixo. |
| `.art-q` com tamanho e respiro próprios | Ver "O subtítulo de seção" abaixo. |

**Hierarquia do conteúdo:**

- Título → `h1.art-title` (Coolvetica 400, 42px), igual ao dos artigos.
- Subtítulo → `p.section-sub`.
- Foto → `.avatar` (140px no desktop, 96px no mobile).
- Corpo → `.art-body p`. O primeiro parágrafo é "Senta aí, pega um café
  e deixa eu me apresentar. Muito prazer, Paula.", com "Paula" na
  `.rose-word` (ver abaixo).
- "Por que existe a Eu Produtei?" → `.art-q`, que é o componente de
  pergunta/subtítulo dentro do corpo já usado nos artigos, aqui com
  tamanho e respiro próprios (ver abaixo).

Detalhe do `.art-q`: nos artigos o seletor é `.art-body p.art-q`, e
exige um `<p>`. Nesta página o seletor foi escrito como
`.art-body .art-q`, com **as mesmas declarações**, só para permitir
`<h2 class="art-q">` e o subtítulo de seção ter marcação de cabeçalho
de verdade. A aparência é idêntica; muda só a semântica do HTML.

#### O subtítulo de seção ("Por que existe a Eu Produtei?")

Nasceu herdando o `.art-q` dos artigos (19px, `margin:32px 0 8px`) e
ficou sutil demais: não separava as duas metades da página. Em
2026-09-17 passou a:

```css
.art-body .art-q{
  font-size:clamp(22px,3vw,26px);
  margin:56px 0 14px;
}
```

De onde vêm os números, todos já usados no projeto:

- **26px** é o piso do clamp do `.section-title` da home
  (`clamp(26px,4vw,36px)`), ou seja, é o tamanho que o projeto já adota
  para título de seção. Fica entre o corpo (17px) e o `h1` (42px) sem
  competir com o título da página.
- **22px no mobile** (o clamp desce até lá) porque ali o `h1` cai para
  28px: em 26px fixos os dois ficariam quase do mesmo tamanho.
- **56px de respiro acima** é o valor que o `footer{margin-top}` deste
  mesmo CSS já usa. Como o parágrafo anterior tem `margin-bottom:20px`,
  as margens colapsam e o espaço visível fica nos 56px.
- **14px abaixo**, o mesmo `margin-bottom` do `.section-title` da home.

**Sem negrito**: a Coolvetica não tem peso acima de 400 (seção 3.11), e
pedir mais faria o navegador sintetizar negrito falso. A hierarquia aqui
é feita por tamanho e por espaço em branco.

#### O nome da marca no corpo (`.art-body .brand`)

```css
.art-body .brand{color:var(--laranja);font-weight:600;}
```

Retoma a intenção da antiga `.about-text .brand` do bloco `#sobre`, que
destacava o nome "Eu Produtei" no meio do texto e era bordô com peso
600. A estrutura é a mesma; só a cor mudou para o laranja oficial.

**Onde se aplica hoje: em um lugar só.** Dentro do corpo desta página o
nome aparece em dois pontos, e só um recebe a classe:

| Onde | Recebe `.brand`? |
|---|---|
| "A **Eu Produtei** nasceu pra falar justamente desse meio do caminho." | sim |
| "Por que existe a Eu Produtei?" (o `.art-q`) | **não**, por decisão explícita: o subtítulo de seção fica na cor do corpo |

Contraste do laranja sobre o creme: 4,03:1. Passa o mínimo de 3:1 e não
alcança o 4,5:1 de texto normal — mas aqui, diferente da `.rose-word`,
o nome também aparece em bordô no título da página, no logo e no
rodapé, então não é a única via de leitura da informação.

A página **não tem** widget de curtir/não curtir nem `.art-tag`/
`.art-date` — não é artigo, não entra na listagem nem na busca (a
`search.js` varre os `.article-row` da home, ver seção 3.5, então a
página nova não aparece nos resultados).

O link de voltar é **"← Voltar pra home"** (`index.html`), no topo e no
rodapé, com o mesmo tratamento dos artigos.

#### A chamada na home (`#quem-escreve`)

Fica **entre Indicações e Contato**, e é a última seção antes do
rodapé. Como a Indicações tem fundo pêssego (`.section-pessego`), a chamada fica no creme,
mantendo a alternância de fundo das seções.

São três elementos: a foto pequena, uma linha de texto e o link.
Reaproveita `.about-grid`, `.avatar` e `.about-text p` que já existiam
(eram do bloco `#sobre`), mais dois acréscimos:

- `.avatar.avatar-sm{width:84px;height:84px;}` — modificador só de
  tamanho, seguindo o mesmo padrão do `.rec-cover-square` da seção 3.6.
- `.chamada-grid` — ajusta a grade para a foto de 84px e centraliza
  verticalmente.
- `.chamada-link` — mesmo tratamento do `.back-link`/`.footer-back`
  (mono, caixa alta, laranja, com sublinhado), com a seta pra frente.

**A palavra "Paula" dessa linha carrega a classe `.rose-word`**, que é
o **único componente que usa a Vintage Rotter no site** (seção 3.11).
Ela morava na saudação do antigo bloco `#sobre` ("Oiê, muito prazer,
Paula!"); quando o bloco saiu, foi movida para a palavra equivalente na
chamada, para a fonte não ficar declarada sem nenhum uso. A mesma
classe aparece também no primeiro parágrafo da `quem-escreve.html`.

#### O tamanho da `.rose-word` (1.6em)

A regra é, idêntica nas duas páginas:

```css
.rose-word{
  color:var(--rosa-escuro);font-family:'Vintage Rotter','Brush Script MT',cursive;
  font-size:1.6em;line-height:1;
}
```

Em `1em` (como nasceu, em 2026-09-17) a palavra **lia como falha de
renderização**, não como destaque, por três motivos somados:

1. **A x-height da Vintage Rotter é 0,450em contra 0,546em da
   Parkinsans.** No mesmo corpo, a minúscula da script sai **18% mais
   baixa** que a do texto ao redor. Curiosamente as maiúsculas são quase
   iguais (0,680 contra 0,690), então o problema é só na minúscula.
2. **O traço é monolinear e fino**, o que reduz ainda mais a presença
   visual no mesmo tamanho.
3. **A cor.** No `--rose` (`#D98C96`) original, o contraste sobre o
   creme era de só **2,38:1**, contra 14,88:1 do texto ao redor.

O `1.6em` foi escolhido medindo, não estimando: **é o maior tamanho que
ainda não empurra a entrelinha do parágrafo.** Testado de 1em a 2.1em nos
dois contextos (16px na home, 17px na página), com `line-height:1` no
span:

| Tamanho do span | A entrelinha do parágrafo muda? |
|---|---|
| 1.5em | não |
| **1.6em** | **não** (+1px na home, dentro da tolerância) |
| 1.75em | sim, +3,0px |

O `line-height:1` é parte da solução e **não deve ser removido**: sem
ele, qualquer tamanho acima de 1em empurra a primeira linha do parágrafo
de 12 a 16px pra baixo, porque a caixa de linha do span aumentado passa
a ditar a altura da linha.

A 1.6em a x-height da script fica em 0,72em contra 0,546em do texto ao
redor, ou seja **32% mais alta** — é isso que faz a palavra ler como
destaque deliberado, e não como palavra encolhida.

**A cor foi resolvida junto**, no mesmo dia: o `--rose` (`#D98C96`) deu
lugar ao **`--rosa-escuro` (`#942F4D`)**, o rosa escuro oficial da
paleta. Isso importa porque "Paula" é a única aparição do nome nessas
duas frases — é conteúdo, não ornamento, e precisa ser legível.

| Cor da `.rose-word` | Contraste sobre o creme | 3:1 (texto grande) | 4,5:1 (texto normal) |
|---|---|---|---|
| `--rose` `#D98C96` (até 2026-09-17) | 2,38:1 | não passa | não passa |
| **`--rosa-escuro` `#942F4D` (atual)** | **6,98:1** | passa | passa |

Ou seja, com o rosa escuro o problema deixa de existir: passa até o AA
de texto normal, sem depender de o texto ser grande. Se algum dia essa
palavra for para um fundo bege (`--beige`), o rosa escuro ainda dá
5,93:1 — também passa.

#### O que saiu junto

- O `#sobre` e a âncora `#sobre` **não existem mais**. O item de menu
  que apontava pra lá agora é **"Quem escreve"** e aponta para
  `quem-escreve.html`. Não sobrou nenhum link nem âncora apontando pro
  bloco removido.
- O título colagem `h2.collage-title` (e as regras `.cw`, `.cw-wine`,
  `.cw-rose`, `.cw-emoji`) foi **removido do CSS**, por decisão de não
  recriá-lo na página nova.
- Também saíram as regras que ficaram órfãs com o bloco:
  `.about-greeting`, `.about-text .brand`,
  `.about-text .placeholder-note` e `.wine-word` (esta já estava órfã
  antes).
- **A foto saiu do base64.** Agora é `assets/paula-rodrigues.jpg`
  (375×500), referenciada normalmente. Só isso derrubou o
  `index.html` de **81 KB para 28 KB**.

### 3.8 Meta tags para compartilhamento (Open Graph / Twitter Card)

- Todas as 8 páginas (`index.html`, `quem-escreve.html` + os 6 artigos) têm no `<head>`,
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

**Segunda rodada, em 2026-09-17**, junto com a reforma da seção
Indicações (seção 3.6). Estas **não** são regras que já estavam órfãs:
ficaram órfãs por causa daquela mudança, e foram removidas na mesma
hora para não virarem sobra.

- `h2.sticker-title`, `h2.sticker-title .sticker-line`,
  `h2.sticker-title .sticker-line.sticker-mid` e
  `h2.sticker-title .sticker-accent` — as 4 regras do título "adesivo"
  (contorno em `text-shadow` de 8 direções, sombra e rotação por linha).
  Era o único uso dessa técnica que sobrava; a versão palavra a palavra,
  do título colagem da seção Sobre, já tinha saído em 2026-09-17.
- `.section-beige` — a Indicações era a última seção a usá-la, e passou
  a `.section-pessego`.

### 3.10 Arquivos de marca e favicon

Os arquivos oficiais da marca ficam em **`assets/brand/`** (pasta criada
em 2026-09-17; os SVGs tinham sido subidos soltos na raiz de `assets/` e
foram movidos pra lá):

| Arquivo | Dimensões | Proporção | Uso |
|---|---|---|---|
| `EuProdutei_Logotipoprincipal_bordo.svg` | 1200×400 | 3:1 | Logo horizontal. Largura mínima definida pelo manual da marca: **200px** — o que dá ~67px de altura. |
| `EuProdutei_Logotiporeduzido_bordo.svg` | 1000×1000 | 1:1 | Logo reduzido, para espaços estreitos (mobile). |
| `favicon.svg` | 1200×1200 | 1:1 | Ícone do site. |
| `apple-touch-icon.png` | 180×180 | 1:1 | Ícone para iOS quando alguém salva o site na tela inicial. |

**Regra do manual da marca**: a proporção original dos logos não pode
ser alterada. Ou seja, não se define `width` e `height` juntos em cima
do logo — define-se só a largura e deixa a altura sair sozinha.

#### O logo no header (desde 2026-09-17)

Até essa data o header mostrava **"Eu Produtei" como texto**, com a
classe `.wordmark` em Fraunces 21px. Isso foi substituído pelo logo em
imagem nas 8 páginas. A classe `.wordmark` continua existindo, mas
agora é só o contêiner do `<img>` — perdeu todas as propriedades de
texto (`font-family`, `font-size`, `font-stretch`, `color`), e a regra
`.wordmark span{color:var(--rose);}` do `index.html`, que pintava o
espaço entre "Eu" e "Produtei", foi removida junto com o span.

A troca de logo por tamanho de tela é feita com `<picture>`, não com
dois `<img>` escondidos por CSS — assim o navegador baixa só o arquivo
que vai usar:

```html
<a href="index.html" class="wordmark">
  <picture>
    <source media="(max-width:720px)" srcset="assets/brand/EuProdutei_Logotiporeduzido_bordo.svg">
    <img src="assets/brand/EuProdutei_Logotipoprincipal_bordo.svg" alt="Eu Produtei">
  </picture>
</a>
```

E o CSS, que define **só a largura** (a altura sai da proporção do
SVG, pela regra do manual acima):

```css
.wordmark{display:flex;align-items:center;}
.wordmark img{display:block;width:200px;height:auto;}
@media(max-width:720px){ .wordmark img{width:40px;} }
```

Pontos que valem registro, porque são decisões e não acaso:

- **O logo é link para a home nas 8 páginas.** Nos artigos ele já era
  (`../index.html`); no `index.html` ele era uma `<div>` sem link e
  virou `<a href="index.html">` em 2026-09-17, pra ficar clicável em
  todo lugar. O `alt` é `"Eu Produtei"` em todas.
- **Breakpoint: 720px**, o mesmo que o `index.html` já usava pra
  esconder o menu. As páginas de artigo **não tinham nenhuma media
  query** antes disso — a delas é nova, mas de propósito com o mesmo
  valor do index, pra não existirem dois breakpoints diferentes no
  projeto.
- **O header cresceu, e isso foi uma escolha deliberada.** O logo
  principal tem 3:1, então nos 200px de largura mínima do manual ele
  fica com ~67px de altura — o dobro dos 33,59px que a linha de texto
  ocupava. Optou-se por deixar o header crescer em vez de reduzir o
  logo abaixo do mínimo do manual ou apertar o espaçamento vertical. O
  espaçamento (16px no index, 20px nos artigos) ficou intacto.

  | Página | Antes | Depois |
  |---|---|---|
  | `index.html` desktop | 66,59px | **99,66px** |
  | `index.html` mobile | 66,59px | **73px** |
  | Artigo desktop | 74,59px | **107,66px** |
  | Artigo mobile | 74,59px | **81px** |

  A `quem-escreve.html`, criada depois (seção 3.7), usa o mesmo header
  das páginas de artigo, então vale para ela a mesma linha "Artigo".

  Note que **o mobile também cresceu**, ainda que pouco: o logo
  reduzido tem 40px de altura e a linha de texto que ele substituiu
  tinha 33,59px — ou seja, 6,41px a mais. É contraintuitivo porque
  "40px" parece menor que "21px de fonte", mas o que conta é a altura
  da caixa de linha (21px × `line-height` 1.6 = 33,59px), não o
  tamanho da fonte.
- O `index.html` tem `nav{position:sticky;top:0}`, então esses ~100px
  ficam fixos no topo durante toda a rolagem. Os artigos não têm
  sticky, o header deles rola junto com a página.

**Favicon**: declarado no `<head>` das 8 páginas, logo depois da meta
`viewport`, em duas linhas:

```html
<link rel="icon" href="assets/brand/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/brand/apple-touch-icon.png">
```

Nas páginas de artigo o caminho é relativo (`../assets/brand/...`),
porque elas ficam um nível abaixo. Não existia favicon antes disso —
não havia nada antigo pra remover.

O `apple-touch-icon.png` foi gerado **a partir do `favicon.svg`**
renderizando o SVG no Chromium via Playwright num viewport de 180×180
com `deviceScaleFactor:1` e tirando screenshot — o mesmo caminho já
usado pra gerar a imagem de Open Graph (seção 3.8). Não há
`rsvg-convert`, Inkscape, ImageMagick nem cairosvg neste ambiente. Se o
`favicon.svg` mudar, o PNG precisa ser gerado de novo; ele não se
atualiza sozinho.

### 3.11 Fontes da marca (desde 2026-09-17)

Até 2026-09-17 os títulos usavam **Fraunces** (serifada, do Google
Fonts) e **Anton** (só nos dois títulos "adesivo"/"colagem"). As duas
foram substituídas pela **Coolvetica**, servida do próprio site.

#### Os arquivos e o que cada um é

| Arquivo em `assets/brand/` | Família declarada | `font-weight` | Situação |
|---|---|---|---|
| `Coolvetica-Regular.woff2` | `Coolvetica` | 400 | Fonte de títulos. É a única que recebe `preload`. |
| `CoolveticaEl-Regular.woff2` | `Coolvetica` | **250** | Declarada e pronta, **sem nenhum uso hoje** (nenhum elemento pede peso 250, então o arquivo nem é baixado). |
| `VintageRotterPersonalUseOnl-R.woff2` | `Vintage Rotter` | 400 | Um único componente, a classe `.rose-word`, aplicada na palavra "Paula" em dois lugares: a chamada na home e o primeiro parágrafo da `quem-escreve.html` (ver seção 3.7). |
| `Parkinsans-Light.woff2` | — | — | **Não é usado.** A Parkinsans continua vindo do Google Fonts, com a faixa completa de pesos (300..800). O arquivo ficou no repo, mas nenhum `@font-face` aponta pra ele. |

Sobre o nome dos dois arquivos da Coolvetica, que é confuso: ambos
terminam em `-Regular`, mas a tabela `name` de cada um deixa claro quem
é quem. O `CoolveticaEl-Regular` declara internamente
`Typographic Family: Coolvetica` e `Typographic Subfamily: ExtraLight`,
com `usWeightClass` **250** — por isso ele foi declarado em 250, e não
em 300: é o número que o próprio arquivo carrega. O
`Coolvetica-Regular` é `Coolvetica / Regular`, `usWeightClass` 400.

#### Declaração

Os `@font-face` ficam no topo do `<style>` de cada página, antes do
`:root`, com `font-display:swap` nos três. Nas páginas de artigo o
caminho é relativo (`../assets/brand/...`).

O `preload` fica no `<head>`, **só para a Coolvetica 400** — é a única
fonte local usada em todas as 8 páginas e aparece acima da dobra:

```html
<link rel="preload" href="assets/brand/Coolvetica-Regular.woff2" as="font" type="font/woff2" crossorigin>
```

O atributo `crossorigin` é obrigatório aqui **mesmo sendo o mesmo
domínio**: fontes são buscadas em modo CORS anônimo, e sem ele o
navegador baixaria o arquivo duas vezes.

**Fallbacks** definidos em cada família:

- `'Coolvetica',Helvetica,Arial,sans-serif` — a Coolvetica é uma sans
  geométrica, então o fallback é sans (e não mais `serif`, como era no
  tempo da Fraunces).
- `'Vintage Rotter','Brush Script MT',cursive` — script.

#### Regra: nada acima do peso 400

**Nem a Coolvetica nem a Vintage Rotter têm peso acima de 400**, e a
Coolvetica também **não tem itálico**. Se algum elemento pedir peso
maior ou `font-style:italic` nessas famílias, o navegador **sintetiza**
negrito ou itálico artificial — engorda ou inclina as letras
mecanicamente, e o resultado borra o contorno. Isso é proibido neste
projeto.

Por isso, em 2026-09-17, **nove elementos que usavam Fraunces acima de
400 foram baixados para 400**: o `h1` do hero e o `h1.art-title` dos
artigos (eram 700); e `.section-title`, `.about-greeting`,
`.art-title`, `.art-q`, `.link-title`, `.rec-title` e `.ml-item` (eram
600). **A hierarquia dos títulos passou a ser feita só por tamanho.**
Os dois títulos que usavam Anton já estavam em 400 e não precisaram de
nada.

Atenção ao mexer: os pesos 500/600/700 que ainda existem no CSS
(`nav ul li a`, `.stamp`, `.hero .lede strong`, `.eyebrow`,
`.about-text .brand`, `mark.search-hit`, `.react-btn`) são todos de
elementos em **Parkinsans**, que tem a faixa 300..800 no Google Fonts —
esses estão corretos e não devem ser mexidos.

#### A exceção deliberada: Fraunces nos `blockquote`

**A Fraunces continua no `<link>` do Google Fonts de propósito, e não
por sobra.** Ela tem exatamente **um uso**: os `blockquote` (a citação
do Marty Cagan no `index.html` e as citações dentro dos artigos), que
são **Fraunces itálico**. Foi uma decisão consciente de manter a
serifada itálica só nas citações, porque:

1. A Coolvetica não tem itálico, e usá-la ali significaria itálico
   sintético — justamente o que este projeto não aceita.
2. A citação ganha em se distinguir do resto: é a única voz que não é
   da autora do site.

Por isso o `<link>` do Google Fonts foi **reduzido a só o que essa
exceção precisa** — a Fraunces é pedida apenas no eixo itálico:

```
?family=Fraunces:ital,opsz,wght@1,9..144,500&family=Parkinsans:wght@300..800&family=IBM+Plex+Mono:wght@500&display=swap
```

Antes, o pedido incluía Fraunces em 400, 600, 700 e 900 não-itálicos
(todos agora sem uso) e a Anton. **Se algum dia alguém aplicar Fraunces
não-itálica em qualquer elemento, precisa reincluir o peso no `<link>`,
senão o navegador vai sintetizar.** As 8 páginas usam o mesmo `<link>`,
idêntico.

#### Ajuste de métrica que foi necessário: `11ch` → `14ch`

A troca foi só de família — nenhum tamanho, entrelinha ou escala
tipográfica mudou. Mas **um ajuste foi inevitável**, e é importante
entender por quê para não o desfazer por engano.

O `.hero h1` tinha `max-width:11ch`. A unidade `ch` é **a largura do
caractere "0" da fonte em uso**, então ela muda quando a fonte muda:

| | largura de `1ch` a 58px | `11ch` resultava em |
|---|---|---|
| Fraunces 700 | 39,58px | 435,4px |
| Coolvetica 400 | 28,39px | **312,3px** |

Com a caixa caindo de 435px para 312px, o título quebrava em **3
linhas** ("A casa de / quem vive / Produto") em vez das 2 originais, e o
hero crescia. A linha "A casa de quem" precisa de 381,9px em
Coolvetica; `14ch` dá 397,5px e ainda é estreito demais para caber "A
casa de quem vive" (492,3px). Ou seja, **`14ch` reproduz exatamente o
comportamento de antes** — 2 linhas, e o hero voltou aos mesmos
542,6px. Foi o único ajuste feito.

As outras três `max-width` em `ch` do projeto (`.hero .lede` 46ch,
`.section-sub` 52ch, `.art-excerpt` 56ch) estão em elementos
**Parkinsans**, cuja fonte não mudou — não precisaram de nada.

#### `font-stretch` virou letra morta (e já era antes)

Os títulos têm `font-stretch` entre 78% e 82% (`h1,h2,h3,.display`,
`.art-title`, `h1.art-title`). Esses valores **não têm nenhum efeito**
na Coolvetica, que não é fonte variável e não tem eixo de largura.

O que vale registrar, porque é contraintuitivo: **eles já não tinham
efeito antes da troca**. A Fraunces do Google Fonts tem só os eixos
`opsz` e `wght` — **não tem eixo `wdth`** —, e a Anton não é variável.
Ou seja, esse `font-stretch` nunca fez nada em nenhuma das três fontes.
Foi mantido no CSS por decisão de não alterar nada além das famílias,
mas pode ser removido com segurança numa limpeza futura.

#### Diferença de largura, medida com as fontes reais

Como o texto passa a ser desenhado por outra fonte, a mesma frase ocupa
outra largura. Medido no mesmo tamanho, com os arquivos reais das três
fontes:

| Elemento | Antes | Depois | Diferença |
|---|---|---|---|
| `.link-title` (cards de contato) | 74,8px | 56,8px | **−24,1%** |
| `h2.sticker-title` (título adesivo de Indicações, removido em 2026-09-17) | 336,4px | 409,4px | **+21,7%** |
| `.rec-title` (indicações) | 73,3px | 57,7px | −21,3% |
| `.about-greeting` | 261,0px | 214,7px | −17,7% |
| `h2.collage-title` (título colagem do antigo bloco Sobre, removido em 2026-09-17) | 353,3px | 410,5px | **+16,2%** |
| `.art-title` (lista) | 472,0px | 400,4px | −15,2% |
| `.section-title` | 496,6px | 423,0px | −14,8% |
| `h1.art-title` (artigos) | 1205,4px | 1032,5px | −14,3% |
| `.ml-item` (Mais lidos) | 428,7px | 368,8px | −14,0% |
| `.art-q` | 559,4px | 487,3px | −12,9% |
| `.hero h1` | 778,5px | 702,2px | −9,8% |

O padrão: onde havia **Fraunces**, o texto **encurtou** 10–24%; onde
havia **Anton**, **esticou** 16–22% — a Anton é bem mais condensada que
a Coolvetica. Nenhuma dessas diferenças vem de `font-stretch` (que,
como dito acima, nunca funcionou); é só a largura natural das letras de
cada fonte.

Reflexos de layout, todos verificados no navegador: nenhum título mudou
de número de linhas no desktop, e no mobile (390px) os
`.section-title` passaram a caber em **1 linha** em vez de 2 — por serem
mais estreitos, a página encurtou ~90px. A `.about-greeting` ficou 2px
mais alta, porque a Vintage Rotter dentro dela tem caixa de linha um
pouco maior que a da Coolvetica.

#### Como verificar isso localmente

O Chromium deste ambiente **não alcança `fonts.googleapis.com`**. Um
screenshot local, sem contornar isso, mostra Parkinsans, IBM Plex Mono e
Fraunces em fallback do sistema — e comparar dois screenshots assim
compara fallbacks, não as fontes reais. Para medir ou fotografar de
verdade: baixar os `.woff2` do Google Fonts via `curl` com
`User-Agent` de navegador (aí funciona, porque o proxy libera o curl),
servi-los localmente e interceptar a requisição a
`fonts.googleapis.com` no Playwright, devolvendo um CSS local que
aponta pros arquivos baixados (com `Access-Control-Allow-Origin: *`,
senão o CORS de fonte bloqueia).

#### Nota sobre licença

O nome interno do arquivo da Vintage Rotter é **"Vintage Rotter
Personal Use Onl"** — ou seja, a fonte se identifica como de uso
pessoal. O euprodutei.com.br é um site pessoal, mas é público e é uma
marca; vale confirmar a licença com quem forneceu o arquivo antes de
tratar esse uso como definitivo.

### 3.12 Seção Contato (`#links`)

Última seção da home, com fundo bordô (`.footer`) e quatro `.link-card`
num grid (`.link-grid`), cada um com uma etiqueta em mono e um título:

| Card | Etiqueta | `href` |
|---|---|---|
| LinkedIn | Rede | `https://www.linkedin.com/in/paulaprodrigues` (abre em nova aba, com `rel="noopener"`) |
| Instagram | Em breve | `#` — placeholder, ainda sem conta |
| E-mail | Contato | `mailto:euprodutei@gmail.com` |
| Comunidade | Em breve | `#` — placeholder |

**O e-mail de contato é `euprodutei@gmail.com`** (era
`paulasantospereira31@gmail.com` até 2026-09-17). Ele aparece em
**exatamente um lugar em todo o repositório**: o `href` desse
`mailto:` no `index.html`. Não está em nenhuma meta tag, não é exibido
como texto visível em nenhuma página (o card mostra "E-mail", não o
endereço) e não aparece em nenhuma das outras 7 páginas. Ou seja, para
trocar o e-mail no futuro basta editar essa única linha.

Cuidado ao buscar: o repositório contém a string
`paulasantospereira31-web`, que é o **nome da organização no GitHub**
(seção 4), não o e-mail. Uma substituição cega por
"paulasantospereira31" quebraria as referências ao repositório na
documentação.

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
