const form = document.getElementById("aspirasiForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = document.getElementById("nama").value;
  const pesan = document.getElementById("pesan").value;
  const tanggal = new Date().toLocaleString("id-ID");

  // Format HARUS 2D array
  const data = {
    values: [[tanggal, nama, pesan]]
  };

  console.log("Data dikirim:", data);

  const response = await fetch(
    "https://v1.nocodeapi.com/arsok70/google_sheets/CSRVlyNAJbppmLcN?tabId=FormAspirasi",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );

  const result = await response.json();
  console.log("Hasil response:", result);
});
