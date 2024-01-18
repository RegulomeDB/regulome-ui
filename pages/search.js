import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import _ from "lodash";
import { AccessibilityDataView } from "../components/accessibility-view";
import Breadcrumbs from "../components/breadcrumbs";
import { ChipDataView } from "../components/chip-data-view";
import { ChromatinView } from "../components/chromatin-view";
import {
  DataArea,
  DataAreaTitle,
  DataItemLabel,
  DataItemValue,
  DataPanel,
} from "../components/data-area";
import { Button } from "../components/form-elements";
import Motifs from "../components/motifs-view";
import Notifications from "../components/notifications";
import PagePreamble from "../components/page-preamble";
import { QTLDataView } from "../components/qtl-data-view";
import RegulomeVersionTag from "../components/regulome-version-tag";
import {
  ScoreDataArea,
  ScoreDataItem,
} from "../components/score-view-data-area";
import SearchPageHeader from "../components/search-page-header";
import SnpsDiagram from "../components/snps-diagram";
import { getChromatinData } from "../lib/chromatin-data";
import errorObjectToProps from "../lib/errors";
import fetchMotifDoc from "../lib/fetch-motif-doc";
import FetchRequest from "../lib/fetch-request";
import filterOverlappingPeaks from "../lib/filter-overlapping-peaks";
import getSnpsInfo from "../lib/get-snps-info";
import { getQueryStringFromServerQuery } from "../lib/query-utils";
import { GenomeBrowserView } from "../components/genome-browser-view";
import fetchVariantLD from "../lib/fetch_variant_ld";
import VariantLDTable from "../components/variant-ld-table";

// Default number of populations to display for allele frequencies.
const DEFAULT_DISPLAY_COUNT = 3;

export default function Search({ data, motifDocList, variantLD, queryString }) {
  const [showMoreFreqs, setShowMoreFreqs] = useState(false);
  const [showScoreView, setShowScoreView] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const isScoreView = !router.asPath.includes(`#!`);
    setShowScoreView(isScoreView);
  }, [router]);

  if (Object.keys(data.notifications).length === 0) {
    const hitSnps = getSnpsInfo(data);
    const coordinates = data.query_coordinates[0];
    const allData = data["@graph"] || [];
    const QTLData = allData.filter(
      (d) => d.method && d.method.indexOf("QTL") !== -1
    );

    const chromatinData = getChromatinData(allData);
    const chipData = filterOverlappingPeaks(
      allData.filter((d) => d.method === "ChIP-seq")
    );
    const dnaseData = filterOverlappingPeaks(
      allData.filter(
        (d) =>
          d.method === "FAIRE-seq" ||
          d.method === "DNase-seq" ||
          d.method === "ATAC-seq"
      )
    );
    const histoneData = filterOverlappingPeaks(
      allData.filter((d) => d.method === "Histone ChIP-seq")
    );

    const motifsData = filterOverlappingPeaks(
      allData.filter((d) => d.method === "footprints" || d.method === "PWMs")
    );

    const duplicatedExperimentDatasets = data["@graph"].filter((d) =>
      d.dataset.includes("experiment")
    );
    // for some reason we are getting duplicates here so we need to filter those out
    const experimentDatasets = _.uniqBy(
      duplicatedExperimentDatasets,
      "dataset"
    );
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

    const numberOfPeaks =
      chipData.length +
      dnaseData.length +
      histoneData.length +
      QTLData.length +
      motifsData.length;

    return (
      <>
        <Breadcrumbs />
        <RegulomeVersionTag />
        <PagePreamble />
        <SearchPageHeader queryString={queryString} />
        {showScoreView && (
          <>
            <DataAreaTitle>Score</DataAreaTitle>
            <DataPanel>
              <ScoreDataArea>
                <ScoreDataItem
                  label="Searched Coordinates"
                  value={coordinates}
                ></ScoreDataItem>
                <ScoreDataItem
                  label="Genome Assembly"
                  value={data.assembly}
                ></ScoreDataItem>
                <ScoreDataItem
                  label="Rank"
                  value={data.regulome_score.ranking}
                ></ScoreDataItem>
                <ScoreDataItem
                  label="Score"
                  value={data.regulome_score.probability}
                ></ScoreDataItem>
                <ScoreDataItem
                  label="Number of Total Peaks"
                  value={numberOfPeaks}
                ></ScoreDataItem>
                <ScoreDataItem
                  label="Number of ChIP-seq Peaks"
                  value={chipData.length}
                ></ScoreDataItem>
                <ScoreDataItem
                  label="Number of Accessibility Peaks"
                  value={dnaseData.length}
                ></ScoreDataItem>
                <ScoreDataItem
                  label="Number of Motifs Peaks"
                  value={motifsData.length}
                ></ScoreDataItem>
                <ScoreDataItem
                  label="Number of QTL Peaks"
                  value={QTLData.length}
                ></ScoreDataItem>
                <ScoreDataItem
                  label="Number of Histone ChIP-seq Peaks"
                  value={histoneData.length}
                ></ScoreDataItem>
                <ScoreDataItem
                  label="Number of Files to Show in Genome Browser"
                  value={filesForGenomeBrowser.length}
                ></ScoreDataItem>
                <ScoreDataItem
                  label="Number of Chromatin State Datasets"
                  value={chromatinData.length}
                ></ScoreDataItem>
              </ScoreDataArea>
            </DataPanel>
            {Object.keys(hitSnps).length > 0 && (
              <>
                <DataAreaTitle>
                  SNPs Matching Searched Coordinates
                </DataAreaTitle>
                <DataPanel>
                  <DataArea>
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
                  </DataArea>
                </DataPanel>
              </>
            )}

            {data.nearby_snps?.length > 0 ? <SnpsDiagram data={data} /> : null}
            <div id="container"></div>

            {variantLD.length > 0 && (
              <>
                <DataAreaTitle>Variant LD Table</DataAreaTitle>
                <DataPanel>
                  <VariantLDTable data={variantLD} />
                </DataPanel>
              </>
            )}
          </>
        )}
        <ChipDataView chipData={chipData}></ChipDataView>
        <AccessibilityDataView data={dnaseData}></AccessibilityDataView>
        <QTLDataView data={QTLData}></QTLDataView>
        <Motifs
          motifsList={motifDocList}
          sequence={data.sequence}
          coordinates={coordinates}
          assembly={data.assembly}
        ></Motifs>
        <ChromatinView data={chromatinData} assembly={data.assembly} />
        <GenomeBrowserView
          files={filesForGenomeBrowser}
          assembly={data.assembly}
          coordinates={coordinates}
        />
      </>
    );
  }
  return (
    <>
      <Breadcrumbs />
      <RegulomeVersionTag />
      <PagePreamble />
      <Notifications notifications={data.notifications} />
    </>
  );
}

Search.propTypes = {
  data: PropTypes.object.isRequired,
  queryString: PropTypes.string.isRequired,
  motifDocList: PropTypes.array.isRequired,
  variantLD: PropTypes.array.isRequired,
};

export async function getServerSideProps({ query }) {
  const queryString = getQueryStringFromServerQuery(query);
  const request = new FetchRequest();
  const data = await request.getObject(`/search?${queryString}`);
  if (FetchRequest.isResponseSuccess(data)) {
    let motifDocList = [];
    let variantLD = [];
    if (data.query_coordinates.length === 1) {
      motifDocList = await fetchMotifDoc(request, data["@graph"]);
      if (query.ld) {
        const response = await fetchVariantLD(
          request,
          data.query_coordinates[0],
          data.assembly,
          query.r2,
          query.ancestry
        );
        if (Array.isArray(response)) {
          variantLD = response;
        }
      }
    }

    const breadcrumbs = [
      {
        title: "Search",
        href: `/search?${queryString}`,
      },
    ];
    return {
      props: {
        data,
        motifDocList,
        variantLD,
        breadcrumbs,
        pageContext: {
          title:
            data.query_coordinates.length < 1
              ? "Search"
              : `${data.query_coordinates[0]} (${data.regulome_score.probability})`,
        },
        queryString,
      },
    };
  }
  return errorObjectToProps(data);
}
