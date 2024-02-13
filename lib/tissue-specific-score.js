import _ from "lodash";
import { ASSOCIATED_ORGAN_MAP } from "./chromatin-data";

export const TissueScoreTailwindColor = [
  "bg-green-50",
  "bg-green-100",
  "bg-green-200",
  "bg-green-300",
  "bg-green-400",
  "bg-green-500",
  "bg-green-600",
  "bg-green-700",
  "bg-green-800",
  "bg-green-900",
  "bg-green-950",
];
export const TissueScoreHexColor = [
  "#f0fdf4",
  "#dcfce7",
  "#bbf7d0",
  "#86efac",
  "#4ade80",
  "#22c55e",
  "#16a34a",
  "#15803d",
  "#166534",
  "#14532d",
  "#052e16",
];

/**
 * The tissue specific score is not normalized so it is hard to show the difference in body map.
 * @param {object} tissueSpecificScores before normalization
 * @returns normalized tissue specific score
 */
export function getNormalizedTissueSpecificScore(tissueSpecificScores) {
  const [min, max] = getScoreRange(tissueSpecificScores);
  const keys = Object.keys(tissueSpecificScores);
  const normalized = {};
  for (let i = 0; i < keys.length; i++) {
    const normalizedScore =
      max === min
        ? 0
        : Math.floor(
            ((tissueSpecificScores[keys[i]] - min) / (max - min)) * 10
          );
    normalized[keys[i]] =
      normalizedScore === 10
        ? [tissueSpecificScores[keys[i]], 9]
        : [tissueSpecificScores[keys[i]], normalizedScore];
  }
  return normalized;
}
/**
 * @param {obj} tissueSpecificScores contains scores for different tissue types
 * @returns an array contains the lowest and highest scores.
 */
export function getScoreRange(tissueSpecificScores) {
  const keys = Object.keys(tissueSpecificScores);
  let min = parseFloat(tissueSpecificScores[keys[0]]);
  let max = parseFloat(tissueSpecificScores[keys[0]]);
  for (let i = 1; i < keys.length; i++) {
    if (parseFloat(tissueSpecificScores[keys[i]]) < min)
      min = parseFloat(tissueSpecificScores[keys[i]]);
    else if (parseFloat(tissueSpecificScores[keys[i]]) > max)
      max = parseFloat(tissueSpecificScores[keys[i]]);
  }
  return [min, max];
}

/**
 * @param {object} data contains the datasets to update
 * @param {object} normalizedTissueSpecificScore to look up normalized tissue specific score
 * @returns data with tissue specific score in each dataset
 */
export function getDataWithTissueScore(data, normalizedTissueSpecificScore) {
  const datasets = data["@graph"];
  if (datasets?.length > 0) {
    const scores = data.regulome_score.tissue_specific_scores;
    datasets.forEach((dataset) => {
      const organs = dataset.biosample_ontology?.organ_slims
        ? dataset.biosample_ontology.organ_slims
        : [];
      if (organs.length > 0) {
        let organWithMaxScore = organs[0];
        let maxScore = scores[organWithMaxScore]
          ? parseFloat(scores[organWithMaxScore])
          : 0;

        organs.forEach((organ) => {
          if (scores[organ] && parseFloat(scores[organ]) > maxScore) {
            maxScore = parseFloat(scores[organ]);
            organWithMaxScore = organ;
          }
        });
        if (maxScore > 0) {
          dataset.tissue_specific_score = maxScore;
          dataset.normalized_tissue_specific_score =
            normalizedTissueSpecificScore[organWithMaxScore][1];
        }
      }
    });
    return datasets;
  }
  return [];
}

/**
 * This function get filtered data using organ filters
 * @param {Array} data all the data before filtering
 * @param {Array} organFilters a list of organs for filtering the data
 * @returns a list of filtered datasets
 */
export function getFilteredData(data, organFilters) {
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
 * @param {Array} data used to generate organ facet
 * @returns organ facet. Each organ is scored using its normalized tissue specific score. This score is used for coloring the body map.
 */
export function getOrganFacets(normalizedTissueSpecificScore) {
  const organs = Object.keys(normalizedTissueSpecificScore);
  const organFacet = {};
  organs.forEach((organ) => {
    organFacet[organ] = normalizedTissueSpecificScore[organ][1];
  });
  return organFacet;
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
