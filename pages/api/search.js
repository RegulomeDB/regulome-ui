import { API_URL } from "../../lib/constants";
import { getQueryStringFromServerQuery } from "../../lib/query-utils";
/**
 * This api is used for querying any given variant by intersecting its position with the genomic intervals
 * that were identified to be functionally active regions from the computational analysis outputs of functional genomic assays
 * such as TF ChIP-seq and DNase-seq (from the ENCODE database) as well as those overlapping the footprints and QTL data.
 * The data is provided by Genomic Data Service (https://github.com/ENCODE-DCC/genomic-data-service).
 * You can submit queries to the RegulomeDB database in the following formats.
 * 1. Rsids assigned by dbSNP. For example: /api/search?regions=rs75982468&genome=hg19
 * 2. Single nucleotide positions. For example: /api/search?regions=chr10:11699181-11699182&genome=GRCh38
 * 3. Chromosomal regions. For example: /api/search?regions=chr12:69360231-69360332%0D%0A&genome=GRCh38&maf=0.1
 * @returns {object} data in json format. The data returned will include
 * a graph of scored datasets, features, nearby snps, regulome score, sequence and variants info.
 */
export default async function handler(req, res) {
  const queryString = getQueryStringFromServerQuery(req.query);
  const url = `${API_URL}/search?${queryString}`;
  const response = await fetch(url);
  const data = await response.json();
  if (response.status !== 200) {
    res.status(400).json("Query failed!");
  } else {
    res.status(200).json(data);
  }
}
