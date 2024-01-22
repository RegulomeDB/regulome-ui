export function getDataWithTissueScore(data) {
  const datasets = data["@graph"];
  if (datasets?.length > 0) {
    const scores = data.regulome_score.tissue_specific_scores;
    const keys = Object.keys(scores);
    let min = parseFloat(scores[keys[0]]); // ignoring case of empty list for conciseness
    let max = parseFloat(scores[keys[0]]);
    for (let i = 1; i < keys.length; i++) {
      if (parseFloat(scores[keys[i]]) < min) min = scores[keys[i]];
      else if (parseFloat(scores[keys[i]]) > max) max = scores[keys[i]];
    }
    datasets.forEach((dataset) => {
      const organs = dataset.biosample_ontology?.organ_slims
        ? dataset.biosample_ontology.organ_slims
        : [];
      if (organs.length > 0) {
        let score = 0;
        organs.forEach((organ) => {
          if (scores[organ] && parseFloat(scores[organ]) > score) {
            score = parseFloat(scores[organ]);
          }
        });
        if (score >= 0) {
          dataset.tissue_specific_score = score;
          dataset.normalized_tissue_specific_score = Math.round(
            ((score - min) / (max - min)) * 10
          );
        }
      }
    });
    return datasets;
  }
  return [];
}
