import PropTypes from "prop-types";
import { useRef } from "react";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/20/solid";
import {
  DataAreaTitle,
  DataItemLabel,
  DataItemValue,
  DataPanel,
} from "./data-area";
import { DnaLogo } from "./dna-logo/dna-logo";

/**
 * Display information for a sigle motif. Each motif contains info about targets, strand, pwms and footprints, and a svg for DNA logo
 */
export function MotifElement({
  motif,
  windowStartPos,
  windowEndPos,
  relativeSnpCoordinate,
}) {
  const pwm = motif.dataMatrix;

  // Determine padding required for alignment of logos
  const motifStart = +motif.start;
  const motifEnd = +motif.end;
  const strand = motif.strand;
  const startAlignmentNeeded =
    strand === "-" ? windowEndPos - motifEnd : motifStart - +windowStartPos;
  const endAlignmentNeeded =
    strand === "-" ? motifStart - +windowStartPos : windowEndPos - motifEnd;
  // Insert padding for alignment
  const newPWM = [...pwm];
  for (let startIdx = 0; startIdx < startAlignmentNeeded; startIdx += 1) {
    newPWM.unshift([0, 0, 0, 0]);
  }
  for (let endIdx = 0; endIdx < endAlignmentNeeded; endIdx += 1) {
    newPWM.push([0, 0, 0, 0]);
  }
  const targetList = motif.targets;
  const pwmList = {};
  const footprintList = {};

  motif.datasets.forEach((datasetUrl, index) => {
    const biosample = motif.biosamples[index];
    const fileAccession = motif.accessions[index];
    const datasetAccession = `accession=${
      datasetUrl.split("/").slice(-2, -1)[0]
    }`;

    // So for a dataset, we get the Label and ID corresponding to the same index we are at now
    if (biosample !== "") {
      // If we have a biosample, then we map biosample to datasetAccession into footprintAnnotationList
      if (footprintList[biosample]) {
        footprintList[biosample].push(datasetAccession);
      } else {
        footprintList[biosample] = [datasetAccession];
      }
    } else {
      // If we don't have a biosample, then map Label -> URL into `pwmList`
      pwmList[fileAccession] = datasetUrl;
    }
  });

  const footprintKeysSorted = Object.keys(footprintList).sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );
  const pwmsLength = Object.keys(pwmList).length;
  const footprintsLength = Object.keys(footprintList).length;

  const targetListLabel = targetList.indexOf(",") !== -1 ? "Targets" : "Target";
  const pwmsLabel = pwmsLength > 1 ? "PWMs" : "PWM";
  const footprintsLabel =
    footprintsLength > 1 ? `Footprints (${footprintsLength})` : "Footprint";
  const heightScale = 0.8;

  return (
    <div className="@container">
      <div className="grid @lg:grid-cols-2 grid-cols-1 gap-1">
        <div className="grid grid-rows-1 gap-1">
          <div className="grid @lg:grid-cols-3 grid-cols-1 gap-4">
            {targetList.length > 0 && (
              <div className="flex gap-2">
                <DataItemLabel>{targetListLabel}</DataItemLabel>
                <DataItemValue>{targetList}</DataItemValue>
              </div>
            )}
            {motif.strand && (
              <div className="flex gap-2">
                <DataItemLabel>Strand</DataItemLabel>
                {motif.strand === "+" ? (
                  <PlusCircleIcon className="h-6" />
                ) : (
                  <MinusCircleIcon className="h-6" />
                )}
              </div>
            )}
            {pwmsLength > 0 && (
              <div className="flex gap-2">
                <DataItemLabel>{pwmsLabel}</DataItemLabel>
                <DataItemValue>
                  {Object.keys(pwmList).map((d, dIndex) => (
                    <a key={d} href={pwmList[d]}>
                      {d}
                      {dIndex === Object.keys(pwmList).length - 1 ? "" : ", "}
                    </a>
                  ))}
                </DataItemValue>
              </div>
            )}
          </div>

          {footprintsLength > 0 && (
            <div className="grid grid-cols-3 gap-4">
              <DataItemLabel>{footprintsLabel}</DataItemLabel>
              <div className="overflow-y-auto rounded-md  h-40  text-data-label border-solid border-2	">
                {footprintKeysSorted.map((d) => (
                  <div className="ml-2" key={d}>
                    <a
                      href={`https://www.encodeproject.org/search/?${footprintList[
                        d
                      ].join("&")}`}
                    >
                      {d}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="pt-8 ">
          <DnaLogo
            pwm={newPWM}
            strand={motif.strand}
            snpCoordinate={relativeSnpCoordinate}
            heightScale={heightScale}
          />
        </div>
      </div>
    </div>
  );
}

MotifElement.propTypes = {
  motif: PropTypes.object.isRequired,
  windowStartPos: PropTypes.number.isRequired,
  windowEndPos: PropTypes.number.isRequired,
  relativeSnpCoordinate: PropTypes.number.isRequired,
};

/**
 * Display information for motifs for the queried SNP. It will display the reference DNA sequence and all the motifs.
 */
export default function Motifs({
  motifsList,
  sequence,
  coordinates,
  assembly,
}) {
  const snpCoordinate = +coordinates.split(":")[1].split("-")[0];

  // Compute offsets for the different pwms to find the widest window
  const windowStartPos = Math.min(...motifsList.map((item) => item.start));
  const windowEndPos = Math.max(...motifsList.map((item) => item.end));
  // trimming the reference sequence to widest window of pwms
  const referenceLength = windowEndPos - windowStartPos;
  const relativeSnpCoordinate = snpCoordinate - windowStartPos + 1;
  const refSeqString = sequence.sequence.slice(
    windowStartPos - sequence.start,
    windowStartPos - sequence.start + referenceLength
  );
  const refSeqList = refSeqString.split("");
  const heightScale = 2;
  const ref = useRef(refSeqString);
  // generate a fake PWM to draw reference sequence
  const fakePWM = refSeqList.map((nucleotide) => {
    const maxHeight = 1;
    if (nucleotide === "A") {
      return [maxHeight, 0, 0, 0];
    }
    if (nucleotide === "C") {
      return [0, maxHeight, 0, 0];
    }
    if (nucleotide === "G") {
      return [0, 0, maxHeight, 0];
    }

    return [0, 0, 0, maxHeight];
  });

  return (
    <>
      {motifsList.length > 0 ? (
        <>
          <DataAreaTitle>Motifs</DataAreaTitle>
          <DataPanel>
            <div className="grid @lg:grid-cols-2 grid-cols-1 gap-4 bg-panel sticky top-0">
              <div className="grid grid-cols-1">
                <DataItemValue>
                  {assembly} Reference {windowStartPos + 1}-{windowEndPos}
                </DataItemValue>
              </div>
              <div className="grid grid-cols-1">
                <DnaLogo
                  ref={ref}
                  pwm={fakePWM}
                  snpCoordinate={relativeSnpCoordinate}
                  hideY
                  strand="+"
                  heightScale={heightScale}
                />
              </div>
            </div>

            <div className="grid grid-rows-1 gap-4">
              {motifsList.map((motif) => (
                <MotifElement
                  key={motif.pwm}
                  motif={motif}
                  coordinates={coordinates}
                  windowStartPos={windowStartPos}
                  windowEndPos={windowEndPos}
                  relativeSnpCoordinate={relativeSnpCoordinate}
                />
              ))}
            </div>
          </DataPanel>
        </>
      ) : (
        <DataPanel>
          <DataAreaTitle>
            No motifs data available to display, please choose a different SNP.
          </DataAreaTitle>
        </DataPanel>
      )}
    </>
  );
}

Motifs.propTypes = {
  motifsList: PropTypes.array.isRequired,
  coordinates: PropTypes.string.isRequired,
  assembly: PropTypes.string.isRequired,
  sequence: PropTypes.object.isRequired,
};
