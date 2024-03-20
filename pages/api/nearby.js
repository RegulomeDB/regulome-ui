import fetchNearby from "../../lib/fetch-nearby";
import FetchRequest from "../../lib/fetch-request";

/**
 * This api is used for querying variants in variant LD data and score them for any given single variant.
 * @returns {arry} data in json format. The data returned will include
 * a list of variants with their score info.
 */
export default async function handler(req, res) {
  const request = new FetchRequest();
  const region = req.query.regions;
  const assembly = req.query.genome;
  try {
    const data = await fetchNearby(request, region, assembly);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
}
