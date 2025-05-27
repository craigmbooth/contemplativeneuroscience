---
layout: page
title: Glossary of Technical Terms
permalink: /glossary/
meta_description: "A glossary of terms related to contemplative neuroscience, meditation practices, and neuroscience research methods."
---

{% include glossary_schema.html %}

This glossary provides definitions for technical terms used throughout the site. Hover over these terms in articles to see their definitions.

<div class="glossary-list">
{% assign sorted_definitions = site.data.definitions | sort_natural: 'title' %}
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

      <div class="glossary-meta">
        {% if term_count > 0 %}
          <button class="related-articles-toggle" onclick="toggleRelatedArticles('{{ definition.term }}')">
            <span>View {{ term_count }} related article{% if term_count > 1 %}s{% endif %}</span>
            <i class="fa fa-caret-down" id="caret-{{ definition.term }}"></i>
          </button>

          <div class="related-articles" id="related-articles-{{ definition.term }}">
            <ul class="related-articles-list">
              {% for post in related_posts %}
                <li>
                  <a href="{{ post.url | prepend: site.baseurl }}?ref=glossary-{{ definition.term }}">{{ post.title }}</a>
                </li>
              {% endfor %}
            </ul>
          </div>
        {% else %}
          <span class="mention-count">Not yet mentioned in articles</span>
        {% endif %}
      </div>
    </div>
  </div>
{% endfor %}
</div>

<script src="{{ '/assets/js/glossary.min.js' | prepend: site.baseurl }}"></script>