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
