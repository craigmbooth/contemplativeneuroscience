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