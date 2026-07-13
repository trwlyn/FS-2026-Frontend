// common/js/main.js

const API_URL = "https://herkansing-backend.onrender.com/api/books";

/**
 * 1. FUNGSI LOAD SEMUA BUKU (DENGAN SPINNER)
 */
async function fetchBooks() {
    const container = document.getElementById('book-container');
    const spinner = document.getElementById('loading-spinner');

    // Pastikan kita berada di halaman yang memiliki container buku
    if (!container) return;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to get data");

        const books = await response.json();

        // Hapus spinner dan bersihkan container
        if (spinner) spinner.remove();
        container.innerHTML = "";

        books.forEach(book => {
            const cardHTML = `
                <div class="col-lg-6">
                    <div class="book-card-horizontal">
                        <div class="card-info">
                            <span class="genre-badge">${book.genre || 'General'}</span>
                            <h3 class="h5 mt-2">${book.title}</h3>
                            <p class="small text-muted">${book.author}</p>
                            <p class="description-short">${book.description}</p>
                            
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
        console.error("Error fetchBooks:", error);
        if (spinner) {
            spinner.innerHTML = `<p class="text-danger">Failed to load books. Please check if the server is running.</p>`;
        }
    }
}

/**
 * 2. FUNGSI LOAD DETAIL BUKU (OFFCANVAS)
 */
async function loadBookDetails(bookId) {
    console.log("Memuat ID:", bookId);

    // Reset konten Offcanvas ke state loading
    document.getElementById("offcanvas-title").innerText = "Loading...";
    document.getElementById("offcanvas-description").innerText = "";

    try {
        const response = await fetch(`${API_URL}/${bookId}`);
        if (!response.ok) throw new Error("Book not found");

        const book = await response.json();

        // Update konten Offcanvas
        document.getElementById("offcanvas-title").innerText = book.title;
        document.getElementById("offcanvas-author").innerText = `by ${book.author}`;
        document.getElementById("offcanvas-img").src = book.image_url;
        document.getElementById("offcanvas-description").innerText = book.description;

        const buyBtn = document.getElementById("btn-buy");
        if (buyBtn) buyBtn.innerText = `Buy Now - €${book.price}`;

    } catch (error) {
        console.error("Error loadBookDetails:", error);
        document.getElementById("offcanvas-title").innerText = "Error loading details.";
    }
}

/**
 * 3. LOGIKA FORMULIR KONTAK (DENGAN SUCCESS STATE)
 */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Ubah tombol menjadi loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Sending...';

        const formData = {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            message: document.getElementById('userMessage').value
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                // TAMPILAN SUKSES: Sembunyikan form dan tampilkan pesan sukses
                const formContainer = contactForm.parentElement;
                formContainer.innerHTML = `
                    <div class="text-center py-5">
                        <i class="fa-solid fa-circle-check text-success mb-3" style="font-size: 4rem;"></i>
                        <h3 class="fw-bold">Message Sent!</h3>
                        <p class="text-muted">Thank you, ${formData.name}. We have received your message and will get back to you soon.</p>
                        <button onclick="location.reload()" class="btn btn-accent mt-3">Send Another Message</button>
                    </div>
                `;
            } else {
                throw new Error("Failed to send");
            }
        } catch (error) {
            console.error("Error Contact Form:", error);
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            alert("Oops! Something went wrong. Please try again later.");
        }
    });
}

// Jalankan fetchBooks saat halaman dimuat
document.addEventListener("DOMContentLoaded", fetchBooks);