const endpoint = "https://v1.nocodeapi.com/arsok70/google_sheets/CSRVlyNAJbppmLcN?tabId=FormAspirasi";

// Saat form dikirim
document.getElementById("aspirasiForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const pesan = document.getElementById("pesan").value.trim();
  const notif = document.getElementById("notif");

  if (!nama || !pesan) {
    notif.innerHTML = "⚠️ Mohon isi semua kolom.";
    notif.style.color = "red";
    return;
  }

  // Format tanggal dan data
  const tanggal = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

  // Data dikirim sesuai format NocodeAPI
  const data = {
    values: [
      [tanggal, nama, pesan]
    ]
  };

  notif.innerHTML = "⏳ Mengirim...";
  notif.style.color = "black";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Gagal kirim data (${response.status})`);
    }

    notif.innerHTML = "✅ Aspirasi berhasil dikirim!";
    notif.style.color = "green";
    document.getElementById("aspirasiForm").reset();

    // Muat ulang tabel agar langsung muncul
    muatData();
  } catch (error) {
    console.error(error);
    notif.innerHTML = "❌ Terjadi kesalahan saat mengirim data.";
    notif.style.color = "red";
  }
});


// === Fungsi untuk menampilkan data dari Google Sheets ===
async function muatData() {
  const tabelBody = document.getElementById("tabelBody");
  tabelBody.innerHTML = `<tr><td colspan="3" align="center">⏳ Memuat data...</td></tr>`;

  try {
    const res = await fetch(endpoint);
    const json = await res.json();

    // Pastikan format data sesuai
    const rows = json.data;
    if (!rows || rows.length <= 1) {
      tabelBody.innerHTML = `<tr><td colspan="3" align="center">Belum ada aspirasi.</td></tr>`;
      return;
    }

    // Hapus header baris pertama (judul kolom)
    const dataRows = rows.slice(1);

    tabelBody.innerHTML = dataRows
      .reverse()
      .map(
        (r) => `
          <tr>
            <td>${r[0]}</td>
            <td>${r[1]}</td>
            <td>${r[2]}</td>
          </tr>`
      )
      .join("");
  } catch (err) {
    console.error(err);
    tabelBody.innerHTML = `<tr><td colspan="3" align="center">❌ Gagal memuat data.</td></tr>`;
  }
}

// Muat data saat halaman dibuka
muatData();
