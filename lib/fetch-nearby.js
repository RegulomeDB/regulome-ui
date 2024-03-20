import { getRegionForCatalog } from "./fetch_variant_ld";

const ERRORS = ["BAD_REQUEST", "NETWORK"];
const API_URL_GENE = "https://api-dev.catalog.igvf.org/api/genes?";
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
    const gene = genes[0];
    const displayStart = gene.start - 1000;
    const displayEnd = gene.end + 1000;
    const displayRegion = `${gene.chr}:${displayStart}-${displayEnd}`;
    const regionegulatoryRegions = await getRegulatoryRegions(
      request,
      displayRegion
    );

    return {
      gene,
      regionegulatoryRegions,
    };
  }
}

async function getGenesByRegion(request, region) {
  const query = `${API_URL_GENE}organism=human&region=${region}`;
  const genes = await request.getObjectByUrl(query);
  return genes;
}

async function getRegulatoryRegions(request, region) {
  let pageNum = 0;
  let regionegulatoryRegions = [];
  let total = [];
  do {
    const query = `${API_URL_REGULATORY_REGION}organism=human&region=${region}&page=${pageNum}`;
    regionegulatoryRegions = await request.getObjectByUrl(query);
    if (ERRORS.includes(regionegulatoryRegions.code)) {
      return regionegulatoryRegions;
    }
    total = total.concat(regionegulatoryRegions);
    pageNum += 1;
  } while (regionegulatoryRegions.length === 25);
  return total;
}
