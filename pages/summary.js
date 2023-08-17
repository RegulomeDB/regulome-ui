import PropTypes from "prop-types";
import { API_URL } from "../lib/constants";
import { getQueryStringFromServerQuery } from "../lib/query-utils";
import Breadcrumbs from "../components/breadcrumbs";
import JsonDisplay from "../components/json-display";
import PagePreamble from "../components/page-preamble";

export default function Page({ data }) {
  return (
    <>
      <Breadcrumbs />
      <PagePreamble />
      <JsonDisplay item={data.total === 0 ? data.notifications : data} />
    </>
  );
}

Page.propTypes = {
  data: PropTypes.object.isRequired,
};

export async function getServerSideProps({ query }) {
  const queryString = getQueryStringFromServerQuery(query);
  const url = `${API_URL}/summary?${queryString}`;
  const response = await fetch(url);
  const data = await response.json();

  const breadcrumbs = [
    {
      title: "Summary",
      href: `/summary?${queryString}`,
    },
  ];

  return {
    props: {
      data,
      breadcrumbs,
      pageContext: { title: "Summary" },
    },
  };
}
