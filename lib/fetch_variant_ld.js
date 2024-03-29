const API_VARIANT = "https://api-dev.catalog.igvf.org/api/variants?";
const API_VARIANT_LD =
  "https://api-dev.catalog.igvf.org/api/variants/variant_ld?";
const R2 = "0.8";
const API_SCORE = "https://gds-for-regulome-demo.demo.regulomedb.org/summary?";
const ERRORS = ["BAD_REQUEST", "NETWORK"];

/**
 * Return a list of variants in variant ld data.
 * @param {object} request to fetch data for data matrix
 * @param {string} region for query
 * @param {string} assembly for query
 * @param {string} r2 for query
 * @returns Return a list of variants.
 */
export default async function fetchVariantLD(
  request,
  region,
  assembly,
  r2,
  ancestry
) {
  // right now we only have data for assembly GRCh38
  if (assembly === "GRCh38") {
    const regionForCatalog = getRegionForCatalog(region);
    const variants = await getVariantsByRegion(request, regionForCatalog);
    if (ERRORS.includes(variants.code)) {
      return variants;
    }
    let variantLD = await Promise.all(
      variants.map(async (variant) => {
        const data = await getVariantsInVariantLD(
          request,
          variant._id,
          r2,
          ancestry
        );
        if (ERRORS.includes(data.code)) {
          return data;
        }
        const dataFormatted = data.map((pair) => {
          const start = pair["sequence variant"][0].pos;
          const end = (parseInt(start) + 1).toString();
          return {
            ancestry: pair.ancestry,
            r2: pair.r2,
            query_spdi: variant.spdi,
            rsid: pair["sequence variant"][0].rsid,
            location: `${pair["sequence variant"][0].chr}:${start}-${end}`,
            ref: pair["sequence variant"][0].ref,
            alt: pair["sequence variant"][0].alt,
            assembly,
          };
        });
        return dataFormatted;
      })
    );
    variantLD = variantLD.flat();
    if (variantLD.length > 0) {
      if (ERRORS.includes(variantLD[0]?.code)) {
        return variantLD[0];
      }
      const scores = await getVariantsScore(request, variantLD, assembly);
      const variantsWithScore = variantLD.map((variant) => ({
        ...variant,
        score: parseFloat(scores[variant.location].regulome_score.probability),
        rank: scores[variant.location].regulome_score.ranking,
        tissue_specific_scores:
          scores[variant.location].regulome_score.tissue_specific_scores,
      }));
      return variantsWithScore;
    }
    return [];
  }
  return [];
}

/**
 * This function get all the variants for given region in catalog database
 * @param {object} request to fetch data
 * @param {string} region for query
 * @returns all the variants for given region in catalog database
 */
async function getVariantsByRegion(request, region) {
  let pageNum = 0;
  let variants = [];
  let total = [];
  do {
    const query = `${API_VARIANT}region=${region}&page=${pageNum}`;
    variants = await request.getObjectByUrl(query);
    if (ERRORS.includes(variants.code)) {
      return variants;
    }
    total = total.concat(variants);
    pageNum += 1;
  } while (variants.length === 25);
  return total.filter(
    (variant) => variant.ref.length === 1 && variant.alt.length === 1
  );
}

/**
 * This function get all the variants for given region in catalog database
 * @param {object} request to fetch data
 * @param {string} region for query
 * @returns all the variants for given region in catalog database
 */
async function getVariantsInVariantLD(request, id, r2, ancestry) {
  let pageNum = 0;
  let variants = [];
  let total = [];
  const ancestryParam = ancestry ? `&ancestry=${ancestry}` : "";
  do {
    const query = `${API_VARIANT_LD}variant_id=${id}&verbose=true&r2=gte:${
      r2 >= R2 ? r2 : R2
    }&page=${pageNum}${ancestryParam}`;
    variants = await request.getObjectByUrl(query);
    if (ERRORS.includes(variants.code)) {
      return variants;
    }
    total = total.concat(variants);
    pageNum += 1;
  } while (variants.length === 25);
  return total.filter(
    (pair) =>
      pair["sequence variant"][0].ref.length === 1 &&
      pair["sequence variant"][0].alt.length === 1
  );
}

/**
 * This function query GDS to get score for each variant
 * @param {object} request to fetch data
 * @param {*} variants for query vairant score
 * @param {*} assembly for query
 * @returns a list of score for each variant
 */
async function getVariantsScore(request, variants, assembly) {
  const regionsSet = variants.reduce((acc, cur) => {
    acc.add(cur.location);
    return acc;
  }, new Set());
  const regions = Array.from(regionsSet);
  const batchNum = 50;
  let total = [];
  do {
    const regionsParm = regions
      .splice(0, regions.length > batchNum ? batchNum : regions.length)
      .join(" ");
    const query = `${API_SCORE}regions=${regionsParm}&genome=${assembly}`;
    const scores = await request.getObjectByUrl(query);
    total = total.concat(scores.variants);
  } while (regions.length > 0);

  const scoresFormatted = total.reduce((acc, cur) => {
    acc[`${cur.chrom}:${cur.start}-${cur.end}`] = cur;
    return acc;
  }, {});

  return scoresFormatted;
}

/**
 * This function convert the region used in GDS to region used in catalog
 * @param {*} region used in GDS
 * @returns region used in catalog
 */
function getRegionForCatalog(region) {
  const tokens = region.split("-");
  const end = (parseInt(tokens[1]) - 1).toString();
  const regionCatalog = `${tokens[0]}-${end}`;
  return regionCatalog;
}
