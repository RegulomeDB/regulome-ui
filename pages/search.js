import PropTypes from "prop-types";
import React, { useState } from "react";
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
import NearbySNPsDrawing from "../components/snps-diagram";
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
    const { hitSnps, sortedPopulations } = getSnpsInfo(data);
    const coordinates = data.query_coordinates[0];
    const allData = data["@graph"] || [];
    const chromatinData = allData.filter((d) => d.method === "chromatin state");
    const chipDataFilteredCount = filterOverlappingPeaks(
      allData.filter((d) => d.method === "ChIP-seq")
    )[1];
    const dnaseDataFilteredCount = filterOverlappingPeaks(
      allData.filter(
        (d) =>
          d.method === "FAIRE-seq" ||
          d.method === "DNase-seq" ||
          d.method === "ATAC-seq"
      )
    )[1];
    const numberOfPeaks =
      allData.length -
      chromatinData.length -
      chipDataFilteredCount -
      dnaseDataFilteredCount;
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
            <DataItemLabel>Number of Peaks</DataItemLabel>
            <DataItemValue>{numberOfPeaks}</DataItemValue>
            <DataItemLabel>Rank</DataItemLabel>
            <DataItemValue>{data.regulome_score.ranking}</DataItemValue>
            <DataItemLabel>Score</DataItemLabel>
            <DataItemValue>{data.regulome_score.probability}</DataItemValue>
            {Object.keys(hitSnps).map((rsid) => (
              <React.Fragment key={rsid}>
                <DataItemLabel>{rsid}</DataItemLabel>
                <DataItemValue>
                  <div>
                    {sortedPopulations[rsid].slice(0, 3).map((population) => (
                      <div
                        key={population}
                      >{`${hitSnps[rsid][population]} (${population})`}</div>
                    ))}
                  </div>
                  {sortedPopulations[rsid].length > 3 && showMoreFreqs ? (
                    <div>
                      {sortedPopulations[rsid]
                        .slice(3, hitSnps[rsid].length)
                        .map((population) => (
                          <div
                            key={population}
                          >{`${hitSnps[rsid][population]} (${population})`}</div>
                        ))}
                    </div>
                  ) : null}
                  {sortedPopulations[rsid].length > defaultDisplayCount ? (
                    <Button
                      type="secondary"
                      onClick={() => setShowMoreFreqs(!showMoreFreqs)}
                    >
                      {sortedPopulations[rsid].length - 3}{" "}
                      {showMoreFreqs ? "fewer" : "more"}
                    </Button>
                  ) : null}
                </DataItemValue>
              </React.Fragment>
            ))}
          </DataArea>
        </DataPanel>
        {data.nearby_snps && data.nearby_snps.length > 0 ? (
          <NearbySNPsDrawing data={data} />
        ) : null}
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
