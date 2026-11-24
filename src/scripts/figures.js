// Post figures (built by lib/rehype-figures.js): a figure shown smaller than its
// real size gets an "Enlarge figure" button at the end of its caption (and the
// image itself becomes clickable) that opens it in a full-screen viewer. On a phone, where even the viewer
// is too narrow, tapping the image there switches to full size and scrolls.
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const figures = Array.from(document.querySelectorAll('.post-content figure.image')).filter(function (figure) {
      return figure.querySelector('img');
    });
    if (!figures.length || typeof HTMLDialogElement !== 'function') return;

    const closeIcon = '<svg viewBox="0 0 12 12" width="14" height="14" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
    const enlargeIcon = '<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M7 1h4v4M5 11H1V7M11 1L7.5 4.5M1 11l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    // Viewer ----------------------------------------------------------------

    const dialog = document.createElement('dialog');
    dialog.className = 'figure-viewer';
    dialog.setAttribute('aria-label', 'Enlarged figure');
    dialog.innerHTML =
      '<button type="button" class="figure-viewer-close" aria-label="Close">' + closeIcon + '</button>' +
      '<div class="figure-viewer-frame"><img alt=""></div>' +
      '<p class="figure-viewer-hint" hidden></p>' +
      '<p class="figure-viewer-caption"></p>';
    document.body.appendChild(dialog);
    const frame = dialog.querySelector('.figure-viewer-frame');
    const viewImg = frame.querySelector('img');
    const viewCaption = dialog.querySelector('.figure-viewer-caption');
    const hint = dialog.querySelector('.figure-viewer-hint');
    const verb = window.matchMedia('(pointer: coarse)').matches ? 'Tap' : 'Click';

    // Whether the viewer is still showing the figure below its real width.
    function updateViewerZoom() {
      const shrunk = viewImg.clientWidth > 0 && viewImg.clientWidth < naturalWidth(viewImg) - 1;
      const actual = dialog.classList.contains('actual-size');
      dialog.classList.toggle('can-zoom', shrunk || actual);
      hint.hidden = !(shrunk || actual);
      hint.textContent = actual
        ? verb + ' the figure to fit it to the screen.'
        : verb + ' the figure to see it at full size.';
    }

    function open(img, figure) {
      const caption = figure.querySelector('figcaption');
      viewImg.src = img.currentSrc || img.src;
      viewImg.alt = img.alt;
      if (img.getAttribute('width')) viewImg.setAttribute('width', img.getAttribute('width'));
      if (img.getAttribute('height')) viewImg.setAttribute('height', img.getAttribute('height'));
      // The caption's own text, without the Enlarge button.
      viewCaption.textContent = caption
        ? Array.from(caption.childNodes).filter(function (n) { return n.nodeType === 3; }).map(function (n) { return n.textContent; }).join('').trim()
        : '';
      dialog.classList.remove('actual-size', 'can-zoom');
      dialog.showModal();
      dialog.scrollTop = 0;
      if (viewImg.complete) updateViewerZoom();
    }

    viewImg.addEventListener('load', updateViewerZoom);
    viewImg.addEventListener('click', function () {
      if (!dialog.classList.contains('can-zoom')) return;
      dialog.classList.toggle('actual-size');
      updateViewerZoom();
    });
    dialog.querySelector('.figure-viewer-close').addEventListener('click', function () { dialog.close(); });
    // A click on the empty space around the figure closes the viewer.
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog || e.target === frame) dialog.close();
    });

    // Figures ---------------------------------------------------------------

    function naturalWidth(img) {
      return img.naturalWidth || Number(img.getAttribute('width')) || 0;
    }

    figures.forEach(function (figure) {
      const img = figure.querySelector('img');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'figure-enlarge';
      button.innerHTML = enlargeIcon + 'Enlarge figure';
      // At the end of the caption, so it never covers part of the figure.
      (figure.querySelector('figcaption') || figure).appendChild(button);
      button.addEventListener('click', function () { open(img, figure); });
      img.addEventListener('click', function () {
        if (figure.classList.contains('zoomable')) open(img, figure);
      });
    });

    // Only figures noticeably smaller than their real size are worth enlarging.
    function updateFigures() {
      figures.forEach(function (figure) {
        const img = figure.querySelector('img');
        figure.classList.toggle('zoomable', img.clientWidth > 0 && naturalWidth(img) > img.clientWidth * 1.15);
      });
      if (dialog.open) updateViewerZoom();
    }

    let frameRequest;
    window.addEventListener('resize', function () {
      cancelAnimationFrame(frameRequest);
      frameRequest = requestAnimationFrame(updateFigures);
    });
    updateFigures();
  });
})();
