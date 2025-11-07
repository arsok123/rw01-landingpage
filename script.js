// ✅ Ganti dengan endpoint NoCodeAPI kamu
const ENDPOINT = "https://v1.nocodeapi.com/arsok70/google_sheets/HFVLzVrXEYXcFYRI";
const SHEET_NAME = "FormAspirasi";

const form = document.getElementById("aspirasiForm");
const notif = document.getElementById("notif");
const tabelBody = document.getElementById("tabelBody");

// 🔹 Fungsi menampilkan notifikasi
function tampilkanNotif(pesan, tipe) {
  notif.textContent = pesan;
  notif.className = `notif ${tipe}`;
}

// 🔹 Ambil data dari Sheet
async function muatData() {
  tabelBody.innerHTML = "<tr><td colspan='3' align='center'>Memuat data...</td></tr>";

  try {
    // ❗ gunakan hanya satu ?tabId
    const res = await fetch(`${ENDPOINT}?tabId=${SHEET_NAME}`);
    const json = await res.json();
    console.log("📄 Data sheet:", json);

    if (json.data && json.data.length > 1) {
      const rows = json.data.slice(1); // lewati header
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

// 🔹 Saat form dikirim
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const pesan = document.getElementById("pesan").value.trim();
  const tanggal = new Date().toLocaleString("id-ID");

  if (!nama || !pesan) {
    tampilkanNotif("⚠️ Harap isi semua kolom.", "error");
    return;
  }

  // ✅ Format body langsung array 2D (tanpa key "values")
  const body = [[tanggal, nama, pesan]];
  console.log("📤 Akan dikirim:", JSON.stringify(body, null, 2));

  try {
    // ❗ hanya satu ?tabId
    const res = await fetch(`${ENDPOINT}?tabId=${SHEET_NAME}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const hasil = await res.json();
    console.log("📦 Hasil response:", hasil);

    if (res.ok && hasil.message === "Success") {
      tampilkanNotif("✅ Aspirasi berhasil dikirim!", "success");
      form.reset();
      muatData();
    } else {
      tampilkanNotif("❌ Gagal kirim: " + (hasil.error || hasil.message), "error");
    }

  } catch (err) {
    console.error("❌ Kesalahan koneksi:", err);
    tampilkanNotif("❌ Tidak dapat terhubung ke server.", "error");
  }
});

// Jalankan pertama kali
muatData();
