import { API_URL } from "../../lib/constants";
import { getQueryStringFromServerQuery } from "../../lib/query-utils";
export default async function handler(req, res) {
  const queryString = getQueryStringFromServerQuery(req.query);
  const url = `${API_URL}/summary?${queryString}`;
  const response = await fetch(url);
  const data = await response.json();
  if (response.status !== 200) {
    res.status(400).json("Query failed!");
  } else {
    res.status(200).json(data);
  }
}
