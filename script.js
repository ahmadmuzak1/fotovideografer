// Toggle navigasi pada layar kecil dan tutup menu setelah tautan dipilih.
const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("#primary-menu");

if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
        const isOpen = menu.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");
        menuToggle.textContent = isOpen ? "×" : "☰";
    });

    menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            menu.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Buka menu");
            menuToggle.textContent = "☰";
        });
    });
}

// Carousel hanya aktif di halaman yang memiliki elemen portofolio-carousel.
const carousel = document.querySelector(".portfolio-carousel");

if (carousel) {
    const slides = [...carousel.querySelectorAll(".carousel-slide")];
    const dotsContainer = carousel.querySelector(".carousel-dots");
    let activeSlide = 0;
    let autoplay;

    // Menampilkan slide berdasarkan indeks dan memperbarui status aksesibilitas.
    function showSlide(index) {
        activeSlide = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === activeSlide;
            slide.classList.toggle("is-active", isActive);
            slide.setAttribute("aria-hidden", String(!isActive));
            dotsContainer.children[slideIndex].setAttribute("aria-current", String(isActive));
        });
    }

    // Mulai ulang timer setelah interaksi agar pengguna sempat membaca slide.
    function restartAutoplay() {
        window.clearInterval(autoplay);
        autoplay = window.setInterval(() => showSlide(activeSlide + 1), 3000);
    }

    // Buat indikator navigasi sesuai jumlah slide yang tersedia.
    slides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.className = "carousel-dot";
        dot.type = "button";
        dot.setAttribute("aria-label", `Tampilkan foto ${index + 1}`);
        dot.setAttribute("aria-current", String(index === activeSlide));
        dot.addEventListener("click", () => {
            showSlide(index);
            restartAutoplay();
        });
        dotsContainer.append(dot);
    });

    carousel.querySelector(".carousel-control--prev").addEventListener("click", () => {
        showSlide(activeSlide - 1);
        restartAutoplay();
    });
    carousel.querySelector(".carousel-control--next").addEventListener("click", () => {
        showSlide(activeSlide + 1);
        restartAutoplay();
    });
    carousel.addEventListener("mouseenter", () => window.clearInterval(autoplay));
    carousel.addEventListener("mouseleave", restartAutoplay);
    carousel.addEventListener("focusin", () => window.clearInterval(autoplay));
    carousel.addEventListener("focusout", (event) => {
        if (!carousel.contains(event.relatedTarget)) restartAutoplay();
    });
    restartAutoplay();
}

/* Login klien (tanpa database): cek kode + password, lalu arahkan ke halaman foto klien. */
(function () {
    const KEY = "rc_galeri_klien";
    const form = document.getElementById("login-form");
    const err = document.getElementById("login-error");
    let gagal = 0, kunciSampai = 0;

    async function sha256(teks) {
        const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(teks));
        return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    const cari = (id) => (window.GALERI_KLIEN || []).find((k) => k.id === id);

    const sudah = cari(sessionStorage.getItem(KEY));
    if (sudah) { location.replace(sudah.halaman); return; }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        err.textContent = "";
        if (Date.now() < kunciSampai) { err.textContent = "Terlalu banyak percobaan. Coba lagi sebentar."; return; }
        const id = form.kode.value.trim().toLowerCase();
        const k = cari(id);
        const hash = await sha256(id + ":" + form.pw.value);
        if (k && hash === k.hash) {
            sessionStorage.setItem(KEY, id);
            location.href = k.halaman;
        } else {
            gagal++;
            if (gagal >= 5) { kunciSampai = Date.now() + 30000; gagal = 0; }
            err.textContent = "Kode atau password salah.";
        }
    });
})();

// Daftar klien. Tambah klien baru lewat buat-akses.html, lalu tempel hasilnya di sini.
// "halaman" = halaman yang dibuka setelah klien berhasil masuk.
window.GALERI_KLIEN = [
  { id: "demo", nama: "Klien Demo", hash: "b0c2e639eedf612b7f964a045c290a0b0df0dff23a803fc606ebbaf5a9342b85", halaman: "klien/demo.html" }  // password: demo123 (hapus sebelum live)
];



