// node_modules

import PropTypes from "prop-types";
import { API_URL } from "../lib/constants";
import Breadcrumbs from "../components/breadcrumbs";

export default function Page({ data }) {
  return (
    <>
      <Breadcrumbs />
      <h1>Summary</h1>
      <div dangerouslySetInnerHTML={{ __html: data }} />
    </>
  );
}

Page.propTypes = {
  data: PropTypes.string.isRequired,
};

export async function getServerSideProps({ query }) {
  const queryElements = [];
  for (const [key, value] of Object.entries(query)) {
    const element = key + "=" + value;
    queryElements.push(element);
  }
  const queryString = queryElements.join("&");
  const url = API_URL + "/summary?" + queryString;

  const response = await fetch(url);
  const data = await response.text();

  const breadcrumbs = [
    {
      title: "Summary",
      href: "query",
    },
  ];

  return {
    props: {
      data,
      breadcrumbs,
    },
  };
}
