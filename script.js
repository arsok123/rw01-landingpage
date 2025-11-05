const scriptURL = 'https://script.google.com/macros/s/AKfycbzwyL70qrsi_OxuCJh5evxiPgyn-9xcGnYbOQifK6cEKoi-gAP8Ekmzm8GQ-2LLcgBP/exec';
const form = document.getElementById('form-aspirasi');
const alertBox = document.getElementById('alertBox');

form.addEventListener('submit', e => {
  e.preventDefault();
  alertBox.style.display = 'none';

  const nama = form.nama.value.trim();
  const pesan = form.pesan.value.trim();

  if (!nama || !pesan) {
    showAlert('❗ Nama dan pesan wajib diisi.', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('nama', nama);
  formData.append('pesan', pesan);

  fetch(scriptURL, { method: 'POST', body: formData })
    .then(res => res.text())
    .then(text => {
      if (text.includes('OK') || text.includes('SUKSES')) {
        showAlert('✅ Aspirasi berhasil dikirim. Terima kasih!', 'success');
        form.reset();
      } else {
        showAlert('❌ Gagal mengirim aspirasi. Coba lagi nanti.', 'error');
      }
    })
    .catch(err => {
      console.error('Error:', err);
      showAlert('❌ Gagal mengirim aspirasi. Periksa koneksi Anda.', 'error');
    });
});

function showAlert(msg, type) {
  alertBox.textContent = msg;
  alertBox.className = `alert ${type}`;
  alertBox.style.display = 'block';
}
