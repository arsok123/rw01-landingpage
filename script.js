document.addEventListener("DOMContentLoaded", function() {
    const tabelBody = document.getElementById("tabelBody");
    const form = document.getElementById("aspirasiForm");
    const notif = document.getElementById("notif");

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const nama = document.getElementById("nama").value;
        const pesan = document.getElementById("pesan").value;
        const tanggal = new Date().toLocaleString();

        // Kirim data ke Google Sheets (atau simpan dalam array untuk testing)
        // Di sini bisa menggunakan fetch API untuk mengirim data ke backend atau API Google Sheets

        // Simulasi menambahkan data ke tabel
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${tanggal}</td>
            <td>${nama}</td>
            <td>${pesan}</td>
        `;
        tabelBody.appendChild(newRow);

        // Reset form
        form.reset();

        // Tampilkan notifikasi sukses
        notif.classList.add("success");
        notif.textContent = "Aspirasi berhasil dikirim!";
        setTimeout(() => notif.textContent = "", 3000);
    });

    // Fungsi untuk memuat data dari Google Sheets
    function loadAspirasi() {
        // Menggunakan fetch untuk mengambil data dari Google Sheets API
        fetch("https://sheets.googleapis.com/v4/spreadsheets/1OpOtZYm3FROXfrtp2VqVYnCEavAniniGnhENndGpXhc/values/Sheet1!A1:C10?key=YOUR_API_KEY
") // Ganti dengan URL API Google Sheets Anda
            .then(response => response.json())
            .then(data => {
                // Clear tabel sebelum menambah data baru
                tabelBody.innerHTML = "";
                
                // Tambahkan data ke tabel
                data.forEach(item => {
                    const newRow = document.createElement("tr");
                    newRow.innerHTML = `
                        <td>${item.tanggal}</td>
                        <td>${item.nama}</td>
                        <td>${item.pesan}</td>
                    `;
                    tabelBody.appendChild(newRow);
                });
            })
            .catch(error => {
                console.error("Error loading data:", error);
                tabelBody.innerHTML = "<tr><td colspan='3'>Gagal memuat data.</td></tr>";
            });
    }

    // Panggil fungsi untuk memuat data saat halaman dimuat
    loadAspirasi();
});
