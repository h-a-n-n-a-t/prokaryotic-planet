window.PP = {
  bacteria: [],
  ready: null,
  async init() {
    if (this.ready) return this.ready;
    this.ready = fetch("data/sample-bacteria.json").then(r => r.json()).then(d => {
      this.bacteria = d.bacteria || [];
      return this.bacteria;
    });
    return this.ready;
  },
  esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  },
  goSpecies(id) {
    window.location.href = `species.html?id=${encodeURIComponent(id)}`;
  },
  query() {
    return new URLSearchParams(location.search);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  await PP.init();
  document.getElementById("loader")?.classList.add("hide");

  const menu = document.getElementById("mobileMenu");
  const nav = document.getElementById("mainNav");
  menu?.addEventListener("click", () => nav?.classList.toggle("open"));

  document.querySelectorAll("[data-close-search]").forEach(el => el.addEventListener("click", closeSearch));
  document.getElementById("globalSearchTrigger")?.addEventListener("click", openSearch);

  document.querySelectorAll("[data-search]").forEach(btn => btn.addEventListener("click", () => {
    const q = btn.dataset.search;
    window.location.href = `bacteria.html?search=${encodeURIComponent(q)}`;
  }));

  document.getElementById("homeSearch")?.addEventListener("keydown", e => {
    if (e.key === "Enter" && e.target.value.trim()) {
      window.location.href = `bacteria.html?search=${encodeURIComponent(e.target.value.trim())}`;
    }
  });

  document.getElementById("startExploring")?.addEventListener("click", () => {
    document.querySelector(".explorer-preview")?.scrollIntoView({behavior:"smooth"});
  });

  updateHomeStats();
});

function openSearch() {
  const modal = document.getElementById("searchModal");
  if (!modal) return;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  setTimeout(() => document.getElementById("globalSearch")?.focus(), 50);
}
function closeSearch() {
  const modal = document.getElementById("searchModal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
}
function updateHomeStats() {
  const bs = PP.bacteria;
  const genera = new Set(bs.map(b => b.genus)).size;
  const papers = bs.reduce((n,b) => n + b.papers.length, 0);
  const diseases = new Set(bs.flatMap(b => b.diseases)).size;
  document.getElementById("statGenera")?.replaceChildren(String(genera));
  document.getElementById("statSpecies")?.replaceChildren(String(bs.length));
  document.getElementById("statPapers")?.replaceChildren(String(papers));
  document.getElementById("statDiseases")?.replaceChildren(String(diseases));
  document.getElementById("statTherapies")?.replaceChildren(String(bs.filter(b => b.papers.some(p => p.category === "Therapeutic Studies")).length));
}