import PropTypes from "prop-types";
import { useState } from "react";
import HumanBodyDiagram from "./human-body-diagram";
import Image from "next/image";
import Modal from "./modal";
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/20/solid";
import { getFillColorTailwind } from "../lib/chromatin-data";

// Mapping from cells and tissue types to inset images
// All mappings are empty because there are no paths or shapes that correspond to the inset images
//     (each has one associated image with a name corresponding to the cell or tissue term)
const HUMAN_CELLS_LIST = {
  "adipose tissue": [],
  blood: [],
  "blood vessel": [],
  "bone marrow": [],
  "connective tissue": [],
  embryo: [],
  epithelium: [],
  "lymphoid tissue": [],
  "lymph node": [],
  "lymphatic vessel": [],
  placenta: [],
};

// Mapping for systems slims
// Systems slims are mapped to organs in the "BodyList"
export const HumanSystemsList = {
  "central nervous system": ["brain", "spinal cord"],
  "circulatory system": [
    "blood",
    "blood vessel",
    "arterial blood vessel",
    "heart",
    "pericardium",
    "vein",
    "lymphatic vessel",
  ],
  "digestive system": [
    "esophagus",
    "intestine",
    "small intestine",
    "large intestine",
    "liver",
    "gallbladder",
    "mouth",
    "spleen",
    "stomach",
    "tongue",
    "colon",
  ],
  "endocrine system": [
    "adrenal gland",
    "liver",
    "gallbladder",
    "pancreas",
    "thymus",
    "thyroid gland",
  ],
  "excretory system": ["urinary bladder", "kidney", "ureter"],
  "exocrine system": ["mammary gland", "liver"],
  "immune system": [
    "lymphoid tissue",
    "spleen",
    "thymus",
    "bone marrow",
    "lymph node",
    "lymphatic vessel",
  ],
  musculature: ["musculature of body", "limb"],
  "peripheral nervous system": ["nerve"],
  "reproductive system": [
    "gonad",
    "ovary",
    "penis",
    "placenta",
    "prostate gland",
    "testis",
    "uterus",
    "vagina",
  ],
  "respiratory system": ["trachea", "bronchus", "lung"],
  "sensory system": ["eye", "nose", "tongue"],
  "skeletal system": ["bone element", "skeleton", "bone marrow", "limb"],
  "integumental system": ["mammary gland", "skin of body"],
};

export function HumanCells({
  facet,
  stateFilters,
  organFilters,
  enabledBodyMapFilters,
  handleClickOrgan,
}) {
  return (
    <>
      {Object.keys(HUMAN_CELLS_LIST).map((cell) => {
        const src = ["lymph node", "lymphatic vessel"].includes(cell)
          ? `/bodyMap/insetSVGs/${cell.replace(" ", "_")}.png`
          : `/bodyMap/insetSVGs/${cell.replace(" ", "_")}.svg`;
        const color = getFillColorTailwind(facet, stateFilters, cell);
        const opacity = organFilters.includes(cell)
          ? "opacity-60"
          : "opacity-30";
        const isDisabled = !enabledBodyMapFilters.includes(cell);
        return (
          <button
            type="button"
            id={cell}
            disabled={isDisabled}
            onClick={handleClickOrgan && (() => handleClickOrgan(cell))}
            key={`${cell}-bodymap-cellslist`}
          >
            <div className="relative">
              <Image src={src} alt="clickable image" width="50" height="50" />
              <div
                className={`absolute inset-0 ${color} ${opacity} rounded-full`}
              />
            </div>
          </button>
        );
      })}
    </>
  );
}

HumanCells.propTypes = {
  facet: PropTypes.object.isRequired,
  stateFilters: PropTypes.array.isRequired,
  organFilters: PropTypes.array.isRequired,
  handleClickOrgan: PropTypes.func,
  enabledBodyMapFilters: PropTypes.array,
};

// The BodyMap component is comprised of several different elements:
// (1) List of system slims ("central nervous system", "skeletal system", "digestive system")
// (2) Diagram of body in svg format with selectable organs
// (3) List of organ slims selectable on body diagram ("adrenal gland", "bone element")
// (4) Inset images representing organ slims difficult to represent on a body diagram ("adipose tissue")
// (5) List of organ slims represented by inset images
// (6) A button (could be optional) to clear organ and system slims selected on BodyMap
// All of these components are responsive (they stack and change position relative to each other based on screen width)
export function BodyMapModal({
  facet,
  organList,
  enabledBodyMapFilters,
  stateFilters,
  organFilters,
  handleClickOrgan,
  toggleThumbnail,
  isThumbnailExpanded,
  setIsThumbnailExpanded,
}) {
  return (
    <div>
      <Modal
        isOpen={isThumbnailExpanded}
        onClose={() => setIsThumbnailExpanded(false)}
      >
        <Modal.Body>
          <button
            className="flex"
            type="button"
            onClick={() => toggleThumbnail()}
          >
            <ArrowsPointingInIcon className="h-6" />
            <div>Hide body diagram</div>
          </button>
          <div className="grid grid-cols-2 gap-4">
            <HumanBodyDiagram
              organList={organList}
              facet={facet}
              stateFilters={stateFilters}
              organFilters={organFilters}
              handleClickOrgan={handleClickOrgan}
            />
            <div>
              <ul className="list-disc grid grid-cols-2 gap-2">
                {organList.map((organ) => {
                  const isSelected = organFilters.includes(organ);
                  const isDisabled = !enabledBodyMapFilters.includes(organ);
                  return (
                    <li key={`${organ}-bodymap-organlist`}>
                      <button
                        id={organ}
                        role="button"
                        disabled={isDisabled}
                        className={`hover:bg-slate-200 ${
                          isDisabled && "text-slate-400"
                        } ${
                          isSelected && "border-solid border-2 border-brand"
                        }`}
                        tabIndex="0"
                        onClick={(e) => handleClickOrgan(e.target.id)}
                        // onMouseEnter={e => highlightOrgan(e, BodyList, CellsList, HumanSystemsList)}
                        // onMouseLeave={unHighlightOrgan}
                      >
                        {organ}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <HumanCells
                facet={facet}
                stateFilters={stateFilters}
                organFilters={organFilters}
                handleClickOrgan={handleClickOrgan}
                enabledBodyMapFilters={enabledBodyMapFilters}
              />
            </div>
            <div>
              <ul className="list-disc grid grid-cols-2 gap-2">
                {Object.keys(HUMAN_CELLS_LIST).map((cell) => {
                  const isSelected = organFilters.includes(cell);
                  const isDisabled = !enabledBodyMapFilters.includes(cell);
                  return (
                    <li key={`${cell}-bodymap-cellslist`}>
                      <button
                        id={cell}
                        role="button"
                        tabIndex="0"
                        disabled={isDisabled}
                        onClick={(e) => handleClickOrgan(e.target.id)}
                        className={`hover:bg-slate-200 ${
                          isDisabled && "text-slate-400"
                        } ${
                          isSelected && "border-solid border-2 border-brand"
                        }`}
                      >
                        {cell}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

BodyMapModal.propTypes = {
  facet: PropTypes.object.isRequired,
  organList: PropTypes.array.isRequired,
  stateFilters: PropTypes.array.isRequired,
  organFilters: PropTypes.array.isRequired,
  handleClickOrgan: PropTypes.func.isRequired,
  enabledBodyMapFilters: PropTypes.array,
  toggleThumbnail: PropTypes.func.isRequired,
  isThumbnailExpanded: PropTypes.bool.isRequired,
  setIsThumbnailExpanded: PropTypes.func.isRequired,
};

// Clickable thumbnail
// Comprised of body map svg and inset images, with expand icon and instructions
// Button to display the actual body map facet <BodyMapModal>
export function BodyMapThumbnail({
  toggleThumbnail,
  organList,
  facet,
  stateFilters,
  organFilters,
}) {
  const CellsList = HUMAN_CELLS_LIST;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => toggleThumbnail()}
      onKeyDown={() => toggleThumbnail()}
    >
      <div>Filter results by body diagram</div>
      <ArrowsPointingOutIcon className="h-6" />
      <HumanBodyDiagram
        organList={organList}
        facet={facet}
        stateFilters={stateFilters}
        organFilters={organFilters}
      />
      <ul className="flex">
        {Object.keys(CellsList).map((cell) => {
          const src = ["lymph node", "lymphatic vessel"].includes(cell)
            ? `/bodyMap/insetSVGs/${cell.replace(" ", "_")}.png`
            : `/bodyMap/insetSVGs/${cell.replace(" ", "_")}.svg`;
          const color = getFillColorTailwind(facet, stateFilters, cell);
          const opacity = organFilters.includes(cell)
            ? "opacity-60"
            : "opacity-30";
          return (
            <li
              className={`body-inset ${cell}`}
              id={cell}
              key={`${cell}-bodymap-cellslist`}
            >
              <div className="relative">
                <Image src={src} alt="clickable image" width="50" height="50" />
                <div
                  className={`absolute inset-0 ${color} ${opacity} rounded-full`}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

BodyMapThumbnail.propTypes = {
  toggleThumbnail: PropTypes.func.isRequired,
  organList: PropTypes.array.isRequired,
  facet: PropTypes.object.isRequired,
  stateFilters: PropTypes.array.isRequired,
  organFilters: PropTypes.array.isRequired,
};

// Combining the body map thumbnail and the body map modal into one component
export function BodyMapThumbnailAndModal({
  facet,
  organList,
  enabledBodyMapFilters,
  stateFilters,
  organFilters,
  handleClickOrgan,
}) {
  const [isThumbnailExpanded, setIsThumbnailExpanded] = useState(false);

  // const BodyList = HumanList;
  // const CellsList = HumanCellsList;

  function toggleThumbnail() {
    setIsThumbnailExpanded(!isThumbnailExpanded);
  }

  return (
    <div>
      <BodyMapThumbnail
        key={facet.organ_slims}
        toggleThumbnail={toggleThumbnail}
        organList={organList}
        facet={facet}
        stateFilters={stateFilters}
        organFilters={organFilters}
        enabledBodyMapFilters={enabledBodyMapFilters}
      />

      <BodyMapModal
        key={facet.organ_slims + 2}
        toggleThumbnail={toggleThumbnail}
        facet={facet}
        organList={organList}
        enabledBodyMapFilters={enabledBodyMapFilters}
        stateFilters={stateFilters}
        organFilters={organFilters}
        handleClickOrgan={handleClickOrgan}
        setIsThumbnailExpanded={setIsThumbnailExpanded}
        isThumbnailExpanded={isThumbnailExpanded}
      />
    </div>
  );
}

BodyMapThumbnailAndModal.propTypes = {
  facet: PropTypes.object.isRequired,
  organList: PropTypes.array.isRequired,
  enabledBodyMapFilters: PropTypes.array.isRequired,
  stateFilters: PropTypes.array.isRequired,
  organFilters: PropTypes.array.isRequired,
  handleClickOrgan: PropTypes.func.isRequired,
};
