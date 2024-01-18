import FetchRequest from "../../lib/fetch-request";
import fetchVariantLD from "../../lib/fetch_variant_ld";

/**
 * This api is used for querying variants in variant LD data and score them for any given single variant.
 * @returns {arry} data in json format. The data returned will include
 * a list of variants with their score info.
 */
export default async function handler(req, res) {
  const request = new FetchRequest();
  const region = req.query.regions;
  const assembly = req.query.genome;
  const r2 = req.query.r2;
  const ancestry = req.query.ancestry;
  try {
    const data = await fetchVariantLD(request, region, assembly, r2, ancestry);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
}
