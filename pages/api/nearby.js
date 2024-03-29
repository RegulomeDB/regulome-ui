import fetchNearby from "../../lib/fetch-nearby";
import FetchRequest from "../../lib/fetch-request";

/**
 * This api is used for querying nearest genes and regulatory regions for any given single variant.
 * @returns {object} data in json format. The data returned will include
 * the coordinates of the display region, the nearest genes and the regulatory regions in the display region.
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
