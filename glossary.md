---
layout: page
title: Glossary
permalink: /glossary/
meta_description: "A glossary of terms related to contemplative neuroscience, meditation practices, and neuroscience research methods."
---

This glossary provides definitions for technical terms used throughout the site. Hover over these terms in articles to see their definitions.

<div class="glossary-list">
{% assign sorted_definitions = site.data.definitions | sort: 'title' %}
{% for definition in sorted_definitions %}
  <div id="{{ definition.term }}" class="glossary-item">
    <h3 class="glossary-term">{{ definition.title }}</h3>
    <div class="glossary-definition">
      {{ definition.def }}

      {% assign term_count = 0 %}
      {% assign related_posts = "" | split: "" %}
      {% for post in site.posts %}
        {% if post.content contains definition.term or post.content contains definition.title %}
          {% assign term_count = term_count | plus: 1 %}
          {% assign related_posts = related_posts | push: post %}
        {% endif %}
      {% endfor %}

      <p class="glossary-meta">
        {% if term_count > 0 %}
          <span class="mention-count">
            Mentioned in {{ term_count }} article{% if term_count > 1 %}s{% endif %}
            <button class="random-article-btn" onclick="goToRandomArticle('{{ definition.term }}')">
              <i class="fa fa-random"></i> Read one
            </button>
          </span>

          <script>
            // Store related posts for this term
            window.termRelatedPosts = window.termRelatedPosts || {};
            window.termRelatedPosts['{{ definition.term }}'] = [
              {% for post in related_posts %}
                { url: "{{ post.url | prepend: site.baseurl }}?ref=glossary-{{ definition.term }}", title: "{{ post.title | escape }}" }{% unless forloop.last %},{% endunless %}
              {% endfor %}
            ];
          </script>
        {% else %}
          <span class="mention-count">Not yet mentioned in articles</span>
        {% endif %}

        {% if definition.wiki %}
          <span class="wiki-link"><a href="https://en.wikipedia.org/wiki/{{ definition.wiki }}" target="_blank">More on Wikipedia</a></span>
        {% endif %}
      </p>
    </div>
  </div>
{% endfor %}
</div>

<style>
.glossary-list {
  margin-top: 30px;
}

.glossary-item {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.glossary-item:last-child {
  border-bottom: none;
}

.glossary-term {
  margin-bottom: 10px;
  color: #333;
  font-family: Merriweather, serif;
}

.glossary-definition {
  font-size: 18px;
  line-height: 1.6;
}

.glossary-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  font-size: 14px;
  color: #666;
}

.mention-count {
  font-style: italic;
  background-color: #f3f3f3;
  padding: 3px 8px;
  border-radius: 4px;
  display: inline-block;
}

.wiki-link {
  margin-left: 15px;
}

@media (max-width: 600px) {
  .glossary-meta {
    flex-direction: column;
  }

  .wiki-link {
    margin-left: 0;
    margin-top: 8px;
  }
}

.random-article-btn {
  display: inline-block;
  background-color: #f62681;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 3px 8px;
  margin-left: 10px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  vertical-align: middle;
}

.random-article-btn:hover {
  background-color: #d01a6c;
}

.random-article-btn i {
  margin-right: 4px;
}
</style>

<script>
function goToRandomArticle(term) {
  if (window.termRelatedPosts && window.termRelatedPosts[term] && window.termRelatedPosts[term].length > 0) {
    const posts = window.termRelatedPosts[term];
    const randomIndex = Math.floor(Math.random() * posts.length);
    window.location.href = posts[randomIndex].url;
  }
}
</script>