
/* =========================================
   E-PORTFOLIO 2 PPG UNESA
   Interactions & Animations
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initNavigation();
  initScrollEffects();
  initRevealAnimations();
  initGallery();
});

/* -----------------------------------------
   1. PRELOADER
----------------------------------------- */

function initPreloader() {
  const preloader = document.getElementById("preloader");

  if (!preloader) return;

  const hidePreloader = () => {
    preloader.classList.add("loaded");
  };

  // Memberi waktu singkat agar animasi pembuka terlihat.
  window.addEventListener("load", () => {
    setTimeout(hidePreloader, 450);
  }, { once: true });

  // Pengaman jika ada aset yang gagal dimuat.
  setTimeout(hidePreloader, 2500);
}

/* -----------------------------------------
   2. NAVIGATION & MOBILE MENU
----------------------------------------- */

function initNavigation() {
  const navbar = document.getElementById("navbar");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const links = document.querySelectorAll(".nav-link");

  if (!navbar || !menuToggle || !navLinks) return;

  function closeMenu() {
    menuToggle.classList.remove("open");
    navLinks.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Buka navigasi");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.classList.toggle("open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Tutup navigasi" : "Buka navigasi"
    );
  });

  // Tutup menu ketika tautan navigasi dipilih.
  links.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // Tutup menu jika pengguna menekan Escape.
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  // Tutup menu jika layar kembali ke desktop.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });

  // Status navbar ketika halaman digulir.
  const updateNavbar = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 25);
  };

  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });

  // Menandai navigasi sesuai bagian yang sedang terlihat.
  const sections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        links.forEach(link => {
          const isActive =
            link.getAttribute("href") === "#" + entry.target.id;

          link.classList.toggle("active", isActive);
        });
      });
    }, {
      rootMargin: "-25% 0px -60% 0px",
      threshold: 0
    });

    sections.forEach(section => navObserver.observe(section));
  }
}

/* -----------------------------------------
   3. SCROLL EFFECTS
----------------------------------------- */

function initScrollEffects() {
  const backToTop = document.getElementById("backToTop");

  if (!backToTop) return;

  function updateScrollState() {
    backToTop.classList.toggle("visible", window.scrollY > 450);
  }

  updateScrollState();

  window.addEventListener("scroll", updateScrollState, {
    passive: true
  });

  backToTop.addEventListener("click", event => {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches ? "auto" : "smooth"
    });
  });
}

/* -----------------------------------------
   4. REVEAL ANIMATIONS
----------------------------------------- */

function initRevealAnimations() {
  const elements = document.querySelectorAll(".reveal");

  if (!elements.length) return;

  // Tampilkan langsung bila browser tidak mendukung observer.
  if (!("IntersectionObserver" in window)) {
    elements.forEach(element => {
      element.classList.add("visible");
    });
    return;
  }

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion) {
    elements.forEach(element => {
      element.classList.add("visible");
    });
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  elements.forEach((element, index) => {
    // Stagger ringan untuk elemen yang berdekatan.
    element.style.transitionDelay =
      `${Math.min(index % 4, 3) * 70}ms`;

    revealObserver.observe(element);
  });
}

/* -----------------------------------------
   5. GALLERY LIGHTBOX
----------------------------------------- */

function initGallery() {
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const closeButton = document.getElementById("lightboxClose");

  if (!lightbox || !lightboxImage || !closeButton) return;

  let lastFocusedElement = null;

  function openLightbox(imageUrl, altText) {
    lastFocusedElement = document.activeElement;

    lightboxImage.src = imageUrl;
    lightboxImage.alt = altText || "Dokumentasi pembelajaran";

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    document.body.style.overflow = "";

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  galleryItems.forEach(item => {
    item.addEventListener("click", () => {
      const image = item.querySelector("img");

      const imageUrl =
        item.dataset.full ||
        (image ? image.currentSrc || image.src : "");

      if (!imageUrl) return;

      // Jangan membuka lightbox untuk gambar yang gagal dimuat.
      if (image && image.complete && image.naturalWidth === 0) {
        return;
      }

      openLightbox(
        imageUrl,
        image ? image.alt : "Dokumentasi pembelajaran"
      );
    });
  });

  closeButton.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", event => {
    if (
      event.key === "Escape" &&
      lightbox.classList.contains("open")
    ) {
      closeLightbox();
    }
  });
}

/* -----------------------------------------
   6. DOCUMENT LINKS
----------------------------------------- */

// Beri pemberitahuan untuk tautan dokumen lokal
// yang belum tersedia saat website dibuka secara lokal.
document.querySelectorAll(".document-link").forEach(link => {
  link.addEventListener("click", event => {
    const url = link.getAttribute("href");

    if (!url) {
      event.preventDefault();
      alert("Tautan dokumen belum ditambahkan.");
      return;
    }

    // Tautan contoh tetap dapat diganti dengan URL PDF
    // atau URL Google Drive yang sudah dibagikan.
  });
});
