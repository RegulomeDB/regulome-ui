const UNKNOWN_SOURCE = "source unknown";
const populationIndex = {
  GnomAD: 0,
  "1000Genomes": 1,
  TOPMED: 2,
  GnomAD_exomes: 3,
  ExAC: 4,
  NorthernSweden: 5,
  ALSPAC: 6,
  TWINSUK: 7,
  Vietnamese: 8,
  GoESP: 9,
  Estonian: 10,
  PAGE_STUDY: 11,
  "source unknown": 12,
};

/**
 * Return the info for SNPs matching searched coordinates.
 * Each SNP can have no more than one ref allele, one or more alt alleles.
 * Each allele may or may not contain frequency info.
 * Frequency info can come from different populations.
 * For each SNP, frequency info needs to be sorted by population when return.
 * @param {object} data data used to get hitted SNPs info
 * @returns {object} Return the info for SNPs matching searched coordinates.
 */
export default function getSnpsInfo(data) {
  const coordinates = data.query_coordinates[0];
  const hitSnps = {};
  const [chrom, startEnd] = coordinates.split(":");
  const [start, end] = startEnd.split("-");
  const filteredSnps = data.nearby_snps.filter(
    (snp) =>
      snp.chrom === chrom &&
      snp.coordinates.gte === +start &&
      snp.coordinates.lt === +end
  );
  filteredSnps.forEach((snp) => {
    if (snp.ref_allele_freq) {
      hitSnps[snp.rsid] = [];
      const refAlleleSeq = Object.keys(snp.ref_allele_freq)[0];
      const refAlleleInfo = snp.ref_allele_freq[refAlleleSeq];
      //check if the ref allele has population info
      if (Object.keys(refAlleleInfo).length !== 0) {
        Object.keys(refAlleleInfo).forEach((population) => {
          hitSnps[snp.rsid][populationIndex[population]] = {
            population,
            info: refAlleleInfo[population]
              ? `${refAlleleSeq}=${refAlleleInfo[population]}`
              : `${refAlleleSeq}=N/A`,
          };
        });
        Object.keys(snp.alt_allele_freq).forEach((altAlleleSeq) => {
          Object.keys(snp.alt_allele_freq[altAlleleSeq]).forEach(
            (population) => {
              hitSnps[snp.rsid][populationIndex[population]].info += snp
                .alt_allele_freq[altAlleleSeq][population]
                ? `, ${altAlleleSeq}=${snp.alt_allele_freq[altAlleleSeq][population]}`
                : `, ${altAlleleSeq}=N/A`;
            }
          );
        });
      } else {
        hitSnps[snp.rsid][populationIndex[UNKNOWN_SOURCE]] = {
          population: UNKNOWN_SOURCE,
          info: `${refAlleleSeq}=N/A`,
        };
        Object.keys(snp.alt_allele_freq).forEach((altAlleleSeq) => {
          hitSnps[snp.rsid][
            populationIndex[UNKNOWN_SOURCE]
          ].info += `, ${altAlleleSeq}=N/A`;
        });
      }
      hitSnps[snp.rsid] = hitSnps[snp.rsid].filter(
        (value) => Object.keys(value).length !== 0
      );
    }
  });
  return hitSnps;
}
