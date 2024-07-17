import { useState } from "react";
import Router from "next/router";
import Breadcrumbs from "../components/breadcrumbs";
import { Button } from "../components/form-elements";
import { DataPanel, DataItemLabel } from "../components/data-area";
import Modal from "../components/modal";
import Navigation from "../components/navigation";
import PagePreamble from "../components/page-preamble";
import RegulomeVersionTag from "../components/regulome-version-tag";
import { validateRegions } from "../lib/validate-regions";
import ToggleSwitch from "../components/toggle-switch";

const inputClassName =
  "border-form-element bg-form-element text-form-element appearance-none border-2 rounded w-full py-2 px-4 leading-tight";
const buttonClassName =
  "shadow bg-brand focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded";
const exampleSnps =
  "rs75982468\nrs10117931\nrs11749731\nrs11160830\nrs2808110\nrs2839467\nrs147375898\nrs111686660\nrs11145227\nrs190318542\nrs148232663\nrs74792881\nrs3087079\nrs2166521\nrs62319725";
const exampleCoordinates =
  "chr12:69360231-69360232\nchr10:5852536-5852537\nchr10:11699181-11699182\nchr1:39026790-39026791\nchr1:109726205-109726206";

const exampleSnp = "rs10117931";
const exampleCoordinate = "chr9:4575119-4575120";
const exampleSpdi = "NC_000009.12:4575119:G:A";
const exampleHgvs = "NC_000009.12:g.4575120G>A";

export default function Query() {
  const [isOpen, setIsOpen] = useState(false);
  const [maf, setMaf] = useState("0.01");
  const [ancestry, setAncestry] = useState("");
  const [r2, setR2] = useState("0.8");
  const [textInput, setTextInput] = useState("");
  const [includeVariantsInLD, setIncludeVariantsInLD] = useState(true);
  const [modifyMaf, setModifyMaf] = useState(false);
  const [source, setSource] = useState("bravo_af");
  const [ldFieldsHidden, setLdFieldsHidden] = useState(false);
  const [isGrch38, setIsGrch38] = useState(true);

  // Handles the submit event on variants form submit.
  async function handleMultipleSubmit(event) {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    if (!textInput) {
      setIsOpen(true);
    } else {
      const assembly = isGrch38 ? "GRCh38" : "hg19";
      const regions = textInput.trim().replace(/\s/g, " ");
      const regionList = regions.split(" ");
      const isValidInput = validateRegions(regionList, assembly);
      if (!isValidInput) {
        setIsOpen(true);
      } else {
        const query = {
          regions,
          genome: assembly,
          source,
          maf,
        };
        if (includeVariantsInLD) {
          query.r2 = r2;
          query.ld = true;
          if (ancestry) {
            query.ancestry = ancestry;
          }
        }
        Router.push({
          pathname: "/summary",
          query,
        });
      }
    }
  }

  return (
    <>
      <RegulomeVersionTag />
      <Navigation />
      <Breadcrumbs />
      <PagePreamble />
      <ToggleSwitch
        isLeftOption={isGrch38}
        setIsLeftOption={setIsGrch38}
        leftOption="GRCh38"
        rightOption="hg19"
      />
      <DataPanel>
        <form onSubmit={handleMultipleSubmit}>
          <div className="flex items-center mb-6">
            <div className="w-1/3">
              <DataItemLabel>Input Variants</DataItemLabel>
            </div>
            <div className="w-2/3">
              <textarea
                className={inputClassName}
                id="region"
                name="region"
                autoComplete="off"
                rows="8"
                cols="50"
                placeholder="Enter the rsIDs, SPDIs, HGVSs or regions, one per line."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="flex items-center mb-6">
            <div className="w-1/3">
              <DataItemLabel htmlFor="include">
                Include Variants in LD
              </DataItemLabel>
            </div>
            <div className="w-2/3">
              <input
                className="mr-1"
                name="include"
                type="checkbox"
                checked={includeVariantsInLD}
                onChange={(e) => {
                  setIncludeVariantsInLD(e.target.checked);
                  setLdFieldsHidden(!e.target.checked);
                }}
              />
            </div>
          </div>

          <div
            className={`flex items-center mb-6 ${
              ldFieldsHidden ? "hidden" : ""
            }`}
          >
            <div className="w-1/3">
              <DataItemLabel htmlFor="ancestry">LD Ancestry</DataItemLabel>
            </div>
            <div className="w-2/3 relative">
              <select
                className={inputClassName}
                name="ancestry"
                value={ancestry}
                onChange={(e) => setAncestry(e.target.value)}
              >
                <option value="">ALL</option>

                <option value="EAS">EAS</option>
                <option value="EUR">EUR</option>
                <option value="AFR">AFR</option>
                <option value="SAS">SAS</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-800">
                <svg
                  className="fill-current h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div
            className={`flex items-center mb-6 ${
              ldFieldsHidden ? "hidden" : ""
            }`}
          >
            <div className="w-1/3">
              <DataItemLabel htmlFor="r2">
                R<sup>2</sup>{" "}
              </DataItemLabel>
            </div>
            <div className="w-2/3">
              <textarea
                className={inputClassName}
                id="r2"
                name="r2"
                rows="1"
                placeholder="Enter a value between 0.80  and 0.99, default to 0.8"
                onChange={(e) => setR2(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="flex items-center mb-6">
            <div className="w-1/3">
              <DataItemLabel htmlFor="include">Modify MAF Score</DataItemLabel>
            </div>
            <div className="w-2/3">
              <input
                className="mr-1"
                name="modify"
                type="checkbox"
                checked={modifyMaf}
                onChange={(e) => {
                  setModifyMaf(e.target.checked);
                }}
              />
            </div>
          </div>
          <div
            className={`flex items-center mb-6 ${modifyMaf ? "" : "hidden"}`}
          >
            <div className="w-1/3">
              <DataItemLabel htmlFor="source">MAF Source</DataItemLabel>
            </div>
            <div className="w-2/3 relative">
              <select
                className={inputClassName}
                name="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                <option value="bravo_af">bravo_af</option>
                <option value="gnomad_af_total">gnomad_af_total</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-800">
                <svg
                  className="fill-current h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div
            className={`flex items-center mb-6 ${modifyMaf ? "" : "hidden"}`}
          >
            <div className="w-1/3">
              <DataItemLabel htmlFor="maf">MAF Score</DataItemLabel>
            </div>
            <div className="w-2/3 relative">
              <select
                className={inputClassName}
                name="maf"
                value={maf}
                onChange={(e) => setMaf(e.target.value)}
              >
                <option value="0.01" defaultValue>
                  0.01
                </option>
                <option value="0.02">0.02</option>
                <option value="0.05">0.05</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-800">
                <svg
                  className="fill-current h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className=" space-x-4 mb-6 flex">
            <div>Click for example single entry: </div>
            <div className="flex flex-wrap space-x-4">
              <Button
                label="single dbSNP"
                type="secondary"
                onClick={() => setTextInput(exampleSnp)}
              >
                rsID
              </Button>
              <Button
                label="coordinates range"
                type="secondary"
                onClick={() => setTextInput(exampleCoordinate)}
              >
                coordinates range
              </Button>
              <Button
                label="spdi"
                type="secondary"
                onClick={() => setTextInput(exampleSpdi)}
              >
                SPDI
              </Button>
              <Button
                label="hgvs"
                type="secondary"
                onClick={() => setTextInput(exampleHgvs)}
              >
                HGVS
              </Button>
            </div>
          </div>

          <div className=" space-x-4 mb-6 flex">
            <div>Click for example multiple entries: </div>
            <div className="flex flex-wrap space-x-4">
              <Button
                label="multiple dbSNPs"
                type="secondary"
                onClick={() => setTextInput(exampleSnps)}
              >
                multiple dbSNPs
              </Button>
              <Button
                label="coordinates ranges"
                type="secondary"
                onClick={() => setTextInput(exampleCoordinates)}
              >
                coordinates ranges
              </Button>
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
      </DataPanel>
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
