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
  COMPLETE_CELLS_LIST_GRCH38,
  COMPLETE_CELLS_LIST_HG19,
  COMPLETE_ORGAN_LIST_GRCH38,
  COMPLETE_ORGAN_LIST_HG19,
  getFillColorTailwind,
  getOrganFacets,
} from "../lib/chromatin-data";

/**
 * HumanCells component display the list of cell images.
 * each cell image is colored by it's highest chromatin state.
 * if the cell image is disabled then there is no coloring.
 * Each cell image is clickable. Click the image will select or deselect the cell type.
 * If the cell image is selected, then the color will have a higher opacity compare to unselected.
 */
export function HumanCells({
  facets,
  cellList,
  organFilters,
  enabledBodyMapFilters,
  handleClickOrgan,
}) {
  return (
    <>
      {cellList.map((cell) => {
        const src = ["lymph node", "lymphatic vessel"].includes(cell)
          ? `/bodyMap/insetSVGs/${cell.replace(" ", "_")}.png`
          : `/bodyMap/insetSVGs/${cell.replace(" ", "_")}.svg`;
        const color = getFillColorTailwind(facets, cell);
        const opacity = organFilters.includes(cell)
          ? "opacity-60"
          : "opacity-30";
        const isDisabled = !enabledBodyMapFilters.includes(cell);
        return (
          <button
            type="button"
            id={cell}
            disabled={isDisabled}
            onClick={
              handleClickOrgan &&
              (() => handleClickOrgan(cell, cellList, enabledBodyMapFilters))
            }
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
  handleClickOrgan: PropTypes.func,
  enabledBodyMapFilters: PropTypes.array,
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
export function BodyMap({
  facets,
  organList,
  cellList,
  enabledBodyMapFilters,
  organFilters,
  handleClickOrgan,
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
            onClick={() => setIsThumbnailExpanded(false)}
          >
            <ArrowsPointingInIcon className="h-6" />
            <div>Hide body diagram</div>
          </button>
          <div className="grid grid-cols-2 gap-4">
            <HumanBodyDiagram
              organList={organList}
              facets={facets}
              organFilters={organFilters}
              enabledBodyMapFilters={enabledBodyMapFilters}
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
                        onClick={(e) =>
                          handleClickOrgan(
                            e.target.id,
                            organList,
                            enabledBodyMapFilters
                          )
                        }
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
                facets={facets}
                cellList={cellList}
                organFilters={organFilters}
                handleClickOrgan={handleClickOrgan}
                enabledBodyMapFilters={enabledBodyMapFilters}
              />
            </div>
            <div>
              <ul className="list-disc grid grid-cols-2 gap-2">
                {cellList.map((cell) => {
                  const isSelected = organFilters.includes(cell);
                  const isDisabled = !enabledBodyMapFilters.includes(cell);
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

BodyMap.propTypes = {
  facets: PropTypes.object.isRequired,
  organList: PropTypes.array.isRequired,
  cellList: PropTypes.array.isRequired,
  organFilters: PropTypes.array.isRequired,
  handleClickOrgan: PropTypes.func.isRequired,
  enabledBodyMapFilters: PropTypes.array,
  isThumbnailExpanded: PropTypes.bool.isRequired,
  setIsThumbnailExpanded: PropTypes.func.isRequired,
};

/**
 * It is a clickable thumbnail comprised of body map svg and inset images, with expand icon and instructions
 * Click the thumbnail will display the actual body map.
 */
export function BodyMapThumbnail({
  organList,
  cellList,
  facets,
  organFilters,
  enabledBodyMapFilters,
  isThumbnailExpanded,
  setIsThumbnailExpanded,
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
        Colored by most active state
      </div>
      <div className="border-2 border-black">
        <ArrowsPointingOutIcon className="h-6" />
        <HumanBodyDiagram
          organList={organList}
          facets={facets}
          organFilters={organFilters}
          enabledBodyMapFilters={enabledBodyMapFilters}
        />
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
                  <Image
                    src={src}
                    alt="clickable image"
                    width="50"
                    height="50"
                  />
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
      </div>
    </div>
  );
}

BodyMapThumbnail.propTypes = {
  organList: PropTypes.array.isRequired,
  cellList: PropTypes.array.isRequired,
  facets: PropTypes.object.isRequired,
  organFilters: PropTypes.array.isRequired,
  enabledBodyMapFilters: PropTypes.array.isRequired,
  isThumbnailExpanded: PropTypes.bool.isRequired,
  setIsThumbnailExpanded: PropTypes.func.isRequired,
};

/**
 * Combining the BodyMapThumbnail and BodyMap into one component
 */
export function BodyMapThumbnailAndModal({
  data,
  assembly,
  organFilters,
  handleClickOrgan,
}) {
  const [isThumbnailExpanded, setIsThumbnailExpanded] = useState(false);
  const facets = getOrganFacets(data, assembly);
  const enabledBodyMapFilters = Object.keys(facets);
  const organList =
    assembly === "hg19" ? COMPLETE_ORGAN_LIST_HG19 : COMPLETE_ORGAN_LIST_GRCH38;
  const cellList =
    assembly === "hg19" ? COMPLETE_CELLS_LIST_HG19 : COMPLETE_CELLS_LIST_GRCH38;

  return (
    <div>
      <BodyMapThumbnail
        organList={organList}
        cellList={cellList}
        facets={facets}
        organFilters={organFilters}
        enabledBodyMapFilters={enabledBodyMapFilters}
        setIsThumbnailExpanded={setIsThumbnailExpanded}
        isThumbnailExpanded={isThumbnailExpanded}
      />

      <BodyMap
        facets={facets}
        organList={organList}
        cellList={cellList}
        enabledBodyMapFilters={enabledBodyMapFilters}
        organFilters={organFilters}
        handleClickOrgan={handleClickOrgan}
        setIsThumbnailExpanded={setIsThumbnailExpanded}
        isThumbnailExpanded={isThumbnailExpanded}
      />
    </div>
  );
}

BodyMapThumbnailAndModal.propTypes = {
  data: PropTypes.array.isRequired,
  assembly: PropTypes.string.isRequired,
  organFilters: PropTypes.array.isRequired,
  handleClickOrgan: PropTypes.func.isRequired,
};
