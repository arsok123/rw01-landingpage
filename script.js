const form = document.getElementById('aspirasiForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nama = document.getElementById('nama').value.trim();
  const pesan = document.getElementById('pesan').value.trim();

  if (!nama || !pesan) {
    alert("Harap isi nama dan pesan terlebih dahulu!");
    return;
  }

  // ✅ Ganti dengan endpoint kamu
  const endpoint = "https://v1.nocodeapi.com/arsok70/google_sheets/CSRVlyNAJbppmLcN?tabId=FormAspirasi";

  const bodyData = {
    values: [
      [new Date().toLocaleString(), nama, pesan]
    ]
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    alert("✅ Data berhasil dikirim!");
    form.reset();
  } catch (error) {
    console.error("❌ Error:", error);
    alert("Gagal mengirim data. Periksa koneksi atau format endpoint.");
  }
});
