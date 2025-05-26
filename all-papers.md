---
layout: page
title: All Papers
permalink: /all-papers/
meta_description: "Complete collection of contemplative neuroscience research paper summaries. Browse all articles exploring the intersection of meditation, mindfulness, and brain science."
---

This page provides a collection of {% assign post_count = site.posts | where_exp: "post", "post.path contains '_posts/'" | size %}{{ post_count }} research paper summaries available on the site. You can browse, search, and sort these papers by title, year, or author. Each summary offers an accessible overview of peer-reviewed research on contemplative practices and their effects on the brain, cognition, and well-being.

<div class="search-container">
  <input type="text" id="paperSearch" class="search-input" placeholder="Search paper titles..." aria-label="Search paper titles">
  <button id="clearSearch" class="clear-search-btn" aria-label="Clear search">×</button>
</div>

<div class="sort-controls">
  <span class="sort-label">Sort by:</span>
  <div class="sort-buttons">
    <button id="sortByTitle" class="sort-button active" data-sort="title" aria-label="Sort by title">
      Title <span class="sort-arrow">↓</span>
    </button>
    <button id="sortByYear" class="sort-button" data-sort="year" aria-label="Sort by publication year">
      Publication Year <span class="sort-arrow">↓</span>
    </button>
    <button id="sortByAuthor" class="sort-button" data-sort="author" aria-label="Sort by first author">
      First Author <span class="sort-arrow">↓</span>
    </button>
  </div>
</div>

<p id="searchResults" class="search-results-info" aria-live="polite"></p>

<div class="all-papers-list">
  {% for post in site.posts %}
    <article class="post-item" itemscope itemtype="http://schema.org/BlogPosting" role="article">
      <div class="article-item">
        <header class="post-header">
          <h3 class="post-title" itemprop="name"><a href="{{ post.url | prepend: site.baseurl }}?ref=all-papers" itemprop="url">{{ post.title }}</a></h3>
        </header>
        <section class="post-excerpt" itemprop="description">
          <p>{{ post.snippet }}</p>
        </section>
        <div class="post-meta citation">
          {{ post.citation | markdownify }}
        </div>
        <div class="post-themes">
          {% if post.theme %}
            <span class="theme-label">Themes:</span>
            {% if post.theme.first %}
              {% for theme in post.theme %}
                {% assign theme_page = site.pages | where: "theme_key", theme | first %}
                {% if theme_page %}
                  <a href="{{ site.baseurl }}{{ theme_page.url }}" class="theme-tag">{{ theme_page.title }}</a>{% unless forloop.last %}, {% endunless %}
                {% endif %}
              {% endfor %}
            {% else %}
              {% assign theme_page = site.pages | where: "theme_key", post.theme | first %}
              {% if theme_page %}
                <a href="{{ site.baseurl }}{{ theme_page.url }}" class="theme-tag">{{ theme_page.title }}</a>
              {% endif %}
            {% endif %}
          {% endif %}
        </div>
      </div>
    </article>
  {% endfor %}
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('paperSearch');
  const clearButton = document.getElementById('clearSearch');
  const resultsInfo = document.getElementById('searchResults');
  const paperItems = document.querySelectorAll('.post-item');
  const allPapersList = document.querySelector('.all-papers-list');

  // Create a no results message element (initially hidden)
  const noResultsMessage = document.createElement('div');
  noResultsMessage.className = 'no-results-message';
  noResultsMessage.innerHTML = 'No papers match your search criteria. Try different keywords.';
  noResultsMessage.style.display = 'none';
  allPapersList.after(noResultsMessage);

  // Sort buttons
  const sortButtons = document.querySelectorAll('.sort-button');
  let currentSort = {
    type: 'title',
    direction: 'desc'
  };

  // Parse data from papers
  function getPaperData() {
    const papers = [];
    paperItems.forEach(item => {
      const titleElement = item.querySelector('.post-title');
      const title = titleElement.textContent.trim();
      
      // Extract year from citation (assumes format includes a year in parentheses)
      const citation = item.querySelector('.citation').textContent;
      const yearMatch = citation.match(/\((\d{4})\)/);
      const year = yearMatch ? parseInt(yearMatch[1]) : 0;
      
      // Extract first author from citation
      const authorMatch = citation.match(/^([^,]+)/);
      const author = authorMatch ? authorMatch[1].trim() : '';
      
      papers.push({
        element: item,
        title: title,
        year: year,
        author: author
      });
    });
    return papers;
  }

  // Sort papers
  function sortPapers() {
    const papers = getPaperData();
    const sortType = currentSort.type;
    const sortDirection = currentSort.direction;
    
    papers.sort((a, b) => {
      let comparison = 0;
      
      if (sortType === 'title') {
        // Reverse the default comparison for titles (Z-A by default)
        comparison = -a.title.localeCompare(b.title);
      } else if (sortType === 'year') {
        // Default comparison for years (older first by default)
        comparison = a.year - b.year;
      } else if (sortType === 'author') {
        // Reverse the default comparison for authors (Z-A by default)
        comparison = -a.author.localeCompare(b.author);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    // Reorder DOM elements
    const fragment = document.createDocumentFragment();
    papers.forEach(paper => {
      fragment.appendChild(paper.element);
    });
    
    allPapersList.innerHTML = '';
    allPapersList.appendChild(fragment);
  }

  // Update sort button states
  function updateSortButtons() {
    sortButtons.forEach(button => {
      const sortType = button.getAttribute('data-sort');
      
      if (sortType === currentSort.type) {
        button.classList.add('active');
        button.setAttribute('data-direction', currentSort.direction);
      } else {
        button.classList.remove('active');
        button.removeAttribute('data-direction');
      }
    });
  }

  // Initialize sorting
  sortPapers();
  updateSortButtons();

  // Sort button click handlers
  sortButtons.forEach(button => {
    button.addEventListener('click', function() {
      const sortType = this.getAttribute('data-sort');
      
      if (sortType === currentSort.type) {
        // Toggle direction if already active
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        // Set new sort type with default desc direction
        currentSort.type = sortType;
        currentSort.direction = 'desc';
      }
      
      sortPapers();
      updateSortButtons();
    });
  });

  // Search functionality
  function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    let matchCount = 0;

    // Show/hide clear button
    clearButton.style.display = searchTerm.length > 0 ? 'block' : 'none';

    // If search is empty, show all papers
    if (searchTerm === '') {
      paperItems.forEach(item => {
        item.classList.remove('hidden');
      });
      resultsInfo.textContent = '';
      noResultsMessage.style.display = 'none';
      return;
    }

    // Filter papers based on search term
    paperItems.forEach(item => {
      const title = item.querySelector('.post-title').textContent.toLowerCase();
      const matchesSearch = title.includes(searchTerm);

      if (matchesSearch) {
        item.classList.remove('hidden');
        matchCount++;
      } else {
        item.classList.add('hidden');
      }
    });

    // Update results info
    if (matchCount === 0) {
      resultsInfo.textContent = 'No papers found matching your search.';
      noResultsMessage.style.display = 'block';
    } else {
      resultsInfo.textContent = `Found ${matchCount} paper${matchCount !== 1 ? 's' : ''} matching your search.`;
      noResultsMessage.style.display = 'none';
    }
  }

  // Event listeners
  searchInput.addEventListener('input', performSearch);

  clearButton.addEventListener('click', function() {
    searchInput.value = '';
    performSearch();
    searchInput.focus();
  });

  // Handle Escape key to clear search
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      searchInput.value = '';
      performSearch();
    }
  });
});
</script>