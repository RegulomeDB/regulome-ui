import { API_URL_GENE, API_URL_REGULATORY_REGION, ERRORS } from "./constants";

const CODING_REGION_EXPAND = 1000;
const NON_CODING_REGION_EXPAND = 2000;

/**
 * This function fetchs data from IGVF catalog, which is used for variant nearby drawing.
 * The data we need for the given region are: the coordinates of the display region,
 * the nearest genes and the regulatory regions in the display region.
 * For the display region, if the variant is in coding region, then display 1kb on either side of the whole gene.
 * Otherwise, display the nearest genes up to 2 kb in both direction.
 * @param {object} request to fetch data
 * @param {string} region for query
 * @param {string} assembly for query
 * @returns data for variant nearby drawing.
 */
export default async function fetchNearby(request, region, assembly) {
  // right now we only have data for assembly GRCh38
  if (assembly === "GRCh38") {
    const regionForCatalog = region;
    const genes = await getNearestGenesByRegion(request, regionForCatalog);
    if (ERRORS.includes(genes.code)) {
      return genes;
    }
    const codingRegion = isCodingRegion(genes, region);
    let displayStart = genes[0].start;
    let displayEnd = genes[0].end;
    if (codingRegion) {
      // There can be more than one gene in the coding region(different directions)
      for (let i = 1; i < genes.length; i++) {
        if (genes[i].start < displayStart) displayStart = genes[i].start;
        else if (genes[i].end > displayEnd) displayEnd = genes[i].end;
      }
      displayStart -= CODING_REGION_EXPAND;
      displayEnd += CODING_REGION_EXPAND;
    } else {
      if (genes.length > 1) {
        displayStart = genes[0].end - NON_CODING_REGION_EXPAND;
        displayEnd = genes[1].start + NON_CODING_REGION_EXPAND;
      } else {
        const regionStart = parseInt(region.split(":")[1].split("-")[0]);
        if (regionStart < genes[0].start) {
          displayStart = regionStart - NON_CODING_REGION_EXPAND;
          displayEnd = genes[0].end + NON_CODING_REGION_EXPAND;
        } else {
          displayStart = genes[0].start - NON_CODING_REGION_EXPAND;
          displayEnd = regionStart + NON_CODING_REGION_EXPAND;
        }
      }
    }

    const displayRegion = `${genes[0].chr}:${displayStart}-${displayEnd}`;
    const queryRegion =
      displayStart >= 0 ? displayRegion : `${genes[0].chr}:0-${displayEnd}`;
    const regulatoryRegions = await getRegulatoryRegions(request, queryRegion);
    if (ERRORS.includes(regulatoryRegions.code)) {
      return regulatoryRegions;
    }

    return {
      displayRegion,
      genes,
      regulatoryRegions,
    };
  }
  return {};
}

/**
 * @param {object} request to fetch data
 * @param {string} region for query
 * @returns a list of nearset genes for the given region
 */
async function getNearestGenesByRegion(request, region) {
  const query = `${API_URL_GENE}region=${region}`;
  const genes = await request.getObjectByUrl(query);
  return genes;
}

/**
 * @param {object} request to fetch data
 * @param {string} region for query
 * @returns a list of regulatory regions from source ENCODE_SCREEN (ccREs) for the given region
 */
async function getRegulatoryRegions(request, region) {
  let pageNum = 0;
  let regulatoryRegions = [];
  let total = [];
  do {
    const query = `${API_URL_REGULATORY_REGION}organism=Homo%20sapiens&source=ENCODE_SCREEN%20%28ccREs%29&region=${region}&page=${pageNum}&limit=1000`;
    regulatoryRegions = await request.getObjectByUrl(query);
    if (ERRORS.includes(regulatoryRegions.code)) {
      return regulatoryRegions;
    }
    total = total.concat(regulatoryRegions);
    pageNum += 1;
  } while (regulatoryRegions.length === 1000);
  return total;
}

/**
 * @param {Array} genes used to check region
 * @param {string} region to check
 * @returns true if the region is in the coding region
 */
function isCodingRegion(genes, region) {
  const regionStart = parseInt(region.split(":")[1].split("-")[0]);
  const geneStart = genes[0].start;
  const geneEnd = genes[0].end;
  return regionStart >= geneStart && regionStart <= geneEnd;
}
