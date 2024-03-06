import PropTypes from "prop-types";
import React from "react";
import _ from "lodash";
import { AccessibilityDataView } from "../components/accessibility-view";
import Breadcrumbs from "../components/breadcrumbs";
import { ChipDataView } from "../components/chip-data-view";
import { ChromatinView } from "../components/chromatin-view";
import Motifs from "../components/motifs-view";
import Navigation from "../components/navigation";
import Notifications from "../components/notifications";
import PagePreamble from "../components/page-preamble";
import { QTLDataView } from "../components/qtl-data-view";
import RegulomeVersionTag from "../components/regulome-version-tag";
import {
  TabGroup,
  TabList,
  TabPane,
  TabPanes,
  TabTitle,
} from "../components/tabs";
import { getChromatinData } from "../lib/chromatin-data";
import errorObjectToProps from "../lib/errors";
import fetchMotifDoc from "../lib/fetch-motif-doc";
import FetchRequest from "../lib/fetch-request";
import filterOverlappingPeaks from "../lib/filter-overlapping-peaks";
import getSnpsInfo from "../lib/get-snps-info";
import { getQueryStringFromServerQuery } from "../lib/query-utils";
import { GenomeBrowserView } from "../components/genome-browser-view";
import fetchVariantLD from "../lib/fetch_variant_ld";
import {
  getDataWithTissueScore,
  getNormalizedTissueSpecificScore,
} from "../lib/tissue-specific-score";
import ScoreView from "../components/score-view";

export default function Search({ data, motifDocList, variantLD }) {
  if (Object.keys(data.notifications).length === 0) {
    const hitSnps = getSnpsInfo(data);
    const coordinates = data.query_coordinates[0];
    const normalizedTissueSpecificScore = getNormalizedTissueSpecificScore(
      data.regulome_score.tissue_specific_scores
    );
    const allData = getDataWithTissueScore(data, normalizedTissueSpecificScore);
    const QTLData = allData.filter(
      (d) => d.method && d.method.indexOf("QTL") !== -1
    );
    const chromatinData = getChromatinData(allData);
    const chipData = filterOverlappingPeaks(
      allData.filter((d) => d.method === "ChIP-seq")
    );
    const accessibilityData = filterOverlappingPeaks(
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
      accessibilityData.length +
      histoneData.length +
      QTLData.length +
      motifsData.length;

    return (
      <>
        <RegulomeVersionTag />
        <Navigation />
        <Breadcrumbs />
        <PagePreamble />
        <TabGroup>
          <TabList>
            <TabTitle>Summary</TabTitle>
            <TabTitle>{`ChIP Data (${chipData.length})`}</TabTitle>
            <TabTitle>{`Accessibility Data (${accessibilityData.length})`}</TabTitle>
            <TabTitle>{`QTL Data (${QTLData.length})`}</TabTitle>
            <TabTitle>{`Motifs (${motifsData.length})`}</TabTitle>
            <TabTitle>{`Chromatin State (${chromatinData.length})`}</TabTitle>
            <TabTitle>{`Genome Browser (${filesForGenomeBrowser.length})`}</TabTitle>
          </TabList>
          <TabPanes>
            <TabPane>
              <ScoreView
                coordinates={coordinates}
                data={data}
                numberOfPeaks={numberOfPeaks}
                chipData={chipData}
                dnaseData={accessibilityData}
                motifsData={motifsData}
                QTLData={QTLData}
                histoneData={histoneData}
                filesForGenomeBrowser={filesForGenomeBrowser}
                chromatinData={chromatinData}
                hitSnps={hitSnps}
                variantLD={variantLD}
              />
            </TabPane>
            <TabPane>
              <ChipDataView chipData={chipData}></ChipDataView>
            </TabPane>
            <TabPane>
              <AccessibilityDataView
                data={accessibilityData}
                normalizedTissueSpecificScore={normalizedTissueSpecificScore}
                assembly={data.assembly}
              ></AccessibilityDataView>
            </TabPane>
            <TabPane>
              <QTLDataView
                data={QTLData}
                normalizedTissueSpecificScore={normalizedTissueSpecificScore}
                assembly={data.assembly}
              ></QTLDataView>
            </TabPane>
            <TabPane>
              <Motifs
                motifsList={motifDocList}
                sequence={data.sequence}
                coordinates={coordinates}
                assembly={data.assembly}
              ></Motifs>
            </TabPane>
            <TabPane>
              <ChromatinView
                data={chromatinData}
                normalizedTissueSpecificScore={normalizedTissueSpecificScore}
                assembly={data.assembly}
              />
            </TabPane>
            <TabPane>
              <GenomeBrowserView
                files={filesForGenomeBrowser}
                assembly={data.assembly}
                coordinates={coordinates}
              />
            </TabPane>
          </TabPanes>
        </TabGroup>
      </>
    );
  }
  return (
    <>
      <RegulomeVersionTag />
      <Navigation />
      <Breadcrumbs />
      <PagePreamble />
      <Notifications notifications={data.notifications} />
    </>
  );
}

Search.propTypes = {
  data: PropTypes.object.isRequired,
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
