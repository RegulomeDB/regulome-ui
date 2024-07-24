const keyOrder = [
  "bravo_af",
  "gnomad_af_total",
  "gnomad_af_afr",
  "gnomad_af_afr_female",
  "gnomad_af_afr_male",
  "gnomad_af_ami",
  "gnomad_af_ami_female",
  "gnomad_af_ami_male",
  "gnomad_af_amr",
  "gnomad_af_amr_female",
  "gnomad_af_amr_male",
  "gnomad_af_asj",
  "gnomad_af_asj_female",
  "gnomad_af_asj_male",
  "gnomad_af_eas",
  "gnomad_af_eas_female",
  "gnomad_af_eas_male",
  "gnomad_af_female",
  "gnomad_af_fin",
  "gnomad_af_fin_female",
  "gnomad_af_fin_male",
  "gnomad_af_male",
  "gnomad_af_nfe",
  "gnomad_af_nfe_female",
  "gnomad_af_nfe_male",
  "gnomad_af_oth",
  "gnomad_af_oth_female",
  "gnomad_af_oth_male",
  "gnomad_af_sas",
  "gnomad_af_sas_male",
  "gnomad_af_sas_female",
  "gnomad_af_raw",
];
/**
 * This function takes a list of frequnce sources and returns a sorted list of sources.
 * @param {Array} freqKeys - A list of frequency sources
 * @returns A sorted list of frequency sources
 */
export function getSortedFreqKeys(freqKeys) {
  // Sort the freqKeys array based on the index of each key in the keyOrder array
  const sortedKeys = freqKeys.sort((a, b) => {
    const indexA = keyOrder.indexOf(a);
    const indexB = keyOrder.indexOf(b);

    return indexA - indexB;
  });

  return sortedKeys;
}

/**
 * This function check if the region queries contain long regions that are longer than 1bp.
 * It will return a message if the region is longer than 1bp.
 * Otherwise, it will return an empty string
 * @param {Array} regionQueries a list of region query strings
 * @param {*} source the source of the frequency
 * @param {*} maf minor allele frequency
 * @returns a message if the region is longer than 1bp, otherwise an empty string
 */
export function getMafNote(regionQueries, source, maf) {
  const sourcePre = source.split("_")[0].toUpperCase();
  const chrRegionPattern = new RegExp(
    "^(chr[1-9]|chr1[0-9]|chr2[0-2]|chrx|chry):[0-9]+-[0-9]+$"
  );

  let hasLongRegion = false;
  for (const region of regionQueries) {
    if (chrRegionPattern.test(region)) {
      const regionParts = region.split(/:|-/);
      const start = parseInt(regionParts[1]);
      const end = parseInt(regionParts[2]);
      if (end - start > 1) {
        hasLongRegion = true;
        break;
      }
    }
  }
  if (hasLongRegion) {
    return ` Regions > 1bp have been filtered to variants with a ${sourcePre} frequency of >= ${maf}.`;
  }
  return "";
}
