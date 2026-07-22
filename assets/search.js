(function () {
  var input = document.getElementById('article-search');
  var list = document.querySelector('.article-list');
  var filterRow = document.querySelector('.filter-row');
  var resultsBox = document.getElementById('search-results');
  if (!input || !list || !resultsBox) return;

  var articlesData = null;

  function stripAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function normalize(str) {
    return stripAccents(str.toLowerCase());
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function highlight(text, term) {
    var normText = normalize(text);
    var normTerm = normalize(term);
    if (!normTerm) return escapeHtml(text);
    var idx = normText.indexOf(normTerm);
    if (idx === -1) return escapeHtml(text);
    var before = text.slice(0, idx);
    var match = text.slice(idx, idx + term.length);
    var after = text.slice(idx + term.length);
    return escapeHtml(before) + '<mark class="search-hit">' + escapeHtml(match) + '</mark>' + escapeHtml(after);
  }

  function buildSnippet(bodyText, term) {
    var normBody = normalize(bodyText);
    var normTerm = normalize(term);
    var idx = normBody.indexOf(normTerm);
    if (idx === -1) {
      return escapeHtml(bodyText.slice(0, 140)) + (bodyText.length > 140 ? '…' : '');
    }
    var start = Math.max(0, idx - 60);
    var end = Math.min(bodyText.length, idx + term.length + 60);
    var prefix = start > 0 ? '…' : '';
    var suffix = end < bodyText.length ? '…' : '';
    return prefix + highlight(bodyText.slice(start, end), term) + suffix;
  }

  function loadArticles() {
    if (articlesData) return Promise.resolve(articlesData);
    var rows = Array.prototype.slice.call(list.querySelectorAll('.article-row[href]'));
    var fetches = rows.map(function (row) {
      var url = row.getAttribute('href');
      return fetch(url)
        .then(function (res) { return res.text(); })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var body = doc.querySelector('.art-body');
          return {
            url: url,
            title: (row.querySelector('.art-title') || {}).textContent || '',
            tag: (row.querySelector('.art-tag') || {}).textContent || '',
            date: (row.querySelector('.art-date') || {}).textContent || '',
            bodyText: body ? body.textContent.replace(/\s+/g, ' ').trim() : '',
          };
        })
        .catch(function () { return null; });
    });
    return Promise.all(fetches).then(function (results) {
      articlesData = results.filter(Boolean);
      return articlesData;
    });
  }

  function renderResults(term, articles) {
    var normTerm = normalize(term);
    var matches = articles.filter(function (a) {
      return normalize(a.title).indexOf(normTerm) !== -1 || normalize(a.bodyText).indexOf(normTerm) !== -1;
    });

    if (matches.length === 0) {
      resultsBox.innerHTML = '<p class="search-empty">Nenhum resultado encontrado. Tente utilizar outra palavra ou termo relacionado.</p>';
      return;
    }

    resultsBox.innerHTML = matches.map(function (a) {
      var snippet = buildSnippet(a.bodyText, term);
      return (
        '<a class="article-row" href="' + a.url + '">' +
          '<div class="art-date">' + escapeHtml(a.date) + '</div>' +
          '<div>' +
            '<span class="art-tag">' + escapeHtml(a.tag) + '</span>' +
            '<div class="art-title">' + highlight(a.title, term) + '</div>' +
            '<div class="art-excerpt">' + snippet + '</div>' +
          '</div>' +
          '<div class="art-arrow">→</div>' +
        '</a>'
      );
    }).join('');
  }

  input.addEventListener('input', function () {
    var term = input.value.trim();

    if (!term) {
      resultsBox.hidden = true;
      resultsBox.innerHTML = '';
      list.hidden = false;
      if (filterRow) filterRow.hidden = false;
      return;
    }

    list.hidden = true;
    if (filterRow) filterRow.hidden = true;
    resultsBox.hidden = false;

    loadArticles().then(function (articles) {
      renderResults(term, articles);
    });
  });
})();
