import _ from "lodash";

const API_VARIANT = "https://api-dev.catalog.igvf.org/api/variants?";
const API_VARIANT_LD =
  "https://api-dev.catalog.igvf.org/api/variants/variant_ld?";
const R2 = "0.8";
const API_SCORE = "https://gds-for-regulome-demo.demo.regulomedb.org/summary?";

/**
 * Return a list of variant ld data.
 * @param {object} request to fetch data for data matrix
 * @param {string} region region for query
 * @param {string} assembly assembly for query
 * @param {string} r2 r2 value for query
 * @returns Return a list of variants.
 */
export default async function fetchVariantLD(
  request,
  region,
  assembly,
  r2,
  ancestry
) {
  if (assembly === "GRCh38") {
    const regionForCatalog = getRegionForCatalog(region);
    const variants = await getVariantsByRegion(request, regionForCatalog);
    const variantLD = await Promise.all(
      _.map(variants, async (variant) => {
        const id = variant._id;
        const ancestryParam = ancestry ? `ancestry=${ancestry}` : "";
        const query = `${API_VARIANT_LD}variant_id=${id}&verbose=true&r2=gte:${
          r2 >= R2 ? r2 : R2
        }&${ancestryParam}`;
        const data = await request.getObjectByUrl(query);
        const dataFormatted = await _.map(data, (pair) => {
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
    const scores = await getVariantsScore(request, variantLD.flat(), assembly);
    const variatnsWithScore = variantLD.flat().map((variant) => ({
      ...variant,
      score: scores[variant.location].regulome_score.probability,
      rank: scores[variant.location].regulome_score.ranking,
      tissue_specific_scores:
        scores[variant.location].regulome_score.tissue_specific_scores,
    }));

    return variatnsWithScore;
  }
  return [];
}

async function getVariantsByRegion(request, region) {
  let pageNum = 0;
  let variants = [];
  let total = [];
  do {
    const query = `${API_VARIANT}region=${region}&page=${pageNum}`;
    variants = await request.getObjectByUrl(query);
    total = total.concat(variants);
    pageNum += 1;
  } while (variants.length === 25);
  return total;
}

async function getVariantsScore(request, variants, assembly) {
  const regions = variants.reduce((acc, cur) => {
    acc.push(cur.location);
    return acc;
  }, []);
  const regionsParm = regions.join(" ");
  const query = `${API_SCORE}regions=${regionsParm}&genome=${assembly}`;
  const scores = await request.getObjectByUrl(query);
  const scoresFormatted = scores.variants.reduce((acc, cur) => {
    acc[`${cur.chrom}:${cur.start}-${cur.end}`] = cur;
    return acc;
  }, {});

  return scoresFormatted;
}
function getRegionForCatalog(region) {
  const tokens = region.split("-");
  const end = (parseInt(tokens[1]) - 1).toString();
  const regionCatalog = `${tokens[0]}-${end}`;
  return regionCatalog;
}
