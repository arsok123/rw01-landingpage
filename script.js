document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("aspirasiForm");
    const fotoInput = document.getElementById("foto");
    const videoInput = document.getElementById("video");
    const pratinjauContainer = document.getElementById("pratinjauContainer");

    // Pratinjau Foto
    fotoInput.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const fotoPreview = document.createElement("img");
                fotoPreview.src = event.target.result;
                fotoPreview.style.maxWidth = '100%';
                pratinjauContainer.innerHTML = '';  // Clear previous previews
                pratinjauContainer.appendChild(fotoPreview);  // Menampilkan pratinjau gambar
            };
            reader.readAsDataURL(file);
        }
    });

    // Pratinjau Video
    videoInput.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const videoPreview = document.createElement("video");
            videoPreview.setAttribute("controls", "true");
            videoPreview.src = url;
            videoPreview.style.maxWidth = '100%';
            pratinjauContainer.innerHTML = '';  // Clear previous previews
            pratinjauContainer.appendChild(videoPreview);  // Menampilkan pratinjau video
        }
    });

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const nama = document.getElementById("nama").value;
        const pesan = document.getElementById("pesan").value;
        const tanggal = new Date().toLocaleString();

        const formData = new FormData(form);  // Mengambil semua data dari form termasuk file

        // Kirim data menggunakan fetch (pastikan URL endpoint sudah benar)
        fetch("YOUR_SERVER_ENDPOINT", {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Data berhasil dikirim:", data);
            alert("Aspirasi berhasil dikirim!");

            // Menambahkan data ke tabel
            const tabelBody = document.getElementById("tabelBody");
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${tanggal}</td>
                <td>${nama}</td>
                <td>${pesan}</td>
                <td><img src="${data.fotoUrl}" alt="Foto" width="100"></td>
                <td><video controls width="100"><source src="${data.videoUrl}" type="video/mp4"></video></td>
            `;
            tabelBody.appendChild(newRow);
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Gagal mengirim aspirasi.");
        });

        // Reset form
        form.reset();

        // Tampilkan notifikasi sukses
        const notif = document.getElementById("notif");
        notif.classList.add("success");
        notif.textContent = "Aspirasi berhasil dikirim!";
        setTimeout(() => notif.textContent = "", 3000);
    });
});
