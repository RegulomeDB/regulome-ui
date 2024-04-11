import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
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
import { getChromatinData } from "../lib/chromatin-data";
import errorObjectToProps from "../lib/errors";
import fetchMotifDoc from "../lib/fetch-motif-doc";
import FetchRequest from "../lib/fetch-request";
import getSnpsInfo from "../lib/get-snps-info";
import { getQueryStringFromServerQuery } from "../lib/query-utils";
import { GenomeBrowserView } from "../components/genome-browser-view";
import fetchVariantLD from "../lib/fetch_variant_ld";
import {
  getDataWithTissueScore,
  getFilteredData,
  getNormalizedTissueSpecificScore,
} from "../lib/tissue-specific-score";
import VariantSummary from "../components/variant-summary";
import SearchPageHeader from "../components/search-page-header";
import { useRouter } from "next/router";
import {
  getAccessibilityDatasets,
  getChipDatasets,
  getFilesForGenomeBrowser,
  getQtlDatasets,
} from "../lib/datasets-processing";
import fetchNearby from "../lib/fetch-nearby";

export default function Search({
  data,
  nearbyData,
  motifDocList,
  variantLD,
  queryString,
}) {
  const [view, setView] = useState("summary");
  const router = useRouter();
  const [organFilters, setOrganFilters] = useState([]);
  const [stateFilters, setStateFilters] = useState([]);
  const [biosampleFilters, setBiosampleFilters] = useState([]);

  useEffect(() => {
    if (router.asPath.includes(`#!accessibility`)) {
      setView("accessibility");
    } else if (router.asPath.includes(`#!chip`)) {
      setView("chip");
    } else if (router.asPath.includes(`#!qtl`)) {
      setView("qtl");
    } else if (router.asPath.includes(`#!motifs`)) {
      setView("motifs");
    } else if (router.asPath.includes(`#!chromatin`)) {
      setView("chromatin");
    } else if (router.asPath.includes(`#!browser`)) {
      setView("browser");
    } else {
      setView("summary");
    }
  }, [router]);
  if (Object.keys(data.notifications).length === 0) {
    const hitSnps = getSnpsInfo(data);
    const normalizedTissueSpecificScore = getNormalizedTissueSpecificScore(
      data.regulome_score.tissue_specific_scores
    );
    const allData = getDataWithTissueScore(data, normalizedTissueSpecificScore);
    const filteredData = getFilteredData(allData, organFilters);
    const filesForGenomeBrowser = getFilesForGenomeBrowser(filteredData);
    const accessibilityDatasets = getAccessibilityDatasets(filteredData);
    const chipDatasets = getChipDatasets(filteredData);
    const qtlDatasets = getQtlDatasets(filteredData);
    const chromatinDatasets = getChromatinData(filteredData);
    const chromatinData = getChromatinData(allData);

    return (
      <>
        <RegulomeVersionTag />
        <Navigation />
        <Breadcrumbs />
        <PagePreamble />
        <SearchPageHeader
          queryString={queryString}
          motifDocListNum={motifDocList.length}
          chipDatasetsNum={chipDatasets.length}
          accessibilityDatasetsNum={accessibilityDatasets.length}
          qtlDatasetsNum={qtlDatasets.length}
          filesForGenomeBrowserNum={filesForGenomeBrowser.length}
          chromatinDatasetsNum={chromatinDatasets.length}
        />
        {view === "summary" && (
          <VariantSummary
            data={data}
            nearbyData={nearbyData}
            motifDocList={motifDocList}
            hitSnps={hitSnps}
            variantLD={variantLD}
            normalizedTissueSpecificScore={normalizedTissueSpecificScore}
            queryString={queryString}
            organFilters={organFilters}
            setOrganFilters={setOrganFilters}
            filteredData={filteredData}
            filesForGenomeBrowser={filesForGenomeBrowser}
            accessibilityDatasets={accessibilityDatasets}
            chipDatasets={chipDatasets}
            qtlDatasets={qtlDatasets}
            chromatinDatasets={chromatinDatasets}
          />
        )}
        {view === "chip" && (
          <ChipDataView chipData={chipDatasets}></ChipDataView>
        )}
        {view === "accessibility" && (
          <AccessibilityDataView
            data={accessibilityDatasets}
            normalizedTissueSpecificScore={normalizedTissueSpecificScore}
            assembly={data.assembly}
            organFilters={organFilters}
            setOrganFilters={setOrganFilters}
          ></AccessibilityDataView>
        )}
        {view === "qtl" && (
          <QTLDataView
            data={qtlDatasets}
            normalizedTissueSpecificScore={normalizedTissueSpecificScore}
            assembly={data.assembly}
            organFilters={organFilters}
            setOrganFilters={setOrganFilters}
          ></QTLDataView>
        )}
        {view === "motifs" && (
          <Motifs
            motifsList={motifDocList}
            sequence={data.sequence}
            coordinates={data.query_coordinates[0]}
            assembly={data.assembly}
          ></Motifs>
        )}
        {view === "chromatin" && (
          <ChromatinView
            data={chromatinData}
            normalizedTissueSpecificScore={normalizedTissueSpecificScore}
            assembly={data.assembly}
            organFilters={organFilters}
            setOrganFilters={setOrganFilters}
            stateFilters={stateFilters}
            setStateFilters={setStateFilters}
            biosampleFilters={biosampleFilters}
            setBiosampleFilters={setBiosampleFilters}
          />
        )}
        {view === "browser" && (
          <GenomeBrowserView
            files={filesForGenomeBrowser}
            assembly={data.assembly}
            coordinates={data.query_coordinates[0]}
          />
        )}
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
  nearbyData: PropTypes.object.isRequired,
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
    let nearbyData = {};
    if (data.query_coordinates.length === 1) {
      motifDocList = await fetchMotifDoc(request, data["@graph"]);
      nearbyData = await fetchNearby(
        request,
        data.query_coordinates[0],
        data.assembly
      );
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
        nearbyData,
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
