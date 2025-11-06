const form = document.getElementById('aspirasiForm');
const notif = document.getElementById('notif');
const tabelBody = document.getElementById('tabelBody');

// ✅ Ganti dengan endpoint kamu
const endpoint = "https://v1.nocodeapi.com/arsok70/google_sheets/CSRVlyNAJbppmLcN?tabId=FormAspirasi";

// 🟢 Kirim data aspirasi
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nama = document.getElementById('nama').value.trim();
  const pesan = document.getElementById('pesan').value.trim();

  if (!nama || !pesan) {
    notif.textContent = "⚠️ Nama dan pesan harus diisi!";
    notif.style.color = "red";
    return;
  }

  const data = {
    values: [
      [new Date().toLocaleString(), nama, pesan]
    ]
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    notif.textContent = "✅ Data berhasil dikirim!";
    notif.style.color = "green";
    form.reset();
    loadData(); // refresh tabel
  } catch (err) {
    console.error(err);
    notif.textContent = "❌ Gagal mengirim data!";
    notif.style.color = "red";
  }
});

// 🔵 Ambil dan tampilkan data dari Google Sheet
async function loadData() {
  try {
    const res = await fetch(endpoint);
    const json = await res.json();

    if (!json.data || json.data.length === 0) {
      tabelBody.innerHTML = `<tr><td colspan="3" align="center">Belum ada data</td></tr>`;
      return;
    }

    tabelBody.innerHTML = "";
    json.data.slice(1).reverse().forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row[0] || '-'}</td>
        <td>${row[1] || '-'}</td>
        <td>${row[2] || '-'}</td>
      `;
      tabelBody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    tabelBody.innerHTML = `<tr><td colspan="3" align="center" style="color:red;">Gagal memuat data</td></tr>`;
  }
}

// 🔄 Jalankan loadData saat pertama kali halaman dibuka
loadData();
