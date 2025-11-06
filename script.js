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
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const hasil = await res.json();
    console.log("📦 Hasil response:", hasil);

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
