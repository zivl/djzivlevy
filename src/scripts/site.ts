// The only client-side JS on the site. Everything works without it:
// facades are real links, gallery items link to the full image, and
// past gigs are already excluded at build time.

/** Click-to-load embeds (YouTube, Spotify): swap the facade for the iframe. */
function initEmbeds(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[data-embed]').forEach((el) => {
    el.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      const iframe = document.createElement('iframe');
      iframe.src = el.dataset['embed'] ?? '';
      iframe.title = el.dataset['title'] ?? '';
      iframe.allow = el.dataset['allow'] ?? 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      iframe.loading = 'eager';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.className = el.dataset['frameClass'] ?? '';
      el.replaceWith(iframe);
      iframe.focus();
    });
  });
}

/** Gallery lightbox using the native <dialog> element. */
function initLightbox(): void {
  const dialog = document.querySelector<HTMLDialogElement>('dialog[data-lightbox]');
  if (!dialog) return;
  const img = dialog.querySelector('img');
  const caption = dialog.querySelector('figcaption');
  const download = dialog.querySelector<HTMLAnchorElement>('a[data-download]');
  document.querySelectorAll<HTMLAnchorElement>('a[data-lightbox-item]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      if (img) {
        img.src = link.href;
        img.alt = link.dataset['alt'] ?? '';
      }
      if (caption) caption.textContent = link.dataset['alt'] ?? '';
      if (download) {
        download.href = link.href;
        download.download = link.dataset['fileName'] ?? '';
      }
      dialog.showModal();
    });
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
}

/** Hide gigs that have passed since the last build. */
function initGigs(): void {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(new Date());
  document.querySelectorAll<HTMLElement>('[data-gig-list]').forEach((list) => {
    let visible = 0;
    list.querySelectorAll<HTMLElement>('[data-gig-date]').forEach((item) => {
      const past = (item.dataset['gigDate'] ?? '') < today;
      item.hidden = past;
      if (!past) visible += 1;
    });
    const empty = list.parentElement?.querySelector<HTMLElement>('[data-gig-empty]');
    if (empty) empty.hidden = visible > 0;
  });
}

initEmbeds();
initLightbox();
initGigs();
