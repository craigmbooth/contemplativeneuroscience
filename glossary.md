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

          <div class="related-articles" id="related-articles-{{ definition.term }}" style="display: none;">
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

<style>
.glossary-list * {
  box-sizing: border-box;
}

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
  margin-top: 15px;
  font-size: 14px;
  color: #666;
}

.mention-count {
  font-style: italic;
  background-color: #f3f3f3;
  padding: 6px 10px;
  border-radius: 4px;
  display: inline-block;
  font-size: 14px;
}

.related-articles-toggle {
  width: 100%;
  text-align: left;
  background-color: #f9f0f5;
  color: #444;
  border: 1px solid #f1c4d6;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: normal;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}

.related-articles-toggle:hover {
  background-color: #f8e4ed;
  border-color: #e4a1bc;
}

.related-articles-toggle i {
  transition: transform 0.3s ease;
}

.related-articles-toggle span {
  flex: 1;
}

.related-articles {
  margin-top: 0;
  background-color: #fafafa;
  border-radius: 0 0 4px 4px;
  padding: 15px;
  border: 1px solid #f1c4d6;
  border-top: none;
  width: 100%;
  box-sizing: border-box;
}

.related-articles-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
  box-sizing: border-box;
}

.related-articles-list li {
  padding: 8px 0;
  border-bottom: 1px dotted #eee;
  margin-left: 0 !important;
  font-size: 15px !important;
  line-height: 1.4 !important;
}

.related-articles-list li:last-child {
  border-bottom: none;
}

.related-articles-list li a {
  display: block;
  text-decoration: none;
  color: #333;
  padding: 2px 0;
  transition: color 0.2s ease;
}

.related-articles-list li a:hover {
  color: #d8517c;
  text-decoration: underline;
}
</style>

<script>
function toggleRelatedArticles(term) {
  const relatedArticlesElement = document.getElementById(`related-articles-${term}`);
  const caretIcon = document.getElementById(`caret-${term}`);
  const button = caretIcon.parentElement;

  // Close all other open lists first
  if (relatedArticlesElement.style.display === 'none') {
    const allLists = document.querySelectorAll('.related-articles');
    const allCarets = document.querySelectorAll('.related-articles-toggle i');
    const allButtons = document.querySelectorAll('.related-articles-toggle');

    allLists.forEach(list => {
      if (list.id !== `related-articles-${term}`) {
        list.style.display = 'none';
      }
    });

    allCarets.forEach(caret => {
      if (caret.id !== `caret-${term}`) {
        caret.style.transform = 'rotate(0deg)';
      }
    });

    allButtons.forEach(btn => {
      btn.style.borderRadius = '4px';
    });

    // Open the clicked list
    relatedArticlesElement.style.display = 'block';
    caretIcon.style.transform = 'rotate(180deg)';
    button.style.borderRadius = '4px 4px 0 0';
  } else {
    // Close the clicked list
    relatedArticlesElement.style.display = 'none';
    caretIcon.style.transform = 'rotate(0deg)';
    button.style.borderRadius = '4px';
  }
}

// Auto-open lists if hash fragment matches term
document.addEventListener('DOMContentLoaded', function() {
  const hash = window.location.hash.substring(1);
  if (hash) {
    const relatedArticlesElement = document.getElementById(`related-articles-${hash}`);
    const caretIcon = document.getElementById(`caret-${hash}`);

    if (relatedArticlesElement) {
      relatedArticlesElement.style.display = 'block';
      if (caretIcon) {
        caretIcon.style.transform = 'rotate(180deg)';
        const button = caretIcon.parentElement;
        if (button) {
          button.style.borderRadius = '4px 4px 0 0';
        }
      }

      // Scroll to the term with a small delay to ensure everything is rendered
      setTimeout(function() {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
      }, 200);
    }
  }
});
</script>