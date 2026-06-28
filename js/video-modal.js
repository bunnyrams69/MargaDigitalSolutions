/* ==========================================================================
   MARGA DIGITAL SOLUTIONS — VIDEO MODAL & LAZY LOADER (video-modal.js)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initVideoLazyLoader();
  initCardHoverPreview();
  initVideoModal();
});

/* --------------------------------------------------------------------------
   1. Video Lazy Loading (Intersection Observer)
   -------------------------------------------------------------------------- */
function initVideoLazyLoader() {
  const lazyVideos = document.querySelectorAll("video.lazy-video");

  if (!("IntersectionObserver" in window)) {
    // Fallback if IntersectionObserver is not supported
    lazyVideos.forEach(video => {
      const src = video.getAttribute("data-src");
      if (src) {
        video.src = src;
        video.load();
      }
    });
    return;
  }

  const videoObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target;
        const src = video.getAttribute("data-src");
        if (src) {
          video.src = src;
          video.load();
          video.classList.remove("lazy-video");
        }
        observer.unobserve(video);
      }
    });
  }, {
    root: null,
    rootMargin: "200px 0px", // Load slightly before entering viewport
    threshold: 0.1
  });

  lazyVideos.forEach(video => {
    videoObserver.observe(video);
  });
}

/* --------------------------------------------------------------------------
   2. Video Card Hover Previews (Plays silently on hover)
   -------------------------------------------------------------------------- */
function initCardHoverPreview() {
  const cards = document.querySelectorAll(".video-card");

  cards.forEach(card => {
    const video = card.querySelector("video");
    if (!video) return;

    card.addEventListener("mouseenter", () => {
      // Only play if video has loaded its src
      if (video.src) {
        video.muted = true;
        video.loop = true;
        
        // Play and handle potential play promise interruptions
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            // Autoplay prevention fallback, ignore
          });
        }
      }
    });

    card.addEventListener("mouseleave", () => {
      if (video.src) {
        video.pause();
        video.currentTime = 0; // Rewind to start
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. Fullscreen Video Modal (Lightbox)
   -------------------------------------------------------------------------- */
function initVideoModal() {
  const modal = document.getElementById("video-modal");
  const modalVideo = document.getElementById("modal-video-player");
  const modalClose = document.getElementById("modal-close");
  const cards = document.querySelectorAll(".video-card");

  if (!modal || !modalVideo || !modalClose) return;

  // Check if we are on the Gym page (vertical reels)
  const isGymPage = document.querySelector(".category-page")?.classList.contains("cat-gym");
  if (isGymPage) {
    modal.classList.add("vertical-mode");
  }

  const openModal = (videoSrc) => {
    // Inject source and load
    modalVideo.src = videoSrc;
    modalVideo.load();
    
    // Animate Modal Reveal with GSAP
    modal.classList.add("active");
    gsap.fromTo(modal, 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.4, ease: "power2.out" }
    );
    
    gsap.fromTo(".video-modal-container", 
      { scale: 0.8 }, 
      { scale: 1, duration: 0.4, ease: "back.out(1.2)" }
    );

    // Play video
    setTimeout(() => {
      modalVideo.play().catch(err => {
        console.log("Autoplay blocked by browser. User interaction needed.");
      });
    }, 200);
  };

  const closeModal = () => {
    // Pause and clear src
    modalVideo.pause();
    
    // Animate Modal Hide
    gsap.to(modal, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut",
      onComplete: () => {
        modal.classList.remove("active");
        modalVideo.src = ""; // Clear src to stop bandwidth use
      }
    });
    
    gsap.to(".video-modal-container", {
      scale: 0.8,
      duration: 0.3,
      ease: "power2.inOut"
    });
  };

  // Attach click listener to each card
  cards.forEach(card => {
    card.addEventListener("click", () => {
      const videoSrc = card.getAttribute("data-video-src");
      if (videoSrc) {
        openModal(videoSrc);
      }
    });
  });

  // Close triggers
  modalClose.addEventListener("click", closeModal);
  
  // Close on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
}
