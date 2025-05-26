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
        {% else %}
        <em>Coming soon</em>
        {% endif %}
      </p>
    </div>
  </div>
{% endfor %}
</div>

---

*Note: Papers may appear in multiple themes if they address several key areas of research.*