(function () {
  const timeline = document.querySelector('[data-roadmap-timeline]');
  if (!timeline) return;

  const progress = timeline.querySelector('.roadmap-progress');
  const items = Array.from(timeline.querySelectorAll('.roadmap-item'));
  if (!items.length) return;

  const updateProgress = () => {
    const viewportLine = window.innerHeight * 0.62;
    let activeIndex = 0;

    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < viewportLine) activeIndex = index;
    });

    const percent = items.length <= 1 ? 100 : (activeIndex / (items.length - 1)) * 100;
    timeline.style.setProperty('--roadmap-progress', `${Math.max(6, percent)}%`);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
    updateProgress();
  }, { threshold: 0.35 });

  items.forEach((item) => observer.observe(item));
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
})();
