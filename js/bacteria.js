document.addEventListener("DOMContentLoaded", async () => {
  const bs = await PP.init();
  setupFilters(bs);
  renderTaxonomy(bs);
  renderSpeciesIndex(bs);
  renderDiseaseCloud(bs);
  const initial = PP.query().get("search") || "";
  if (initial) document.getElementById("bacteriaSearch").value = initial;
  renderBacteria();
  document.getElementById("launchSimulation")?.addEventListener("click", () => {
    alert("Simulation engine placeholder: connect your Java application/service here through an API.");
  });
});

let allBacteria = [];
function setupFilters(bs) {
  allBacteria = bs;
  const phyla = [...new Set(bs.map(b => b.phylum))].sort();
  const genera = [...new Set(bs.map(b => b.genus))].sort();
  phyla.forEach(x => document.getElementById("phylumFilter")?.insertAdjacentHTML("beforeend", `<option>${PP.esc(x)}</option>`));
  genera.forEach(x => document.getElementById("genusFilter")?.insertAdjacentHTML("beforeend", `<option>${PP.esc(x)}</option>`));
  ["bacteriaSearch","phylumFilter","genusFilter","gramFilter","shapeFilter","oxygenFilter","pathogenFilter","resistanceFilter"].forEach(id => {
    document.getElementById(id)?.addEventListener("input", renderBacteria);
    document.getElementById(id)?.addEventListener("change", renderBacteria);
  });
  document.getElementById("clearFilters")?.addEventListener("click", () => {
    ["bacteriaSearch","phylumFilter","genusFilter","gramFilter","shapeFilter","oxygenFilter"].forEach(id => { const el=document.getElementById(id); if(el) el.value=""; });
    ["pathogenFilter","resistanceFilter"].forEach(id => { const el=document.getElementById(id); if(el) el.checked=false; });
    renderBacteria();
  });
}
function renderBacteria() {
  const q = (document.getElementById("bacteriaSearch")?.value || "").toLowerCase().trim();
  const phylum = document.getElementById("phylumFilter")?.value || "";
  const genus = document.getElementById("genusFilter")?.value || "";
  const gram = document.getElementById("gramFilter")?.value || "";
  const shape = document.getElementById("shapeFilter")?.value || "";
  const oxygen = document.getElementById("oxygenFilter")?.value || "";
  const pathogen = document.getElementById("pathogenFilter")?.checked;
  const resistance = document.getElementById("resistanceFilter")?.checked;

  const filtered = allBacteria.filter(b => {
    const hay = [b.name,b.genus,b.species,b.family,b.phylum,b.diseases.join(" "),b.resistance.join(" "),b.virulence.join(" ")].join(" ").toLowerCase();
    return (!q || hay.includes(q)) && (!phylum || b.phylum===phylum) && (!genus || b.genus===genus) &&
      (!gram || b.gram===gram) && (!shape || b.shape===shape) && (!oxygen || b.oxygen===oxygen) &&
      (!pathogen || /pathogen/i.test(b.pathogenicity)) && (!resistance || b.resistance.length);
  });

  document.getElementById("resultCount").textContent = `${filtered.length} organism${filtered.length===1?"":"s"}`;
  document.getElementById("resultsTitle").textContent = q ? `Matches for “${q}”` : "Bacteria";
  document.getElementById("bacteriaGrid").innerHTML = filtered.map((b,i) => `
    <article class="bacteria-card" style="animation-delay:${i*35}ms" data-id="${PP.esc(b.id)}">
      <div class="card-top"><div><div class="taxon">${PP.esc(b.genus.toUpperCase())} · ${PP.esc(b.family.toUpperCase())}</div><h3><i>${PP.esc(b.name)}</i></h3></div><div class="microbe-avatar">🦠</div></div>
      <p>${PP.esc(b.description)}</p>
      <div class="chip-row"><span class="chip">${PP.esc(b.gram)}</span><span class="chip">${PP.esc(b.shape)}</span><span class="chip">${PP.esc(b.oxygen)}</span></div>
      <div class="chip-row"><span class="chip">📚 ${b.papers.length} studies</span><span class="chip">⚕ ${b.diseases.length} disease links</span></div>
    </article>`).join("") || `<div class="empty-state">No organisms match those filters.</div>`;
  document.querySelectorAll(".bacteria-card").forEach(el => el.addEventListener("click", () => PP.goSpecies(el.dataset.id)));
}
function renderTaxonomy(bs) {
  const groups = {};
  bs.forEach(b => {
    groups[b.phylum] ??= {};
    groups[b.phylum][b.family] ??= {};
    groups[b.phylum][b.family][b.genus] ??= [];
    groups[b.phylum][b.family][b.genus].push(b);
  });
  document.getElementById("taxonomyTree").innerHTML = Object.entries(groups).map(([phylum,fams]) => `
    <div class="tree-node"><button class="tree-toggle">▸ <strong>${PP.esc(phylum)}</strong></button>
      <div class="tree-children hidden">${Object.entries(fams).map(([family,genera]) => `
        <div class="tree-node"><button class="tree-toggle">▸ ${PP.esc(family)}</button>
          <div class="tree-children hidden">${Object.entries(genera).map(([genus,items]) => `
            <div class="tree-node"><button class="tree-toggle">▸ <strong>${PP.esc(genus)}</strong></button>
              <div class="tree-children hidden">${items.map(b => `<div class="tree-node"><a class="tree-toggle" href="species.html?id=${encodeURIComponent(b.id)}">🦠 <i>${PP.esc(b.name)}</i></a></div>`).join("")}</div>
            </div>`).join("")}</div>
        </div>`).join("")}</div>
    </div>`).join("");
  document.querySelectorAll(".tree-toggle").forEach(btn => btn.addEventListener("click", e => {
    const next = e.currentTarget.nextElementSibling;
    if (next?.classList.contains("tree-children")) next.classList.toggle("hidden");
  }));
}
function renderSpeciesIndex(bs) {
  document.getElementById("speciesIndex").innerHTML = bs.map(b => `<a class="species-item" href="species.html?id=${encodeURIComponent(b.id)}"><i>${PP.esc(b.name)}</i><small>${PP.esc(b.genus)} · ${PP.esc(b.phylum)}</small></a>`).join("");
}
function renderDiseaseCloud(bs) {
  const diseases = [...new Set(bs.flatMap(b=>b.diseases))].sort();
  document.getElementById("diseaseCloud").innerHTML = diseases.map(d => `<button data-disease="${PP.esc(d)}">${PP.esc(d)}</button>`).join("");
  document.querySelectorAll("[data-disease]").forEach(btn => btn.addEventListener("click", () => {
    document.getElementById("bacteriaSearch").value = btn.dataset.disease;
    document.querySelector(".explorer-layout").scrollIntoView({behavior:"smooth"});
    renderBacteria();
  }));
}