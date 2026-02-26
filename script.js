const seal = document.querySelector(".seal");
const flap = document.querySelector(".flap");
const letter = document.querySelector(".letter");
const card = document.querySelector(".card");
const music = document.getElementById("music");
const repeatBtn = document.querySelector(".repeat-btn");
const musicToggle = document.getElementById('musicToggle');

let isOpen = false;
let isAnimating = false;

function openEnvelope() {
  if (isAnimating) {
    console.log("Already animating");
    return;
  }
  
  console.log("Opening envelope...");
  isAnimating = true;
  isOpen = true;

  const tl = gsap.timeline();

  // Fade out and scale seal
  tl.to(seal, {
    scale: 0,
    opacity: 0,
    duration: 0.4,
    ease: "back.in"
  });

  // Flip flap
  tl.to(flap, {
    rotateX: -180,
    duration: 1.2,
    ease: "power3.inOut"
  }, 0);

  // Pull letter up
  tl.to(letter, {
    y: -220,
    duration: 1,
    ease: "power3.out"
  }, "-=0.5");

  // Fade in card content
  tl.to(card, {
    opacity: 1,
    duration: 0.8
  }, "-=0.3");

  // Enable card interactions
  tl.add(() => {
    card.classList.add("active");
    letter.classList.add("active");
  });

  // Play music safely
  if (music && music.play) {
    music.play().catch(error => {
      console.log("Audio playback prevented:", error);
    });
    // update toggle button state
    if (musicToggle) musicToggle.textContent = '⏸';
  }

  // Show repeat button when animation completes
  tl.add(() => {
    isAnimating = false;
    if (repeatBtn) {
      repeatBtn.classList.add("show");
    }
  });
}

function closeEnvelope() {
  if (isAnimating || !isOpen) {
    console.log("Cannot close - animating or not open");
    return;
  }
  
  console.log("Closing envelope...");
  isAnimating = true;
  isOpen = false;

  if (repeatBtn) {
    repeatBtn.classList.remove("show");
  }

  card.classList.remove("active");
  letter.classList.remove("active");

  const tl = gsap.timeline();

  // Hide card
  tl.to(card, {
    opacity: 0,
    duration: 0.5
  });

  // Push letter down
  tl.to(letter, {
    y: 0,
    duration: 0.8,
    ease: "power3.out"
  }, "-=0.3");

  // Close flap
  tl.to(flap, {
    rotateX: 0,
    duration: 1,
    ease: "power3.inOut"
  }, 0);

  // Reveal seal
  tl.to(seal, {
    scale: 1,
    opacity: 1,
    duration: 0.5,
    ease: "back.out"
  }, "-=0.5");

  // Stop music
  if (music) {
    music.pause();
    music.currentTime = 0;
    if (musicToggle) musicToggle.textContent = '▶';
  }

  tl.add(() => {
    isAnimating = false;
  });
}

// Add event listeners
if (seal) {
  seal.addEventListener("click", function(e) {
    e.stopPropagation();
    console.log("Seal clicked, isOpen:", isOpen, "isAnimating:", isAnimating);
    if (!isOpen && !isAnimating) {
      openEnvelope();
    }
  });
}

if (repeatBtn) {
  repeatBtn.addEventListener("click", function() {
    closeEnvelope();
    setTimeout(() => {
      openEnvelope();
    }, 500);
  });
}

// Music toggle button behavior
if (musicToggle) {
  musicToggle.addEventListener('click', function(e){
    e.stopPropagation();
    if (!music) return;
    if (music.paused) {
      music.play().then(() => {
        musicToggle.textContent = '⏸';
      }).catch(err => console.log('Playback blocked', err));
    } else {
      music.pause();
      music.currentTime = 0;
      musicToggle.textContent = '▶';
    }
  });
}
  