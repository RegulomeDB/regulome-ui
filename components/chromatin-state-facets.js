import PropTypes from "prop-types";

export const ChromatinStateColor = {
  "Active TSS": {
    tailwind: "bg-rose-600",
    hex: "#fbbf24",
  },
  "Flanking TSS": {
    tailwind: "bg-orange-500",
    hex: "#f97316",
  },
  "Flanking TSS downstream": {
    tailwind: "bg-orange-500",
    hex: "#f97316",
  },
  "Flanking TSS upstream": {
    tailwind: "bg-orange-500",
    hex: "#f97316",
  },
  "Active enhancer 1": {
    tailwind: "bg-amber-400",
    hex: "#fbbf24",
  },
  "Active enhancer 2": {
    tailwind: "bg-amber-400",
    hex: "#fbbf24",
  },
  "Weak enhancer": {
    tailwind: "bg-yellow-300",
    hex: "#fde047",
  },
  "Genic enhancer 1": {
    tailwind: "bg-lime-400",
    hex: "#a3e635",
  },
  "Genic enhancer 2": {
    tailwind: "bg-lime-400",
    hex: "#a3e635",
  },
  "Strong transcription": {
    tailwind: "bg-green-600",
    hex: "#16a34a",
  },
  "Weak transcription": {
    tailwind: "bg-green-600",
    hex: "#16a34a",
  },
  "Bivalent/Poised TSS": {
    tailwind: "bg-rose-400",
    hex: "#fb7185",
  },
  "Bivalent enhancer": {
    tailwind: "bg-yellow-500",
    hex: "#eab308",
  },
  "ZNF genes & repeats": {
    tailwind: "bg-emerald-400",
    hex: "#34d399",
  },
  "Weak Repressed PolyComb": {
    tailwind: "bg-gray-400",
    hex: "#a8a29e",
  },
  "Repressed PolyComb": {
    tailwind: "bg-gray-400",
    hex: "#a8a29e",
  },
  Heterochromatin: {
    tailwind: "bg-indigo-400",
    hex: "#818cf8",
  },
  "Quiescent/Low": {
    tailwind: "bg-gray-300",
    hex: "#d6d3d1",
  },
  Enhancers: {
    tailwind: "bg-yellow-300",
    hex: "#fde047",
  },
  "Flanking Bivalent TSS/Enh": {
    tailwind: "bg-red-300",
    hex: "#fca5a5",
  },
  "Flanking Active TSS": {
    tailwind: "bg-orange-500",
    hex: "#f97316",
  },
  "Transcr. at gene 5' and 3'": {
    tailwind: "bg-green-300",
    hex: "#86efac",
  },
  "Genic enhancers": {
    tailwind: "bg-lime-400",
    hex: "#a3e635",
  },
};

export default function ChromatinStateFacets({
  facets,
  filters,
  handleClickState,
}) {
  // function handleClick(key) {
  //     alert(key);
  // }

  return (
    <div className="grid-rows-1">
      {facets.map((d) => {
        const dKey = d.replace(/[^\w\s]/gi, "").toLowerCase();
        const isSelected = filters.includes(d);
        return (
          <div key={dKey} className="flex items-center justify-between">
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
  );
}

ChromatinStateFacets.propTypes = {
  facets: PropTypes.array.isRequired,
  filters: PropTypes.array.isRequired,
  handleClickState: PropTypes.func.isRequired,
};
