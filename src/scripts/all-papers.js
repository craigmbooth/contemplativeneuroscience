// All Papers (pages/all-papers.astro): search, sort and study-type filter.
// Search matches every word typed, anywhere in a paper's headline, snippet,
// citation, themes or the glossary terms it explains, and highlights the
// matches. The controls are mirrored in the URL (?q=, ?type=, ?sort=) so a
// filtered list can be linked to; the 404 page sends searches here with ?q=.
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('paperSearch');
  const clearButton = document.getElementById('clearSearch');
  const sortSelect = document.getElementById('sortOrder');
  const typeFilter = document.getElementById('typeFilter');
  const resultsInfo = document.getElementById('searchResults');
  const noResults = document.querySelector('.no-results-message');
  const list = document.querySelector('.all-papers-list');
  if (!searchInput || !list) return;

  const papers = Array.from(list.querySelectorAll('.post-item')).map(function(item) {
    const highlightable = Array.from(item.querySelectorAll('.post-title a, .post-excerpt, .citation'));
    return {
      item: item,
      order: Number(item.dataset.order),
      year: Number(item.dataset.year),
      author: item.dataset.author || '',
      title: item.querySelector('.post-title').textContent.trim(),
      type: item.dataset.studyType || '',
      visibleText: item.textContent.toLowerCase(),
      hiddenText: (item.dataset.search || '').toLowerCase(),
      // "DMN=Default mode network": show the first part, match either.
      terms: (item.dataset.terms || '').split('|').filter(Boolean).map(function(t) {
        return { label: t.split('=')[0], text: t.toLowerCase() };
      }),
      mentions: item.querySelector('.search-mentions'),
      highlightable: highlightable,
      originals: highlightable.map(function(el) { return el.innerHTML; })
    };
  });

  // Sorting -----------------------------------------------------------------

  const comparators = {
    'added': function(a, b) { return a.order - b.order; },
    'year-desc': function(a, b) { return b.year - a.year || a.order - b.order; },
    'year-asc': function(a, b) { return a.year - b.year || a.order - b.order; },
    'title': function(a, b) { return a.title.localeCompare(b.title); },
    'author': function(a, b) { return a.author.localeCompare(b.author) || a.year - b.year; }
  };

  function sortPapers() {
    const compare = comparators[sortSelect.value] || comparators.added;
    const fragment = document.createDocumentFragment();
    papers.slice().sort(compare).forEach(function(p) { fragment.appendChild(p.item); });
    list.appendChild(fragment);
  }

  // Highlighting ------------------------------------------------------------

  const escapeRegExp = function(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };

  function resetHighlights(p) {
    p.highlightable.forEach(function(el, i) { el.innerHTML = p.originals[i]; });
  }

  function highlight(el, pattern) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function(node) {
      const text = node.nodeValue;
      pattern.lastIndex = 0;
      if (!pattern.test(text)) return;
      pattern.lastIndex = 0;
      const fragment = document.createDocumentFragment();
      let last = 0;
      let match;
      while ((match = pattern.exec(text))) {
        if (match.index > last) fragment.appendChild(document.createTextNode(text.slice(last, match.index)));
        const mark = document.createElement('mark');
        mark.textContent = match[0];
        fragment.appendChild(mark);
        last = match.index + match[0].length;
      }
      if (last < text.length) fragment.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(fragment, node);
    });
  }

  // Search and filter -------------------------------------------------------

  function update() {
    const query = searchInput.value.trim();
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const type = typeFilter ? typeFilter.value : '';
    const pattern = words.length ? new RegExp(words.map(escapeRegExp).join('|'), 'gi') : null;
    let shown = 0;

    clearButton.hidden = query.length === 0;

    papers.forEach(function(p) {
      resetHighlights(p);
      const matchesWords = words.every(function(w) {
        return p.visibleText.includes(w) || p.hiddenText.includes(w) ||
          p.terms.some(function(t) { return t.text.includes(w); });
      });
      const visible = matchesWords && (type === '' || p.type === type);
      p.item.classList.toggle('hidden', !visible);

      // Name the glossary terms that matched, when the word isn't in the visible text.
      const termHits = words.length && visible
        ? p.terms.filter(function(t) {
            return words.some(function(w) { return t.text.includes(w) && !p.visibleText.includes(w); });
          }).map(function(t) { return t.label; })
        : [];
      p.mentions.hidden = termHits.length === 0;
      p.mentions.textContent = termHits.length ? 'Covers: ' + termHits.join(', ') : '';

      if (visible) {
        shown++;
        if (pattern) p.highlightable.forEach(function(el) { highlight(el, pattern); });
      }
    });

    const total = papers.length;
    if (!words.length && type === '') {
      resultsInfo.textContent = '';
    } else if (shown === 0) {
      resultsInfo.textContent = query ? 'No papers match “' + query + '”.' : 'No papers match.';
    } else {
      resultsInfo.textContent = 'Showing ' + shown + ' of ' + total + ' papers.';
    }
    noResults.hidden = shown !== 0;
    syncUrl(query, type);
  }

  // URL ---------------------------------------------------------------------

  function syncUrl(query, type) {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (type) params.set('type', type);
    if (sortSelect.value !== 'added') params.set('sort', sortSelect.value);
    const search = params.toString();
    const url = window.location.pathname + (search ? '?' + search : '') + window.location.hash;
    if (url !== window.location.pathname + window.location.search + window.location.hash) {
      history.replaceState(null, '', url);
    }
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get('q')) searchInput.value = params.get('q');
  if (params.get('type') && typeFilter && typeFilter.querySelector('option[value="' + CSS.escape(params.get('type')) + '"]')) {
    typeFilter.value = params.get('type');
  }
  if (params.get('sort') && comparators[params.get('sort')]) sortSelect.value = params.get('sort');

  // Events ------------------------------------------------------------------

  let timer;
  searchInput.addEventListener('input', function() {
    clearTimeout(timer);
    timer = setTimeout(update, 120);
  });
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      searchInput.value = '';
      update();
    }
  });
  clearButton.addEventListener('click', function() {
    searchInput.value = '';
    update();
    searchInput.focus();
  });
  if (typeFilter) typeFilter.addEventListener('change', update);
  sortSelect.addEventListener('change', function() {
    sortPapers();
    update();
  });

  sortPapers();
  update();
});
