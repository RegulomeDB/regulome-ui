import PropTypes from "prop-types";
import { API_URL } from "../lib/constants";
import { getQueryStringFromServerQuery } from "../lib/query-utils";
import Breadcrumbs from "../components/breadcrumbs";
import JsonDisplay from "../components/json-display";
import PagePreamble from "../components/page-preamble";

export default function Search({ data }) {
  return (
    <>
      <Breadcrumbs />
      <PagePreamble />
      <JsonDisplay item={data} />
    </>
  );
}

Search.propTypes = {
  data: PropTypes.string.isRequired,
};

export async function getServerSideProps({ query }) {
  const queryString = getQueryStringFromServerQuery(query);
  const url = `${API_URL}/search?${queryString}`;
  const response = await fetch(url);
  const data = await response.json();
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
      pageContext: { title: "Search" },
    },
  };
}
