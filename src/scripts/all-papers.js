document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('paperSearch');
  const clearButton = document.getElementById('clearSearch');
  const resultsInfo = document.getElementById('searchResults');
  const paperItems = document.querySelectorAll('.post-item');
  const allPapersList = document.querySelector('.all-papers-list');

  // Create a no results message element (initially hidden)
  const noResultsMessage = document.createElement('div');
  noResultsMessage.className = 'no-results-message';
  noResultsMessage.innerHTML = 'No papers match your search criteria. Try different keywords.';
  noResultsMessage.style.display = 'none';
  allPapersList.after(noResultsMessage);

  // Sort buttons
  const sortButtons = document.querySelectorAll('.sort-button');
  let currentSort = {
    type: 'title',
    direction: 'desc'
  };

  // Parse data from papers
  function getPaperData() {
    const papers = [];
    paperItems.forEach(item => {
      const titleElement = item.querySelector('.post-title');
      const title = titleElement.textContent.trim();
      
      // Extract year from citation (assumes format includes a year in parentheses)
      const citation = item.querySelector('.citation').textContent;
      const yearMatch = citation.match(/\((\d{4})\)/);
      const year = yearMatch ? parseInt(yearMatch[1]) : 0;
      
      // Extract first author from citation
      const authorMatch = citation.match(/^([^,]+)/);
      const author = authorMatch ? authorMatch[1].trim() : '';
      
      papers.push({
        element: item,
        title: title,
        year: year,
        author: author
      });
    });
    return papers;
  }

  // Sort papers
  function sortPapers() {
    const papers = getPaperData();
    const sortType = currentSort.type;
    const sortDirection = currentSort.direction;
    
    papers.sort((a, b) => {
      let comparison = 0;
      
      if (sortType === 'title') {
        // Reverse the default comparison for titles (Z-A by default)
        comparison = -a.title.localeCompare(b.title);
      } else if (sortType === 'year') {
        // Default comparison for years (older first by default)
        comparison = a.year - b.year;
      } else if (sortType === 'author') {
        // Reverse the default comparison for authors (Z-A by default)
        comparison = -a.author.localeCompare(b.author);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    // Reorder DOM elements
    const fragment = document.createDocumentFragment();
    papers.forEach(paper => {
      fragment.appendChild(paper.element);
    });
    
    allPapersList.innerHTML = '';
    allPapersList.appendChild(fragment);
  }

  // Update sort button states
  function updateSortButtons() {
    sortButtons.forEach(button => {
      const sortType = button.getAttribute('data-sort');
      
      if (sortType === currentSort.type) {
        button.classList.add('active');
        button.setAttribute('data-direction', currentSort.direction);
      } else {
        button.classList.remove('active');
        button.removeAttribute('data-direction');
      }
    });
  }

  // Initialize sorting
  sortPapers();
  updateSortButtons();

  // Sort button click handlers
  sortButtons.forEach(button => {
    button.addEventListener('click', function() {
      const sortType = this.getAttribute('data-sort');
      
      if (sortType === currentSort.type) {
        // Toggle direction if already active
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        // Set new sort type with default desc direction
        currentSort.type = sortType;
        currentSort.direction = 'desc';
      }
      
      sortPapers();
      updateSortButtons();
    });
  });

  // Search functionality
  function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    let matchCount = 0;

    // Show/hide clear button
    clearButton.style.display = searchTerm.length > 0 ? 'block' : 'none';

    // If search is empty, show all papers
    if (searchTerm === '') {
      paperItems.forEach(item => {
        item.classList.remove('hidden');
      });
      resultsInfo.textContent = '';
      noResultsMessage.style.display = 'none';
      return;
    }

    // Filter papers based on search term
    paperItems.forEach(item => {
      const title = item.querySelector('.post-title').textContent.toLowerCase();
      const matchesSearch = title.includes(searchTerm);

      if (matchesSearch) {
        item.classList.remove('hidden');
        matchCount++;
      } else {
        item.classList.add('hidden');
      }
    });

    // Update results info
    if (matchCount === 0) {
      resultsInfo.textContent = 'No papers found matching your search.';
      noResultsMessage.style.display = 'block';
    } else {
      resultsInfo.textContent = `Found ${matchCount} paper${matchCount !== 1 ? 's' : ''} matching your search.`;
      noResultsMessage.style.display = 'none';
    }
  }

  // Event listeners
  searchInput.addEventListener('input', performSearch);

  clearButton.addEventListener('click', function() {
    searchInput.value = '';
    performSearch();
    searchInput.focus();
  });

  // Handle Escape key to clear search
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      searchInput.value = '';
      performSearch();
    }
  });
});