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
  console.log("📤 Request body terkirim:", JSON.stringify(body));

  // ✅ Jika sukses
  if (res.ok && hasil.message === "Success") {
    tampilkanNotif("✅ Aspirasi berhasil dikirim!", "success");
    document.getElementById("aspirasiForm").reset();
    muatData();
    return;
  }

  // ⚠️ Jika error "Body param should be a 2D array"
  if (hasil.error && hasil.error.includes("2D array")) {
    tampilkanNotif("⚙️ Format data salah — mencoba ulang otomatis...", "error");

    const fallbackUrl = `${ENDPOINT}?tabId=${SHEET_NAME}`;
    console.log("🔁 Mengulang POST ke:", fallbackUrl);

    const res2 = await fetch(fallbackUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values: [[tanggal, nama, pesan]] })
    });

    const hasil2 = await res2.json();
    console.log("📦 Respons fallback:", hasil2);

    if (res2.ok && hasil2.message === "Success") {
      tampilkanNotif("✅ Aspirasi berhasil dikirim (mode fallback)!", "success");
      document.getElementById("aspirasiForm").reset();
      muatData();
    } else {
      tampilkanNotif("❌ Gagal kirim (fallback): " + (hasil2.error || hasil2.message), "error");
    }
    return;
  }

  // ❌ Jika gagal tapi bukan error 2D array
  tampilkanNotif(
    "❌ Gagal mengirim: " + (hasil.error || hasil.message || `Kode ${res.status}`),
    "error"
  );

} catch (err) {
  // 💥 Jika error koneksi / fatal
  console.error("❌ Kesalahan koneksi:", err);
  tampilkanNotif("❌ Tidak dapat terhubung ke server (cek koneksi).", "error");
}
