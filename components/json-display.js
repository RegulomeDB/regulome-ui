// node_modules
import PropTypes from "prop-types";
// components
import { DataPanel } from "./data-area";

/**
 * This function will display a raw JSON view for a given object if the query is in JSON format, otherwise it will display an object view.
 * @param {*} item the object to display
 * @returns either a raw JSON view or a object view
 */
export default function JsonDisplay({ item }) {
  return (
    <DataPanel>
      <div className="border border-gray-300 bg-gray-100 text-xs dark:border-gray-800 dark:bg-gray-900">
        <pre className="overflow-x-scroll p-1">
          {JSON.stringify(item, null, 4)}
        </pre>
      </div>
    </DataPanel>
  );
}

JsonDisplay.propTypes = {
  item: PropTypes.object.isRequired,
};
