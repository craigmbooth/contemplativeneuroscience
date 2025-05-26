// Dynamic background image loader
(function() {
  // Find all elements with data-bg-image attribute
  const elements = document.querySelectorAll('[data-bg-image]');
  
  elements.forEach(function(element) {
    const imageUrl = element.getAttribute('data-bg-image');
    if (imageUrl) {
      element.style.backgroundImage = 'url(' + imageUrl + ')';
    }
  });
})();