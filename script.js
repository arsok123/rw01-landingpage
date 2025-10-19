// ======================
// Scroll animation
// ======================
const animElements = document.querySelectorAll('.animate');

function showOnScroll() {
  animElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add('show');
    }
  });
}

window.addEventListener('scroll', showOnScroll);
window.addEventListener('load', showOnScroll);

// ======================
// Preview file input (aspirasi)
// ======================
document.querySelectorAll('input[type=file]').forEach(input => {
  input.addEventListener('change', function () {
    const preview = document.createElement('p');
    preview.textContent = this.files[0] ? 'File siap diupload: ' + this.files[0].name : '';
    if (this.nextSibling && this.nextSibling.tagName === 'P') {
      this.nextSibling.remove();
    }
    this.parentNode.insertBefore(preview, this.nextSibling);
  });
});

// ======================
// Lightbox gallery initialization
// ======================
if (typeof lightbox !== 'undefined') {
  lightbox.option({
    'resizeDuration': 200,
    'wrapAround': true,
    'fadeDuration': 300,
    'imageFadeDuration': 300,
    'alwaysShowNavOnTouchDevices': true
  });
} else {
  console.warn('Lightbox JS belum ter-load. Pastikan link script Lightbox ada di index.html.');
}
