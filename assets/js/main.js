document.getElementById("year").textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll(".reveal-up");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -40px 0px",
  },
);

revealItems.forEach((item) => revealObserver.observe(item));

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const href = anchor.getAttribute("href");
    if (!href || href === "#") {
      return;
    }

    const target = document.querySelector(href);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
