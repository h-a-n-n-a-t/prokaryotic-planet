document.addEventListener("DOMContentLoaded", async () => {
  const bs = await PP.init();
  const papers = bs.flatMap(b => b.papers.map(p => ({...p, organism:b.name, id:b.id})));
  const render = () => {
    const q = (document.getElementById("paperSearch").value || "").toLowerCase();
    const cat = document.getElementById("categoryFilter").value;
    const year = document.getElementById("yearFilter").value;
    const filtered = papers.filter(p => {
      const hay = [p.title,p.journal,p.category,p.pmid,p.doi,p.organism].join(" ").toLowerCase();
      return (!q || hay.includes(q)) && (!cat || p.category===cat) && (!year || String(p.year)===year);
    });
    document.getElementById("allPapers").innerHTML = filtered.map(p => `
      <article class="paper-card"><div class="paper-category">${PP.esc(p.category)}</div><h3>${PP.esc(p.title)}</h3><p>${PP.esc(p.summary)}</p><div class="paper-meta"><span>${PP.esc(p.organism)}</span><span>${p.year}</span></div><div class="paper-meta"><span>${PP.esc(p.journal)}</span><span>${PP.esc(p.pmid)}</span></div><a href="species.html?id=${encodeURIComponent(p.id)}">Open organism →</a></article>`).join("") || `<div class="empty-state">No study records match those filters.</div>`;
    const cats = Object.groupBy ? Object.groupBy(filtered,p=>p.category) : {};
    document.getElementById("studyStats").innerHTML = ["General Studies","Disease Studies","Therapeutic Studies"].map(c=>`<div class="mini-stat"><strong>${filtered.filter(p=>p.category===c).length}</strong>${c}</div>`).join("");
  };
  ["paperSearch","categoryFilter","yearFilter"].forEach(id => document.getElementById(id).addEventListener("input",render));
  render();
});