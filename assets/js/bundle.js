(function () {
    "use strict";

    document.addEventListener('DOMContentLoaded', function(){

        // Creates Captions from Alt tags
        document.querySelectorAll(".post-content img").forEach(function(img) {
            // Let's put a caption if there is one
            if(img.getAttribute("alt") && !img.classList.contains("emoji")) {
                const figure = document.createElement('figure');
                figure.className = 'image';
                img.parentNode.insertBefore(figure, img);
                figure.appendChild(img);
                
                const figcaption = document.createElement('figcaption');
                figcaption.textContent = img.getAttribute("alt");
                figure.appendChild(figcaption);
            }
        });

        // Toggle mobile menu
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', function() {
                this.classList.toggle('active');
                const customLinks = document.querySelector('.custom-links');
                if (customLinks) {
                    customLinks.classList.toggle('active');
                }
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.menu-toggle') && !event.target.closest('.custom-links')) {
                const menuToggle = document.querySelector('.menu-toggle');
                const customLinks = document.querySelector('.custom-links');
                if (menuToggle) menuToggle.classList.remove('active');
                if (customLinks) customLinks.classList.remove('active');
            }
        });

        // Close menu when clicking a link (for mobile)
        document.querySelectorAll('.custom-links a').forEach(function(link) {
            link.addEventListener('click', function() {
                const menuToggle = document.querySelector('.menu-toggle');
                const customLinks = document.querySelector('.custom-links');
                if (menuToggle) menuToggle.classList.remove('active');
                if (customLinks) customLinks.classList.remove('active');
            });
        });

        // Dynamic background image loader
        const elements = document.querySelectorAll('[data-bg-image]');
        elements.forEach(function(element) {
            const imageUrl = element.getAttribute('data-bg-image');
            if (imageUrl) {
                element.style.backgroundImage = 'url(' + imageUrl + ')';
            }
        });

        // Article image padding adjustment
        const articleImage = document.querySelector('.article-image');
        const postContent = document.querySelector('.post-content');
        if (articleImage && postContent) {
            const height = articleImage.offsetHeight;
            postContent.style.paddingTop = height + 'px';
        }

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href*="#"]:not([href="#"])').forEach(function(link) {
            link.addEventListener('click', function(e) {
                if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'')
                 && location.hostname === this.hostname) {
                    let target = document.querySelector(this.hash);
                    if (!target) {
                        target = document.querySelector('[name="' + this.hash.slice(1) + '"]');
                    }
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

    });

})();