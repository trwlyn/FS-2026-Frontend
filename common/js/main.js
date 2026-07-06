// common/js/main.js

// URL API Backend Anda (Pastikan FastAPI sedang berjalan!)
const API_URL = "http://127.0.0.1:8000/api/books";

async function fetchBooks() {
    try {
        const response = await fetch(API_URL);
        const books = await response.json();

        const container = document.getElementById('book-container');
        container.innerHTML = ""; // Bersihkan wadah sebelum memuat data

        books.forEach(book => {
            // Kita buat template Card Horizontal sesuai desain Anda
            // Di dalam loop books.forEach
            const cardHTML = `
            <div class="col-lg-6">
                <div class="book-card-horizontal">
                    <div class="card-info">
                        <span class="genre-badge">${book.genre}</span>
                        <h3 class="h5 mt-2">${book.title}</h3>
                        <p class="small text-muted">${book.author}</p>
                        <button class="btn btn-accent btn-sm mt-auto align-self-start" 
                        onclick="loadBookDetails(${book.id})" 
                        data-bs-toggle="offcanvas" 
                        data-bs-target="#bookDetailOffcanvas">
                        View Details
                        </button>
                    </div>
                    <div class="card-img-container">
                    <img src="${book.image_url}" alt="${book.title}">
                    </div>
                </div>
            </div>
            `;
    
            container.innerHTML += cardHTML;
        });
    } catch (error) {
        console.error("Gagal memuat buku:", error);
    }
}

// Panggil fungsi saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", fetchBooks);


// common/js/main.js

async function loadBookDetails(bookId) {
    // Pastikan bookId adalah angka murni
    console.log("Memuat ID:", bookId);

    try {
        // Gunakan URL absolut agar lebih aman
        const response = await fetch(`http://127.0.0.1:8000/api/books/${bookId}`);

        if (!response.ok) throw new Error("Buku tidak ditemukan");

        const book = await response.json();

        // Update konten Offcanvas
        document.getElementById("offcanvas-title").innerText = book.title;
        document.getElementById("offcanvas-author").innerText = `by ${book.author}`;
        document.getElementById("offcanvas-img").src = book.image_url;
        document.getElementById("offcanvas-description").innerText = book.description;

        // Update tombol harga
        const buyBtn = document.getElementById("btn-buy");
        if (buyBtn) buyBtn.innerText = `Buy Now - €${book.price}`;

    } catch (error) {
        console.error("Error Detail:", error);
    }
}