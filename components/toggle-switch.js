import React from "react";
import PropTypes from "prop-types";

export default function ToggleSwitch({
  label,
  isLeftOption,
  setIsLeftOption,
  leftOption,
  rightOption,
}) {
  const leftOptionStyle = isLeftOption
    ? "text-black dark:text-white"
    : "text-slate-400";
  const rightOptionStyle = isLeftOption
    ? "text-slate-400"
    : "text-black dark:text-white";
  return (
    <>
      {label && <span className="text-xl p-1">{label}</span>}
      <label className="m-2 relative inline-flex cursor-pointer select-none items-center">
        <input
          name="switch"
          type="checkbox"
          checked={!isLeftOption}
          onChange={(e) => {
            setIsLeftOption(!e.target.checked);
          }}
          className="sr-only"
        />
        <span
          className={`${leftOptionStyle}  flex items-center text-xl font-bold`}
        >
          {leftOption}
        </span>
        <span className="mx-4 flex h-8 w-[60px] items-center rounded-full p-1 duration-200 bg-[#CCCCCE]">
          <span
            className={`h-6 w-6 rounded-full bg-brand duration-200 ${
              isLeftOption ? "" : "translate-x-[28px]"
            }`}
          ></span>
        </span>
        <span
          className={`${rightOptionStyle} flex items-center text-xl font-bold`}
        >
          {rightOption}
        </span>
      </label>
    </>
  );
}
ToggleSwitch.propTypes = {
  // is left option on
  isLeftOption: PropTypes.bool.isRequired,
  // To set whether switch to left option
  setIsLeftOption: PropTypes.func.isRequired,
  // Option on the left
  leftOption: PropTypes.string.isRequired,
  // Option on the right
  rightOption: PropTypes.string.isRequired,
  // drescription text before the two options
  label: PropTypes.string,
};
