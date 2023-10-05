import PropTypes from "prop-types";
import { FunnelIcon } from "@heroicons/react/20/solid";
import { ChromatinStateColor, getStatesFacets } from "../lib/chromatin-data";

/**
 * ChromatinStateFacets display the state facets for chromatin data.
 * Each facet contain the state name at the left and the corresponding color at the right.
 * You can select the facets to filter the chromatin data.
 */
export default function ChromatinStateFacets({
  data,
  assembly,
  stateFilters,
  handleClickState,
}) {
  const facets = getStatesFacets(data, assembly);

  return (
    <>
      <div className="flex">
        <FunnelIcon className="h-5" />
        <div>Filter by chromatin state </div>
      </div>
      <div className="text-data-label text-sm italic">
        Ordered by transcription activity
      </div>
      <div className="grid-rows-1 border-2 border-black">
        {facets.map((d) => {
          const key = d.replace(/[^\w\s]/gi, "").toLowerCase();
          const isSelected = stateFilters.includes(d);
          return (
            <div key={key} className="flex items-center justify-between">
              <button
                className={`flex-grow hover:bg-slate-100 ${
                  isSelected && "border-solid border-2 border-brand"
                }`}
                onClick={() => handleClickState(d)}
              >
                {d}
              </button>
              <label
                className={`box-content h-3 w-3 p-1 ${ChromatinStateColor[d].tailwind}`}
              ></label>
            </div>
          );
        })}
      </div>
    </>
  );
}

ChromatinStateFacets.propTypes = {
  data: PropTypes.array.isRequired,
  assembly: PropTypes.string.isRequired,
  stateFilters: PropTypes.array.isRequired,
  handleClickState: PropTypes.func.isRequired,
};
