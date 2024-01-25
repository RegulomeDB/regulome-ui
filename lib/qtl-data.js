import _ from "lodash";
import { ASSOCIATED_ORGAN_MAP } from "./chromatin-data";
import {
  TissueScoreHexColor,
  TissueScoreTailwindColor,
} from "./tissue-specific-score";

/**
 * This function get filtered QTL data
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
      return organsForDataset.some((organ) => organFilters.includes(organ));
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

/**
 * @param {*} organFilters before change
 * @param {*} organ the user clicks
 * @param {*} organList shown in body map
 * @param {*} enabledOrganList enabled for selecting
 * @returns the updated organ filter
 */
export function getOrganFilter(
  organFilters,
  organ,
  organList,
  enabledOrganList
) {
  let filters = [...organFilters];
  if (organList && enabledOrganList) {
    if (organList.includes(organ) && enabledOrganList.includes(organ)) {
      if (filters.includes(organ)) {
        if (organ in ASSOCIATED_ORGAN_MAP) {
          ASSOCIATED_ORGAN_MAP[organ].forEach((associatedOrgan) => {
            if (enabledOrganList.includes(associatedOrgan)) {
              filters = _.without(filters, associatedOrgan);
            }
          });
        }
        filters = _.without(filters, organ);
      } else {
        filters.push(organ);
        if (organ in ASSOCIATED_ORGAN_MAP) {
          ASSOCIATED_ORGAN_MAP[organ].forEach((associatedOrgan) => {
            if (
              enabledOrganList.includes(associatedOrgan) &&
              !filters.includes(associatedOrgan)
            ) {
              filters.push(associatedOrgan);
            }
          });
        }
      }
    }
  } else {
    filters = _.without(filters, organ);
  }
  return filters;
}
