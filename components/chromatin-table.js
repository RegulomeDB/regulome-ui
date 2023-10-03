// node_modules
import PropTypes from "prop-types";
// components
import { DataGridContainer } from "./data-grid";
import SortableGrid from "./sortable-grid";

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

const chromatinDataColumns = [
  {
    id: "chromatin_state",
    title: "Chromatin state",
  },

  {
    id: "biosample",
    title: "Biosample",
  },
  {
    id: "biosample_classification",
    title: "Classification",
  },
  {
    id: "organ",
    title: "Organ",
  },
  {
    id: "dataset",
    title: "Dataset",
    display: ({ source }) => (
      <a href={source.dataset}>{source.dataset.split("/")[4]}</a>
    ),
  },
  {
    id: "file",
    title: "File",
    display: ({ source }) => (
      <a href={`https://encodeproject.org/files/${source.file}/`}>
        {source.file}
      </a>
    ),
  },
];

/**
 * Display a sortable table of the given accessibility data.
 * The data can be filtered by biosample term name.
 */
export default function ChromatinTable({ data }) {
  return (
    <DataGridContainer>
      <SortableGrid data={data} columns={chromatinDataColumns} />
    </DataGridContainer>
  );
}

ChromatinTable.propTypes = {
  // data to display
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
