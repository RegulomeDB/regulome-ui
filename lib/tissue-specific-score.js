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
  const keys = Object.keys(tissueSpecificScores);
  let min = parseFloat(tissueSpecificScores[keys[0]]);
  let max = parseFloat(tissueSpecificScores[keys[0]]);
  for (let i = 1; i < keys.length; i++) {
    if (parseFloat(tissueSpecificScores[keys[i]]) < min)
      min = tissueSpecificScores[keys[i]];
    else if (parseFloat(tissueSpecificScores[keys[i]]) > max)
      max = tissueSpecificScores[keys[i]];
  }
  const normalized = {};
  for (let i = 0; i < keys.length; i++) {
    normalized[keys[i]] =
      max === min
        ? 0
        : Math.round(
            ((tissueSpecificScores[keys[i]] - min) / (max - min)) * 10
          );
  }
  return normalized;
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
            normalizedTissueSpecificScore[organWithMaxScore];
        }
      }
    });
    return datasets;
  }
  return [];
}
