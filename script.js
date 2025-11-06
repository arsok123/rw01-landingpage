const endpoint = "https://v1.nocodeapi.com/arsok70/google_sheets/CSRVlyNAJbppmLcN?tabId=FormAspirasi";


document.getElementById("aspirasiForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const nama = document.getElementById("nama").value.trim();
  const pesan = document.getElementById("pesan").value.trim();
  const notif = document.getElementById("notif");

  if (!nama || !pesan) {
    notif.textContent = "⚠️ Harap isi semua kolom.";
    notif.className = "notif error";
    return;
  }

  const tanggal = new Date().toLocaleString("id-ID");
  const data = {
    tabId: "FormAspirasi",
    values: [[tanggal, nama, pesan]]
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log(result);

    if (result.message === "Success") {
      notif.textContent = "✅ Aspirasi berhasil dikirim!";
      notif.className = "notif success";
      document.getElementById("aspirasiForm").reset();
      muatData(); // refresh daftar setelah kirim
    } else {
      notif.textContent = "❌ Terjadi kesalahan saat mengirim data.";
      notif.className = "notif error";
    }

  } catch (error) {
    console.error(error);
    notif.textContent = "❌ Tidak dapat terhubung ke server.";
    notif.className = "notif error";
  }
});

async function muatData() {
  const tabelBody = document.getElementById("tabelBody");
  tabelBody.innerHTML = "<tr><td colspan='3' align='center'>Memuat data...</td></tr>";

  try {
    const res = await fetch(`${endpoint}?tabId=FormAspirasi`);
    const json = await res.json();

    if (json.data && json.data.length > 0) {
      const rows = json.data.slice(1); // lewati header jika ada
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
    console.error(err);
    tabelBody.innerHTML = "<tr><td colspan='3' align='center'>Gagal memuat data.</td></tr>";
  }
}

muatData();
