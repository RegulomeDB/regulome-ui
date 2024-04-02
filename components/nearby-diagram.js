import PropTypes from "prop-types";
import {
  PlusIcon,
  MinusIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/20/solid";
import React, { useEffect, useRef, useState } from "react";
import { Tooltip, Button as TooltipButton } from "@nextui-org/react";
import { DataAreaTitle, DataPanel } from "./data-area";
import Base from "./dna-logo/base";
import { MotifDnaLogo } from "./dna-logo/motif";

const colorGenome = {
  "Nucleobase A": "red",
  "Nucleobase T": "#228b22",
  "Nucleobase G": "orange",
  "Nucleobase C": "blue",
};

const geneTypes = {
  artifact: "uncharacterized",
  IG_C_gene: "protein coding",
  IG_C_pseudogene: "pseudogene",
  IG_D_gene: "protein coding",
  IG_J_gene: "protein coding",
  IG_J_pseudogene: "pseudogene",
  IG_pseudogene: "pseudogene",
  IG_V_gene: "protein coding",
  IG_V_pseudogene: "pseudogene",
  lncRNA: "non-protein coding",
  miRNA: "non-protein coding",
  misc_RNA: "non-protein coding",
  Mt_rRNA: "non-protein coding",
  Mt_tRNA: "non-protein coding",
  processed_pseudogene: "pseudogene",
  protein_coding: "protein coding",
  pseudogene: "pseudogene",
  ribozyme: "non-protein coding",
  rRNA: "non-protein coding",
  rRNA_pseudogene: "pseudogene",
  scaRNA: "non-protein coding",
  scRNA: "non-protein coding",
  snoRNA: "non-protein coding",
  snRNA: "non-protein coding",
  sRNA: "non-protein coding",
  TEC: "uncharacterized",
  TR_C_gene: "protein coding",
  TR_D_gene: "protein coding",
  TR_J_gene: "protein coding",
  TR_J_pseudogene: "pseudogene",
  TR_V_gene: "protein coding",
  TR_V_pseudogene: "pseudogene",
  transcribed_processed_pseudogene: "pseudogene",
  transcribed_unitary_pseudogene: "pseudogene",
  transcribed_unprocessed_pseudogene: "pseudogene",
  translated_processed_pseudogene: "pseudogene",
  translated_unprocessed_pseudogene: "pseudogene",
  unitary_pseudogene: "pseudogene",
  unprocessed_pseudogene: "pseudogene",
  vault_RNA: "non-protein coding",
};
// coding: 'rgb(101,1,168)', #6501a8
// protein coding: 'rgb(101,1,168)', #6501a8
// nonCoding: 'rgb(1,193,75)', #01c14b
// pseudogene: 'rgb(230,0,172)', #e600ac
// pseudo: 'rgb(230,0,172)',
// problem: 'rgb(224,2,2)',
// polyA: 'rgb(237,127,2)',
// other: 'rgb(128,128,128)'
const colorGenes = {
  "protein coding": "#6501a8",
  "non-protein coding": "#01c14b",
  pseudogene: "#e600ac",
  uncharacterized: "gray",
};

// PLS	255,0,0	#FF0000
// pELS	255,167,0	#FFA700
// dELS	255,205,0	#FFCD00
// CA-H3K4me3	255,170,170	#FFAAAA
// CA-CTCF	0,176,240	#00B0F0
// CA-only	6,218,147	#06DA93
// CA-TF	190,40,229	#BE28E5
// TF-only	216,118,236	#D876EC
// Low DNase	225,225,225	#E1E1E1
// Unclassified	140,140,140	#8C8C8C
// ENH - enhancer same as dELS
// PRO - promoter same as PLS
const colorCCREs = {
  PLS: "#FF0000",
  PRO: "#FF0000",
  pELS: "#FFA700",
  dELS: "#FFCD00",
  ENH: "#FFCD00",
  "CA-H3K4me3": "#FFAAAA",
  "CA-CTCF": "#00B0F0",
  CA: "#06DA93",
  "CA-TF": "#BE28E5",
  TF: "#D876EC",
  "Low DNase": "#E1E1E1",
  Unclassified: "#8C8C8C",
};

const regRegionSourceOrder = [
  "ENCODE_SCREEN (ccREs)",
  "ENCODE_EpiRaction",
  "ENCODE-E2G",
  "ENCODE_MPRA",
  "FUNCODE",
  "AFGR",
  "PMID:34038741",
  "PMID:34017130",
];

const tickWidth = 200;
const blankHeight = 10;
const DnaBaseHeight = 50;
const variantLabelWidth = 120;
const labelHeight = 28;
const fontSize = 20;
const regRegionFontSize = 16;
const scalePositionY = 50;
const genePositionY = 80;
const geneUnitHeight = 50;
const geneLabelWidth = 200;
const viewBoxLength = 2000;
const regRegionPositionUnitHeight = 25;

/**
 * In this nearby drawing, we show groups of data from top to bottom:
 * The scale is at the top.
 * The nearest genes with their gene names as labels
 * The regulatory regions separated into trackes by sources, labeled by the source
 * The sequence near the coordinateds
 * The variant got hit labeled by rsid
 * The variants in LD labeled by rsid
 * The motifs labeled by the targets
 */
export default function NearbyDiagram({
  data,
  motifsList,
  nearbyData,
  targetSnp,
  variantLD,
}) {
  const regRegionPositionY =
    genePositionY + geneUnitHeight * nearbyData.genes.length + blankHeight;
  const coordinates = data.query_coordinates[0];
  const [sliderValue, setSliderValue] = useState(19);
  const [scaleX, setScaleX] = useState(20);
  const svgRef = useRef(null);

  const genes = nearbyData.genes;
  const regulatoryRegions = nearbyData.regulatoryRegions;
  const regulatoryRegionsBySource = regulatoryRegions.reduce(
    (groups, region) => {
      if (region.source in groups) {
        groups[region.source].items.push(region);
      } else {
        groups[region.source] = {};
        groups[region.source].items = [region];
      }
      return groups;
    },
    {}
  );
  let index = 0;
  regRegionSourceOrder.forEach((source) => {
    if (source in regulatoryRegionsBySource) {
      regulatoryRegionsBySource[source].index = index;
      index += 1;
    }
  });
  const sequencePositionY =
    regRegionPositionY +
    Object.keys(regulatoryRegionsBySource).length *
      (regRegionPositionUnitHeight + labelHeight) +
    blankHeight;
  const altLength = targetSnp[0].alt.length > 0 ? targetSnp[0].alt.length : 1;
  const variantPositionY =
    sequencePositionY + DnaBaseHeight * altLength + blankHeight;
  const motifPositionY =
    variantPositionY +
    DnaBaseHeight +
    blankHeight +
    labelHeight +
    blankHeight * 2;
  const viewBoxHeight =
    scaleX >= 2
      ? motifPositionY + motifsList.length * geneUnitHeight + blankHeight * 2
      : sequencePositionY + blankHeight * 2;
  const baseHeight = 50;
  const displayRegionToken = nearbyData.displayRegion.split(":")[1];
  const offsetX = +displayRegionToken.split("-")[0];
  const displayRegionLength = +displayRegionToken.split("-")[1] - offsetX;

  const variantPosX = coordinates.split(":")[1].split("-")[0] - offsetX;
  const [viewBoxMinX, setViewBoxMinX] = useState(
    Math.floor(variantPosX * scaleX - viewBoxLength / 2)
  );

  useEffect(() => {
    const svgElement = svgRef.current;
    function handleScroll(event) {
      event.preventDefault();
      const scrollDelta = event.deltaX || event.detail || event.wheelDelta;

      setViewBoxMinX((prevViewBoxX) => {
        const newViewBoxX = prevViewBoxX + scrollDelta;
        const endX = displayRegionLength * scaleX;
        if (newViewBoxX < 0) {
          return 0;
        }
        if (newViewBoxX > endX - viewBoxLength) {
          return endX - viewBoxLength;
        }
        return newViewBoxX;
      });
    }

    svgElement.addEventListener("wheel", handleScroll, { passive: false });

    return () => {
      svgElement.removeEventListener("wheel", handleScroll);
    };
  }, [displayRegionLength, scaleX]);

  function handleSliderChange(event) {
    const newSliderValue = parseInt(event.target.value);
    setSliderValue(newSliderValue);
    const newScaleX =
      newSliderValue >= 0 ? newSliderValue + 1 : 1 / (newSliderValue * -1 + 1);

    setViewBoxMinX(
      Math.floor(
        ((viewBoxMinX + viewBoxLength / 2) / scaleX) * newScaleX -
          viewBoxLength / 2
      )
    );
    setScaleX(newScaleX);
  }

  function handleFocusClick() {
    const newViewBoxX = variantPosX * scaleX - 1000;
    setViewBoxMinX(newViewBoxX);
  }

  function handleZoomIn() {
    if (sliderValue < 19) {
      const newSliderValue = sliderValue + 2;
      const newScaleX =
        newSliderValue >= 0
          ? newSliderValue + 1
          : 1 / (newSliderValue * -1 + 1);
      setSliderValue(newSliderValue);

      setViewBoxMinX(
        Math.floor(
          ((viewBoxMinX + viewBoxLength / 2) / scaleX) * newScaleX -
            viewBoxLength / 2
        )
      );
      setScaleX(newScaleX);
    }
  }
  function handleZoomOut() {
    if (sliderValue > -19) {
      const newSliderValue = sliderValue - 2;
      const newScaleX =
        newSliderValue >= 0
          ? newSliderValue + 1
          : 1 / (newSliderValue * -1 + 1);
      setSliderValue(newSliderValue);

      setViewBoxMinX(
        Math.floor(
          ((viewBoxMinX + viewBoxLength / 2) / scaleX) * newScaleX -
            viewBoxLength / 2
        )
      );
      setScaleX(newScaleX);
    }
  }

  return (
    <>
      <DataAreaTitle>Variant Nearby</DataAreaTitle>
      <DataPanel>
        <div>
          <NearybyLegend />
          <div className="flex space-x-2 py-2 justify-center">
            <div>
              <button onClick={handleZoomOut}>
                <MinusIcon className="w-5 h-5" />
              </button>
              <input
                type="range"
                min="-19"
                max="19"
                step="2"
                value={sliderValue}
                onChange={handleSliderChange}
              />
              <button onClick={handleZoomIn}>
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>

            <button onClick={handleFocusClick}>
              <ViewfinderCircleIcon className="w-5 h-5" />
            </button>
          </div>

          <svg
            viewBox={`${viewBoxMinX} 0  ${viewBoxLength} ${viewBoxHeight}`}
            preserveAspectRatio="xMidYMid meet"
            ref={svgRef}
            style={{ border: "1px solid black" }}
          >
            <g id="scale">
              <line
                transform={`scale(${scaleX}, 1)`}
                x1="0"
                y1={scalePositionY}
                x2={displayRegionLength}
                y2={scalePositionY}
                stroke="black"
                strokeWidth="2"
              />
              {/* Draw ticks and labels */}
              {Array.from({
                length: Math.floor((displayRegionLength / tickWidth) * scaleX),
              }).map((_, index) => {
                const tickX = (index * tickWidth) / scaleX;
                return (
                  <g key={index}>
                    <line
                      x1={index * tickWidth + scaleX / 2}
                      y1={scalePositionY}
                      x2={index * tickWidth + scaleX / 2}
                      y2={scalePositionY - 10}
                      stroke="black"
                      strokeWidth="2"
                    />
                    <text
                      fontSize={fontSize}
                      x={tickX * scaleX + scaleX / 2}
                      y={scalePositionY - 20}
                      textAnchor="middle"
                    >
                      {Math.floor((index * tickWidth) / scaleX + offsetX)}
                    </text>
                  </g>
                );
              })}{" "}
            </g>
            <g id="genes">
              {genes.map((gene, i) => {
                const geneStart = (gene.start - offsetX) * scaleX;
                const viewBoxMaxX = viewBoxMinX + viewBoxLength;
                // show gene label at the top beginning of the gene
                let labelX = geneStart;
                //make sure we show the whole gene label
                if (
                  viewBoxMaxX > labelX &&
                  (viewBoxMaxX - labelX) * scaleX < geneLabelWidth
                ) {
                  labelX = viewBoxMaxX - geneLabelWidth;
                }
                if (
                  viewBoxMinX > (gene.start - offsetX) * scaleX &&
                  viewBoxMinX < (gene.end - offsetX) * scaleX
                ) {
                  labelX = viewBoxMinX;
                }
                return (
                  <g key={gene.name}>
                    <rect
                      transform={`scale(${scaleX}, 1)`}
                      key={gene.name}
                      x={gene.start - offsetX}
                      y={genePositionY + i * geneUnitHeight}
                      width={gene.end - gene.start}
                      height={20}
                      fill={colorGenes[geneTypes[gene.gene_type]]}
                    />
                    <text
                      fontSize={fontSize}
                      fill="black"
                      x={labelX}
                      y={genePositionY - 6 + i * geneUnitHeight}
                    >
                      {gene.name}
                    </text>
                  </g>
                );
              })}
            </g>
            <g id="regulatory-regions-source">
              {Object.keys(regulatoryRegionsBySource).map((source) => {
                return (
                  <text
                    key={source}
                    fontSize={regRegionFontSize}
                    fill="black"
                    x={viewBoxMinX}
                    y={
                      regRegionPositionY -
                      5 +
                      regulatoryRegionsBySource[source].index *
                        (regRegionPositionUnitHeight + labelHeight)
                    }
                  >
                    regulatory region source: {source}
                  </text>
                );
              })}
            </g>
            <g id="regulatory-regions">
              {Object.keys(regulatoryRegionsBySource).map((source) => {
                return (
                  <React.Fragment key={source}>
                    {regulatoryRegionsBySource[source].items.map((region) => {
                      return (
                        <rect
                          key={region.name}
                          x={(region.start - offsetX) * scaleX}
                          y={
                            regRegionPositionY +
                            regulatoryRegionsBySource[source].index *
                              (regRegionPositionUnitHeight + labelHeight)
                          }
                          width={(region.end - region.start) * scaleX}
                          height={20}
                          fill={
                            region.biochemical_activity
                              ? colorCCREs[region.biochemical_activity]
                              : "#06da93"
                          }
                          opacity="0.8"
                        />
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </g>
            <g id="variant-position-vertical-line">
              <line
                transform={`translate(${scaleX / 2}) scale(${scaleX}, 1)`}
                x1={variantPosX}
                x2={variantPosX}
                y1={0}
                y2={viewBoxHeight}
                stroke="#e9d66b"
                strokeDasharray="40,8"
                strokeWidth={scaleX >= 1 ? 1 : 2 / scaleX}
                opacity="0.3"
              />
            </g>
            {scaleX >= 2 && (
              <>
                <g id="sequence">
                  <g id="x-axis">
                    <line
                      transform={`scale(${scaleX}, 1)`}
                      x1={0}
                      x2={displayRegionLength}
                      y1={sequencePositionY + baseHeight / 2}
                      y2={sequencePositionY + baseHeight / 2}
                      markerEnd="url(#arrow)"
                      markerStart="url(#arrow)"
                      stroke="#7F7F7F"
                      strokeWidth="2"
                    />
                  </g>
                  {data.sequence.sequence.split("").map((base, i) => {
                    return (
                      <g
                        key={i}
                        transform={`translate(${
                          (data.sequence.start - offsetX + i) * scaleX
                        } ${sequencePositionY}) scale(${scaleX}, 1)`}
                      >
                        <Base xscale={0.01} yscale={0.5} base={base} />
                      </g>
                    );
                  })}
                  {variantLD.map((variant) => {
                    const location = variant.location;
                    const region = location.split(":")[1];
                    const start = parseInt(region.split("-")[0]);
                    return (
                      <g
                        key={variant.location + variant.ancestry}
                        transform={`translate(${
                          (start - offsetX) * scaleX
                        } ${sequencePositionY}) scale(${scaleX}, 1)`}
                      >
                        <Base xscale={0.01} yscale={0.5} base={variant.ref} />
                      </g>
                    );
                  })}
                </g>
                <g id="variants">
                  {variantLD.map((variant) => {
                    const location = variant.location;
                    const region = location.split(":")[1];
                    const start = parseInt(region.split("-")[0]);
                    return (
                      <g key={variant.location + variant.ancestry}>
                        <g
                          transform={`translate(${
                            (start - offsetX) * scaleX
                          } ${variantPositionY}) scale(${scaleX}, 1)`}
                        >
                          <Base xscale={0.01} yscale={0.5} base={variant.alt} />
                        </g>
                        <g>
                          <rect
                            x={(start - offsetX) * scaleX - 50}
                            y={variantPositionY + geneUnitHeight + blankHeight}
                            width={variantLabelWidth}
                            height={labelHeight}
                            fill="blue"
                          />
                          <text
                            fontSize={fontSize}
                            fill="white"
                            x={(start - offsetX) * scaleX - 40}
                            y={variantPositionY + 80}
                          >
                            {variant.rsid}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                  {targetSnp[0].alt.map((base, i) => {
                    return (
                      <g
                        key={base}
                        transform={`translate(${
                          (targetSnp[0].start - offsetX) * scaleX
                        } ${
                          variantPositionY - i * DnaBaseHeight
                        }) scale(${scaleX}, 1)`}
                      >
                        <Base xscale={0.01} yscale={0.5} base={base} />
                      </g>
                    );
                  })}
                  {targetSnp.length > 0 && (
                    <g id="target-snp-label">
                      <rect
                        x={(targetSnp[0].start - offsetX) * scaleX - 50}
                        y={variantPositionY + geneUnitHeight + blankHeight}
                        width={variantLabelWidth * targetSnp[0].rsids.length}
                        height={labelHeight}
                        fill="red"
                      />
                      <text
                        fontSize="20"
                        fill="white"
                        x={(targetSnp[0].start - offsetX) * scaleX - 40}
                        y={variantPositionY + 80}
                      >
                        {targetSnp[0].rsids.join(", ")}
                      </text>
                    </g>
                  )}
                </g>
                <g id="motifs">
                  {motifsList.map((motif, i) => {
                    return (
                      <React.Fragment key={motif.pwm}>
                        <MotifDnaLogo
                          pwm={motif.dataMatrix}
                          strand={motif.strand}
                          startX={motif.start - offsetX}
                          startY={motifPositionY + i * 50}
                          scaleX={scaleX}
                        />
                        <text
                          fontSize={fontSize}
                          fill="black"
                          x={viewBoxMinX}
                          y={
                            motifPositionY +
                            i * DnaBaseHeight +
                            DnaBaseHeight * 0.7
                          }
                        >
                          motif target: {motif.targets}
                        </text>
                      </React.Fragment>
                    );
                  })}
                </g>
              </>
            )}
          </svg>
        </div>
      </DataPanel>
    </>
  );
}
NearbyDiagram.propTypes = {
  data: PropTypes.object.isRequired,
  nearbyData: PropTypes.object.isRequired,
  variantLD: PropTypes.array.isRequired,
  targetSnp: PropTypes.array.isRequired,
  motifsList: PropTypes.array.isRequired,
};

/**
 * Display the legend for nearby drawing
 */
export function NearybyLegend() {
  return (
    <div className="grid justify-items-end pb-4">
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
              <strong>Regulatory regions</strong>
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
        <TooltipButton>
          <div className="flex space-x-2">
            <div className="grid row-2 space-y-1">
              <div className="flex space-x-1">
                <div
                  className="h-3 w-3"
                  style={{ background: `${colorGenome["Nucleobase A"]}` }}
                />
                <div
                  className="h-3 w-3"
                  style={{ background: `${colorGenome["Nucleobase T"]}` }}
                />
              </div>

              <div className="flex space-x-1">
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
        </TooltipButton>
      </Tooltip>
    </div>
  );
}
