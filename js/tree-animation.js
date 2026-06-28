/* ==========================================================================
   MARGA DIGITAL SOLUTIONS — TREE ANIMATION JAVASCRIPT (tree-animation.js)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Ensure GSAP and ScrollTrigger are loaded
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("GSAP or ScrollTrigger is not loaded!");
    return;
  }

  initBanyanTreeAnimation();
  initAmbientParticles();
});

/* --------------------------------------------------------------------------
   1. Banyan Tree GSAP Scroll Animation
   -------------------------------------------------------------------------- */
function initBanyanTreeAnimation() {
  const treeSvg = document.getElementById("tree-svg");
  const treeSection = document.getElementById("tree-section");
  const treeStage = document.getElementById("tree-stage");

  if (!treeSvg || !treeSection || !treeStage) return;

  // Exit early and run mobile reveal animation on mobile viewports to prevent GSAP pinning and scroll-locking
  const isMobile = window.innerWidth < 768;
  if (isMobile) {
    initMobileTreeAnimation(treeSvg, animatedPaths);
    return;
  }

  // Setup stroke-dasharray and stroke-dashoffset for all animated paths
  const animatedPaths = treeSvg.querySelectorAll(".draw-path");
  animatedPaths.forEach(path => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
  });

  // Set initial state for category label groups using GSAP (scales exactly around center coordinate 50% 50%)
  gsap.set(".category-label-group", { scale: 0.5, transformOrigin: "50% 50%", opacity: 0 });

  // Calculate dynamic scroll distance based on device height
  const isMobile = window.innerWidth < 768;
  const pinDuration = isMobile ? "350%" : "600%"; // Matches 450vh and 700vh total heights

  // Register GSAP ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Create the master timeline driven by scroll scrub
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: treeSection,
      start: "top top",
      end: `+=${pinDuration}`, // Dynamically map end scroll height based on mobile/desktop duration
      pin: true, // Pin the entire treeSection container!
      pinSpacing: true, // Let ScrollTrigger create the spacer spacing underneath to lock downstream elements
      scrub: 1.5, // Smooth lag to catch up to scrolling
      invalidateOnRefresh: true
    }
  });

  // 1. Trunk draws (Time: 0 -> 1.0)
  tl.to("#trunk", { strokeDashoffset: 0, duration: 1.0, ease: "power1.inOut" }, 0);

  // 2. Aerial roots drop (Time: 0.8 -> 1.6)
  const aerialRoots = treeSvg.querySelectorAll(".aerial-root");
  if (aerialRoots.length > 0) {
    tl.to(aerialRoots, { strokeDashoffset: 0, duration: 0.8, stagger: 0.15, ease: "power1.out" }, 0.8);
  }

  // 3. LEFT BRANCHES GROW — Top to Bottom order (Restaurants -> Clothing -> Gym)
  
  // Left High — RESTAURANTS (Time: 1.5 -> 2.5)
  tl.to("#branch-left-high .draw-path", { strokeDashoffset: 0, duration: 1.0, ease: "power1.inOut" }, 1.5);
  tl.to("#leaves-left-high .leaf-cluster", { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: "back.out(1.5)" }, 2.2);
  tl.to("#label-restaurants", { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out", onStart: () => {
    document.getElementById("label-restaurants")?.classList.add("pulsing");
  }}, 2.3);

  // Left Mid — CLOTHING (Time: 2.2 -> 3.2)
  tl.to("#branch-left-mid .draw-path", { strokeDashoffset: 0, duration: 1.0, ease: "power1.inOut" }, 2.2);
  tl.to("#leaves-left-mid .leaf-cluster", { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: "back.out(1.5)" }, 2.9);
  tl.to("#label-clothing", { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out", onStart: () => {
    document.getElementById("label-clothing")?.classList.add("pulsing");
  }}, 3.0);

  // Left Low — GYM (Time: 2.9 -> 3.9)
  tl.to("#branch-left-low .draw-path", { strokeDashoffset: 0, duration: 1.0, ease: "power1.inOut" }, 2.9);
  tl.to("#leaves-left-low .leaf-cluster", { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: "back.out(1.5)" }, 3.6);
  tl.to("#label-gym", { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out", onStart: () => {
    document.getElementById("label-gym")?.classList.add("pulsing");
  }}, 3.7);

  // 4. RIGHT BRANCHES GROW — Top to Bottom order (Gruhapravesh -> Resorts -> Pre School)

  // Right High — GRUHAPRAVESH (Time: 3.6 -> 4.6)
  tl.to("#branch-right-high .draw-path", { strokeDashoffset: 0, duration: 1.0, ease: "power1.inOut" }, 3.6);
  tl.to("#leaves-right-high .leaf-cluster", { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: "back.out(1.5)" }, 4.3);
  tl.to("#label-gruhapravesh", { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out", onStart: () => {
    document.getElementById("label-gruhapravesh")?.classList.add("pulsing");
  }}, 4.4);

  // Right Mid — RESORTS (Time: 4.3 -> 5.3)
  tl.to("#branch-right-mid .draw-path", { strokeDashoffset: 0, duration: 1.0, ease: "power1.inOut" }, 4.3);
  tl.to("#leaves-right-mid .leaf-cluster", { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: "back.out(1.5)" }, 5.0);
  tl.to("#label-resorts", { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out", onStart: () => {
    document.getElementById("label-resorts")?.classList.add("pulsing");
  }}, 5.1);

  // Right Low — PRE SCHOOL (Time: 5.0 -> 6.0)
  tl.to("#branch-right-low .draw-path", { strokeDashoffset: 0, duration: 1.0, ease: "power1.inOut" }, 5.0);
  tl.to("#leaves-right-low .leaf-cluster", { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: "back.out(1.5)" }, 5.7);
  tl.to("#label-preschool", { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out", onStart: () => {
    document.getElementById("label-preschool")?.classList.add("pulsing");
  }}, 5.8);

  // 5. CROWN / TOP BRANCH — CORPORATE (Time: 5.7 -> 6.7)
  tl.to("#branch-top-center .draw-path", { strokeDashoffset: 0, duration: 1.0, ease: "power1.inOut" }, 5.7);
  tl.to("#leaves-top-center .leaf-cluster", { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: "back.out(1.5)" }, 6.4);
  tl.to("#label-corporate", { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out", onStart: () => {
    document.getElementById("label-corporate")?.classList.add("pulsing");
  }}, 6.5);

  // 6. Hold complete state (Time: 6.9 -> 8.5)
  // Holds the completed tree with all labels visible and pulsing for the final ~20% of the scroll space before releasing.
  tl.to({}, { duration: 1.6 }, 6.9);

  // Reset animations if we scroll all the way back up
  ScrollTrigger.addEventListener("refresh", () => {
    // Force recalculations on resizing
    animatedPaths.forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
    });
  });
}

/* --------------------------------------------------------------------------
   2. Floating Ambient Forest Particles
   -------------------------------------------------------------------------- */
function initAmbientParticles() {
  const container = document.querySelector(".particles-container");
  if (!container) return;

  const particleCount = window.innerWidth < 768 ? 15 : 40;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    
    // Random size, horizontal start position, vertical animation delay and speed
    const size = Math.random() * 4 + 2; // 2px to 6px
    const left = Math.random() * 100; // 0% to 100%
    const delay = Math.random() * 15; // 0s to 15s delay
    const duration = Math.random() * 10 + 10; // 10s to 20s travel duration
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
    
    container.appendChild(particle);
  }
}

/* --------------------------------------------------------------------------
   3. Mobile-Specific Reveal Animation (Triggered once on Scroll Enter)
   -------------------------------------------------------------------------- */
function initMobileTreeAnimation(treeSvg, animatedPaths) {
  // Setup stroke-dasharray and stroke-dashoffset for all animated paths on mobile
  animatedPaths.forEach(path => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
  });

  // Set initial mobile states for leaves and category buttons
  gsap.set(".leaf-cluster", { scale: 0, opacity: 0, transformOrigin: "50% 50%" });
  gsap.set(".mobile-btn", { scale: 0.7, opacity: 0, transformOrigin: "50% 50%" });

  // Register GSAP ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Create the master timeline triggered on scroll enter (once)
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#tree-section",
      start: "top 75%", // Triggers when top of tree section is 75% down the viewport
      once: true // Plays once and remains in the final animated state
    }
  });

  // 1. Trunk draws (Time: 0 -> 1.0)
  tl.to("#trunk", { strokeDashoffset: 0, duration: 1.0, ease: "power1.inOut" });

  // 2. Aerial roots drop (Time: 0.6 -> 1.2)
  const aerialRoots = treeSvg.querySelectorAll(".aerial-root");
  if (aerialRoots.length > 0) {
    tl.to(aerialRoots, { strokeDashoffset: 0, duration: 0.6, stagger: 0.1, ease: "power1.out" }, "-=0.4");
  }

  // 3. Branches grow pair-by-pair (left/right staggered)
  // High Branches: Restaurants & Gruhapravesh
  tl.to("#branch-left-high .draw-path, #branch-right-high .draw-path", { strokeDashoffset: 0, duration: 0.8, ease: "power1.inOut" }, "-=0.2");
  tl.to("#leaves-left-high .leaf-cluster, #leaves-right-high .leaf-cluster", { opacity: 1, scale: 1, duration: 0.4, stagger: 0.03, ease: "back.out(1.2)" }, "-=0.4");
  tl.to(".btn-restaurants, .btn-gruhapravesh", { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" }, "-=0.2");

  // Mid Branches: Clothing & Resorts
  tl.to("#branch-left-mid .draw-path, #branch-right-mid .draw-path", { strokeDashoffset: 0, duration: 0.8, ease: "power1.inOut" }, "-=0.3");
  tl.to("#leaves-left-mid .leaf-cluster, #leaves-right-mid .leaf-cluster", { opacity: 1, scale: 1, duration: 0.4, stagger: 0.03, ease: "back.out(1.2)" }, "-=0.4");
  tl.to(".btn-clothing, .btn-resorts", { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" }, "-=0.2");

  // Low Branches: Gym & Pre School
  tl.to("#branch-left-low .draw-path, #branch-right-low .draw-path", { strokeDashoffset: 0, duration: 0.8, ease: "power1.inOut" }, "-=0.3");
  tl.to("#leaves-left-low .leaf-cluster, #leaves-right-low .leaf-cluster", { opacity: 1, scale: 1, duration: 0.4, stagger: 0.03, ease: "back.out(1.2)" }, "-=0.4");
  tl.to(".btn-gym, .btn-preschool", { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" }, "-=0.2");

  // Top Center / Crown Branch: Corporate Shoots
  tl.to("#branch-top-center .draw-path", { strokeDashoffset: 0, duration: 0.8, ease: "power1.inOut" }, "-=0.3");
  tl.to("#leaves-top-center .leaf-cluster", { opacity: 1, scale: 1, duration: 0.4, stagger: 0.03, ease: "back.out(1.2)" }, "-=0.4");
  tl.to(".btn-corporate", { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" }, "-=0.2");
}

