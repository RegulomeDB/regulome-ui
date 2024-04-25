import _ from "lodash";
import { ASSOCIATED_ORGAN_MAP } from "./chromatin-data";
import colors from "tailwindcss/colors";

export const TissueScoreFillColor = [
  "fill-sky-500",
  "fill-sky-400",
  "fill-sky-300",
  "fill-sky-200",
  "fill-sky-100",
  "fill-green-100",
  "fill-green-200",
  "fill-green-300",
  "fill-green-400",
  "fill-green-500",
  "fill-green-600",
];
export const TissueScoreBackgroundColor = [
  "bg-sky-500",
  "bg-sky-400",
  "bg-sky-300",
  "bg-sky-200",
  "bg-sky-100",
  "bg-green-100",
  "bg-green-200",
  "bg-green-300",
  "bg-green-400",
  "bg-green-500",
  "bg-green-600",
];

export const TissueScoreBarColor = [
  colors.sky[500],
  colors.sky[400],
  colors.sky[300],
  colors.sky[200],
  colors.sky[100],
  colors.green[100],
  colors.green[200],
  colors.green[300],
  colors.green[400],
  colors.green[500],
  colors.green[600],
];

/**
 * The tissue specific score is not normalized so it is hard to show the difference in body map.
 * After liner normalization, the lowest score is 1, the highest score is 10.
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
        : Math.ceil(((tissueSpecificScores[keys[i]] - min) / (max - min)) * 10);
    normalized[keys[i]] =
      normalizedScore === 0
        ? [tissueSpecificScores[keys[i]], 1]
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
          dataset.tissue_specific_score_color =
            TissueScoreBackgroundColor[
              dataset.normalized_tissue_specific_score
            ];
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
 * @param {object} normalizedTissueSpecificScore used to generate organ facet
 * @returns organ facet. Each organ is scored using its normalized tissue specific score. This score is used for coloring the body map.
 */
export function getOrganFacetsForTissueScore(normalizedTissueSpecificScore) {
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
export function getFillColorTissueScore(facets, organ) {
  const fill =
    organ in facets ? TissueScoreFillColor[facets[organ]] : "fill-white";
  return fill;
}

/**
 * @param {object} facets to get the score for the target organ
 * @param {string} organ to fill color
 * @returns the background color in tailwind
 */
export function getBackgroundColorTissueScore(facets, organ) {
  const fill =
    organ in facets ? TissueScoreBackgroundColor[facets[organ]] : null;
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
