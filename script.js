const scriptURL = 'httpshttps://script.google.com/macros/s/AKfycbzGshx-OzAw4_ERjNK9NBXZtd5lVg44xFBdZ7lSneOH7JioOzxoqNa7fE_15cLAwiY5/exec';

const form = document.querySelector('#form-aspirasi');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nama = form.elements['nama'].value.trim();
    const pesan = form.elements['pesan'].value.trim();

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
    .then(response => {
      return response.text();
    })
    .then(text => {
      console.log('Response dari server:', text);
      alert('✅ Aspirasi berhasil dikirim!');
      form.reset();
    })
    .catch(error => {
      console.error('Error kirim aspirasi:', error);
      alert('❌ Gagal mengirim aspirasi. Coba ulangi.');
    });
  });
}
