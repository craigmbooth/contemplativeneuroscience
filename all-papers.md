---
layout: page
title: All Papers
permalink: /all-papers/
meta_description: "Complete collection of contemplative neuroscience research paper summaries. Browse all articles exploring the intersection of meditation, mindfulness, and brain science."
---

This page provides a chronological list of all research paper summaries available on the site. Each summary offers an accessible overview of peer-reviewed research on contemplative practices and their effects on the brain, cognition, and well-being.

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
    <button id="sortByYear" class="sort-button" data-sort="year" aria-label="Sort by year">
      Year <span class="sort-arrow">↓</span>
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

<style>
.all-papers-list {
  margin-top: 30px;
}

.post-item {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #eee;
}

.post-item:last-child {
  border-bottom: none;
}

.post-title {
  margin-bottom: 10px;
  font-family: Merriweather, serif;
}

.post-excerpt {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 15px;
}

.citation {
  padding-left: 2em;
  text-indent: -2em;
  margin-bottom: 15px;
  font-size: 16px;
  color: #555;
}

.post-themes {
  font-size: 15px;
  margin-top: 10px;
}

.theme-label {
  font-weight: 500;
  color: #666;
}

.theme-tag {
  display: inline-block;
  text-decoration: none;
  color: #f62681;
  transition: color 0.2s ease;
}

.theme-tag:hover {
  color: #d8517c;
  text-decoration: underline;
}

.search-container {
  position: relative;
  margin: 20px 0;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 15px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #f1c4d6;
  box-shadow: 0 0 0 2px rgba(216, 81, 124, 0.1);
}

.clear-search-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  padding: 5px;
  display: none;
}

.clear-search-btn:hover {
  color: #666;
}

.search-results-info {
  font-size: 15px;
  color: #666;
  margin: 10px 0 20px;
  font-style: italic;
}

.post-item.hidden {
  display: none;
}

.no-results-message {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #666;
  font-style: italic;
  border: 1px dashed #ddd;
  border-radius: 4px;
  margin: 20px 0;
}

/* Sort Controls */
.sort-controls {
  display: flex;
  align-items: center;
  margin: 20px 0;
  flex-wrap: wrap;
}

.sort-label {
  font-weight: 500;
  color: #666;
  margin-right: 10px;
  font-size: 16px;
}

.sort-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.sort-button {
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sort-button:hover {
  background-color: #f1f1f1;
  border-color: #ccc;
}

.sort-button.active {
  background-color: #f1c4d6;
  border-color: #d8517c;
  color: #333;
  font-weight: 500;
}

.sort-arrow {
  display: inline-block;
  margin-left: 4px;
  transition: transform 0.2s ease;
}

.sort-button.active[data-direction="asc"] .sort-arrow {
  transform: rotate(180deg);
}
</style>

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