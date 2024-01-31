const CHR_GRCH38 = [
  "NC_000001.11",
  "NC_000002.12",
  "NC_000003.12",
  "NC_000004.12",
  "NC_000005.10",
  "NC_000006.12",
  "NC_000007.14",
  "NC_000008.11",
  "NC_000009.12",
  "NC_000010.11",
  "NC_000011.10",
  "NC_000012.12",
  "NC_000013.11",
  "NC_000014.9",
  "NC_000015.10",
  "NC_000016.10",
  "NC_000017.11",
  "NC_000018.10",
  "NC_000019.10",
  "NC_000020.11",
  "NC_000021.9",
  "NC_000022.11",
  "NC_000023.11",
  "NC_000024.10",
];
const CHR_GRCH37 = [
  "NC_000001.10",
  "NC_000002.11",
  "NC_000003.11",
  "NC_000004.11",
  "NC_000005.9",
  "NC_000006.11",
  "NC_000007.13",
  "NC_000008.10",
  "NC_000009.11",
  "NC_000010.10",
  "NC_000011.9",
  "NC_000012.11",
  "NC_000013.10",
  "NC_000014.8",
  "NC_000015.9",
  "NC_000016.9",
  "NC_000017.10",
  "NC_000018.9",
  "NC_000019.9",
  "NC_000020.10",
  "NC_000021.9",
  "NC_000022.10",
  "NC_000023.10",
  "NC_000024.9",
];
const chrRegionPattern = new RegExp(
  "^(chr[1-9]|chr1[0-9]|chr2[0-2]|chrx|chry):[0-9]+-[0-9]+$"
);
const rsidPattern = new RegExp("^rs[0-9]+$");
const hgvsPattern = new RegExp(
  "^:g.[0-9]+(A|C|G|T|U|R|Y|K|M|S|W|B|D|H|V|N)>(A|C|G|T|U|R|Y|K|M|S|W|B|D|H|V|N)"
);
const spdiPattern = new RegExp(
  "^:[0-9]+:(A|C|G|T|U|R|Y|K|M|S|W|B|D|H|V|N):(A|C|G|T|U|R|Y|K|M|S|W|B|D|H|V|N)"
);

/**
 * Check if the regions for query are valid.
 * @param {Array} regions array of regions to validate
 * @param {string} assembly for the regions
 * @returns {boolean} True if all regions are valid. False if any of the regions is not valid
 */
export function validateRegions(regions, assembly) {
  return regions.every((region) => validateRegion(region, assembly));
}

/**
 * Check if the single region for query is valid.
 * @param {string} region to validate
 * @param {string} assembly for the region
 * @returns {boolean} True if the region is valid. False if not valid.
 */
export function validateRegion(region, assembly) {
  // check if the region is coordinates or rsid
  if (chrRegionPattern.test(region) || rsidPattern.test(region)) {
    return true;
  }
  const tokens = region.split(":");
  // check if the chromosome id is allowed
  if (
    (assembly === "GRCh38" && CHR_GRCH38.includes(tokens[0])) ||
    (assembly === "hg19" && CHR_GRCH37.includes(tokens[0]))
  ) {
    const suffix = region.substring(tokens[0].length, region.length);
    // check if it is a valid hgvs or spdi
    if (hgvsPattern.test(suffix) || spdiPattern.test(suffix)) {
      return true;
    }
  }
  return false;
}
