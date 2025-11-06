// ✅ Endpoint dengan tabId di URL (versi lama NoCodeAPI)
const ENDPOINT = "https://v1.nocodeapi.com/arsok70/google_sheets/YIKReFjIqgQshfzR?tabId=FormAspirasi";

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

  // ✅ Format body sesuai Google Sheets API
  const body = {
    values: [[tanggal, nama, pesan]]
  };

  console.log("📤 Akan dikirim ke NocodeAPI:", JSON.stringify(body, null, 2));

  try {
  // 🛰️ Kirim data ke NoCodeAPI
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  // 🧾 Ambil hasil respons
  let hasil;
  try {
    hasil = await res.json();
  } catch (jsonErr) {
    console.warn("⚠️ Gagal parse JSON dari response:", jsonErr);
    hasil = { error: "Response bukan JSON valid" };
  }

  console.log("📦 Hasil response:", hasil);

  // ✅ Berhasil (pesan sukses)
  if (res.ok && hasil.message === "Success") {
    tampilkanNotif("✅ Aspirasi berhasil dikirim!", "success");
    document.getElementById("aspirasiForm").reset();
    muatData();
    return;
  }

  // ⚠️ Error umum dari server
  if (hasil.error && hasil.error.includes("2D array")) {
    tampilkanNotif("⚙️ Deteksi format salah: coba ulang dengan versi URL (auto fix).", "error");

    // 🚑 Fallback otomatis → tambahkan ?tabId di URL dan ulangi POST
    const fallbackUrl = `${ENDPOINT}?tabId=${SHEET_NAME}`;
    console.log("🔁 Mengulang POST ke:", fallbackUrl);

    const res2 = await fetch(fallbackUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values: [[tanggal, nama, pesan]] })
    });

        const hasil = await res.json();
    console.log("📦 Hasil response:", hasil); // This line is already good for verification.
    console.log("Request body sent:", JSON.stringify(body)); // Add this to compare with expected API format.

    if (res.ok && hasil.message === "Success") {
      tampilkanNotif("✅ Aspirasi berhasil dikirim!", "success");
      document.getElementById("aspirasiForm").reset();
      muatData();
    } else {
      // The error message from the server should be in hasil.error or hasil.message
      tampilkanNotif("❌ Gagal kirim: " + (hasil.error || hasil.message || "Unknown error"), "error");
    }


  // ❌ Kalau bukan error 2D array, tampilkan hasil server
  tampilkanNotif(
    "❌ Gagal mengirim: " + (hasil.error || hasil.message || `Kode ${res.status}`),
    "error"
  );

} catch (err) {
  // 💥 Network atau error fetch
  console.error("❌ Kesalahan koneksi:", err);
  tampilkanNotif("❌ Tidak dapat terhubung ke server (cek koneksi).", "error");
}


async function muatData() {
  const tabelBody = document.getElementById("tabelBody");
  tabelBody.innerHTML = "<tr><td colspan='3' align='center'>Memuat data...</td></tr>";

  try {
    const res = await fetch(ENDPOINT);
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

function tampilkanNotif(pesan, tipe) {
  const notif = document.getElementById("notif");
  notif.textContent = pesan;
  notif.className = `notif ${tipe}`;
}

muatData();
