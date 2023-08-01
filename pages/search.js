// node_modules

import PropTypes from "prop-types";
import { API_URL } from "../lib/constants";

export default function Page({ data }) {
  return <div dangerouslySetInnerHTML={{ __html: data }} />;
}

Page.propTypes = {
  data: PropTypes.string.isRequired,
};

export async function getServerSideProps({ query }) {
  console.log(query);
  const queryElements = [];
  for (const [key, value] of Object.entries(query)) {
    const element = key + "=" + value;
    queryElements.push(element);
  }
  const queryString = queryElements.join("&");
  console.log(queryString);
  const url = API_URL + "/search?" + queryString;
  console.log(url);

  const response = await fetch(url);
  const data = await response.text();

  return {
    props: {
      data,
    },
  };
}
