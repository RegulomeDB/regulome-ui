/**
 * This function de-dups overlapping peaks in each dataset from ChIP, DNase and ATAC-seq assays.
 * @param {Array} Datasets list of datasets to filter
 * @returns {Array} Return an array. Array[0] si DatasetsFiltered: datasets after filtering. Array[1] is DatasetsFilteredCount: the number of datasets that are filtered out.
 */
export default function filterOverlappingPeaks(Datasets) {
  const DatasetsFiltered = [];
  let DatasetsFilteredCount = 0;
  if (Datasets.length > 0) {
    // we want to keep the wider peaks in each dataset
    // if the start & end positions are the same we will keep the one with the strongest signal
    // sort all peaks by dataset ids -> start positions in ascending order -> end positions in descending order -> signals in descending order
    Datasets.sort(
      (a, b) =>
        a.dataset_rel.localeCompare(b.dataset_rel) ||
        a.start - b.start ||
        b.end - a.end ||
        b.value - a.value
    );
    // keep the peak if it is the first peak in a new dataset or if it is not within the previous peak
    DatasetsFiltered.push(Datasets[0]);
    let lastDataset = Datasets[0].dataset_rel;
    let lastEnd = Datasets[0].end;
    for (let i = 1; i < Datasets.length; i += 1) {
      if (
        Datasets[i].dataset_rel !== lastDataset ||
        Datasets[i].end > lastEnd
      ) {
        DatasetsFiltered.push(Datasets[i]);
        lastDataset = Datasets[i].dataset_rel;
        lastEnd = Datasets[i].end;
      } else {
        DatasetsFilteredCount += 1;
      }
    }
  }
  return [DatasetsFiltered, DatasetsFilteredCount];
}
