// URLs CSV Google Sheets
const beritaURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGqc1G_4X3ig5TYyiIj63CPju66ZkviN7MsolUxbx0v99GYBg2P23PYtJOdvk0rpMaD2a70lVjVqKf/pub?gid=2090908824&single=true&output=csv';
const galeriURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGqc1G_4X3ig5TYyiIj63CPju66ZkviN7MsolUxbx0v99GYBg2P23PYtJOdvk0rpMaD2a70lVjVqKf/pub?gid=1520446044&single=true&output=csv';
const bisnisURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGqc1G_4X3ig5TYyiIj63CPju66ZkviN7MsolUxbx0v99GYBg2P23PYtJOdvk0rpMaD2a70lVjVqKf/pub?gid=227320896&single=true&output=csv';
const saldoURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGqc1G_4X3ig5TYyiIj63CPju66ZkviN7MsolUxbx0v99GYBg2P23PYtJOdvk0rpMaD2a70lVjVqKf/pub?gid=0&single=true&output=csv';

// Fungsi fetch CSV menggunakan PapaParse
function fetchCSV(url, callback){
  Papa.parse(url, {
    download: true,
    header: true,
    complete: function(results){ callback(results.data); }
  });
}

// Saldo Kas
fetchCSV(saldoURL, data=>{
  const container = document.querySelector('#list-saldo');
  data.forEach(row=>{
    const div = document.createElement('div');
    div.className = 'col-md-4 card p-3 m-2 text-center';
    div.innerHTML = `<h5>${row.Kategori}</h5><p>${row.Saldo}</p>`;
    container.appendChild(div);
  });
});

// Berita
fetchCSV(beritaURL, data=>{
  const container = document.querySelector('#list-berita');
  data.forEach(row=>{
    const div = document.createElement('div');
    div.className = 'col-md-6 card p-3 m-2';
    div.innerHTML = `<h5>${row.Judul}</h5><small>${row.Tanggal}</small><p>${row.Isi}</p>`;
    container.appendChild(div);
  });
});

// Galeri
fetchCSV(galeriURL, data=>{
  const container = document.querySelector('#list-galeri');
  data.forEach(row=>{
    const div = document.createElement('div');
    div.className = 'col-md-4 mb-3';
    div.innerHTML = `<a href="${row.URL}" data-lightbox="galeri" data-title="${row.Judul}">
      <img src="${row.URL}" class="img-fluid rounded"></a>`;
    container.appendChild(div);
  });
});

// Bisnis Warga
fetchCSV(bisnisURL, data=>{
  const container = document.querySelector('#list-bisnis');
  data.forEach(row=>{
    const div = document.createElement('div');
    div.className = 'col-md-4 card p-3 m-2';
    div.innerHTML = `<h5>${row.Nama}</h5><p>${row.Deskripsi}</p><p>Harga: ${row.Harga}</p><p>Kontak: ${row.Kontak}</p>`;
    container.appendChild(div);
  });
});

// Scroll animation
const animElements = document.querySelectorAll('.animate');
function showOnScroll(){
  animElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight - 100){ el.classList.add('show'); }
  });
}
window.addEventListener('scroll', showOnScroll);
window.addEventListener('load', showOnScroll);

// Preview file input (Aspirasi)
document.querySelectorAll('input[type=file]').forEach(input=>{
  input.addEventListener('change', function(){
    const preview = document.createElement('p');
    preview.textContent = this.files[0] ? 'File siap diupload: ' + this.files[0].name : '';
    if(this.nextSibling){ this.nextSibling.remove(); }
    this.parentNode.insertBefore(preview, this.nextSibling);
  });
});
