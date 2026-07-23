(function () {
  var list = document.querySelector('.article-list:not(#search-results)');
  if (!list) return;

  var rows = Array.prototype.slice.call(list.querySelectorAll('.article-row[data-date]'));
  rows.sort(function (a, b) {
    return b.dataset.date.localeCompare(a.dataset.date);
  });
  rows.forEach(function (row) { list.appendChild(row); });
})();
