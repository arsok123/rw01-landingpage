document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("aspirasiForm");
    const fotoInput = document.getElementById("foto");
    const videoInput = document.getElementById("video");

    const pratinjauContainer = document.getElementById("pratinjauContainer");

    // Pratinjau foto
    fotoInput.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const fotoPreview = document.createElement("img");
                fotoPreview.src = event.target.result;
                fotoPreview.style.maxWidth = '100%';
                fotoPreview.style.marginTop = '15px';
                pratinjauContainer.innerHTML = '';  // Clear previous previews
                pratinjauContainer.appendChild(fotoPreview);  // Menampilkan pratinjau gambar
            };
            reader.readAsDataURL(file);
        }
    });

    // Pratinjau video
    videoInput.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const videoPreview = document.createElement("video");
            videoPreview.setAttribute("controls", "true");
            videoPreview.src = url;
            videoPreview.style.maxWidth = '100%';
            videoPreview.style.marginTop = '15px';
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

        // Kirim data menggunakan fetch
        fetch("YOUR_SERVER_ENDPOINT", {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Data berhasil dikirim:", data);
            alert("Aspirasi berhasil dikirim!");
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Gagal mengirim aspirasi.");
        });

        // Tampilkan daftar aspirasi setelah berhasil kirim
        const tabelBody = document.getElementById("tabelBody");
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
        const notif = document.getElementById("notif");
        notif.classList.add("success");
        notif.textContent = "Aspirasi berhasil dikirim!";
        setTimeout(() => notif.textContent = "", 3000);
    });
});
