import PropTypes from "prop-types";
import { DataItemLabel, DataItemValue } from "./data-area";

/**
 * Wrapper for an area containing score related data items, setting up a grid to display two score data items
 */
export function ScoreDataArea({ children }) {
  return (
    <div
      className="@md:grid @md:grid-cols-2 @md:gap-4"
      data-testid="score-dataarea"
    >
      {children}
    </div>
  );
}

/**
 * Display the label and value of a sore data item. The sore data item will be in grid-cols-2
 * so we can display two items in one row.
 */
export function ScoreDataItem({ label, value }) {
  return (
    <div className="@md:grid @md:grid-cols-2 @md:gap-4">
      <DataItemLabel>{label}</DataItemLabel>
      <DataItemValue>{value}</DataItemValue>
    </div>
  );
}

ScoreDataItem.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
