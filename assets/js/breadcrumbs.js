// Contextual breadcrumbs for paper pages.
//
// Internal links point at clean canonical URLs, so the page the visitor came
// from is read from document.referrer (same-origin only). Legacy ?ref= links
// (old bookmarks, external links) are still honoured.
//
// The static trail Google sees lives in the BreadcrumbList JSON-LD in <head>;
// this script only changes which crumbs are visible.

function getNavigationOrigin() {
  var params = new URLSearchParams(window.location.search);
  var ref = params.get('ref');
  if (ref) {
    if (ref.indexOf('glossary') === 0) return { ref: 'glossary' };
    return { ref: ref, theme: params.get('theme') };
  }

  if (!document.referrer) return null;
  var referrer;
  try {
    referrer = new URL(document.referrer);
  } catch (e) {
    return null;
  }
  if (referrer.origin !== window.location.origin) return null;

  var path = referrer.pathname;
  if (path.indexOf('/all-papers') === 0) return { ref: 'all-papers' };
  if (path.indexOf('/glossary') === 0) return { ref: 'glossary' };
  var themeMatch = path.match(/^\/themes\/([^\/]+)\/?$/);
  if (themeMatch) return { ref: 'theme', theme: themeMatch[1] };
  return null;
}

function updateBreadcrumbs() {
  var breadcrumbs = document.querySelector('.breadcrumbs');
  if (!breadcrumbs) return;

  var optional = breadcrumbs.querySelectorAll('.theme-breadcrumb, .all-papers-breadcrumb, .glossary-breadcrumb');
  optional.forEach(function(elem) {
    elem.classList.remove('visible');
  });

  var origin = getNavigationOrigin();
  if (!origin) return;

  if (origin.ref === 'all-papers') {
    var allPapers = breadcrumbs.querySelector('.all-papers-breadcrumb');
    if (allPapers) allPapers.classList.add('visible');
  } else if (origin.ref === 'glossary') {
    var glossary = breadcrumbs.querySelector('.glossary-breadcrumb');
    if (glossary) glossary.classList.add('visible');
  } else if (origin.ref === 'theme' && origin.theme) {
    var themeCrumb = breadcrumbs.querySelector('.theme-breadcrumb[data-theme="' + CSS.escape(origin.theme) + '"]');
    if (themeCrumb) {
      breadcrumbs.querySelector('.themes-index-breadcrumb').classList.add('visible');
      themeCrumb.classList.add('visible');
    }
  }
}

document.addEventListener('DOMContentLoaded', updateBreadcrumbs);
