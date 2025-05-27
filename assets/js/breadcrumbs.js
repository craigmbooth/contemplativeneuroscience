// Function to get URL parameter by name
function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Function to update breadcrumbs based on referrer
function updateBreadcrumbs() {
  var referrerParam = getParameterByName('ref');
  var themeParam = getParameterByName('theme');

  // Hide all optional breadcrumbs by default
  var optionalBreadcrumbs = document.querySelectorAll('.theme-breadcrumb, .all-papers-breadcrumb, .glossary-breadcrumb');
  optionalBreadcrumbs.forEach(function(elem) {
    elem.classList.remove('visible');
  });

  if (referrerParam === 'home') {
    // Coming from home - all optional breadcrumbs already hidden
  } else if (referrerParam === 'all-papers') {
    // Show All Papers breadcrumb
    var allPapersBreadcrumb = document.querySelector('.all-papers-breadcrumb');
    if (allPapersBreadcrumb) {
      allPapersBreadcrumb.classList.add('visible');
    }
  } else if (referrerParam === 'glossary') {
    // Show Glossary breadcrumb
    var glossaryBreadcrumb = document.querySelector('.glossary-breadcrumb');
    if (glossaryBreadcrumb) {
      glossaryBreadcrumb.classList.add('visible');
    }
  } else if (referrerParam && referrerParam.startsWith('glossary-')) {
    // Coming from a specific glossary term
    var glossaryBreadcrumb = document.querySelector('.glossary-breadcrumb');
    if (glossaryBreadcrumb) {
      glossaryBreadcrumb.classList.add('visible');
    }
  } else if (referrerParam === 'theme' && themeParam) {
    // Show theme breadcrumbs
    var themeBreadcrumbs = document.querySelectorAll('.theme-breadcrumb');
    themeBreadcrumbs.forEach(function(elem) {
      elem.classList.add('visible');
    });

    // Make sure we're showing the correct theme in the breadcrumb
    var themeLinks = document.querySelectorAll('.theme-breadcrumb a[itemprop="item"]');
    themeLinks.forEach(function(link) {
      // Check if this is the theme link that contains our theme parameter
      if (link.href.indexOf('/themes/' + themeParam) >= 0) {
        // Make sure this theme's parent is visible
        link.parentNode.classList.add('visible');
      } else {
        // Hide other theme breadcrumbs
        var parentLi = link.closest('li');
        if (parentLi && parentLi.classList.contains('theme-breadcrumb') &&
            !parentLi.querySelector('span[itemprop="name"]').textContent.includes('Research Themes')) {
          parentLi.classList.remove('visible');
        }
      }
    });
  }
}

// Run after page load
document.addEventListener('DOMContentLoaded', updateBreadcrumbs);