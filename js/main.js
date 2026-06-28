/* ==========================================================================
   MARGA DIGITAL SOLUTIONS — GLOBAL JAVASCRIPT (main.js)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP plugins
  if (typeof gsap !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  initPageTransitions();
  initNavbarScroll();
  initMobileMenu();
  initCustomCursor();
  initScrollReveals();
  initHeroSparkles();
});

/* --------------------------------------------------------------------------
   1. Page Transitions
   -------------------------------------------------------------------------- */
function initPageTransitions() {
  const overlay = document.getElementById("transition-overlay");
  
  if (!overlay) return;

  // Fade out transition overlay on page load
  gsap.fromTo(overlay, 
    { opacity: 1 }, 
    { opacity: 0, duration: 0.4, ease: "power2.out", onComplete: () => {
      overlay.style.pointerEvents = "none";
    }}
  );

  // Intercept local link clicks
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    const target = link.getAttribute("target");

    // Don't intercept mailto, tel, anchor-only, external, or target="_blank" links
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      target === "_blank" ||
      link.classList.contains("no-transition") ||
      href.includes("instagram.com")
    ) {
      return;
    }

    // Check if link goes to a hash on the current page (e.g. index.html#contact)
    const currentUrl = window.location.pathname.split("/").pop() || "index.html";
    const targetUrl = href.split("#")[0].split("/").pop() || "index.html";
    if (currentUrl === targetUrl && href.includes("#")) {
      // It's an anchor scroll on the same page, let it behave naturally or scroll smoothly
      const hash = href.substring(href.indexOf("#"));
      const element = document.querySelector(hash);
      if (element) {
        e.preventDefault();
        gsap.to(window, { duration: 1, scrollTo: hash, ease: "power2.inOut" });
      }
      return;
    }

    // Intercept navigation
    e.preventDefault();
    overlay.style.pointerEvents = "all";

    gsap.to(overlay, {
      opacity: 1,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => {
        window.location.href = href;
      }
    });
  });
}

/* --------------------------------------------------------------------------
   2. Navbar Scroll Backdrop
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const checkScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", checkScroll);
  checkScroll(); // Run once in case page loads scrolled down
}

/* --------------------------------------------------------------------------
   3. Mobile Hamburger Overlay Menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.querySelector(".nav-toggle");
  const overlay = document.querySelector(".mobile-menu-overlay");
  const closeBtn = document.querySelector(".mobile-menu-close");
  const menuLinks = document.querySelectorAll(".mobile-nav-link");

  if (!toggle || !overlay) return;

  let menuTimeline = gsap.timeline({ paused: true });

  // Stagger reveal of menu links
  menuTimeline.to(overlay, { opacity: 0.98, duration: 0.3, ease: "power2.out", onStart: () => {
    overlay.classList.add("active");
  }})
  .to(menuLinks, {
    y: 0,
    opacity: 1,
    duration: 0.4,
    stagger: 0.1,
    ease: "power3.out"
  }, "-=0.15");

  const openMenu = () => {
    toggle.classList.add("open");
    menuTimeline.play();
  };

  const closeMenu = () => {
    toggle.classList.remove("open");
    gsap.to(menuLinks, {
      y: 30,
      opacity: 0,
      duration: 0.2,
      stagger: 0.05,
      ease: "power2.in",
      onComplete: () => {
        menuTimeline.reverse(0);
        overlay.classList.remove("active");
      }
    });
  };

  toggle.addEventListener("click", () => {
    if (toggle.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeMenu);
  }

  // Close menu when a link is clicked
  menuLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      
      // If it's an anchor link, close menu first
      if (href && href.includes("#")) {
        closeMenu();
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. Custom Cursor (GSAP quickTo)
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");

  if (!dot || !ring) return;

  // Set initial invisible state to prevent snap on first move
  gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

  let hasMoved = false;

  // quickTo setups for optimized positioning performance
  const xDotTo = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3" });
  const yDotTo = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3" });
  
  const xRingTo = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3" });
  const yRingTo = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3" });

  window.addEventListener("mousemove", (e) => {
    if (!hasMoved) {
      gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
      hasMoved = true;
    }

    xDotTo(e.clientX);
    yDotTo(e.clientY);
    
    xRingTo(e.clientX);
    yRingTo(e.clientY);
  });

  window.addEventListener("mouseleave", () => {
    gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    hasMoved = false;
  });

  // Target hover triggers
  const hoverElements = "a, button, .video-card, .nav-toggle, .category-label-group, .back-btn";
  
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverElements)) {
      gsap.to(dot, { scale: 0, opacity: 0, duration: 0.2 });
      gsap.to(ring, { 
        width: 60, 
        height: 60, 
        borderColor: "var(--page-accent, var(--color-amber))",
        boxShadow: "0 0 10px var(--page-accent, rgba(196,137,42,0.4))",
        duration: 0.2 
      });
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(hoverElements)) {
      gsap.to(dot, { scale: 1, opacity: 0.7, duration: 0.2 });
      gsap.to(ring, { 
        width: 36, 
        height: 36, 
        borderColor: "var(--color-amber)",
        boxShadow: "none",
        duration: 0.2 
      });
    }
  });
}

/* --------------------------------------------------------------------------
   5. Scroll Reveals (GSAP ScrollTrigger)
   -------------------------------------------------------------------------- */
function initScrollReveals() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  // Reveal elements on scroll
  const revealElements = gsap.utils.toArray(".reveal");
  
  revealElements.forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 45 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none"
        }
      }
    );
  });
}

/* --------------------------------------------------------------------------
   6. Sparkles Particle Canvas Engine (Aceternity SparklesCore Simulation)
   -------------------------------------------------------------------------- */
function createSparklesEngine(canvasId, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  window.addEventListener("resize", () => {
    if (canvas.parentElement) {
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    }
  });

  const particles = [];
  const maxParticles = options.particleDensity || (window.innerWidth < 768 ? 40 : 120);
  const particleColor = options.particleColor || "rgba(255, 255, 255, ";

  class Sparkle {
    constructor() {
      this.reset();
      // Distribute particles across the canvas height on initial load
      this.y = Math.random() * height;
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 20;
      this.size = Math.random() * (options.maxSize || 1.2) + (options.minSize || 0.3);
      this.speedY = -(Math.random() * (options.speed || 0.3) + 0.1); // Slow upward drift
      this.speedX = Math.random() * 0.2 - 0.1; // Soft side drift
      this.opacity = Math.random() * (options.maxOpacity || 0.6) + 0.1;
      this.fadeSpeed = Math.random() * 0.008 + 0.003;
      this.fadeDir = Math.random() > 0.5 ? 1 : -1;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;

      // Sparkle Shimmer (twinkling opacity)
      this.opacity += this.fadeSpeed * this.fadeDir;
      if (this.opacity >= (options.maxOpacity || 0.7)) {
        this.fadeDir = -1;
      } else if (this.opacity <= 0.05) {
        this.fadeDir = 1;
      }

      // Reset if particle moves out of boundary
      if (this.y < 0 || this.x < 0 || this.x > width) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${particleColor}${this.opacity})`;
      ctx.fill();
    }
  }

  // Create sparkles
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Sparkle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}

function initHeroSparkles() {
  // 1. Homepage hero sparkles (fine white, high density)
  createSparklesEngine("hero-sparkles-canvas", {
    particleDensity: window.innerWidth < 768 ? 60 : 180,
    minSize: 0.3,
    maxSize: 1.2,
    speed: 0.3,
    maxOpacity: 0.7
  });

  // 2. About teaser background sparkles (soft gold-amber tinted)
  createSparklesEngine("about-sparkles-canvas", {
    particleDensity: window.innerWidth < 768 ? 35 : 85,
    minSize: 0.4,
    maxSize: 1.4,
    speed: 0.2,
    maxOpacity: 0.6,
    particleColor: "rgba(196, 137, 42, " // Matches --color-amber
  });

  // 3. Footer background sparkles (soft gold-amber tinted)
  createSparklesEngine("footer-sparkles-canvas", {
    particleDensity: window.innerWidth < 768 ? 20 : 65,
    minSize: 0.3,
    maxSize: 1.2,
    speed: 0.2,
    maxOpacity: 0.5,
    particleColor: "rgba(196, 137, 42, " // Matches --color-amber
  });

  // 4. About page hero sparkles (fine white, medium density)
  createSparklesEngine("about-hero-sparkles-canvas", {
    particleDensity: window.innerWidth < 768 ? 50 : 140,
    minSize: 0.3,
    maxSize: 1.2,
    speed: 0.3,
    maxOpacity: 0.65
  });

  // 5. Category page hero sparkles (colored/tinted to match the page accent!)
  const catCanvas = document.getElementById("cat-hero-sparkles-canvas");
  if (catCanvas) {
    // Read the --page-accent color dynamically from CSS variables on document body
    let accentColor = getComputedStyle(document.body).getPropertyValue('--page-accent').trim();
    
    // Parse hex color into RGB format
    let rgbPrefix = "rgba(255, 255, 255, "; // Default fallback: white
    if (accentColor && accentColor.startsWith('#')) {
      const hex = accentColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        rgbPrefix = `rgba(${r}, ${g}, ${b}, `;
      }
    }

    createSparklesEngine("cat-hero-sparkles-canvas", {
      particleDensity: window.innerWidth < 768 ? 45 : 120,
      minSize: 0.4,
      maxSize: 1.4,
      speed: 0.25,
      maxOpacity: 0.6,
      particleColor: rgbPrefix
    });
  }
}
