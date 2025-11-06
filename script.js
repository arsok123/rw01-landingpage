const form = document.getElementById("aspirasiForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = document.getElementById("nama").value;
  const pesan = document.getElementById("pesan").value;
  const tanggal = new Date().toLocaleString("id-ID");

  // Format HARUS array 2 dimensi (2D array)
  const dataKirim = {
    values: [[tanggal, nama, pesan]]
  };

  console.log("📄 Data sheet:", dataKirim);

  try {
    const response = await fetch(
      "https://v1.nocodeapi.com/arsok70/google_sheets/CSRVlyNAJbppmLcN?tabId=FormAspirasi",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataKirim)
      }
    );

    const result = await response.json();
    console.log("📦 Hasil response:", result);

    if (response.ok) {
      alert("✅ Data berhasil dikirim ke Google Sheets!");
      form.reset();
    } else {
      alert("⚠️ Gagal kirim data: " + (result.error || "Tidak diketahui"));
    }
  } catch (err) {
    console.error("❌ Error:", err);
    alert("Terjadi kesalahan koneksi.");
  }
});
