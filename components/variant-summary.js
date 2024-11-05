import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { XCircleIcon } from "@heroicons/react/20/solid";

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
  getOrganFacetsForTissueScore,
  getOrganFilter,
} from "../lib/tissue-specific-score";
import { BodyMapThumbnailAndModal } from "./body-map";
import { TissueScoreBar } from "./tissue-score-bar";
import { Card } from "./card";
import Motifs from "./motifs-view";
import ChromatinBarChart from "./chromatin-bar-chart";
import Sparkline from "./sparkline";
import { getSortedFreqKeys } from "../lib/variant_data";

// To dynamically load those components on the client side,
// use the ssr option to disable server-rendering since AccessibilityChart relies on browser APIs like window.
const BarChart = dynamic(() => import("./bar-chart"), {
  ssr: false,
});
const ChipDataBarChart = dynamic(() => import("./chip-data-bar-chart"), {
  ssr: false,
});

const NearbyDiagram = dynamic(() => import("./nearby-diagram"), {
  ssr: false,
});

// Default number of populations to display for allele frequencies.
const DEFAULT_DISPLAY_COUNT_HG19 = 3;
const DEFAULT_DISPLAY_COUNT_GRCH38 = 2;

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
  data,
  hitSnps,
  nearbyData,
  motifDocList,
  variantLD,
  normalizedTissueSpecificScore,
  queryString,
  organFilters,
  setOrganFilters,
  filesForGenomeBrowser,
  accessibilityDatasets,
  chipDatasets,
  qtlDatasets,
  chromatinDatasets,
}) {
  const [showMoreFreqs, setShowMoreFreqs] = useState(false);
  function handleClickOrgan(organ, organList, enabledOrganList) {
    const filters = getOrganFilter(
      organFilters,
      organ,
      organList,
      enabledOrganList
    );
    setOrganFilters(filters);
  }
  // get the list of frequency keys if the key has a non-null value
  const freqKeys = data.variants[0].freq
    ? Object.keys(data.variants[0].freq).filter(
        (key) => data.variants[0].freq[key] !== null
      )
    : [];
  // freqKeys is an array contains possible keys like bravo_af and gnomad_af_total, etc. Sort the keys to make sure bravo_af is always the first one and gnomad_af_total is always the second one.
  const sortedFreqKeys = getSortedFreqKeys(freqKeys);

  return (
    <>
      <DataAreaTitle>Scores</DataAreaTitle>
      {data.assembly === "GRCh38" ? (
        <>
          <div className="grid grid-cols-1 lg:space-x-4 lg:grid-cols-3">
            <DataPanel className="grid place-items-center">
              <div className="relative w-64">
                <div>
                  <BodyMapThumbnailAndModal
                    data={data["@graph"]}
                    assembly={data.assembly}
                    organFilters={organFilters}
                    handleClickOrgan={handleClickOrgan}
                    getOrganFacetsForTissue={getOrganFacetsForTissueScore}
                    normalizedTissueSpecificScore={
                      normalizedTissueSpecificScore
                    }
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
                    normalizedTissueSpecificScore={
                      normalizedTissueSpecificScore
                    }
                  />
                </div>
              </div>
            </DataPanel>
            <DataPanel className="col-span-2">
              <DataArea>
                <DataItemLabel>Searched Coordinates</DataItemLabel>
                <DataItemValue>{data.query_coordinates[0]}</DataItemValue>
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
                {data.variants[0].spdi && (
                  <>
                    <DataItemLabel>SPDI</DataItemLabel>
                    <DataItemValue>{data.variants[0].spdi}</DataItemValue>
                    <DataItemLabel>HGVS</DataItemLabel>
                    <DataItemValue>{data.variants[0].hgvs}</DataItemValue>
                    <DataItemLabel>Ref</DataItemLabel>
                    <DataItemValue>{data.variants[0].ref}</DataItemValue>
                    <DataItemLabel>Alt</DataItemLabel>
                    <DataItemValue>{data.variants[0].alt}</DataItemValue>
                  </>
                )}
                {data.variants[0].rsids?.length > 0 && (
                  <>
                    <DataItemLabel>rsID</DataItemLabel>
                    <DataItemValue>
                      {data.variants[0].rsids.join(", ")}
                    </DataItemValue>
                  </>
                )}
                {data.variants[0].gencode_category && (
                  <>
                    <DataItemLabel>GENCODE Category</DataItemLabel>
                    <DataItemValue>
                      {data.variants[0].gencode_category}
                    </DataItemValue>
                  </>
                )}
              </DataArea>
            </DataPanel>
          </div>
          {sortedFreqKeys.length > 0 && (
            <>
              <DataAreaTitle>Variant Allele Frequencies</DataAreaTitle>
              <DataPanel>
                <DataArea>
                  {Object.keys(hitSnps).map((rsid) => (
                    <React.Fragment key={rsid}>
                      <DataItemLabel>Frequency</DataItemLabel>
                      <DataItemValue>
                        <div>
                          {sortedFreqKeys
                            .slice(0, DEFAULT_DISPLAY_COUNT_GRCH38)
                            .map((key) => (
                              <div
                                key={key}
                              >{`${key} (${data.variants[0].freq[key]})`}</div>
                            ))}
                        </div>
                        {sortedFreqKeys.length > DEFAULT_DISPLAY_COUNT_GRCH38 &&
                        showMoreFreqs ? (
                          <div>
                            {sortedFreqKeys
                              .slice(
                                DEFAULT_DISPLAY_COUNT_GRCH38,
                                sortedFreqKeys.length
                              )
                              .map((key) => (
                                <div
                                  key={key}
                                >{`${key} (${data.variants[0].freq[key]})`}</div>
                              ))}
                          </div>
                        ) : null}
                        {sortedFreqKeys.length >
                        DEFAULT_DISPLAY_COUNT_GRCH38 ? (
                          <Button
                            type="secondary"
                            onClick={() => setShowMoreFreqs(!showMoreFreqs)}
                          >
                            {sortedFreqKeys.length -
                              DEFAULT_DISPLAY_COUNT_GRCH38}{" "}
                            {showMoreFreqs ? "fewer" : "more"}
                          </Button>
                        ) : null}
                      </DataItemValue>
                    </React.Fragment>
                  ))}
                </DataArea>
              </DataPanel>
            </>
          )}
        </>
      ) : (
        <DataPanel>
          <DataArea>
            <DataItemLabel>Searched Coordinates</DataItemLabel>
            <DataItemValue>{data.query_coordinates[0]}</DataItemValue>
            <DataItemLabel>Genome Assembly</DataItemLabel>
            <DataItemValue>{data.assembly}</DataItemValue>
            <DataItemLabel>Global Rank</DataItemLabel>
            <DataItemValue>{data.regulome_score.ranking}</DataItemValue>
            <DataItemLabel>Global Score</DataItemLabel>
            <DataItemValue>{data.regulome_score.probability}</DataItemValue>

            {Object.keys(hitSnps).length > 0 && (
              <>
                {Object.keys(hitSnps).map((rsid) => (
                  <React.Fragment key={rsid}>
                    <DataItemLabel>{rsid}</DataItemLabel>
                    <DataItemValue>
                      <div>
                        {hitSnps[rsid]
                          .slice(0, DEFAULT_DISPLAY_COUNT_HG19)
                          .map((populationInfo) => (
                            <div
                              key={populationInfo.population}
                            >{`${populationInfo.info} (${populationInfo.population})`}</div>
                          ))}
                      </div>
                      {hitSnps[rsid].length > DEFAULT_DISPLAY_COUNT_HG19 &&
                      showMoreFreqs ? (
                        <div>
                          {hitSnps[rsid]
                            .slice(
                              DEFAULT_DISPLAY_COUNT_HG19,
                              hitSnps[rsid].length
                            )
                            .map((populationInfo) => (
                              <div
                                key={populationInfo.population}
                              >{`${populationInfo.info} (${populationInfo.population})`}</div>
                            ))}
                        </div>
                      ) : null}
                      {hitSnps[rsid].length > DEFAULT_DISPLAY_COUNT_HG19 ? (
                        <Button
                          type="secondary"
                          onClick={() => setShowMoreFreqs(!showMoreFreqs)}
                        >
                          {hitSnps[rsid].length - DEFAULT_DISPLAY_COUNT_HG19}{" "}
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
      )}

      {data.assembly === "GRCh38" ? (
        <NearbyDiagram
          data={data}
          nearbyData={nearbyData}
          variantLD={variantLD}
          motifsList={motifDocList}
        />
      ) : data.nearby_snps?.length > 0 ? (
        <SnpsDiagram data={data} />
      ) : null}

      <DataAreaTitle>Summary</DataAreaTitle>
      <DataPanel>
        <div className="@container">
          <div className="grid gap-8 grid-cols-1 @2xl:grid-cols-2 p-3">
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
                  coordinates={data.query_coordinates[0]}
                  assembly={data.assembly}
                  thumbnail
                />
              )}
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
                <BarChart
                  data={accessibilityDatasets}
                  datasetsLabel="Number of accessibility datasets"
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
                <BarChart
                  data={qtlDatasets}
                  datasetsLabel="Number of QTL datasets"
                  height={500}
                  thumbnail
                />
              )}
            </Card>
            <Card
              queryString={queryString}
              viewType={"browser"}
              title={"Genome Browser"}
              trackingLabel="Tracks"
              datasets={filesForGenomeBrowser}
            >
              <Image
                src={
                  data.assembly === "hg19"
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
              viewType={"chromatin"}
              title={"Chromatin State"}
              trackingLabel="Datasets"
              datasets={chromatinDatasets}
            >
              {chromatinDatasets.length > 0 && (
                <ChromatinBarChart
                  chromatinData={chromatinDatasets}
                  assembly={data.assembly}
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
  hitSnps: PropTypes.object.isRequired,
  nearbyData: PropTypes.object.isRequired,
  variantLD: PropTypes.array.isRequired,
  motifDocList: PropTypes.array.isRequired,
  normalizedTissueSpecificScore: PropTypes.object.isRequired,
  queryString: PropTypes.string.isRequired,
  // selected organs in a list
  organFilters: PropTypes.array.isRequired,
  // function to set organFilters
  setOrganFilters: PropTypes.func.isRequired,
  filesForGenomeBrowser: PropTypes.array.isRequired,
  chipDatasets: PropTypes.array.isRequired,
  accessibilityDatasets: PropTypes.array.isRequired,
  qtlDatasets: PropTypes.array.isRequired,
  chromatinDatasets: PropTypes.array.isRequired,
};
