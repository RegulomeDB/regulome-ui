import _ from "lodash";
import { ChromatinStateColor } from "../components/chromatin-state-facets";

export const ASSOCIATED_ORGAN_MAP = {
  breast: ["mammary gland"],
  colon: ["large intestine"],
  gonad: ["ovary", "testis"],
  intestine: ["large intestine", "colon", "small intestine"],
  "large intestine": ["colon"],
  lung: ["bronchus"],
  skeleton: ["bone element"],
};

export const COMPLETE_ORGAN_LIST_GRCH38 = [
  "adrenal gland",
  "arterial blood vessel",
  "bone element",
  "brain",
  "breast",
  "bronchus",
  "colon",
  "esophagus",
  "eye",
  "gonad",
  "heart",
  "intestine",
  "kidney",
  "large intestine",
  "limb",
  "liver",
  "lung",
  "mammary gland",
  "mouth",
  "musculature of body",
  "nerve",
  "nose",
  "ovary",
  "pancreas",
  "penis",
  "prostate gland",
  "skeleton",
  "skin of body",
  "small intestine",
  "spinal cord",
  "spleen",
  "stomach",
  "testis",
  "thymus",
  "thyroid gland",
  "tongue",
  "ureter",
  "uterus",
  "urinary bladder",
  "vagina",
  "vein",
];
export const COMPLETE_ORGAN_LIST_HG19 = [
  "adrenal gland",
  "arterial blood vessel",
  "bone element",
  "brain",
  "colon",
  "esophagus",
  "gonad",
  "heart",
  "intestine",
  "kidney",
  "large intestine",
  "limb",
  "liver",
  "lung",
  "mammary gland",
  "musculature of body",
  "ovary",
  "pancreas",
  "penis",
  "skin of body",
  "small intestine",
  "spinal cord",
  "spleen",
  "stomach",
  "thymus",
  "uterus",
  "vein",
];

export const COMPLETE_CELLS_LIST_GRCH38 = [
  "adipose tissue",
  "blood",
  "blood vessel",
  "bone marrow",
  "connective tissue",
  "embryo",
  "epithelium",
  "lymphoid tissue",
  "lymph node",
  "lymphatic vessel",
  "placenta",
];
export const COMPLETE_CELLS_LIST_HG19 = [
  "adipose tissue",
  "blood",
  "blood vessel",
  "bone marrow",
  "connnective tissue",
  "embryo",
  "epithelium",
  "placenta",
];

export const mapChromatinNames = {
  EnhA1: "Active enhancer 1",
  EnhA2: "Active enhancer 2",
  EnhBiv: "Bivalent Enhancer",
  EnhG1: "Genic enhancer 1",
  EnhG2: "Genic enhancer 2",
  EnhWk: "Weak enhancer",
  Het: "Heterochromatin",
  Quies: "Quiescent/Low",
  ReprPC: "Repressed PolyComb",
  ReprPCWk: "Weak Repressed PolyComb",
  TssA: "Active TSS",
  TssBiv: "Bivalent/Poised TSS",
  TssFlnk: "Flanking TSS",
  TssFlnkD: "Flanking TSS downstream",
  TssFlnkU: "Flanking TSS upstream",
  Tx: "Strong transcription",
  TxWk: "Weak transcription",
  "ZNF/Rpts": "ZNF genes & repeats",

  Enh: "Enhancers",
  BivFlnk: "Flanking Bivalent TSS/Enh",
  TssAFlnk: "Flanking Active TSS",
  TxFlnk: "Transcr. at gene 5' and 3'",
  EnhG: "Genic enhancers",
};

export const SORTED_CHROMATIN_STATES_HG19 = [
  "Active TSS",
  "Flanking Active TSS",
  "Genic enhancers",
  "Enhancers",
  "Transcr. at gene 5' and 3'",
  "Strong transcription",
  "Weak transcription",
  "Bivalent/Poised TSS",
  "Flanking Bivalent TSS/Enh",
  "Bivalent Enhancer",
  "ZNF genes & repeats",
  "Repressed PolyComb",
  "Weak Repressed PolyComb",
  "Heterochromatin",
  "Quiescent/Low",
];

export const SORTED_CHROMATIN_STATES_GRCH38 = [
  "Active TSS",
  "Flanking TSS",
  "Flanking TSS downstream",
  "Flanking TSS upstream",
  "Active enhancer 1",
  "Active enhancer 2",
  "Weak enhancer",
  "Genic enhancer 1",
  "Genic enhancer 2",
  "Strong transcription",
  "Weak transcription",
  "Bivalent/Poised TSS",
  "Bivalent enhancer",
  "ZNF genes & repeats",
  "Weak Repressed PolyComb",
  "Repressed PolyComb",
  "Heterochromatin",
  "Quiescent/Low",
];

export function isLetter(c) {
  return c.toLowerCase() !== c.toUpperCase();
}

export function getChromatinData(data) {
  const filteredData = data.filter((d) => d.method === "chromatin state");
  const chromatinData = [];
  if (filteredData.length > 1) {
    for (let i = 0; i < filteredData.length; i++) {
      const dataset = {};
      const chromatinState = !isLetter(filteredData[i].value[0])
        ? filteredData[i].value.replace(/[^A-Za-z]+/g, "")
        : filteredData[i].value;
      dataset.chromatin_state = mapChromatinNames[chromatinState];
      dataset.organ =
        filteredData[i].biosample_ontology?.organ_slims?.join(", ") || "";
      dataset.biosample = filteredData[i].biosample_ontology
        ? filteredData[i].biosample_ontology.term_name
        : "";
      dataset.biosample_classification = filteredData[i].biosample_ontology
        ? filteredData[i].biosample_ontology.classification
        : "";
      dataset.dataset = filteredData[i].dataset;
      dataset.file = filteredData[i].file;
      chromatinData[i] = dataset;
    }
  }
  return chromatinData;
}

export function getStateFacets(data, assembly) {
  const uniqueStates = [...new Set(data.map((item) => item.chromatin_state))];
  const order =
    assembly === "hg19"
      ? SORTED_CHROMATIN_STATES_HG19
      : SORTED_CHROMATIN_STATES_GRCH38;
  const sortedStates = [];
  order.forEach((state) => {
    if (uniqueStates.includes(state)) {
      sortedStates.push(state);
    }
  });

  return sortedStates;
}

export function getOrganFacets(data, assembly) {
  const order =
    assembly === "hg19"
      ? SORTED_CHROMATIN_STATES_HG19
      : SORTED_CHROMATIN_STATES_GRCH38;
  const uniqueOrgansWithSates = {};
  data.forEach((dataset) => {
    const organs = dataset.organ.split(", ").filter((e) => {
      return e;
    });
    const state = dataset.chromatin_state;
    organs.forEach((organ) => {
      if (organ in uniqueOrgansWithSates) {
        if (!uniqueOrgansWithSates[organ].includes(state)) {
          uniqueOrgansWithSates[organ].push(state);
        }
      } else {
        uniqueOrgansWithSates[organ] = [state];
      }
    });
  });
  const sorted = {};
  Object.keys(uniqueOrgansWithSates).forEach((organ) => {
    const sortedStates = [];
    order.forEach((state) => {
      if (uniqueOrgansWithSates[organ].includes(state)) {
        sortedStates.push(state);
      }
    });
    sorted[organ] = sortedStates;
  });

  return sorted;
}

export function getStatesbyOrgans(organFilters, data, assembly) {
  const states = [];
  const order =
    assembly === "hg19"
      ? SORTED_CHROMATIN_STATES_HG19
      : SORTED_CHROMATIN_STATES_GRCH38;
  data.forEach((dataset) => {
    const organsForDataset = dataset.organ.split(", ").filter((e) => {
      return e;
    });
    let hasOrgan = false;
    for (let j = 0; j < organsForDataset.length; j++) {
      if (organFilters.includes(organsForDataset[j])) {
        hasOrgan = true;
        break;
      }
    }
    if (hasOrgan && !states.includes(dataset.chromatin_state)) {
      states.push(dataset.chromatin_state);
    }
  });

  const sortedStates = [];
  order.forEach((state) => {
    if (states.includes(state)) {
      sortedStates.push(state);
    }
  });
  return sortedStates;
}

export function getOrgansByStates(statesFilters, data) {
  const organs = [];
  data.forEach((dataset) => {
    const state = dataset.chromatin_state;
    if (statesFilters.includes(state)) {
      const organsForDataset = dataset.organ.split(", ").filter((e) => {
        return e;
      });
      organsForDataset.forEach((organ) => {
        if (!organs.includes(organ)) {
          organs.push(organ);
        }
      });
    }
  });
  return organs;
}

export function filterDataByStateAndOrgan(data, stateFilters, organFilters) {
  let filteredData = data;

  if (stateFilters.length !== 0) {
    filteredData = filteredData.filter((dataset) => {
      return stateFilters.includes(dataset.chromatin_state);
    });
  }

  if (organFilters.length !== 0) {
    filteredData = filteredData.filter((dataset) => {
      const organs = dataset.organ.split(", ").filter((e) => {
        return e;
      });
      let isSelected = false;
      organFilters.forEach((organ) => {
        if (organs.includes(organ)) {
          isSelected = true;
          return;
        }
      });
      return isSelected;
    });
  }

  return filteredData;
}

/**
 * Return a list of organs for a set of data. Some organs are the same, we will just combine them.
 * for example: colon and large intestine are the same thing, will just use colon.
 * Skeleton and bone element will change to bone element.
 * Some organ actually is parent of several organ,
 * for example gonad will be skipped since it is testis and ovary.
 * intestine will be skipped since it is colon and small intestine
 * @param {*} data date to get the list of organs
 * @returns a list of organs
 */
export function getEnabledOrganList(data) {
  const organList = [];
  data.forEach((dataset) => {
    const organs = dataset.organ.split(", ").filter((e) => {
      return e;
    });
    organs.forEach((organ) => {
      if (!organList.includes(organ)) {
        organList.push(organ);
      }
    });
  });
  organList.sort();
  return organList;
}

export function getFillColor(facet, stateFilters, organFilters, organ) {
  // const isOrganSelected = organFilters.length === 0 || organFilters.includes(organ);
  let fill = "white";
  if (organ in facet) {
    if (stateFilters.length === 0) {
      fill = ChromatinStateColor[facet[organ][0]].hex;
    } else {
      for (let i = 0; i < facet[organ].length; i++) {
        if (stateFilters.includes(facet[organ][i])) {
          fill = ChromatinStateColor[facet[organ][i]].hex;
          break;
        }
      }
    }
  }
  return fill;
}

export function getFillColorTailwind(facet, stateFilters, organ) {
  // const isOrganSelected = organFilters.length === 0 || organFilters.includes(organ);
  let fill = "white";
  if (organ in facet) {
    if (stateFilters.length === 0) {
      fill = ChromatinStateColor[facet[organ][0]].tailwind;
    } else {
      for (let i = 0; i < facet[organ].length; i++) {
        if (stateFilters.includes(facet[organ][i])) {
          fill = ChromatinStateColor[facet[organ][i]].tailwind;
          break;
        }
      }
    }
  }
  return fill;
}

export function getBiosampleFacets(data, assembly) {
  const order =
    assembly === "hg19"
      ? SORTED_CHROMATIN_STATES_HG19
      : SORTED_CHROMATIN_STATES_GRCH38;
  const facets = data.reduce((accumulator, dataset) => {
    const biosample = dataset.biosample;
    const state = dataset.chromatin_state;
    if (biosample in accumulator) {
      accumulator[biosample].states[state] += 1;
    } else {
      accumulator[biosample] = {
        biosample,
        organ: dataset.organ,
        states: order.reduce((acc, curr) => ((acc[curr] = 0), acc), {}),
      };
      accumulator[biosample].states[state] = 1;
    }
    return accumulator;
  }, {});
  const sortedFacets = _.sortBy(facets, ["organ", "biosample"]);
  return sortedFacets;
}
