import PropTypes from "prop-types";
import { FunnelIcon } from "@heroicons/react/20/solid";
import BiosampleStateBar from "./biosample-state-bar";
import { getBiosampleFacets } from "../lib/chromatin-data";

/**
 * ChromatinBiosampleFacets display the biosample facets for chromatin data.
 * Each facet contain text info for biosample name and organ slims name at the left.
 * And a bar chart to display the number of datasets for each state for the biosample at the right.
 * You can select the facets to filter the chromatin data.
 */
export default function ChromatinBiosampleFacets({
  data,
  assembly,
  biosampleFilters,
  handleClickBiosample,
}) {
  const facets = getBiosampleFacets(data, assembly);

  return (
    <>
      <div className="flex">
        <FunnelIcon className="h-5" />
        <div>Filter by biosample </div>
      </div>
      <div className="text-data-label text-sm italic">Grouped by organs</div>
      <div className="overflow-y-auto h-80 border-2 border-panel">
        {facets.map((facet) => {
          const key = facet.biosample.replace(/[^\w\s]/gi, "").toLowerCase();
          const isSelected = biosampleFilters.includes(facet.biosample);
          return (
            <div key={key}>
              <div className="grid grid-cols-4 ">
                <div className="col-span-3">
                  <button
                    className={` flex text-sm hover:bg-highlight gap-1
                    ${isSelected && "border-solid border-2 border-brand"}`}
                    onClick={() => handleClickBiosample(facet.biosample)}
                  >
                    <div>{facet.biosample}</div>
                    <div className="text-data-label">{facet.organ}</div>
                  </button>
                </div>
                <div className="col-span-1">
                  <BiosampleStateBar states={facet.states} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

ChromatinBiosampleFacets.propTypes = {
  data: PropTypes.array.isRequired,
  assembly: PropTypes.string.isRequired,
  biosampleFilters: PropTypes.array.isRequired,
  handleClickBiosample: PropTypes.func.isRequired,
};
