import { getRegionForCatalog } from "./fetch_variant_ld";

const ERRORS = ["BAD_REQUEST", "NETWORK"];
const API_URL_GENE =
  "https://api-dev.catalog.igvf.org/api/variants/nearest-genes?";
const API_URL_REGULATORY_REGION =
  "https://api-dev.catalog.igvf.org/api/regulatory_regions?";

export default async function fetchNearby(request, region, assembly) {
  // right now we only have data for assembly GRCh38
  if (assembly === "GRCh38") {
    const regionForCatalog = getRegionForCatalog(region);
    const genes = await getGenesByRegion(request, regionForCatalog);
    if (ERRORS.includes(genes.code)) {
      return genes;
    }
    const codingRegion = isCodingRegion(genes, region);
    let displayStart = genes[0].start;
    let displayEnd = genes[0].end;
    if (codingRegion) {
      for (let i = 1; i < genes.length; i++) {
        if (genes[i].start < displayStart) displayStart = genes[i].start;
        else if (genes[i].end > displayEnd) displayEnd = genes[i].end;
      }
      displayStart -= 1000;
      displayEnd += 1000;
    } else {
      displayStart = genes[0].end - 2000;
      displayEnd = genes[1].start + 2000;
    }

    const displayRegion = `${genes[0].chr}:${displayStart}-${displayEnd}`;
    const regulatoryRegions = await getRegulatoryRegions(
      request,
      displayRegion
    );

    return {
      displayRegion,
      genes,
      regulatoryRegions,
    };
  }
}

async function getGenesByRegion(request, region) {
  const query = `${API_URL_GENE}region=${region}`;
  const genes = await request.getObjectByUrl(query);
  return genes;
}

async function getRegulatoryRegions(request, region) {
  let pageNum = 0;
  let regulatoryRegions = [];
  let total = [];
  do {
    const query = `${API_URL_REGULATORY_REGION}organism=human&region=${region}&page=${pageNum}`;
    regulatoryRegions = await request.getObjectByUrl(query);
    if (ERRORS.includes(regulatoryRegions.code)) {
      return regulatoryRegions;
    }
    total = total.concat(regulatoryRegions);
    pageNum += 1;
  } while (regulatoryRegions.length === 25 && pageNum <= 4);
  return total;
}

function isCodingRegion(genes, region) {
  const regionStart = parseInt(region.split(":")[1].split("-")[0]);
  const geneStart = genes[0].start;
  const geneEnd = genes[0].end;
  return regionStart >= geneStart && regionStart <= geneEnd ? true : false;
}
