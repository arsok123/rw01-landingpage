document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("aspirasiForm");
    const fotoInput = document.getElementById("foto");
    const videoInput = document.getElementById("video");
    const pratinjauContainer = document.getElementById("pratinjauContainer");
    const tabelBody = document.getElementById("tabelBody");
    const notif = document.getElementById("notif");

    const ENDPOINT = "https://script.google.com/macros/s/AKfycbwBBD7MhPZjtlTLHoWT1X0SZqprxVN367l2ZSfVGjugoHGYhEJI680tqVgSNpw1ZUaUlg/exec"; // Ganti dengan URL Apps Script kamu

    // 🔹 Pratinjau Foto
    fotoInput.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const fotoPreview = document.createElement("img");
                fotoPreview.src = event.target.result;
                fotoPreview.style.maxWidth = "100%";
                pratinjauContainer.innerHTML = "";
                pratinjauContainer.appendChild(fotoPreview);
            };
            reader.readAsDataURL(file);
        }
    });

    // 🔹 Pratinjau Video
    videoInput.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const videoPreview = document.createElement("video");
            videoPreview.controls = true;
            videoPreview.src = url;
            videoPreview.style.maxWidth = "100%";
            pratinjauContainer.innerHTML = "";
            pratinjauContainer.appendChild(videoPreview);
        }
    });

    // 🔹 Kirim Form
    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        const nama = document.getElementById("nama").value.trim();
        const pesan = document.getElementById("pesan").value.trim();
        const tanggal = new Date().toLocaleString();

        // 🔸 Baca file dan ubah ke Base64
        const files = [];
        const fotoFile = fotoInput.files[0];
        const videoFile = videoInput.files[0];

        if (fotoFile) {
            const fotoBase64 = await fileToBase64(fotoFile);
            files.push({
                filename: fotoFile.name,
                file: fotoBase64.split(",")[1],
                type: fotoFile.type
            });
        }
        if (videoFile) {
            const videoBase64 = await fileToBase64(videoFile);
            files.push({
                filename: videoFile.name,
                file: videoBase64.split(",")[1],
                type: videoFile.type
            });
        }

        // 🔸 Siapkan payload JSON
        const payload = {
            nama,
            pesan,
            files
        };

        // 🔸 Kirim ke Apps Script
        fetch(ENDPOINT, {
            method: "POST",
            mode: "no-cors", // penting untuk GitHub Pages
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then(() => {
            // Karena no-cors, kita tidak bisa baca response,
            // tapi tetap bisa anggap sukses
            showNotif("Aspirasi berhasil dikirim!", true);

            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${tanggal}</td>
                <td>${nama}</td>
                <td>${pesan}</td>
                <td>${fotoFile ? fotoFile.name : "-"}</td>
                <td>${videoFile ? videoFile.name : "-"}</td>
            `;
            tabelBody.appendChild(newRow);

            form.reset();
            pratinjauContainer.innerHTML = "";
        })
        .catch(error => {
            console.error("Error:", error);
            showNotif("Gagal mengirim aspirasi. Periksa koneksi.", false);
        });
    });

    // 🔹 Fungsi bantu
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function showNotif(msg, success = true) {
        notif.textContent = msg;
        notif.style.color = success ? "green" : "red";
        setTimeout(() => notif.textContent = "", 4000);
    }
});
