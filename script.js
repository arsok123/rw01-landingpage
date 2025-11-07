// ✅ Ganti dengan endpoint NoCodeAPI kamu
const ENDPOINT = "https://v1.nocodeapi.com/arsok70/google_sheets/HFVLzVrXEYXcFYRI";
const SHEET_NAME = "FormAspirasi";

const form = document.getElementById("aspirasiForm");
const notif = document.getElementById("notif");
const tabelBody = document.getElementById("tabelBody");

// 🔹 Fungsi menampilkan notifikasi
function tampilkanNotif(pesan, tipe = "info") {
  notif.textContent = pesan;
  notif.className = `notif ${tipe}`;
}

// 🔹 Ambil data dari Sheet
async function muatData() {
  tabelBody.innerHTML = "<tr><td colspan='3' align='center'>Memuat data...</td></tr>";

  try {
    const res = await fetch(`${ENDPOINT}?sheet=${SHEET_NAME}`);
    const json = await res.json();
    console.log("📄 Data sheet:", json);

    if (Array.isArray(json.data) && json.data.length > 1) {
      const rows = json.data.slice(1); // lewati header
      tabelBody.innerHTML = rows.map(r => `
        <tr>
          <td>${r[1] || "-"}</td>
          <td>${r[2] || "-"}</td>
          <td>${r[0] || "-"}</td>
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

  const nama = form.querySelector("#nama")?.value.trim() || "";
  const pesan = form.querySelector("#pesan")?.value.trim() || "";
  const tanggal = new Date().toLocaleString("id-ID");

  if (!nama || !pesan) {
    tampilkanNotif("⚠️ Harap isi semua kolom.", "error");
    return;
  }

  // ✅ Format body langsung array 2D
  const body = [[tanggal, nama, pesan]];
  console.log("📤 Akan dikirim:", JSON.stringify(body, null, 2));

  try {
    const res = await fetch(`${ENDPOINT}?sheet=${SHEET_NAME}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const hasil = await res.json();
    console.log("📦 Hasil response:", hasil);

    if (res.ok && (
      hasil.message === "Success" ||
      hasil.message === "Successfully Inserted" ||
      (hasil.message && hasil.message.includes("Success"))
    )) {
      tampilkanNotif("✅ Aspirasi berhasil dikirim!", "success");
      form.reset();
      muatData();
    } else {
      tampilkanNotif("❌ Gagal kirim: " + (hasil.error || hasil.message || "Unknown error"), "error");
    }

  } catch (err) {
    console.error("❌ Kesalahan koneksi:", err);
    tampilkanNotif("❌ Tidak dapat terhubung ke server.", "error");
  }
});

// 🔹 Jalankan pertama kali
muatData();
