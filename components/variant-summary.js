import dynamic from "next/dynamic";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { XCircleIcon } from "@heroicons/react/20/solid";
import Image from "next/image";

import {
  DataArea,
  DataAreaTitle,
  DataItemLabel,
  DataItemValue,
  DataPanel,
} from "./data-area";
import { Button } from "./form-elements";
import SnpsDiagram from "./snps-diagram";
import VariantLDTable from "./variant-ld-table";
import {
  getFilteredData,
  getOrganFacetsForTissueScore,
  getOrganFilter,
} from "../lib/tissue-specific-score";
import { BodyMapThumbnailAndModal } from "./body-map";
import { TissueScoreBar } from "./tissue-score-bar";
import {
  getAccessibilityDatasets,
  getChipDatasets,
  getFilesForGenomeBrowser,
  getQtlDatasets,
} from "../lib/datasets-proccessing";
import { Card } from "./card";
import Motifs from "./motifs-view";
import { getChromatinData } from "../lib/chromatin-data";
import ChromatinBarChart from "./chromatin-bar-chart";
import Sparkline from "./sparkline";

// To dynamically load component AccessibilityChart on the client side,
// use the ssr option to disable server-rendering since AccessibilityChart relies on browser APIs like window.
const AccessibilityChart = dynamic(() => import("./accessibility-chart"), {
  ssr: false,
});
const ChipDataBarChart = dynamic(() => import("./chip-data-bar-chart"), {
  ssr: false,
});
const QTLChart = dynamic(() => import("./qtl-chart"), {
  ssr: false,
});

// Default number of populations to display for allele frequencies.
const DEFAULT_DISPLAY_COUNT = 3;

function Selections({ filters, clearFilterFunc }) {
  return (
    <div>
      <span>Selected filters:</span>
      {filters.map((filter) => {
        return (
          <button
            key={`${filter}-selected-filter`}
            onClick={() => clearFilterFunc(filter)}
            className="flex text-data-label text-sm"
          >
            <XCircleIcon className="h-5" />
            {filter}
          </button>
        );
      })}
    </div>
  );
}

Selections.propTypes = {
  filters: PropTypes.array.isRequired,
  clearFilterFunc: PropTypes.func.isRequired,
};

export default function VariantSummary({
  coordinates,
  data,
  hitSnps,
  motifDocList,
  variantLD,
  normalizedTissueSpecificScore,
  assembly,
  queryString,
}) {
  const [showMoreFreqs, setShowMoreFreqs] = useState(false);
  const [organFilters, setOrganFilters] = useState([]);
  const filteredData = getFilteredData(data["@graph"], organFilters);
  const filesForGenomeBrowser = getFilesForGenomeBrowser(filteredData);
  const accessibilityDatasets = getAccessibilityDatasets(filteredData);
  const chipDatasets = getChipDatasets(filteredData);
  const qtlDatasets = getQtlDatasets(filteredData);
  const chromatinDatasets = getChromatinData(filteredData);
  function handleClickOrgan(organ, organList, enabledOrganList) {
    const filters = getOrganFilter(
      organFilters,
      organ,
      organList,
      enabledOrganList
    );
    setOrganFilters(filters);
  }

  return (
    <>
      <DataAreaTitle>Scores</DataAreaTitle>
      <div className="grid grid-cols-1 lg:space-x-4 lg:grid-cols-3">
        <DataPanel className="grid place-items-center">
          <div className="relative w-64">
            <div>
              <BodyMapThumbnailAndModal
                data={data["@graph"]}
                assembly={assembly}
                organFilters={organFilters}
                handleClickOrgan={handleClickOrgan}
                getOrganFacetsForTissue={getOrganFacetsForTissueScore}
                normalizedTissueSpecificScore={normalizedTissueSpecificScore}
                colorBy={"Colored by tissue specific score"}
                width={"w-10/12"}
              />
              {organFilters.length > 0 && (
                <Selections
                  filters={organFilters}
                  clearFilterFunc={handleClickOrgan}
                />
              )}
            </div>
            <div className="absolute top-12 right-6 h-48">
              <TissueScoreBar
                normalizedTissueSpecificScore={normalizedTissueSpecificScore}
              />
            </div>
          </div>
        </DataPanel>
        <DataPanel className="col-span-2">
          <DataArea>
            <DataItemLabel>Searched Coordinates</DataItemLabel>
            <DataItemValue>{coordinates}</DataItemValue>
            <DataItemLabel>Genome Assembly</DataItemLabel>
            <DataItemValue>{data.assembly}</DataItemValue>
            <DataItemLabel>Global Rank</DataItemLabel>
            <DataItemValue>{data.regulome_score.ranking}</DataItemValue>
            <DataItemLabel>Global Score</DataItemLabel>
            <DataItemValue>{data.regulome_score.probability}</DataItemValue>
            <DataItemLabel>Tissue Specific Scores</DataItemLabel>
            <div className="w-11/12">
              <Sparkline
                scores={data.regulome_score.tissue_specific_scores}
                maxBarThickness={8}
                thumbnail
              />
            </div>

            {Object.keys(hitSnps).length > 0 && (
              <>
                {Object.keys(hitSnps).map((rsid) => (
                  <React.Fragment key={rsid}>
                    <DataItemLabel>{rsid}</DataItemLabel>
                    <DataItemValue>
                      <div>
                        {hitSnps[rsid].slice(0, 3).map((populationInfo) => (
                          <div
                            key={populationInfo.population}
                          >{`${populationInfo.info} (${populationInfo.population})`}</div>
                        ))}
                      </div>
                      {hitSnps[rsid].length > 3 && showMoreFreqs ? (
                        <div>
                          {hitSnps[rsid]
                            .slice(3, hitSnps[rsid].length)
                            .map((populationInfo) => (
                              <div
                                key={populationInfo.population}
                              >{`${populationInfo.info} (${populationInfo.population})`}</div>
                            ))}
                        </div>
                      ) : null}
                      {hitSnps[rsid].length > DEFAULT_DISPLAY_COUNT ? (
                        <Button
                          type="secondary"
                          onClick={() => setShowMoreFreqs(!showMoreFreqs)}
                        >
                          {hitSnps[rsid].length - 3}{" "}
                          {showMoreFreqs ? "fewer" : "more"}
                        </Button>
                      ) : null}
                    </DataItemValue>
                  </React.Fragment>
                ))}
              </>
            )}
          </DataArea>
        </DataPanel>
      </div>

      {data.nearby_snps?.length > 0 ? <SnpsDiagram data={data} /> : null}
      <div id="container"></div>

      <DataAreaTitle>Summary</DataAreaTitle>
      <DataPanel>
        <div className="@container">
          <div className="grid gap-8 grid-cols-1 @2xl:grid-cols-2 p-3">
            <Card
              queryString={queryString}
              viewType={"browser"}
              title={"Genome Browser"}
              trackingLabel="tracks"
              datasets={filesForGenomeBrowser}
            >
              <Image
                src={
                  assembly === "hg19"
                    ? "/browser-thumbnail-hg19.png"
                    : "/browser-thumbnail-grch38.png"
                }
                alt="a screen shot of genome broswer view"
                width="0"
                height="0"
                sizes="100vw"
                className="w-full h-auto rounded-lg"
                priority
              />
            </Card>
            <Card
              queryString={queryString}
              viewType={"chip"}
              title={"ChIP Data"}
              trackingLabel="Datasets"
              datasets={chipDatasets}
            >
              {chipDatasets.length > 0 && (
                <ChipDataBarChart
                  chipData={chipDatasets}
                  height={500}
                  thumbnail
                />
              )}
            </Card>
            <Card
              queryString={queryString}
              viewType={"accessibility"}
              title={"Accessibility"}
              trackingLabel="Datasets"
              datasets={accessibilityDatasets}
            >
              {accessibilityDatasets.length > 0 && (
                <AccessibilityChart
                  accessibilityData={accessibilityDatasets}
                  height={500}
                  thumbnail
                />
              )}
            </Card>
            <Card
              queryString={queryString}
              viewType={"qtl"}
              title={"QTL Data"}
              trackingLabel="Datasets"
              datasets={qtlDatasets}
            >
              {qtlDatasets.length > 0 && (
                <QTLChart qtlData={qtlDatasets} height={500} thumbnail />
              )}
            </Card>
            <Card
              queryString={queryString}
              viewType={"motifs"}
              title={"Motifs"}
              trackingLabel="Motifs"
              datasets={motifDocList}
            >
              {motifDocList.length > 0 && (
                <Motifs
                  motifsList={
                    motifDocList.length > 3
                      ? motifDocList.slice(0, 3)
                      : motifDocList
                  }
                  sequence={data.sequence}
                  coordinates={coordinates}
                  assembly={data.assembly}
                  thumbnail
                />
              )}
            </Card>
            <Card
              queryString={queryString}
              viewType={"chromatin"}
              title={"Chromatin State"}
              trackingLabel="Datasets"
              datasets={chromatinDatasets}
            >
              {chromatinDatasets.length > 0 && (
                <ChromatinBarChart
                  chromatinData={chromatinDatasets}
                  assembly={assembly}
                  height={500}
                  thumbnail
                />
              )}
            </Card>
          </div>
        </div>
      </DataPanel>

      {variantLD.length > 0 && (
        <>
          <DataAreaTitle>Variant LD Table</DataAreaTitle>
          <DataPanel>
            <VariantLDTable data={variantLD} />
          </DataPanel>
        </>
      )}
    </>
  );
}

VariantSummary.propTypes = {
  data: PropTypes.object.isRequired,
  coordinates: PropTypes.string.isRequired,
  assembly: PropTypes.string.isRequired,
  hitSnps: PropTypes.object.isRequired,
  variantLD: PropTypes.array.isRequired,
  motifDocList: PropTypes.array.isRequired,
  normalizedTissueSpecificScore: PropTypes.object.isRequired,
  queryString: PropTypes.string.isRequired,
};
