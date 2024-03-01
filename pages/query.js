import { useState } from "react";
import Router from "next/router";
import Breadcrumbs from "../components/breadcrumbs";
import { Button } from "../components/form-elements";
import { DataPanel, DataItemLabel } from "../components/data-area";
import Modal from "../components/modal";
import Navigation from "../components/navigation";
import PagePreamble from "../components/page-preamble";
import RegulomeVersionTag from "../components/regulome-version-tag";
import { validateRegions, validateRegion } from "../lib/validate-regions";
import {
  TabGroup,
  TabList,
  TabPane,
  TabPanes,
  TabTitle,
} from "../components/tabs";

const inputClassName =
  "appearance-none  border-form-element bg-form-element text-form-element border-2 rounded w-full py-2 px-4 leading-tight";
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
  const [fileInput, setFileInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [maf, setMaf] = useState("0.01");
  const [ancestry, setAncestry] = useState("");
  const [r2, setR2] = useState("0.8");
  const [textInputForMultiple, setTextInputForMultiple] = useState("");
  const [textInputForSingle, setTextInputForSingle] = useState("");
  const [includeVariantsInLD, setIncludeVariantsInLD] = useState(false);
  const [ldFieldsHidden, setLdFieldsHidden] = useState(true);
  const [isGrch38, setIsGrch38] = useState(true);

  const grch38LabelStyle = isGrch38
    ? "text-black dark:text-white"
    : "text-slate-400";
  const grch19LabelStyle = isGrch38
    ? "text-slate-400"
    : "text-black dark:text-white";

  // Handles the submit event on single variant form submit.
  async function handleSingleSubmit(event) {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    if (!textInputForSingle) {
      setIsOpen(true);
    } else {
      const assembly = isGrch38 ? "GRCh38" : "hg19";
      const region = textInputForSingle
        ? textInputForSingle.trim().replace(/\s/g, " ")
        : fileInput.trim().replace(/\s/g, " ");
      const isValidInput = validateRegion(region, assembly);
      if (!isValidInput) {
        setIsOpen(true);
      } else {
        const query = {
          regions: region,
          genome: assembly,
        };
        if (includeVariantsInLD) {
          query.r2 = r2;
          query.ld = true;
          if (ancestry) {
            query.ancestry = ancestry;
          }
        }
        Router.push({
          pathname: "/search",
          query,
        });
      }
    }
  }

  // Handles the submit event on  variants form submit.
  async function handleMultipleSubmit(event) {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    if (textInputForMultiple && fileInput) {
      alert(
        "Only choose one method to set regions: through text input or file upload"
      );
    } else if (!textInputForMultiple && !fileInput) {
      setIsOpen(true);
    } else {
      const assembly = isGrch38 ? "GRCh38" : "hg19";
      const regions = textInputForMultiple
        ? textInputForMultiple.trim().replace(/\s/g, " ")
        : fileInput.trim().replace(/\s/g, " ");
      const regionList = regions.split(" ");
      const isValidInput = validateRegions(regionList, assembly);
      if (!isValidInput) {
        setIsOpen(true);
      } else {
        const query = {
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

  return (
    <>
      <RegulomeVersionTag />
      <Navigation />
      <Breadcrumbs />
      <PagePreamble />
      <label className="m-2 relative inline-flex cursor-pointer select-none items-center">
        <input
          type="checkbox"
          checked={!isGrch38}
          onChange={(e) => {
            setIsGrch38(!e.target.checked);
          }}
          className="sr-only"
        />
        <span
          className={`${grch38LabelStyle}  flex items-center text-xl font-bold`}
        >
          GRCh38
        </span>
        <span
          className={`mx-4 flex h-8 w-[60px] items-center rounded-full p-1 duration-200 ${"bg-[#CCCCCE]"}`}
        >
          <span
            className={`h-6 w-6 rounded-full bg-brand duration-200 ${
              isGrch38 ? "" : "translate-x-[28px]"
            }`}
          ></span>
        </span>
        <span
          className={`${grch19LabelStyle} flex items-center text-xl font-bold`}
        >
          hg19
        </span>
      </label>
      <DataPanel>
        <TabGroup>
          <TabList>
            <TabTitle>Single variant</TabTitle>
            <TabTitle>Multiple variants</TabTitle>
          </TabList>
          <TabPanes>
            <TabPane>
              <form onSubmit={handleSingleSubmit}>
                <div className="flex items-center mb-6">
                  <div className="w-1/3">
                    <DataItemLabel>Region</DataItemLabel>
                  </div>
                  <div className="w-2/3">
                    <textarea
                      className={inputClassName}
                      id="region"
                      name="region"
                      autoComplete="off"
                      rows="8"
                      cols="50"
                      placeholder="Enter the rsID, SPDI, HGVS or a region, only one single variant is allowed."
                      value={textInputForSingle}
                      onChange={(e) => setTextInputForSingle(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="flex items-center mb-6">
                  <div className="w-1/3">
                    <DataItemLabel htmlFor="include">
                      Include variants in LD
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
                    <DataItemLabel htmlFor="ancestry">
                      LD Ancestry
                    </DataItemLabel>
                  </div>
                  <div className="w-2/3 relative">
                    <select
                      className={inputClassName}
                      name="ancestry"
                      value={ancestry}
                      onChange={(e) => setAncestry(e.target.value)}
                    >
                      <option value="">Select one...</option>

                      <option value="EAS">EAS</option>
                      <option value="EUR">EUR</option>
                      <option value="AFR">AFR</option>
                      <option value="SAS">SAS</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-800">
                      <svg
                        class="fill-current h-6 w-6"
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

                <div className=" space-x-4 mb-6 flex">
                  <div>Click for example entry: </div>
                  <Button
                    label="single dbSNP"
                    type="secondary"
                    onClick={() => setTextInputForSingle(exampleSnp)}
                  >
                    single dbSNP
                  </Button>
                  <Button
                    label="coordinates range"
                    type="secondary"
                    onClick={() => setTextInputForSingle(exampleCoordinate)}
                  >
                    coordinates range
                  </Button>
                  <Button
                    label="spdi"
                    type="secondary"
                    onClick={() => setTextInputForSingle(exampleSpdi)}
                  >
                    SPDI
                  </Button>
                  <Button
                    label="hgvs"
                    type="secondary"
                    onClick={() => setTextInputForSingle(exampleHgvs)}
                  >
                    HGVS
                  </Button>
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
            </TabPane>
            <TabPane>
              <form onSubmit={handleMultipleSubmit}>
                <div className="flex items-center mb-6">
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
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-800">
                      <svg
                        class="fill-current h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex items-center mb-6">
                  <div className="w-1/3">
                    <DataItemLabel>Regions</DataItemLabel>
                  </div>
                  <div className="w-2/3">
                    <textarea
                      className={inputClassName}
                      id="regions"
                      name="regions"
                      rows="8"
                      cols="50"
                      placeholder="Enter rsIDs or regions, one per line. For example: rs75982468, chr12:69360231-69360232."
                      value={textInputForMultiple}
                      onChange={(e) => setTextInputForMultiple(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <div className=" items-center mb-6 hidden">
                  <div className="w-1/3">
                    <DataItemLabel htmlFor="file">
                      Upload your file
                    </DataItemLabel>
                  </div>
                  <div className="w-2/3">
                    <input
                      id="file"
                      name="file"
                      type="file"
                      accept=".txt, .tsv, .csv"
                      value={fileInput}
                      onChange={readText}
                    />
                  </div>
                </div>

                <div className=" space-x-4 mb-6 flex">
                  <div>Click for example entry: </div>
                  <Button
                    label="multiple dbSNPs"
                    type="secondary"
                    onClick={() => setTextInputForMultiple(exampleSnps)}
                  >
                    multiple dbSNPs
                  </Button>
                  <div> or </div>
                  <Button
                    label="coordinates ranges"
                    type="secondary"
                    onClick={() => setTextInputForMultiple(exampleCoordinates)}
                  >
                    coordinates ranges
                  </Button>
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
            </TabPane>
          </TabPanes>
        </TabGroup>
      </DataPanel>{" "}
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
