const scriptURL = 'https://script.google.com/macros/s/AKfycbzdV5Sb9z2blkt2-Q-_2FoDaty7SmDYTYVWXNgjGmbCdsu7gpSd_zwCanzGObA_4Ke-/exec';

document.querySelector('#form-aspirasi').addEventListener('submit', function(e) {
  e.preventDefault();
  const nama = this.elements['nama'].value.trim();
  const pesan = this.elements['pesan'].value.trim();

  if (!nama || !pesan) {
    alert('Nama dan pesan wajib diisi.');
    return;
  }

  const formData = new FormData();
  formData.append('nama', nama);
  formData.append('pesan', pesan);

  fetch(scriptURL, {
    method: 'POST',
    body: formData
  })
  .then(res => res.text())
  .then(text => {
    console.log('Response dari server:', text);
    if (text.includes('OK') || text.includes('SUKSES')) {
      alert('✅ Aspirasi berhasil dikirim!');
      this.reset();
    } else {
      alert('❌ Gagal mengirim aspirasi. Server memberi respons: ' + text);
    }
  })
  .catch(err => {
    console.error('Error kirim aspirasi:', err);
    alert('❌ Gagal mengirim aspirasi. Coba lagi nanti.');
  });
});
