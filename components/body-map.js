import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  FunnelIcon,
} from "@heroicons/react/20/solid";
import PropTypes from "prop-types";
import { useState } from "react";
import Image from "next/image";
import HumanBodyDiagram from "./human-body-diagram";
import Modal from "./modal";
import {
  ASSOCIATED_ORGAN_MAP,
  COMPLETE_CELLS_LIST_GRCH38,
  COMPLETE_CELLS_LIST_HG19,
  COMPLETE_ORGAN_LIST_GRCH38,
  COMPLETE_ORGAN_LIST_HG19,
  getFillColorHexChromatin,
  getFillColorTailwindChromatin,
} from "../lib/chromatin-data";
import {
  getFillColorHexTissueScore,
  getFillColorTailwindTissueScore,
} from "../lib/tissue-specific-score";

/**
 * HumanCells component display the list of cell images.
 * each cell image is colored by its highest chromatin state.
 * if the cell image is disabled then there is no coloring.
 * Each cell image is clickable. Click the image will select or deselect the cell type.
 * If the cell image is selected, then the color will have a higher opacity compare to unselected.
 */
function HumanCells({
  facets,
  cellList,
  organFilters,
  enabledBodyMapFilters,
  handleClickOrgan,
  highlightedOrgans,
  highlightOrgans,
  getFillColorTailwind,
}) {
  return (
    <>
      {cellList.map((cell) => {
        const src = ["lymph node", "lymphatic vessel"].includes(cell)
          ? `/bodyMap/insetSVGs/${cell.replace(" ", "_")}.png`
          : `/bodyMap/insetSVGs/${cell.replace(" ", "_")}.svg`;
        const color = getFillColorTailwind(facets, cell);
        const opacity =
          organFilters.includes(cell) | highlightedOrgans.includes(cell)
            ? "opacity-60"
            : "opacity-30";
        const isDisabled = !enabledBodyMapFilters.includes(cell);
        return (
          <button
            type="button"
            id={cell}
            disabled={isDisabled}
            onClick={() =>
              handleClickOrgan(cell, cellList, enabledBodyMapFilters)
            }
            onMouseEnter={() => highlightOrgans(cell)}
            onMouseLeave={() => highlightOrgans()}
            key={`${cell}-bodymap-cellslist`}
          >
            <div className="relative">
              <Image src={src} alt="clickable image" width="50" height="50" />
              {color && (
                <div
                  className={`absolute inset-0 ${color} ${opacity} rounded-full`}
                />
              )}
            </div>
          </button>
        );
      })}
    </>
  );
}

HumanCells.propTypes = {
  facets: PropTypes.object.isRequired,
  cellList: PropTypes.array.isRequired,
  organFilters: PropTypes.array.isRequired,
  handleClickOrgan: PropTypes.func.isRequired,
  enabledBodyMapFilters: PropTypes.array,
  highlightedOrgans: PropTypes.array.isRequired,
  highlightOrgans: PropTypes.func.isRequired,
  getFillColorTailwind: PropTypes.func.isRequired,
};

function HumanCellsThumbnail({
  facets,
  cellList,
  organFilters,
  getFillColorTailwind,
}) {
  return (
    <ul className="flex">
      {cellList.map((cell) => {
        const src = ["lymph node", "lymphatic vessel"].includes(cell)
          ? `/bodyMap/insetSVGs/${cell.replace(" ", "_")}.png`
          : `/bodyMap/insetSVGs/${cell.replace(" ", "_")}.svg`;
        const color = getFillColorTailwind(facets, cell);
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
              {color && (
                <div
                  className={`absolute inset-0 ${color} ${opacity} rounded-full`}
                />
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

HumanCellsThumbnail.propTypes = {
  facets: PropTypes.object.isRequired,
  cellList: PropTypes.array.isRequired,
  organFilters: PropTypes.array.isRequired,
  getFillColorTailwind: PropTypes.func.isRequired,
};

/**
 * The BodyMap component is comprised of several different elements:
 * (1) Diagram of body in svg format with selectable organs
 * (2) List of organ slims selectable on body diagram ( for example: "adrenal gland", "bone element")
 * (3) Inset images representing organ slims difficult to represent on a body diagram ("adipose tissue")
 * (4) List of organ slims represented by inset images
 * Each image representing a organ slim is colored by it's highest chromatin state if enabled, colored white if disabled
 * Each image and text item in list are clickable if enabled for selecting or deselecting the filter the user wants.
 * If the organ slim is selected then the responding image's color opacity will increase compare to unselected.
 */
function BodyMap({
  facetsChromatin,
  facetsTissueScore,
  organList,
  cellList,
  enabledBodyMapFilters,
  organFilters,
  handleClickOrgan,
  isColorByChromatinState,
  isThumbnailExpanded,
  setIsThumbnailExpanded,
}) {
  const [highlightedOrgans, setHighlightedOrgans] = useState([]);
  function highlightOrgans(organ) {
    if (organ) {
      let organs = [organ];
      if (organ in ASSOCIATED_ORGAN_MAP) {
        organs = organs.concat(ASSOCIATED_ORGAN_MAP[organ]);
      }
      setHighlightedOrgans(organs);
    } else {
      setHighlightedOrgans([]);
    }
  }
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
            onClick={() => setIsThumbnailExpanded(false)}
          >
            <ArrowsPointingInIcon className="h-6" />
            <div>Hide body diagram</div>
          </button>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-1">
              <HumanBodyDiagram
                organList={organList}
                facets={
                  isColorByChromatinState ? facetsChromatin : facetsTissueScore
                }
                organFilters={organFilters}
                enabledBodyMapFilters={enabledBodyMapFilters}
                handleClickOrgan={handleClickOrgan}
                highlightedOrgans={highlightedOrgans}
                highlightOrgans={highlightOrgans}
                getFillColorHex={
                  isColorByChromatinState
                    ? getFillColorHexChromatin
                    : getFillColorHexTissueScore
                }
              />
            </div>
            <div className="grid grid-cols-1">
              <ul className="list-disc grid grid-cols-2 gap-2">
                {organList.map((organ) => {
                  const isSelected = organFilters.includes(organ);
                  const isDisabled = !enabledBodyMapFilters.includes(organ);
                  const isHighlighted = highlightedOrgans.includes(organ);
                  const borderStyle = isSelected
                    ? "border-solid border-2 border-brand"
                    : "";
                  const highlight = isHighlighted ? "bg-highlight" : "";
                  return (
                    <li key={`${organ}-bodymap-organlist`}>
                      <button
                        id={organ}
                        role="button"
                        disabled={isDisabled}
                        className={`disabled:text-button-selected-disabled ${highlight} ${borderStyle}`}
                        tabIndex="0"
                        onClick={(e) =>
                          handleClickOrgan(
                            e.target.id,
                            organList,
                            enabledBodyMapFilters
                          )
                        }
                        onMouseEnter={(e) => highlightOrgans(e.target.id)}
                        onMouseLeave={() => highlightOrgans()}
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
                facets={
                  isColorByChromatinState ? facetsChromatin : facetsTissueScore
                }
                cellList={cellList}
                organFilters={organFilters}
                handleClickOrgan={handleClickOrgan}
                enabledBodyMapFilters={enabledBodyMapFilters}
                highlightedOrgans={highlightedOrgans}
                highlightOrgans={highlightOrgans}
                getFillColorTailwind={
                  isColorByChromatinState
                    ? getFillColorTailwindChromatin
                    : getFillColorTailwindTissueScore
                }
              />
            </div>
            <div>
              <ul className="list-disc grid grid-cols-2 gap-2">
                {cellList.map((cell) => {
                  const isSelected = organFilters.includes(cell);
                  const isDisabled = !enabledBodyMapFilters.includes(cell);
                  const isHighlighted = highlightedOrgans.includes(cell);

                  const borderStyle = isSelected
                    ? "border-solid border-2 border-brand"
                    : "";
                  const highlight = isHighlighted ? "bg-highlight" : "";

                  return (
                    <li key={`${cell}-bodymap-cellslist`}>
                      <button
                        id={cell}
                        role="button"
                        tabIndex="0"
                        disabled={isDisabled}
                        onClick={(e) =>
                          handleClickOrgan(
                            e.target.id,
                            cellList,
                            enabledBodyMapFilters
                          )
                        }
                        onMouseEnter={(e) => highlightOrgans(e.target.id)}
                        onMouseLeave={() => highlightOrgans()}
                        className={`disabled:text-button-selected-disabled ${highlight} ${borderStyle}`}
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

BodyMap.propTypes = {
  facetsChromatin: PropTypes.object.isRequired,
  facetsTissueScore: PropTypes.object.isRequired,
  organList: PropTypes.array.isRequired,
  cellList: PropTypes.array.isRequired,
  organFilters: PropTypes.array.isRequired,
  handleClickOrgan: PropTypes.func.isRequired,
  enabledBodyMapFilters: PropTypes.array,
  isColorByChromatinState: PropTypes.bool,
  isThumbnailExpanded: PropTypes.bool.isRequired,
  setIsThumbnailExpanded: PropTypes.func.isRequired,
};
/**
 * It is a clickable thumbnail comprised of body map svg and inset images, with expand icon and instructions
 * Click the thumbnail will display the actual body map.
 */
function BodyMapThumbnail({
  organList,
  cellList,
  facetsChromatin,
  facetsTissueScore,
  organFilters,
  enabledBodyMapFilters,
  isThumbnailExpanded,
  setIsThumbnailExpanded,
  isColorByChromatinState,
  width,
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setIsThumbnailExpanded(!isThumbnailExpanded)}
    >
      <div className="flex">
        <FunnelIcon className="h-5" />
        <div>Filter by body diagram</div>
      </div>
      <div className="text-data-label text-sm italic">
        {isColorByChromatinState
          ? "Colored by most active state"
          : "Colored by tissue specific score"}
      </div>
      <div className="grid border-2 border-panel h-80 p-1">
        <div className={`relative ${width}`}>
          <HumanBodyDiagram
            organList={organList}
            facets={
              isColorByChromatinState ? facetsChromatin : facetsTissueScore
            }
            facetsTissueScore={facetsTissueScore}
            organFilters={organFilters}
            enabledBodyMapFilters={enabledBodyMapFilters}
            getFillColorHex={
              isColorByChromatinState
                ? getFillColorHexChromatin
                : getFillColorHexTissueScore
            }
          />
          <ArrowsPointingOutIcon className="absolute inset-0 h-6" />
        </div>

        <HumanCellsThumbnail
          facets={isColorByChromatinState ? facetsChromatin : facetsTissueScore}
          cellList={cellList}
          organFilters={organFilters}
          getFillColorTailwind={
            isColorByChromatinState
              ? getFillColorTailwindChromatin
              : getFillColorTailwindTissueScore
          }
        />
      </div>
    </div>
  );
}

BodyMapThumbnail.propTypes = {
  organList: PropTypes.array.isRequired,
  cellList: PropTypes.array.isRequired,
  facetsChromatin: PropTypes.object.isRequired,
  facetsTissueScore: PropTypes.object.isRequired,
  organFilters: PropTypes.array.isRequired,
  enabledBodyMapFilters: PropTypes.array.isRequired,
  isColorByChromatinState: PropTypes.bool,
  isThumbnailExpanded: PropTypes.bool.isRequired,
  setIsThumbnailExpanded: PropTypes.func.isRequired,
  width: PropTypes.string,
};

/**
 * Combining the BodyMapThumbnail and BodyMap into one component
 */
export function BodyMapThumbnailAndModal({
  data,
  assembly,
  organFilters,
  handleClickOrgan,
  getOrganFacetsForChromatin,
  getOrganFacetsForTissue,
  normalizedTissueSpecificScore,
  isColorByChromatinState,
  width,
}) {
  const [isThumbnailExpanded, setIsThumbnailExpanded] = useState(false);
  let facetsChromatin = {};
  const facetsTissueScore = getOrganFacetsForTissue(
    normalizedTissueSpecificScore
  );
  let enabledBodyMapFilters = [];
  if (getOrganFacetsForChromatin) {
    facetsChromatin = getOrganFacetsForChromatin(data, assembly);
    enabledBodyMapFilters = Object.keys(facetsChromatin);
  } else {
    const organsSet = new Set();
    data.forEach((dataset) => {
      const organs = dataset.biosample_ontology?.organ_slims
        ? dataset.biosample_ontology.organ_slims
        : [];
      organs.forEach((organ) => organsSet.add(organ));
    });
    enabledBodyMapFilters = Array.from(organsSet);
  }

  const organList =
    assembly === "hg19" ? COMPLETE_ORGAN_LIST_HG19 : COMPLETE_ORGAN_LIST_GRCH38;
  const cellList =
    assembly === "hg19" ? COMPLETE_CELLS_LIST_HG19 : COMPLETE_CELLS_LIST_GRCH38;

  return (
    <div>
      <BodyMapThumbnail
        organList={organList}
        cellList={cellList}
        facetsChromatin={facetsChromatin}
        facetsTissueScore={facetsTissueScore}
        organFilters={organFilters}
        enabledBodyMapFilters={enabledBodyMapFilters}
        setIsThumbnailExpanded={setIsThumbnailExpanded}
        isThumbnailExpanded={isThumbnailExpanded}
        isColorByChromatinState={isColorByChromatinState}
        width={width}
      />

      <BodyMap
        facetsChromatin={facetsChromatin}
        facetsTissueScore={facetsTissueScore}
        organList={organList}
        cellList={cellList}
        enabledBodyMapFilters={enabledBodyMapFilters}
        organFilters={organFilters}
        handleClickOrgan={handleClickOrgan}
        setIsThumbnailExpanded={setIsThumbnailExpanded}
        isThumbnailExpanded={isThumbnailExpanded}
        isColorByChromatinState={isColorByChromatinState}
      />
    </div>
  );
}

BodyMapThumbnailAndModal.propTypes = {
  data: PropTypes.array.isRequired,
  assembly: PropTypes.string.isRequired,
  organFilters: PropTypes.array.isRequired,
  handleClickOrgan: PropTypes.func.isRequired,
  getOrganFacetsForChromatin: PropTypes.func,
  getOrganFacetsForTissue: PropTypes.func.isRequired,
  normalizedTissueSpecificScore: PropTypes.object,
  isColorByChromatinState: PropTypes.bool,
  width: PropTypes.string,
};
