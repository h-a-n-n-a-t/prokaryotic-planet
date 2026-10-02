# The Prokaryotic Planet

An interactive frontend prototype for a bacterial knowledge platform.

## Technology

- Node.js
- HTML5
- CSS3
- Vanilla JavaScript
- JSON demonstration dataset

## Run locally

1. Install Node.js.
2. Open a terminal in this folder.
3. Run:

```bash
npm start
```

4. Open:

http://localhost:3000

## Pages

- `index.html` — landing page
- `bacteria.html` — explorer, taxonomy tree, disease, therapeutics and interactive lab
- `species.html` — dynamic species profile
- `studies.html` — research explorer
- `about.html` — project/data architecture

## Important

The included records are DEMONSTRATION DATA. They are not a complete list of bacteria and the paper records are prototype records.

For a production version, connect the API/data layer to authoritative scientific sources such as NCBI Taxonomy, PubMed, BacDive, UniProt, KEGG, BV-BRC, GTDB, CARD and ResFinder.

Traditional Java browser applets are obsolete. The Interactive Lab is therefore an API-ready integration container for a future Java-based service/application.

## Suggested next architecture

Frontend → Node.js/API backend → normalized scientific database/cache → external scientific APIs

The frontend already uses API-ready concepts such as:
- fetchBacteria()
- fetchGenus()
- fetchSpecies()
- fetchStudies()
- fetchDiseaseStudies()
- fetchTherapeuticStudies()
- fetchResistanceGenes()
