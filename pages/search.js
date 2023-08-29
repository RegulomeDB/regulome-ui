import PropTypes from "prop-types";
import React, { useState } from "react";
import _ from "lodash";
import Breadcrumbs from "../components/breadcrumbs";
import {
  DataArea,
  DataItemLabel,
  DataItemValue,
  DataPanel,
} from "../components/data-area";
import { Button } from "../components/form-elements";
import Notifications from "../components/notifications";
import PagePreamble from "../components/page-preamble";
import RegulomeVersionTag from "../components/regulome-version-tag";
import SnpsDiagram from "../components/snps-diagram";
import errorObjectToProps from "../lib/errors";
import FetchRequest from "../lib/fetch-request";
import filterOverlappingPeaks from "../lib/filter-overlapping-peaks";
import getSnpsInfo from "../lib/get-snps-info";
import { getQueryStringFromServerQuery } from "../lib/query-utils";

// Default number of populations to display for allele frequencies.
const defaultDisplayCount = 3;

export default function Search({ data }) {
  const [showMoreFreqs, setShowMoreFreqs] = useState(false);
  if (Object.keys(data.notifications).length === 0) {
    const hitSnps = getSnpsInfo(data);
    const coordinates = data.query_coordinates[0];
    const allData = data["@graph"] || [];
    const QTLData = allData.filter(
      (d) => d.method && d.method.indexOf("QTL") !== -1
    );

    const chromatinData = allData.filter((d) => d.method === "chromatin state");
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
      // eslint-disable-next-line no-plusplus
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
        <DataPanel>
          <DataArea>
            <DataItemLabel>Searched Coordinates</DataItemLabel>
            <DataItemValue>{coordinates}</DataItemValue>
            <DataItemLabel>Genome Assembly</DataItemLabel>
            <DataItemValue>{data.assembly}</DataItemValue>
            <DataItemLabel>Rank</DataItemLabel>
            <DataItemValue>{data.regulome_score.ranking}</DataItemValue>
            <DataItemLabel>Score</DataItemLabel>
            <DataItemValue>{data.regulome_score.probability}</DataItemValue>
            <DataItemLabel>Number of Total Peaks</DataItemLabel>
            <DataItemValue>{numberOfPeaks}</DataItemValue>
            <DataItemLabel>Number of ChIP-seq Peaks</DataItemLabel>
            <DataItemValue>{chipData.length}</DataItemValue>
            <DataItemLabel>Number of Accessibility Peaks</DataItemLabel>
            <DataItemValue>{dnaseData.length}</DataItemValue>
            <DataItemLabel>Number of Motifs Peaks</DataItemLabel>
            <DataItemValue>{motifsData.length}</DataItemValue>
            <DataItemLabel>Number of QTL Peaks</DataItemLabel>
            <DataItemValue>{QTLData.length}</DataItemValue>
            <DataItemLabel>Number of Histone ChIP-seq Peaks</DataItemLabel>
            <DataItemValue>{histoneData.length}</DataItemValue>
            <DataItemLabel>
              Number of Files to Show in Genome Browser
            </DataItemLabel>
            <DataItemValue>{filesForGenomeBrowser.length}</DataItemValue>
            <DataItemLabel>Number of Chromatin State Datasets</DataItemLabel>
            <DataItemValue>{chromatinData.length}</DataItemValue>
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
                  {hitSnps[rsid].length > defaultDisplayCount ? (
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
        {data.nearby_snps?.length > 0 ? <SnpsDiagram data={data} /> : null}
        <div id="container"></div>
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
};

export async function getServerSideProps({ query }) {
  const queryString = getQueryStringFromServerQuery(query);
  const request = new FetchRequest();
  const data = await request.getObject(`/search?${queryString}`);
  if (FetchRequest.isResponseSuccess(data)) {
    const breadcrumbs = [
      {
        title: "Search",
        href: `/search?${queryString}`,
      },
    ];
    return {
      props: {
        data,
        breadcrumbs,
        pageContext: {
          title:
            data.query_coordinates.length < 1
              ? "Search"
              : data.query_coordinates[0],
        },
      },
    };
  }
  return errorObjectToProps(data);
}
