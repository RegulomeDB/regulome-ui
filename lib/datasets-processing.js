import _ from "lodash";
import filterOverlappingPeaks from "./filter-overlapping-peaks";

/**
 * To get the files for genome browser, filter the datasets to get all the experiments,
 * then get the indexed files from experiments. We also getting metadata from the dataset for files.
 * @param {Array} datasets to get files
 * @returns a list of files
 */
export function getFilesForGenomeBrowser(datasets) {
  const duplicatedExperimentDatasets = datasets.filter((d) =>
    d.dataset.includes("experiment")
  );
  // for some reason we are getting duplicates here so we need to filter those out
  const experimentDatasets = _.uniqBy(duplicatedExperimentDatasets, "dataset");
  experimentDatasets.sort((a, b) => (a.method > b.method ? 1 : -1));
  // genome browser files
  let filesForGenomeBrowser = [];
  experimentDatasets.forEach((dataset) => {
    const files = dataset.files_for_genome_browser;
    let target = "";
    // use target labels instead of gene symbols for histone ChIP-seq targets
    if (dataset.method === "Histone ChIP-seq") {
      target = dataset.target_label ? dataset.target_label : "";
    } else {
      target = dataset.targets ? dataset.targets.join(", ") : "";
    }
    for (let i = 0; i < files.length; i++) {
      files[i].assay_term_name = dataset.method;
      files[i].biosample_ontology = dataset.biosample_ontology;
      files[i].file_format = files[i].href.split(".")[1];
      files[i].dataset = dataset.dataset_rel;
      files[i].title = files[i].accession;
      files[i].target = target;
      files[i].biosample = dataset.biosample_ontology.term_name || "";
      files[i].assay = dataset.method || "";
      files[i].organ =
        dataset.biosample_ontology.classification === "tissue"
          ? dataset.biosample_ontology.organ_slims.join(", ")
          : dataset.biosample_ontology.cell_slims.join(", ");
    }
    filesForGenomeBrowser = filesForGenomeBrowser.concat(
      dataset.files_for_genome_browser
    );
  });
  return filesForGenomeBrowser;
}

/**
 * @param {Array} datasets need to be filtered
 * @returns filtered accessibility datasets
 */
export function getAccessibilityDatasets(datasets) {
  return filterOverlappingPeaks(
    datasets.filter(
      (d) =>
        d.method === "FAIRE-seq" ||
        d.method === "DNase-seq" ||
        d.method === "ATAC-seq"
    )
  );
}

/**
 * @param {Array} datasets need to be filtered
 * @returns filtered chip datasets
 */
export function getChipDatasets(datasets) {
  return filterOverlappingPeaks(
    datasets.filter((d) => d.method === "ChIP-seq")
  );
}

/**
 * @param {Array} datasets need to be filtered
 * @returns filtered qtl datasets
 */
export function getQtlDatasets(datasets) {
  return datasets.filter((d) => d.method && d.method.indexOf("QTL") !== -1);
}
