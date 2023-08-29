/**
 * This function de-dups overlapping peaks in datasets
 * @param {Array} datasets list of datasets to filter
 * @returns {Array} Return datasets after filtering
 */
export default function filterOverlappingPeaks(datasets) {
  let filteredDatasets = [];
  if (datasets.length > 0) {
    // we want to keep the wider peaks in each dataset
    // if the start & end positions are the same we will keep the one with the strongest signal
    // sort all peaks by dataset ids -> start positions in ascending order -> end positions in descending order -> signals in descending order
    datasets.sort(
      (a, b) =>
        a.dataset_rel.localeCompare(b.dataset_rel) ||
        a.start - b.start ||
        b.end - a.end ||
        b.value - a.value
    );
    //keep the peak if it is the first peak in a new dataset or if it is not within the previous peak
    filteredDatasets = datasets.reduce((accumulator, dataset) => {
      const lastDatasetRef = accumulator[accumulator.length - 1]?.dataset_rel;
      const lastDatasetEnd = accumulator[accumulator.length - 1]?.end;
      if (
        dataset.dataset_rel !== lastDatasetRef ||
        dataset.end > lastDatasetEnd
      ) {
        return accumulator.concat(dataset);
      }
      return accumulator;
    }, []);
  }
  return filteredDatasets;
}
