/**
 * Check if the regions for query are valid.
 * @param {Array} regions array of regions to validate
 * @returns {boolean} True if all regions are valid. False if any of the regions is not valid
 */
export default function validateRegions(regions) {
  const chrRegionPattern = new RegExp(
    "^(chr[1-9]|chr1[0-9]|chr2[0-2]|chrx|chry):[0-9]+-[0-9]+$"
  );
  const rsidPattern = new RegExp("^rs[0-9]+$");
  for (let i = 0, max = regions.length; i < max; i++) {
    if (!chrRegionPattern.test(regions[i]) && !rsidPattern.test(regions[i])) {
      return false;
    }
  }
  return true;
}
