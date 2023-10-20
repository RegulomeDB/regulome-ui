import PropTypes from "prop-types";
import { Tooltip, Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { ArrowUturnLeftIcon } from "@heroicons/react/20/solid";
import { BrowserFeat } from "./browserfeat";

const colorCCREs = {
  "Promoter-like": "#ff0000",
  "Proximal enhancer-like": "#ffa700",
  "Distal enhancer-like": "#ffcd00",
  "DNase-H3K4me3": "#ffaaaa",
  "CTCF-only": "#00b0f0",
  "DNase-only": "#06da93",
  "Low-DNase": "#ffffff",
};

const colorGenome = {
  "Nucleobase A": "#0c7489",
  "Nucleobase T": "#f9ce70",
  "Nucleobase G": "#0fa3b1",
  "Nucleobase C": "#c14953",
  "GC-low": "#0c7489",
  "GC-rich": "#f9ce70",
};

const colorGenes = {
  Transcript: "#cfd7c7",
  "Protein coding": "#575f5a",
  "Non-protein coding": "#f9ce70",
  UTR: "#c14953",
};

const PINNED_FILES_GRCH38 = [
  {
    file_format: "vdna-dir",
    href: "https://encoded-build.s3.amazonaws.com/browser/GRCh38/GRCh38.vdna-dir",
  },
  {
    file_format: "vgenes-dir",
    href: "https://encoded-build.s3.amazonaws.com/browser/GRCh38/GRCh38.vgenes-dir",
    title: "GENCODE V29",
  },
  {
    title: "dbSNP (153)",
    file_format: "variant",
    path: "https://encoded-build.s3.amazonaws.com/browser/GRCh38/GRCh38-dbSNP153.vvariants-dir",
  },
  {
    file_format: "bigBed",
    path: "https://encode-public.s3.amazonaws.com/2021/09/08/2f6c22f7-8479-4107-8e1e-e11be8e86da6/ENCFF998GAH.bigBed",
    dataset: "/annotations/ENCSR890YQQ/",
    title: "representative DNase hypersensitivity sites",
  },
  {
    file_format: "bigBed",
    path: "https://encode-public.s3.amazonaws.com/2021/09/08/67d00c9a-6924-4a86-a592-7bfab4ecb2ad/ENCFF081NFZ.bigBed",
    dataset: "/annotations/ENCSR487PRC/",
    title: "cCRE, all",
  },
];

const PINNED_FILES_HG19 = [
  {
    file_format: "vdna-dir",
    href: "https://encoded-build.s3.amazonaws.com/browser/hg19/hg19.vdna-dir",
  },
  {
    file_format: "vgenes-dir",
    href: "https://encoded-build.s3.amazonaws.com/browser/hg19/hg19.vgenes-dir",
    title: "GENCODE V29",
  },
  {
    title: "dbSNP (153)",
    file_format: "variant",
    path: "https://encoded-build.s3.amazonaws.com/browser/hg19/hg19-dbSNP153.vvariants-dir",
  },
];

/**
 * Display the legend for genome browser
 */
export function GenomeLegend() {
  return (
    <div class="grid justify-items-end pb-4">
      <Tooltip
        content={
          <div className="bg-white border border-gray-400 grid grid-cols-3">
            <div>
              <strong>Genome</strong>
              {Object.keys(colorGenome).map((nucleobase) => (
                <div className="flex space-x-1" key={nucleobase}>
                  <div
                    className="h-5 w-5"
                    style={{ background: `${colorGenome[nucleobase]}` }}
                  />
                  <div className="legend-label">{nucleobase}</div>
                </div>
              ))}
            </div>
            <div>
              <strong>Genes</strong>
              {Object.keys(colorGenes).map((gene) => (
                <div className="flex space-x-1" key={gene}>
                  <div
                    className="h-5 w-5"
                    style={{ background: `${colorGenes[gene]}` }}
                  />
                  <div className="legend-label">{gene}</div>
                </div>
              ))}
            </div>
            <div>
              <strong>CCREs</strong>
              {Object.keys(colorCCREs).map((ccre) => (
                <div className="flex space-x-1" key={ccre}>
                  <div
                    className={`h-5 w-5 legend-swatch ${
                      colorCCREs[ccre] === "#ffffff"
                        ? "border border-gray-400"
                        : ""
                    }`}
                    style={{ background: `${colorCCREs[ccre]}` }}
                  />
                  <div className="legend-label">{ccre}</div>
                </div>
              ))}
            </div>
          </div>
        }
        placement={"left-start"}
      >
        <Button>
          <div className="flex space-x-2">
            <div className="grid row-2">
              <div className="flex">
                <div
                  className="h-3 w-3"
                  style={{ background: `${colorGenome["Nucleobase A"]}` }}
                />
                <div
                  className="h-3 w-3"
                  style={{ background: `${colorGenome["Nucleobase T"]}` }}
                />
              </div>

              <div className="flex">
                <div
                  className="h-3 w-3"
                  style={{ background: `${colorGenome["Nucleobase C"]}` }}
                />
                <div
                  className="h-3 w-3"
                  style={{ background: `${colorGenome["Nucleobase G"]}` }}
                />
              </div>
            </div>
            <div>Legend</div>
          </div>
        </Button>
      </Tooltip>
    </div>
  );
}

/**
 * Display a label for a file’s track.
 */
function TrackLabel({ file, assembly, long }) {
  let fileLabel = "";
  let datasetLabel = "";

  if (file.href) {
    fileLabel = file.href.split("/@@download/")[0].split("/files/")[1];
  }

  if (file.dataset) {
    datasetLabel = file.dataset.split("/")[2];
  }

  const pinnedFile =
    file.file_format === "variant" ||
    file.file_format === "vgenes-dir" ||
    file.file_format === "vdna-dir" ||
    file.title === "representative DNase hypersensitivity sites" ||
    file.title === "cCRE, all";

  return (
    <div>
      {file.name ? (
        <span>{file.name}</span>
      ) : pinnedFile && file.title ? (
        <span>{file.title}</span>
      ) : file.file_format === "bigWig" ? (
        <span>
          {file.target ? `${file.target} - ` : ""}
          {file.assay_term_name} -{" "}
          {file.biosample_ontology ? file.biosample_ontology.term_name : ""}
        </span>
      ) : file.file_format === "vdna-dir" ? (
        <span>{assembly}</span>
      ) : (
        <span>
          {file.target ? `${file.target} - ` : ""}
          {file.assay_term_name} -{" "}
          {file.biosample_ontology.term_name
            ? file.biosample_ontology.term_name
            : ""}
        </span>
      )}
      {file.href && !pinnedFile && long ? (
        <div>
          File:{" "}
          <a
            href={`http://encodeproject.org${
              file.href.split("/@@download/")[0]
            }`}
          >
            {fileLabel}
          </a>
        </div>
      ) : null}
      {file.dataset && !pinnedFile && long ? (
        <div>
          Dataset:{" "}
          <a href={`http://encodeproject.org${file.dataset}`}>{datasetLabel}</a>
        </div>
      ) : null}
    </div>
  );
}

TrackLabel.propTypes = {
  /** File object being displayed in the track */
  file: PropTypes.object.isRequired,
  /** File object being displayed in the track */
  assembly: PropTypes.string.isRequired,
  long: PropTypes.bool,
};

function filesToTracks(files, assembly) {
  const tracks = files.map((file) => {
    if (file.name) {
      const trackObj = {};
      trackObj.name = <TrackLabel file={file} assembly={assembly} />;
      trackObj.longname = <TrackLabel file={file} assembly={assembly} long />;
      trackObj.type = "signal";
      trackObj.path = file.href;
      trackObj.heightPx = 50;
      trackObj.expandable = true;
      return trackObj;
    }
    if (file.file_format === "bigWig") {
      const trackObj = {};
      trackObj.name = <TrackLabel file={file} assembly={assembly} />;
      trackObj.longname = <TrackLabel file={file} assembly={assembly} long />;
      trackObj.type = "signal";
      trackObj.path = file.cloud_metadata_url;
      trackObj.heightPx = 50;
      trackObj.expandable = true;
      return trackObj;
    }
    if (file.file_format === "vdna-dir") {
      const trackObj = {};
      trackObj.name = <TrackLabel file={file} assembly={assembly} />;
      trackObj.type = "sequence";
      trackObj.path = file.href;
      trackObj.heightPx = 50;
      return trackObj;
    }
    if (file.file_format === "vgenes-dir") {
      const trackObj = {};
      trackObj.name = <TrackLabel file={file} assembly={assembly} />;
      trackObj.type = "annotation";
      trackObj.path = file.href;
      trackObj.heightPx = 120;
      trackObj.displayLabels = true;
      return trackObj;
    }
    if (
      file.title === "representative DNase hypersensitivity sites" ||
      file.title === "cCRE, all"
    ) {
      const trackObj = {};
      trackObj.name = <TrackLabel file={file} assembly={assembly} />;
      trackObj.type = "annotation";
      trackObj.path = file.path;
      trackObj.heightPx =
        file.title === "representative DNase hypersensitivity sites" ? 50 : 30;
      trackObj.expandable = false;
      trackObj.displayLabels = false;
      return trackObj;
    }
    if (file.file_format === "variant") {
      const trackObj = {};
      trackObj.name = <TrackLabel file={file} assembly={assembly} />;
      trackObj.type = "variant";
      trackObj.path = file.href || file.path; // some titles like dBSNP set path
      trackObj.heightPx = 40;
      trackObj.expandable = true;
      trackObj.displayLabels = true;
      return trackObj;
    }
    const trackObj = {};
    trackObj.name = <TrackLabel file={file} assembly={assembly} />;
    trackObj.type = "annotation";
    trackObj.path = file.cloud_metadata_url;
    trackObj.expandable = true;
    trackObj.longname = <TrackLabel file={file} assembly={assembly} long />;
    // bigBed bedRNAElements, bigBed peptideMapping, bigBed bedExonScore, bed12, and bed9 have two tracks and need extra height
    // Convert to lower case in case of inconsistency in the capitalization of the file format in the data
    if (
      file.file_format_type &&
      [
        "bedrnaelements",
        "peptidemapping",
        "bedexonscore",
        "bed12",
        "bed9",
      ].includes(file.file_format_type.toLowerCase())
    ) {
      trackObj.heightPx = 120;
    } else {
      trackObj.heightPx = 50;
    }
    return trackObj;
  });
  return tracks;
}

export default function GenomeBrowser({ files, assembly, coordinates }) {
  const disableBrowserForIE = BrowserFeat.getBrowserCaps("uaTrident")
    ? true
    : false;

  function ResetButton() {
    return (
      <button className="reset-browser-button">
        <ArrowUturnLeftIcon className="h-5" />
        <span className="reset-title">Reset to query variant label</span>
      </button>
    );
  }

  const [func, setFunc] = useState(ResetButton);

  useEffect(() => {
    async function load() {
      const highlightLocationStart = +coordinates.split(":")[1].split("-")[0];
      const highlightLocationEnd = +coordinates.split(":")[1].split("-")[1];
      const x0 = highlightLocationStart - 5000;
      const x1 = highlightLocationEnd + 5000;

      const chr = coordinates.split(":")[0];

      const pinnedFiles =
        assembly === "GRCh38" ? PINNED_FILES_GRCH38 : PINNED_FILES_HG19;

      const filesUpdated = [...pinnedFiles, ...files];
      const tracks = filesToTracks(filesUpdated, assembly);
      const highlightString = `${chr}:${highlightLocationStart}-${highlightLocationEnd}`;
      const GenomeVisualizer = await import("genome-visualizer").then(
        (mod) => mod.GenomeVisualizer
      );
      const visualizer = new GenomeVisualizer({
        clampToTracks: true,
        reorderTracks: true,
        removableTracks: false,
        highlightLocation: highlightString,
        originalChr: chr,
        panels: [
          {
            location: { contig: chr, x0, x1 },
          },
        ],
        tracks,
      });
      visualizer.render(
        {
          width: document.getElementById("browser").clientWidth,
          height: visualizer.getContentHeight(),
        },
        document.getElementById("browser")
      );
      function drawTracksResized() {
        visualizer.render(
          {
            width: document.getElementById("browser").clientWidth,
            height: visualizer.getContentHeight(),
          },
          document.getElementById("browser")
        );
      }
      visualizer.addEventListener("track-resize", drawTracksResized);
      window.addEventListener("resize", drawTracksResized);
      function ResetButton() {
        return (
          <button
            className="reset-browser-button"
            onClick={() => visualizer.setLocation({ contig: chr, x0, x1 })}
          >
            <ArrowUturnLeftIcon className="h-5 px-2" />
            <span className="reset-title">Reset to query variant</span>
          </button>
        );
      }
      setFunc(ResetButton);
    }

    load();
  }, [files, assembly, coordinates]);

  return (
    <div>
      {!disableBrowserForIE ? (
        <div className="tall-browser-container">
          <GenomeLegend />
          <>{func}</>
          <div id="browser" className="valis-browser" />
        </div>
      ) : (
        <div className="browser-error valis-browser">
          The genome browser does not support Internet Explorer. Please upgrade
          your browser to Edge to visualize files on ENCODE.
        </div>
      )}
    </div>
  );
}

GenomeBrowser.propTypes = {
  files: PropTypes.array.isRequired,
  assembly: PropTypes.string,
  coordinates: PropTypes.string.isRequired,
};
