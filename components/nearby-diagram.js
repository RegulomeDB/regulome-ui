import PropTypes from "prop-types";
import React from "react";
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
const tickHeight = 10;
const blankHeight = 10;
const textTokenWidth = 12;
const labelHeight = 28;
const fontSizeLarge = 20;
const fontSizeSmall = 16;
const scaleForGenePositionY = 50;
const genePositionY = 80;
const geneRectHeight = 20;
const geneUnitHeight = 50;
const viewBoxMinX = 0;
const viewBoxLength = 2000;
const regRegionPositiontrackHeight = 25;
const baseMaxWidth = 100;
const baseWidth = 35;
const baseHeight = 50;
const zoomInIconHeigt = 100;
const variatInLdHeight = 40;

/**
 * In this nearby drawing, we show groups of data from top to bottom:
 * The nearest genes with their gene names as labels
 * The regulatory regions separated into trackes by sources, labeled by the source
 * The variants in LD
 * The sequence near the coordinateds
 * The SNP got hit and the SNPs nearby labeled by rsid
 * The motifs labeled by the targets
 * This svg use three different scales to draw all the elements.
 * From the smallest to the biggest scale,
 * Genes, and regulatory regions use the same smallest scale.
 * Variants in LD use the same scale
 * Sequence, variants and motifs use the same largest scale.
 */
export default function NearbyDiagram({
  data,
  motifsList,
  nearbyData,
  variantLD,
}) {
  const uniqueVariantLD = variantLD.filter(
    (variant, index) =>
      variantLD.findIndex((item) => item.location === variant.location) ===
      index
  );
  const genes = nearbyData.genes;
  const regulatoryRegions = nearbyData.regulatoryRegions.filter(
    (region) => region.source === "ENCODE_SCREEN (ccREs)"
  );
  const targetCoordinatesStart = +data.query_coordinates[0]
    .split(":")[1]
    .split("-")[0];
  const nearyBySnps = data.nearby_snps.filter(
    (snp) =>
      snp.variation_type === "SNV" &&
      snp.coordinates.gte >= data.sequence.start &&
      snp.coordinates.gte <= data.sequence.end
  );
  const offsetXForVariant =
    targetCoordinatesStart - viewBoxLength / (2 * baseWidth);
  const displayRegionToken = nearbyData.displayRegion.split(":")[1];
  const displayRegionStart = +displayRegionToken.split("-")[0];
  const displayRegionEnd = +displayRegionToken.split("-")[1];
  const displayRegionMid =
    (displayRegionEnd - displayRegionStart) / 2 + displayRegionStart;
  const scaleForGene =
    displayRegionMid > targetCoordinatesStart
      ? viewBoxLength / 2 / (displayRegionEnd - targetCoordinatesStart)
      : viewBoxLength / 2 / (targetCoordinatesStart - displayRegionStart);
  const offsetXForGene =
    displayRegionMid < targetCoordinatesStart
      ? displayRegionStart
      : targetCoordinatesStart - (displayRegionEnd - targetCoordinatesStart);
  const regRegionPositionY =
    genePositionY + geneUnitHeight * nearbyData.genes.length + blankHeight;
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
  let scaleForVariantInLd = null;
  let offsetForVariantInLd = null;
  let VariantsInLdPositionY = null;
  let zoomInIconPositionForVariantsInLd = null;
  let scaleForVariantsInLdPositionY = null;
  if (uniqueVariantLD.length > 0) {
    const variantsInLdRegionStart = uniqueVariantLD[0].start;
    const variantsInLdRegionEnd =
      uniqueVariantLD[uniqueVariantLD.length - 1].start;
    const variantsInLdRegionMid =
      (variantsInLdRegionEnd + variantsInLdRegionStart) / 2;
    scaleForVariantInLd =
      variantsInLdRegionMid > targetCoordinatesStart
        ? viewBoxLength / 2 / (variantsInLdRegionEnd - targetCoordinatesStart)
        : viewBoxLength /
          2 /
          (targetCoordinatesStart - variantsInLdRegionStart);
    offsetForVariantInLd =
      variantsInLdRegionMid < targetCoordinatesStart
        ? variantsInLdRegionStart
        : targetCoordinatesStart -
          (variantsInLdRegionEnd - targetCoordinatesStart);
    zoomInIconPositionForVariantsInLd =
      regRegionPositionY +
      Object.keys(regulatoryRegionsBySource).length *
        (regRegionPositiontrackHeight + labelHeight);
    scaleForVariantsInLdPositionY =
      zoomInIconPositionForVariantsInLd + zoomInIconHeigt + 30 + blankHeight;
    VariantsInLdPositionY = scaleForVariantsInLdPositionY + blankHeight;
  }
  const zoomInIconPositionForSequence = VariantsInLdPositionY
    ? VariantsInLdPositionY + variatInLdHeight + labelHeight + blankHeight
    : regRegionPositionY +
      Object.keys(regulatoryRegionsBySource).length *
        (regRegionPositiontrackHeight + labelHeight);
  const scaleForSequencePositionY =
    zoomInIconPositionForSequence + zoomInIconHeigt + 30 + blankHeight;
  const sequencePositionY = scaleForSequencePositionY + blankHeight;
  const altLength = getAltMaxNum(nearyBySnps);
  const variantPositionY =
    sequencePositionY + baseHeight * altLength + blankHeight;

  let preRectX2 = 0;
  let preRectY = 0;
  const highestLabelY = variantPositionY + geneUnitHeight + blankHeight;
  let lowestLabelY = highestLabelY;
  const nearbySnpsData = nearyBySnps.map((variant) => {
    const start = variant.coordinates.gte;
    const textLength = variant.rsid.length * textTokenWidth;
    // need to show all alts
    const bases = Object.keys(variant.alt_allele_freq);
    const basesData = bases.map((base, i) => {
      return {
        base,
        transform: `translate(${
          (start - offsetXForVariant) * baseWidth - baseWidth / 2
        } ${variantPositionY - i * baseHeight}) `,
      };
    });
    const rectX = (start - offsetXForVariant) * baseWidth - textLength / 2 - 2;
    let rectY = highestLabelY;
    if (preRectX2 >= rectX) {
      rectY = preRectY + labelHeight + blankHeight;
    }
    const rectWidth = textLength + 4;
    const textX = (start - offsetXForVariant) * baseWidth - textLength / 2;
    const textY = rectY + 20;
    const rsid = variant.rsid;
    const fill = start === targetCoordinatesStart ? "red" : "blue";
    const lineX = rectX + textLength / 2;
    const lineY1 = highestLabelY - 10;
    const lineY2 = rectY + labelHeight;
    preRectX2 = rectX + rectWidth;
    preRectY = rectY;
    if (rectY > lowestLabelY) {
      lowestLabelY = rectY;
    }

    return {
      textLength,
      basesData,
      rectX,
      rectY,
      rectWidth,
      textX,
      textY,
      lineX,
      lineY1,
      lineY2,
      rsid,
      fill,
    };
  });

  const motifPositionY = lowestLabelY + labelHeight + blankHeight * 2;
  const viewBoxHeight =
    motifPositionY + motifsList.length * geneUnitHeight + blankHeight * 2;

  return (
    <>
      <DataAreaTitle>Variant Nearby</DataAreaTitle>
      <DataPanel>
        <div>
          <NearybyLegend />
          <svg
            viewBox={`${viewBoxMinX - 60} 0  ${
              viewBoxLength + 120
            } ${viewBoxHeight}`}
            preserveAspectRatio="xMidYMid meet"
            className="border-2 border-panel"
          >
            <g id="variant-position-vertical-line-top">
              <line
                x1={viewBoxLength / 2}
                x2={viewBoxLength / 2}
                y1={0}
                y2={zoomInIconPositionForSequence}
                stroke="#e9d66b"
                strokeDasharray="40,8"
                strokeWidth={3}
                opacity="0.8"
              />
            </g>
            <g id="variant-position-vertical-line-bottom">
              <line
                x1={viewBoxLength / 2}
                x2={viewBoxLength / 2}
                y1={sequencePositionY}
                y2={viewBoxHeight}
                stroke="#e9d66b"
                strokeDasharray="40,8"
                strokeWidth={baseWidth}
                opacity="0.5"
              />
            </g>
            <g id="scale-for-gene">
              <line
                x1={viewBoxMinX}
                y1={scaleForGenePositionY}
                x2={viewBoxLength}
                y2={scaleForGenePositionY}
                className="stroke-data-label stroke-2"
              />
              {/* Draw ticks and labels */}
              {Array.from({
                length: Math.floor(viewBoxLength / tickWidth + 1),
              }).map((_, index) => {
                return (
                  <g key={index}>
                    <line
                      x1={index * tickWidth}
                      y1={scaleForGenePositionY}
                      x2={index * tickWidth}
                      y2={scaleForGenePositionY - tickHeight}
                      className="stroke-data-label stroke-2"
                    />
                    <text
                      className="fill-data-label"
                      fontSize={fontSizeLarge}
                      x={index * tickWidth}
                      y={scaleForGenePositionY - tickHeight - 5}
                      textAnchor="middle"
                    >
                      {Math.floor(
                        (index * tickWidth) / scaleForGene + offsetXForGene
                      )}
                    </text>
                  </g>
                );
              })}
            </g>
            <g id="genes">
              {genes.map((gene, i) => {
                let textX =
                  gene.start < offsetXForGene
                    ? viewBoxMinX
                    : (gene.start - offsetXForGene) * scaleForGene;
                const textLength = textTokenWidth * gene.name.length;
                if (textX + textLength > viewBoxLength) {
                  textX = viewBoxLength - textLength;
                }
                return (
                  <g key={gene.name}>
                    <rect
                      transform={`scale(${scaleForGene}, 1)`}
                      key={gene.name}
                      x={gene.start - offsetXForGene}
                      y={genePositionY + i * geneUnitHeight}
                      width={gene.end - gene.start}
                      height={geneRectHeight}
                      fill={colorGenes[geneTypes[gene.gene_type]]}
                    />
                    <text
                      className="fill-data-label"
                      fontSize={fontSizeLarge}
                      x={textX}
                      y={genePositionY - 6 + i * geneUnitHeight}
                      textLength={textLength}
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
                    fontSize={fontSizeSmall}
                    className="fill-data-label"
                    x={viewBoxMinX}
                    y={
                      regRegionPositionY -
                      5 +
                      regulatoryRegionsBySource[source].index *
                        (regRegionPositiontrackHeight + labelHeight)
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
                          x={(region.start - offsetXForGene) * scaleForGene}
                          y={
                            regRegionPositionY +
                            regulatoryRegionsBySource[source].index *
                              (regRegionPositiontrackHeight + labelHeight)
                          }
                          width={(region.end - region.start) * scaleForGene}
                          height={geneRectHeight}
                          fill={
                            region.biochemical_activity
                              ? colorCCREs[region.biochemical_activity]
                              : colorCCREs.CA
                          }
                          opacity="0.8"
                        />
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </g>
            {uniqueVariantLD.length > 0 && (
              <>
                <g id="zoom-in-icon-for-variants-in-ld">
                  <line
                    x1={viewBoxMinX}
                    x2={viewBoxLength / 2}
                    y1={zoomInIconPositionForVariantsInLd + 100}
                    y2={zoomInIconPositionForVariantsInLd}
                    className="stroke-data-label stroke-2"
                  />
                  <line
                    x1={viewBoxLength / 2}
                    x2={viewBoxLength}
                    y1={zoomInIconPositionForVariantsInLd}
                    y2={zoomInIconPositionForVariantsInLd + 100}
                    className="stroke-data-label stroke-2"
                  />
                </g>
                <g id="scale-for-variants-in-ld">
                  <line
                    x1={viewBoxMinX}
                    x2={viewBoxLength}
                    y1={scaleForVariantsInLdPositionY}
                    y2={scaleForVariantsInLdPositionY}
                    className="stroke-data-label stroke-2"
                  />
                  {/* Draw ticks and labels */}
                  {Array.from({
                    length: Math.floor(viewBoxLength / tickWidth + 1),
                  }).map((_, index) => {
                    return (
                      <g key={index}>
                        <line
                          x1={index * tickWidth}
                          y1={scaleForVariantsInLdPositionY}
                          x2={index * tickWidth}
                          y2={scaleForVariantsInLdPositionY - tickHeight}
                          className="stroke-data-label stroke-2"
                        />
                        <text
                          className="fill-data-label"
                          fontSize={fontSizeLarge}
                          x={index * tickWidth}
                          y={scaleForVariantsInLdPositionY - tickHeight - 5}
                          textAnchor="middle"
                        >
                          {Math.floor(
                            (index * tickWidth) / scaleForVariantInLd +
                              offsetForVariantInLd
                          )}
                        </text>
                      </g>
                    );
                  })}
                </g>
                <g id="variants-in-ld">
                  <text
                    id="variants-in-ld-track-label"
                    fontSize={fontSizeSmall}
                    className="fill-data-label"
                    x={viewBoxMinX}
                    y={scaleForVariantsInLdPositionY + labelHeight}
                  >
                    variants in LD
                  </text>
                  {uniqueVariantLD.map((variant) => {
                    const location = variant.location;
                    const region = location.split(":")[1];
                    const start = parseInt(region.split("-")[0]);
                    return (
                      <g key={variant.location}>
                        <g>
                          <line
                            x1={
                              (start - offsetForVariantInLd + 1) *
                              scaleForVariantInLd
                            }
                            x2={
                              (start - offsetForVariantInLd + 1) *
                              scaleForVariantInLd
                            }
                            y1={VariantsInLdPositionY + labelHeight}
                            y2={
                              VariantsInLdPositionY +
                              labelHeight +
                              variatInLdHeight
                            }
                            className="stroke-brand stroke-2"
                          />
                        </g>
                      </g>
                    );
                  })}
                </g>
              </>
            )}
            <g id="zoom-in-icon-for-sequence">
              <line
                x1={viewBoxMinX}
                x2={viewBoxLength / 2}
                y1={zoomInIconPositionForSequence + 100}
                y2={zoomInIconPositionForSequence}
                className="stroke-data-label stroke-2"
              />
              <line
                x1={viewBoxLength / 2}
                x2={viewBoxLength}
                y1={zoomInIconPositionForSequence}
                y2={zoomInIconPositionForSequence + 100}
                className="stroke-data-label stroke-2"
              />
            </g>
            <g id="scale-for-sequence">
              <line
                x1={viewBoxMinX}
                x2={viewBoxLength}
                y1={scaleForSequencePositionY}
                y2={scaleForSequencePositionY}
                className="stroke-data-label stroke-2"
              />
              {/* Draw ticks and labels */}
              {Array.from({
                length: Math.floor(viewBoxLength / tickWidth + 1),
              }).map((_, index) => {
                return (
                  <g key={index}>
                    <line
                      x1={index * tickWidth}
                      y1={scaleForSequencePositionY}
                      x2={index * tickWidth}
                      y2={scaleForSequencePositionY - tickHeight}
                      className="stroke-data-label stroke-2"
                    />
                    <text
                      className="fill-data-label"
                      fontSize={fontSizeLarge}
                      x={index * tickWidth}
                      y={scaleForSequencePositionY - tickHeight - 5}
                      textAnchor="middle"
                    >
                      {Math.floor(
                        (index * tickWidth) / baseWidth + offsetXForVariant
                      )}
                    </text>
                  </g>
                );
              })}
            </g>
            <g id="sequence">
              {data.sequence.sequence.split("").map((base, i) => {
                return (
                  <g
                    key={i}
                    transform={`translate(${
                      (data.sequence.start - offsetXForVariant + i) *
                        baseWidth -
                      baseWidth / 2
                    } ${sequencePositionY})`}
                  >
                    <Base
                      xscale={baseWidth / baseMaxWidth}
                      yscale={0.5}
                      base={base}
                    />
                  </g>
                );
              })}
            </g>
            <g id="nearby-snps-label-tick">
              {nearbySnpsData.map((variant) => {
                return (
                  <line
                    key={variant.rsid}
                    x1={variant.lineX}
                    y1={variant.lineY1}
                    x2={variant.lineX}
                    y2={variant.lineY2}
                    className="stroke-data-label stroke-2"
                  />
                );
              })}
            </g>
            <g id="nearby-snps">
              {nearbySnpsData.map((variant) => {
                return (
                  <g key={variant.rsid}>
                    {variant.basesData.map((base) => {
                      return (
                        <g key={base.base} transform={base.transform}>
                          <Base
                            xscale={baseWidth / baseMaxWidth}
                            yscale={0.5}
                            base={base.base}
                          />
                        </g>
                      );
                    })}
                    <g>
                      <rect
                        x={variant.rectX}
                        y={variant.rectY}
                        width={variant.rectWidth}
                        height={labelHeight}
                        fill={variant.fill}
                      />
                      <text
                        fontSize={fontSizeLarge}
                        fill="white"
                        x={variant.textX}
                        y={variant.textY}
                        textLength={variant.textLength}
                      >
                        {variant.rsid}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
            <g id="motifs">
              {motifsList.map((motif, i) => {
                return (
                  <React.Fragment key={motif.pwm}>
                    <MotifDnaLogo
                      pwm={motif.dataMatrix}
                      strand={motif.strand}
                      startX={motif.start - offsetXForVariant - 0.5}
                      startY={motifPositionY + i * 50}
                      scaleX={baseWidth}
                    />
                    <text
                      fontSize={fontSizeLarge}
                      className="fill-data-label"
                      x={viewBoxMinX}
                      y={motifPositionY + i * baseHeight + baseHeight * 0.7}
                    >
                      motif target: {motif.targets}
                    </text>
                  </React.Fragment>
                );
              })}
            </g>
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
/**
 * The function returns the max number of alts a SNP has in the list of nearby SNPs.
 * @param {*} nearbySnps a list of nearby SNPs
 * @returns The max number of alts a SNP has in the list
 */
function getAltMaxNum(nearbySnps) {
  let max = 1;
  for (let i = 0; i < nearbySnps.length; i++) {
    const altNum = Object.keys(nearbySnps[i].alt_allele_freq).length;
    if (altNum > max) {
      max = altNum;
    }
  }
  return max;
}
