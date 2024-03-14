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
import filterOverlappingPeaks from "../lib/filter-overlapping-peaks";
import getSnpsInfo from "../lib/get-snps-info";
import { getQueryStringFromServerQuery } from "../lib/query-utils";
import { GenomeBrowserView } from "../components/genome-browser-view";
import fetchVariantLD from "../lib/fetch_variant_ld";
import {
  getDataWithTissueScore,
  getNormalizedTissueSpecificScore,
} from "../lib/tissue-specific-score";
import VariantSummary from "../components/variant-summary";
import SearchPageHeader from "../components/search-page-header";
import { useRouter } from "next/router";
import {
  getChipDatasets,
  getFilesForGenomeBrowser,
} from "../lib/datasets-proccessing";

export default function Search({ data, motifDocList, variantLD, queryString }) {
  const [view, setView] = useState("summary");
  const router = useRouter();

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
    const coordinates = data.query_coordinates[0];
    const normalizedTissueSpecificScore = getNormalizedTissueSpecificScore(
      data.regulome_score.tissue_specific_scores
    );
    const allData = getDataWithTissueScore(data, normalizedTissueSpecificScore);
    const QTLData = allData.filter(
      (d) => d.method && d.method.indexOf("QTL") !== -1
    );
    const chromatinData = getChromatinData(allData);
    const chipData = getChipDatasets(allData);
    const accessibilityData = filterOverlappingPeaks(
      allData.filter(
        (d) =>
          d.method === "FAIRE-seq" ||
          d.method === "DNase-seq" ||
          d.method === "ATAC-seq"
      )
    );
    const filesForGenomeBrowser = getFilesForGenomeBrowser(data["@graph"]);

    return (
      <>
        <RegulomeVersionTag />
        <Navigation />
        <Breadcrumbs />
        <PagePreamble />
        <SearchPageHeader queryString={queryString} />
        {view === "summary" && (
          <VariantSummary
            coordinates={coordinates}
            data={data}
            motifDocList={motifDocList}
            hitSnps={hitSnps}
            variantLD={variantLD}
            normalizedTissueSpecificScore={normalizedTissueSpecificScore}
            assembly={data.assembly}
            queryString={queryString}
          />
        )}
        {view === "chip" && <ChipDataView chipData={chipData}></ChipDataView>}
        {view === "accessibility" && (
          <AccessibilityDataView
            data={accessibilityData}
            normalizedTissueSpecificScore={normalizedTissueSpecificScore}
            assembly={data.assembly}
          ></AccessibilityDataView>
        )}
        {view === "qtl" && (
          <QTLDataView
            data={QTLData}
            normalizedTissueSpecificScore={normalizedTissueSpecificScore}
            assembly={data.assembly}
          ></QTLDataView>
        )}
        {view === "motifs" && (
          <Motifs
            motifsList={motifDocList}
            sequence={data.sequence}
            coordinates={coordinates}
            assembly={data.assembly}
          ></Motifs>
        )}
        {view === "chromatin" && (
          <ChromatinView
            data={chromatinData}
            normalizedTissueSpecificScore={normalizedTissueSpecificScore}
            assembly={data.assembly}
          />
        )}
        {view === "browser" && (
          <GenomeBrowserView
            files={filesForGenomeBrowser}
            assembly={data.assembly}
            coordinates={coordinates}
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
