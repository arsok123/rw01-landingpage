const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyfO-C3ZIh4HdzYoTxui4JYEeHQLYo6S3OuQBo2_OG6yx4NgnvkrpUp6S_UYA0fR3k/exec"; // Ganti dengan URL milikmu

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("aspirasiForm");
  const notif = document.getElementById("notif");
  const tabelBody = document.getElementById("tabelBody");

  // Fungsi kirim data ke Google Sheet
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    notif.textContent = "Mengirim...";
    notif.style.color = "#555";

    const data = {
      nama: document.getElementById("nama").value.trim(),
      pesan: document.getElementById("pesan").value.trim(),
    };

    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (json.result === "success") {
        notif.textContent = "✅ " + json.message;
        notif.style.color = "green";
        form.reset();
        muatData(); // refresh tabel otomatis
      } else {
        notif.textContent = "⚠️ " + json.message;
        notif.style.color = "red";
      }
    } catch (err) {
      notif.textContent = "❌ Gagal mengirim: " + err.message;
      notif.style.color = "red";
    }
  });

  // Fungsi ambil data dari Google Sheet (via JSON publik)
  async function muatData() {
    try {
      const sheetId = "1OpOtZYm3FROXfrtp2VqVYnCEavAniniGnhENndGpXhc";
      const sheetName = "FormAspirasi";
      const url = `https://opensheet.elk.sh/${sheetId}/${sheetName}`;

      const res = await fetch(url);
      const data = await res.json();

      tabelBody.innerHTML = "";
      data.reverse().forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.Timestamp || row[0]}</td>
          <td>${row.nama || row[1]}</td>
          <td>${row.pesan || row[2]}</td>
        `;
        tabelBody.appendChild(tr);
      });

      if (data.length === 0) {
        tabelBody.innerHTML = "<tr><td colspan='3' align='center'>Belum ada aspirasi</td></tr>";
      }

    } catch (err) {
      tabelBody.innerHTML = `<tr><td colspan='3' align='center'>Gagal memuat data</td></tr>`;
    }
  }

  muatData(); // panggil pertama kali saat halaman dibuka
});
