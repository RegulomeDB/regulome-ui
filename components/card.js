import Link from "next/link";
import PropTypes from "prop-types";

export function Card({
  queryString,
  viewType,
  title,
  trackingLabel,
  datasets,
  children,
}) {
  return (
    <Link
      className="bg-white border rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 no-underline "
      href={`/search?${queryString}#!${viewType}`}
    >
      <div className="px-4 pb-3">
        <h5 className="text-xl font-semibold flex justify-center">{title}</h5>
        <div className="mt-2 flex justify-center">
          <span className="text-sm dark:text-gray-400">{trackingLabel}</span>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
            {datasets.length}
          </span>
        </div>
      </div>
      <div className="p-2 flex justify-center w-full">{children}</div>
    </Link>
  );
}

Card.propTypes = {
  // the view type for single variant
  viewType: PropTypes.string.isRequired,
  // the card title
  title: PropTypes.string.isRequired,
  // the name of the data to track
  trackingLabel: PropTypes.string.isRequired,
  // the datasets to track
  datasets: PropTypes.array.isRequired,
  queryString: PropTypes.string.isRequired,
};
