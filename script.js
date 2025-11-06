// ========== KONFIGURASI ==========
const ENDPOINT = "https://v1.nocodeapi.com/arsok70/google_sheets/CSRVlyNAJbppmLcN";
const SHEET_NAME = "FormAspirasi";
// =================================

// Event kirim form
document.getElementById("aspirasiForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const pesan = document.getElementById("pesan").value.trim();
  const notif = document.getElementById("notif");

  if (!nama || !pesan) {
    tampilkanNotif("⚠️ Harap isi semua kolom.", "error");
    return;
  }

  const tanggal = new Date().toLocaleString("id-ID");
  const dataKirim = { tabId: SHEET_NAME, values: [[tanggal, nama, pesan]] };

  console.log("📤 Data yang akan dikirim:", dataKirim);

  try {
    // Kirim data ke Google Sheets
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataKirim)
    });

    const hasil = await res.json();
    console.log("📦 Respons NocodeAPI:", hasil);

    // Jika endpoint lama (masih butuh ?tabId di URL)
    if (hasil.error && hasil.error.includes("2D array")) {
      console.warn("⚙️ Deteksi: endpoint versi lama. Mengulang dengan ?tabId di URL...");
      await kirimDenganUrl(tanggal, nama, pesan);
      return;
    }

    if (res.ok && hasil.message === "Success") {
      tampilkanNotif("✅ Aspirasi berhasil dikirim!", "success");
      document.getElementById("aspirasiForm").reset();
      muatData();
    } else {
      tampilkanNotif("❌ Gagal kirim: " + (hasil.error || hasil.message), "error");
    }
  } catch (err) {
    console.error("❌ Kesalahan koneksi:", err);
    tampilkanNotif("❌ Tidak dapat terhubung ke server.", "error");
  }
});

// Fallback untuk endpoint lama
async function kirimDenganUrl(tanggal, nama, pesan) {
  const url = `${ENDPOINT}?tabId=${SHEET_NAME}`;
  const data = { values: [[tanggal, nama, pesan]] };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const hasil = await res.json();
    console.log("📦 Respons (mode URL):", hasil);

    if (res.ok && hasil.message === "Success") {
      tampilkanNotif("✅ Aspirasi berhasil dikirim (mode URL)!", "success");
      document.getElementById("aspirasiForm").reset();
      muatData();
    } else {
      tampilkanNotif("❌ Gagal kirim (mode URL): " + (hasil.error || hasil.message), "error");
    }
  } catch (err) {
    tampilkanNotif("❌ Kesalahan koneksi (mode URL).", "error");
  }
}

// Muat data tabel
async function muatData() {
  const tabelBody = document.getElementById("tabelBody");
  tabelBody.innerHTML = "<tr><td colspan='3' align='center'>Memuat data...</td></tr>";

  try {
    const res = await fetch(`${ENDPOINT}?tabId=${SHEET_NAME}`);
    const json = await res.json();
    console.log("📄 Data sheet:", json);

    if (json.data && json.data.length > 1) {
      const rows = json.data.slice(1);
      tabelBody.innerHTML = rows.map(r => `
        <tr>
          <td>${r[0] || "-"}</td>
          <td>${r[1] || "-"}</td>
          <td>${r[2] || "-"}</td>
        </tr>
      `).join("");
    } else {
      tabelBody.innerHTML = "<tr><td colspan='3' align='center'>Belum ada data.</td></tr>";
    }
  } catch (err) {
    console.error("❌ Gagal memuat:", err);
    tabelBody.innerHTML = "<tr><td colspan='3' align='center'>Gagal memuat data.</td></tr>";
  }
}

// Fungsi utilitas
function tampilkanNotif(pesan, tipe) {
  const notif = document.getElementById("notif");
  notif.textContent = pesan;
  notif.className = `notif ${tipe}`;
}

// Jalankan saat load
muatData();
