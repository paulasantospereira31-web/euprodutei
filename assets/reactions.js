(function () {
  var STORE_KEY = 'euprodutei-reactions';

  function loadStore() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  document.querySelectorAll('.reactions').forEach(function (widget) {
    var slug = widget.dataset.article;
    if (!slug) return;

    var voteKey = 'euprodutei-vote-' + slug;
    var store = loadStore();
    if (!store[slug]) store[slug] = { like: 0, dislike: 0 };

    var likeBtn = widget.querySelector('.react-like');
    var dislikeBtn = widget.querySelector('.react-dislike');
    var likeCount = likeBtn.querySelector('.react-count');
    var dislikeCount = dislikeBtn.querySelector('.react-count');
    var currentVote = localStorage.getItem(voteKey) || null;

    function render() {
      likeCount.textContent = store[slug].like;
      dislikeCount.textContent = store[slug].dislike;
      likeBtn.setAttribute('aria-pressed', currentVote === 'like');
      dislikeBtn.setAttribute('aria-pressed', currentVote === 'dislike');
    }

    function save() {
      localStorage.setItem(STORE_KEY, JSON.stringify(store));
      if (currentVote) {
        localStorage.setItem(voteKey, currentVote);
      } else {
        localStorage.removeItem(voteKey);
      }
    }

    function vote(type) {
      var counts = store[slug];
      if (currentVote === type) {
        counts[type] = Math.max(0, counts[type] - 1);
        currentVote = null;
      } else {
        if (currentVote) counts[currentVote] = Math.max(0, counts[currentVote] - 1);
        counts[type] += 1;
        currentVote = type;
      }
      save();
      render();
    }

    likeBtn.addEventListener('click', function () { vote('like'); });
    dislikeBtn.addEventListener('click', function () { vote('dislike'); });

    render();
  });
})();
