import PropTypes from "prop-types";
import Breadcrumbs from "../components/breadcrumbs";
import {
  DataArea,
  DataItemLabel,
  DataItemValue,
  DataPanel,
} from "../components/data-area";
import Notifications from "../components/notifications";
import PagePreamble from "../components/page-preamble";
import RegulomeVersionTag from "../components/regulome-version-tag";
import errorObjectToProps from "../lib/errors";
import FetchRequest from "../lib/fetch-request";
import { getQueryStringFromServerQuery } from "../lib/query-utils";

export default function Search({ data }) {
  return (
    <>
      <Breadcrumbs />
      <RegulomeVersionTag />
      <PagePreamble />
      {data.total === 1 && (
        <DataPanel>
          <DataArea>
            <DataItemLabel>Searched Coordinates</DataItemLabel>
            <DataItemValue>{data.query_coordinates[0]}</DataItemValue>
            <DataItemLabel>Genome Assembly</DataItemLabel>
            <DataItemValue>{data.assembly}</DataItemValue>
            <DataItemLabel>Rank</DataItemLabel>
            <DataItemValue>{data.regulome_score.ranking}</DataItemValue>
            <DataItemLabel>Score</DataItemLabel>
            <DataItemValue>{data.regulome_score.probability}</DataItemValue>
          </DataArea>
        </DataPanel>
      )}
      {Object.keys(data.notifications).length > 0 && (
        <Notifications notifications={data.notifications} />
      )}
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
