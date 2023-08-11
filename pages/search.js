import PropTypes from "prop-types";
import { useState } from "react";
import Router from "next/router";
import Breadcrumbs from "../components/breadcrumbs";
import { DataPanel, DataItemLabel } from "../components/data-area";
import JsonDisplay from "../components/json-display";
import PagePreamble from "../components/page-preamble";
import RegulomeVersionTag from "../components/regulome-version-tag";
import { API_URL } from "../lib/constants";
import { getQueryStringFromServerQuery } from "../lib/query-utils";

export default function Page({ data }) {
  const [showForm, setShowForm] = useState(true);
  const [fileInput, setFileInput] = useState("");
  const [jsonData, setJsondata] = useState(data);

  if (data) {
    return <JsonDisplay item={data} />;
  }

  // Handles the submit event on form submit.
  async function handleSubmit(event) {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.
    const textInput = event.target.regions.value;
    const assembly = event.target.assembly.value;
    const maf = event.target.maf.value;

    if (textInput && fileInput) {
      alert(
        "Only choose one method to set regions: throught text input or file upload"
      );
    } else if (!textInput && !fileInput) {
      alert("Please define region(s) for query");
    } else {
      const regions = textInput
        ? textInput.replace(/\s/g, " ")
        : fileInput.replace(/\s/g, " ");
      const queryString =
        maf === "1.1"
          ? `regions=${regions}&genome=${assembly}`
          : `regions=${regions}&genome=${assembly}&maf=${maf}`;
      const endpoint = `/api/search?${queryString}`;
      const response = await fetch(endpoint);
      data = await response.json();
      setShowForm(false);
      setJsondata(data);
      const query =
        maf === "1.1"
          ? {
              regions,
              genome: assembly,
            }
          : {
              regions,
              genome: assembly,
              maf,
            };
      Router.push(
        {
          pathname: "/search",
          query,
        },
        undefined,
        { shallow: true }
      );
    }
  }

  async function ReadText(event) {
    const file = event.target.files.item(0);
    const text = await file.text();
    setFileInput(text);
  }

  const inputClassName =
    "bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-brand";
  const buttonClassName =
    "shadow bg-brand focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded";

  return (
    <>
      <Breadcrumbs />
      <PagePreamble />
      {showForm ? (
        <>
          <RegulomeVersionTag />
          <DataPanel>
            <form onSubmit={handleSubmit}>
              <div className="flex items-center mb-6">
                <div className="w-1/3">
                  <DataItemLabel htmlFor="maf">MAF Score</DataItemLabel>
                </div>
                <div className="w-2/3">
                  <select className={inputClassName} name="maf">
                    <option value="1.1" defaultValue>
                      NA
                    </option>
                    <option value="0.2">0.2</option>
                    <option value="0.4">0.4</option>
                    <option value="0.6">0.6</option>
                    <option value="0.8">0.8</option>
                    <option value="1.0">0.8</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <div className="w-1/3">
                  <DataItemLabel htmlFor="assembly">Assembly</DataItemLabel>
                </div>
                <div className="w-2/3">
                  <select className={inputClassName} name="assembly">
                    <option value="GRCh38" defaultValue>
                      GRCh38
                    </option>
                    <option value="hg19">hg19</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <div className="w-1/3">
                  <DataItemLabel htmlFor="regions">Region(s)</DataItemLabel>
                </div>
                <div className="w-2/3">
                  <textarea
                    className={inputClassName}
                    id="regions"
                    name="regions"
                    rows="4"
                    cols="50"
                    placeholder="Enter rsID(s) OR region(s), one per line. For example: rs75982468, chr12:69360231-69360232."
                  ></textarea>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <div className="w-1/3">
                  <DataItemLabel htmlFor="file">Upload your file</DataItemLabel>
                </div>
                <div className="w-2/3">
                  <input
                    id="file"
                    name="file"
                    type="file"
                    accept=".txt, .tsv, .csv"
                    onChange={ReadText}
                  />
                </div>
              </div>
              <pre id="output"></pre>

              <div className="flex items-center">
                <div className="w-1/3"></div>
                <div className="w-2/3">
                  <button className={buttonClassName} type="submit">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </DataPanel>{" "}
        </>
      ) : (
        <JsonDisplay item={jsonData} />
      )}
    </>
  );
}

Page.propTypes = {
  // The query result to display
  data: PropTypes.object,
};

export async function getServerSideProps({ query }) {
  let data = null;
  if (Object.keys(query).length > 0) {
    const queryString = getQueryStringFromServerQuery(query);
    const url = `${API_URL}/search?${queryString}`;
    const response = await fetch(url);
    data = await response.json();
  }
  const breadcrumbs = [
    {
      title: "Search",
      href: "/search",
    },
  ];
  return {
    props: {
      breadcrumbs,
      pageContext: { title: "Search" },
      data,
    },
  };
}
