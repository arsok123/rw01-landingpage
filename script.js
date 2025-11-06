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

  // Format body sesuai dokumentasi NoCodeAPI
  const body = {
    values: [[tanggal, nama, pesan]]
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const result = await response.json();
    console.log("Hasil response:", result);

    if (response.ok && result.message === "Success") {
      notif.textContent = "✅ Aspirasi berhasil dikirim!";
      notif.className = "notif success";
      document.getElementById("aspirasiForm").reset();
      muatData();
    } else {
      notif.textContent = "❌ Gagal mengirim data: " + (result.message || "Periksa konsol.");
      notif.className = "notif error";
    }

  } catch (err) {
    console.error("Error:", err);
    notif.textContent = "❌ Tidak dapat terhubung ke server.";
    notif.className = "notif error";
  }
});

async function muatData() {
  const tabelBody = document.getElementById("tabelBody");
  tabelBody.innerHTML = "<tr><td colspan='3' align='center'>Memuat data...</td></tr>";

  try {
    const res = await fetch(endpoint.replace("?tabId=FormAspirasi", "") + "?tabId=FormAspirasi");
    const json = await res.json();
    console.log("Data sheet:", json);

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
    console.error("Gagal memuat:", err);
    tabelBody.innerHTML = "<tr><td colspan='3' align='center'>Gagal memuat data.</td></tr>";
  }
}

muatData();
