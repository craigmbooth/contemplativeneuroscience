---
layout: page
title: Research Themes
permalink: /themes/
---

This collection organizes research papers into thematic categories that represent key areas of investigation in contemplative neuroscience. While research papers are often categorized by methodology or specific results, these themes help highlight broader questions and areas of inquiry that span multiple studies and approaches.

Each theme represents a significant aspect of how contemplative practices interact with brain function, cognition, or health. By grouping papers this way, we hope to facilitate deeper understanding of the patterns and consistencies emerging across different research efforts.

## Available Themes

<div class="theme-grid">
{% assign theme_pages = site.pages | where_exp: "page", "page.layout == 'theme'" %}
{% for theme_page in theme_pages %}
  <div class="theme-card">
    <div class="theme-card-image">
      <a href="{{ theme_page.url | prepend: site.baseurl }}">
        {% if theme_page.image_format %}
          <img src="{{ site.baseurl }}/assets/images/themes/{{ theme_page.theme_key }}.{{ theme_page.image_format }}" alt="">
        {% else %}
          <img src="{{ site.baseurl }}/assets/images/themes/{{ theme_page.theme_key }}.png" alt="">
        {% endif %}
      </a>
    </div>
    <div class="theme-card-content">
      <h3><a href="{{ theme_page.url | prepend: site.baseurl }}">{{ theme_page.title }}</a></h3>
      <p>{{ theme_page.theme_description | strip_html }}</p>
      {% assign theme_posts = site.posts | where_exp: "post", "post.theme == theme_page.theme_key" %}
      {% assign theme_array_posts = site.posts | where_exp: "post", "post.theme contains theme_page.theme_key" %}
      {% assign theme_posts = theme_posts | concat: theme_array_posts | uniq %}
      <p class="theme-card-count">
        {% if theme_posts.size > 0 %}
        <em>{{ theme_posts.size }} paper{% if theme_posts.size > 1 %}s{% endif %}</em>
        {% assign sorted_posts = theme_posts | sort: 'date' | reverse %}
        <br><small>(Last paper added: {{ sorted_posts[0].date | date: "%b %d, %Y" }})</small>
        {% else %}
        <em>Coming soon</em>
        {% endif %}
      </p>
    </div>
  </div>
{% endfor %}
</div>

<style>
.theme-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.theme-card {
  display: flex;
  border-radius: 5px;
  overflow: hidden;
  background: #f9f9f9;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.theme-card:hover {
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.theme-card-image {
  flex: 0 0 150px;
}

.theme-card-image img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 5px 0 0 5px;
}

.theme-card-content {
  flex: 1;
  padding: 15px;
}

.theme-card-content h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

.theme-card-content p {
  margin: 0 0 10px;
  font-size: 0.9em;
}

.theme-card-count {
  font-size: 0.8em;
  color: #666;
}

@media (max-width: 600px) {
  .theme-card {
    flex-direction: column;
  }

  .theme-card-image {
    flex: 0 0 auto;
  }

  .theme-card-image img {
    width: 100%;
    height: 180px;
    border-radius: 5px 5px 0 0;
  }
}
</style>

---

*Note: Papers may appear in multiple themes if they address several key areas of research.*