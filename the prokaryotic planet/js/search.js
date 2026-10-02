document.addEventListener("DOMContentLoaded", async () => {
  await PP.init();
  const input = document.getElementById("globalSearch");
  input?.addEventListener("input", () => renderGlobalResults(input.value));
  input?.addEventListener("keydown", e => {
    if (e.key === "Escape") closeSearch();
    if (e.key === "Enter") {
      const first = document.querySelector("#globalResults .search-result");
      first?.click();
    }
  });
});

function renderGlobalResults(query) {
  const box = document.getElementById("globalResults");
  if (!box) return;
  const q = query.trim().toLowerCase();
  if (!q) {
    box.innerHTML = `<div class="search-result"><div><b>Try searching</b><small>Staphylococcus aureus · MRSA · mecA · tuberculosis</small></div></div>`;
    return;
  }

  const results = [];
  PP.bacteria.forEach(b => {
    const hay = [b.name,b.genus,b.species,b.family,b.phylum,b.gram,b.shape,b.oxygen,b.pathogenicity,...b.diseases,...b.resistance,...b.virulence].join(" ").toLowerCase();
    if (hay.includes(q)) results.push({type:"BACTERIUM",title:b.name,sub:`${b.genus} · ${b.family}`,id:b.id});
    b.papers.forEach(p => {
      if ((p.title+" "+p.journal+" "+p.category+" "+p.pmid).toLowerCase().includes(q))
        results.push({type:"PAPER",title:p.title,sub:`${p.category} · ${b.name}`,id:b.id});
    });
  });

  box.innerHTML = results.slice(0,10).map(r => `
    <div class="search-result" data-id="${PP.esc(r.id)}">
      <div><b>${PP.esc(r.title)}</b><small>${PP.esc(r.sub)}</small></div><span>${PP.esc(r.type)}</span>
    </div>`).join("") || `<div class="search-result"><div><b>No matches</b><small>Try another organism, disease or resistance gene.</small></div></div>`;

  box.querySelectorAll(".search-result[data-id]").forEach(el => el.addEventListener("click", () => PP.goSpecies(el.dataset.id)));
}