function toggleRelatedArticles(term) {
  const relatedArticlesElement = document.getElementById(`related-articles-${term}`);
  const button = document.querySelector(`button[onclick="toggleRelatedArticles('${term}')"]`);

  // Close all other open lists first
  if (!relatedArticlesElement.classList.contains('visible')) {
    const allLists = document.querySelectorAll('.related-articles');
    const allButtons = document.querySelectorAll('.related-articles-toggle');

    allLists.forEach(list => {
      if (list.id !== `related-articles-${term}`) {
        list.classList.remove('visible');
      }
    });

    allButtons.forEach(btn => {
      if (btn !== button) {
        btn.classList.remove('expanded');
      }
    });

    // Open the clicked list
    relatedArticlesElement.classList.add('visible');
    button.classList.add('expanded');
  } else {
    // Close the clicked list
    relatedArticlesElement.classList.remove('visible');
    button.classList.remove('expanded');
  }
}

// Auto-open lists if hash fragment matches term
document.addEventListener('DOMContentLoaded', function() {
  const hash = window.location.hash.substring(1);
  if (hash) {
    const relatedArticlesElement = document.getElementById(`related-articles-${hash}`);
    const caretIcon = document.getElementById(`caret-${hash}`);

    if (relatedArticlesElement) {
      relatedArticlesElement.classList.add('visible');
      const button = document.querySelector(`button[onclick="toggleRelatedArticles('${hash}')"]`);
      if (button) {
        button.classList.add('expanded');
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