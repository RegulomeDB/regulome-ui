import {
  TissueScoreHexColor,
  TissueScoreTailwindColor,
} from "./tissue-specific-score";

/**
 * This function get filterred QTL data
 * @param {Array} data all the QTL data
 * @param {Array} organFilters a list of organs for filtering the data
 * @returns a list of QTL datasets
 */
export function getFilteredQtlData(data, organFilters) {
  let filteredData = data;
  if (organFilters.length > 0) {
    filteredData = filteredData.filter((dataset) => {
      const organsForDataset = dataset.biosample_ontology?.organ_slims
        ? dataset.biosample_ontology.organ_slims
        : [];
      let hasOrgan = false;
      for (let j = 0; j < organsForDataset.length; j++) {
        if (organFilters.includes(organsForDataset[j])) {
          hasOrgan = true;
          break;
        }
      }
      return hasOrgan;
    });
  }
  return filteredData;
}

/**
 * @param {Array} data QTL data
 * @returns organ facet. Each organ is scored using its normalized tissue specific score. This score is used for coloring the body map.
 */
export function getOrganFacets(data) {
  const organScores = {};
  data.forEach((dataset) => {
    const organs = dataset.biosample_ontology?.organ_slims
      ? dataset.biosample_ontology.organ_slims
      : [];
    const score = dataset.normalized_tissue_specific_score;
    organs.forEach((organ) => {
      if (organ in organScores) {
        if (organScores[organ] < score) {
          organScores[organ] = score;
        }
      } else {
        organScores[organ] = [score];
      }
    });
  });
  return organScores;
}

/**
 * @param {object} facets to get the score for the target organ
 * @param {string} organ to fill color
 * @returns the color in tailwind
 */
export function getFillColorTailwind(facets, organ) {
  const fill = organ in facets ? TissueScoreTailwindColor[facets[organ]] : null;
  return fill;
}

/**
 * @param {object} facets to get the score for the target organ
 * @param {string} organ to fill color
 * @returns the color in hex
 */
export function getFillColorHex(facets, organ) {
  const fill = organ in facets ? TissueScoreHexColor[facets[organ]] : "white";
  return fill;
}
