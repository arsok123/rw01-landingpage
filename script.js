const scriptURL = "https://script.google.com/macros/s/AKfycbzGshx-OzAw4_ERjNK9NBXZtd5lVg44xFBdZ7lSneOH7JioOzxoqNa7fE_15cLAwiY5/exec";

document.getElementById("aspirasiForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const pesan = document.getElementById("pesan").value.trim();
  const status = document.getElementById("status");

  if (!nama || !pesan) {
    status.textContent = "⚠️ Nama dan pesan wajib diisi.";
    status.style.color = "red";
    return;
  }

  status.textContent = "⏳ Mengirim...";
  status.style.color = "#333";

  fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify({ nama, pesan }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.text())
  .then(txt => {
    if (txt.includes("OK")) {
      status.textContent = "✅ Aspirasi berhasil dikirim!";
      status.style.color = "green";
      document.getElementById("aspirasiForm").reset();
    } else {
      status.textContent = "❌ Gagal mengirim aspirasi.";
      status.style.color = "red";
    }
  })
  .catch(err => {
    console.error(err);
    status.textContent = "❌ Gagal mengirim aspirasi.";
    status.style.color = "red";
  });
});
