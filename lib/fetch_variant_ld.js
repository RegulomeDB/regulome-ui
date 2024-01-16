import _ from "lodash";

const API_VARIANT = "https://api.catalog.igvf.org/api/variants?";
const API_VARIANT_LD = "https://api.catalog.igvf.org/api/variants/variant_ld?";
const R2 = "gte:0.8";

/**
 * Return a list of variant ld data.
 * @param {object} request to fetch data for data matrix
 * @param {string} region region for query
 * @param {string} assembly assembly for query
 * @returns Return a list of variants.
 */
export default async function fetchVariantLD(request, region, assembly) {
  const regionForCatalog = getRegionForCatalog(region);
  const variants = await getVariantsByRegion(request, regionForCatalog);
  if (assembly === "GRCh38") {
    const variantLD = await Promise.all(
      _.map(variants, async (variant) => {
        const id = variant._id;
        const query = `${API_VARIANT_LD}variant_id=${id}&verbose=true&r2=${R2}`;
        console.log(query);
        const data = await request.getObjectByUrl(query);
        const dataFormatted = _.map(data, (pair) => {
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
    console.log(variantLD.flat());
    return variantLD.flat();
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

function getRegionForCatalog(region) {
  const tokens = region.split("-");
  const end = (parseInt(tokens[1]) - 1).toString();
  const regionCatalog = `${tokens[0]}-${end}`;
  return regionCatalog;
}
