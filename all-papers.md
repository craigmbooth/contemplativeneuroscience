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

<script src="{{ '/assets/js/all-papers.min.js' | prepend: site.baseurl }}"></script>