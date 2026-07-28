const marqueeTracks = document.querySelectorAll(".marquee-track");
const revealItems = document.querySelectorAll(".reveal");
const managedMedia = document.querySelectorAll(".managed-media");

function buildMarquee(track) {
  const text = track.dataset.text?.trim();
  if (!text) return;

  track.innerHTML = "";

  const repeatCount = 14;
  for (let i = 0; i < repeatCount; i += 1) {
    const item = document.createElement("span");
    item.className = "marquee-item";
    item.textContent = text;
    track.appendChild(item);
  }
}

function handleMediaState(img) {
  const frame = img.closest(".media-frame");
  if (!frame) return;

  const onLoad = () => {
    frame.classList.remove("is-missing");
    frame.classList.add("is-loaded");
  };

  const onError = () => {
    frame.classList.remove("is-loaded");
    frame.classList.add("is-missing");
  };

  if (img.complete) {
    if (img.naturalWidth > 0) {
      onLoad();
    } else {
      onError();
    }
  } else {
    img.addEventListener("load", onLoad, { once: true });
    img.addEventListener("error", onError, { once: true });
  }
}

function initReveal() {
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 0.03, 0.24)}s`;
    observer.observe(item);
  });
}

marqueeTracks.forEach(buildMarquee);
managedMedia.forEach(handleMediaState);
initReveal();
