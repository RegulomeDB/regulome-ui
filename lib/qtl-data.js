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

export function getFillColorTailwind(facets, organ) {
  const fill = organ in facets ? TissueScoreTailwindColor[facets[organ]] : null;
  return fill;
}

export function getFillColorHex(facets, organ) {
  const fill = organ in facets ? TissueScoreHexColor[facets[organ]] : "white";
  return fill;
}
