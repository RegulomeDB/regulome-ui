const populationOrder = [
  "GnomAD",
  "1000Genomes",
  "TOPMED",
  "GnomAD_exomes",
  "ExAC",
  "NorthernSweden",
  "ALSPAC",
  "TWINSUK",
  "Vietnamese",
  "GoESP",
  "Estonian",
  "PAGE_STUDY",
  "source unknown",
];

/**
 * Return the info for SNPs matching searched coordinates
 * @param {object} data data used to get SNPs info
 * @returns {object} Return the info for SNPs matching searched coordinates
 */
export default function getSnpsInfo(data) {
  const coordinates = data.query_coordinates[0];
  const snpsInfo = {};
  snpsInfo.hitSnps = {};
  snpsInfo.sortedPopulations = {};
  const [chrom, startEnd] = coordinates.split(":");
  const [start, end] = startEnd.split("-");
  data.nearby_snps.forEach((snp) => {
    if (
      snp.chrom === chrom &&
      snp.coordinates.gte === +start &&
      snp.coordinates.lt === +end
    ) {
      snpsInfo.hitSnps[snp.rsid] = {};
      const populationAlleles = {};
      if (snp.ref_allele_freq) {
        const refAlleleTag = Object.keys(snp.ref_allele_freq)[0];
        if (Object.keys(snp.ref_allele_freq[refAlleleTag]).length !== 0) {
          Object.keys(snp.ref_allele_freq).forEach((allele) => {
            Object.keys(snp.ref_allele_freq[allele]).forEach((population) => {
              if (!snp.ref_allele_freq[allele][population]) {
                populationAlleles[population] = [`${allele}=N/A`];
              } else {
                populationAlleles[population] = [
                  `${allele}=${snp.ref_allele_freq[allele][population]}`,
                ];
              }
            });
          });
          Object.keys(snp.alt_allele_freq).forEach((allele) => {
            Object.keys(snp.alt_allele_freq[allele]).forEach((population) => {
              if (!snp.alt_allele_freq[allele][population]) {
                populationAlleles[population].push(`${allele}=N/A`);
              } else {
                populationAlleles[population].push(
                  `${allele}=${snp.alt_allele_freq[allele][population]}`
                );
              }
            });
          });
        } else {
          populationAlleles["source unknown"] = [`${refAlleleTag}=N/A`];
          Object.keys(snp.alt_allele_freq).forEach((allele) => {
            populationAlleles["source unknown"].push(`${allele}=N/A`);
          });
        }
      }
      snpsInfo.sortedPopulations[snp.rsid] = [];
      populationOrder.forEach((population) => {
        if (populationAlleles[population]) {
          snpsInfo.hitSnps[snp.rsid][population] =
            populationAlleles[population].join(", ");
          snpsInfo.sortedPopulations[snp.rsid].push(population);
        }
      });
    }
  });
  return snpsInfo;
}
