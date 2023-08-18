import { useState } from "react";
import Router from "next/router";
import Breadcrumbs from "../components/breadcrumbs";
import { Button } from "../components/form-elements";
import { DataPanel, DataItemLabel } from "../components/data-area";
import Modal from "../components/modal";
import PagePreamble from "../components/page-preamble";
import RegulomeVersionTag from "../components/regulome-version-tag";

const inputClassName =
  "bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-brand";
const buttonClassName =
  "shadow bg-brand focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded";

export default function Page() {
  const [fileInput, setFileInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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
        "Only choose one method to set regions: through text input or file upload"
      );
    } else if (!textInput && !fileInput) {
      setIsOpen(true);
    } else {
      const regions = textInput
        ? textInput.trim().replace(/\s/g, " ")
        : fileInput.trim().replace(/\s/g, " ");
      const regionList = regions.split(" ");
      const isValidInput = validateRegions(regionList);
      if (!isValidInput) {
        setIsOpen(true);
      } else {
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
        Router.push({
          pathname: "/summary",
          query,
        });
      }
    }
  }

  async function readText(event) {
    const file = event.target.files.item(0);
    const text = await file.text();
    setFileInput(text);
  }

  function validateRegions(regions) {
    const chrRegionPattern = new RegExp(
      "^(chr[1-9]|chr1[0-9]|chr2[0-2]|chrx|chry):[0-9]+-[0-9]+$"
    );
    const rsidPattern = new RegExp("^rs[0-9]+$");
    for (let i = 0, max = regions.length; i < max; i++) {
      if (!chrRegionPattern.test(regions[i]) && !rsidPattern.test(regions[i])) {
        return false;
      }
    }
    return true;
  }

  return (
    <>
      <Breadcrumbs />
      <PagePreamble />

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
                  <option value="1.0">1.0</option>
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

            <div className=" items-center mb-6 hidden">
              <div className="w-1/3">
                <DataItemLabel htmlFor="file">Upload your file</DataItemLabel>
              </div>
              <div className="w-2/3">
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept=".txt, .tsv, .csv"
                  onChange={readText}
                />
              </div>
            </div>
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

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Header>Query Error</Modal.Header>
        <Modal.Body>
          <div>Please define valid region(s) for query.</div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export async function getServerSideProps() {
  const breadcrumbs = [
    {
      title: "Query",
      href: "/query",
    },
  ];
  return {
    props: {
      breadcrumbs,
      pageContext: { title: "Query" },
    },
  };
}
