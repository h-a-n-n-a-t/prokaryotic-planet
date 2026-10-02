document.addEventListener("DOMContentLoaded", async () => {
  const bs = await PP.init();
  const id = PP.query().get("id") || bs[0]?.id;
  const b = bs.find(x => x.id === id) || bs[0];
  if (!b) return;
  renderProfile(b);
  setupResearchTabs(b);
});

function renderProfile(b) {
  document.title = `${b.name} | The Prokaryotic Planet`;
  document.getElementById("profileHeader").innerHTML = `
    <div class="profile-title"><div class="microbe-avatar">🦠</div><div><div class="section-kicker">${PP.esc(b.genus.toUpperCase())} · SPECIES PROFILE</div><h1><i>${PP.esc(b.name)}</i></h1><p>${PP.esc(b.description)}</p></div></div>`;
  const make = (id, pairs) => document.getElementById(id).innerHTML = pairs.map(([k,v]) => `<div class="info-card"><small>${PP.esc(k)}</small><strong>${PP.esc(Array.isArray(v)?v.join(", ")||"None listed":v||"Not specified")}</strong></div>`).join("");
  make("taxonomyCards",[["Domain","Bacteria"],["Phylum",b.phylum],["Class",b.class],["Order",b.order],["Family",b.family],["Genus",b.genus],["Species",b.species]]);
  make("biologyCards",[["Cell morphology",b.shape],["Gram reaction",b.gram],["Cell arrangement",b.arrangement],["Motility",b.motility],["Oxygen requirement",b.oxygen],["Habitat",b.habitat]]);
  make("genomeCards",[["Genome size",b.genomeSize],["GC content",b.gc],["Approx. genes",b.genes],["Plasmids",b.plasmids],["Research activity",b.researchActivity]]);
  make("pathogenCards",[["Pathogenicity",b.pathogenicity],["Associated diseases",b.diseases],["Virulence factors",b.virulence],["Resistance genes",b.resistance]]);
  make("ecologyCards",[["Natural / host habitat",b.habitat],["Ecological context",b.ecology],["Host association",b.ecology]]);
  document.getElementById("resistanceBox").innerHTML = b.resistance.length ? b.resistance.map(x=>`<span class="chip">${PP.esc(x)}</span>`).join(" ") : `<p style="color:#71899a;font-size:11px">No resistance records in demo data.</p>`;
  document.getElementById("diseaseBox").innerHTML = b.diseases.length ? b.diseases.map(x=>`<span class="chip">${PP.esc(x)}</span>`).join(" ") : `<p style="color:#71899a;font-size:11px">No disease associations in demo data.</p>`;
  document.getElementById("researchName").textContent = b.name;
  document.getElementById("favoriteBtn").addEventListener("click", e => { e.currentTarget.textContent = "★ Saved locally"; e.currentTarget.style.color = "var(--cyan)"; localStorage.setItem("pp-favorite-"+b.id,"1"); });
  if (localStorage.getItem("pp-favorite-"+b.id)) document.getElementById("favoriteBtn").textContent = "★ Saved locally";
}
function setupResearchTabs(b) {
  const render = category => {
    const papers = category === "All" ? b.papers : b.papers.filter(p => p.category === category);
    document.getElementById("paperGrid").innerHTML = papers.map(p => `
      <article class="paper-card"><div class="paper-category">${PP.esc(p.category)}</div><h3>${PP.esc(p.title)}</h3><p>${PP.esc(p.summary)}</p><div class="paper-meta"><span>${PP.esc(p.journal)}</span><span>${p.year}</span></div><div class="paper-meta"><span>PMID: ${PP.esc(p.pmid)}</span><span>DOI: ${PP.esc(p.doi)}</span></div><a href="https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(p.title)}" target="_blank" rel="noopener">Search PubMed ↗</a></article>`).join("");
  };
  render("All");
  document.querySelectorAll(".research-tabs button").forEach(btn => btn.addEventListener("click", () => {
    document.querySelectorAll(".research-tabs button").forEach(x=>x.classList.remove("active")); btn.classList.add("active"); render(btn.dataset.category);
  }));
}