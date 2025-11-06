const form = document.getElementById("aspirasiForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
const pesan = document.getElementById("pesan").value.trim();
const tanggal = new Date().toLocaleString("id-ID");

const dataKirim = {
  values: [[tanggal, nama, pesan]]
};

console.log("📤 Akan dikirim ke NocodeAPI:", JSON.stringify(dataKirim, null, 2));


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
