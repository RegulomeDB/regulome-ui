import PropTypes from "prop-types";
import { ChromatinStateColor } from "./chromatin-state-facets";

const BAR_HEIGHT = 20;
const WIDTH_PER_DATASET = 10;
const TEXT_X = 10;
const TEXT_Y = 18;

/**
 * Display SNPs Matching Searched Coordinates and Nearby SNPs using line chart
 */
export default function BiosampleStateBar({ states }) {
  const total = Object.keys(states).reduce(
    (sum, key) => (sum += states[key]),
    0
  );
  const rectsData = [];
  let startX = 0;
  Object.keys(states).forEach((state) => {
    const fill = ChromatinStateColor[state].hex;
    const x = startX;
    const width = WIDTH_PER_DATASET * states[state];
    const key = state;
    rectsData.push({
      x,
      width,
      fill,
      key,
    });
    startX += width;
  });
  return (
    <svg height="35px">
      <g className="text-sm">
        {rectsData.map((rect) => {
          return (
            <g key={rect.key}>
              <rect
                id="lable-background-color"
                x={rect.x}
                height={BAR_HEIGHT}
                width={rect.width}
                fill={rect.fill}
                opacity="0.8"
              />
            </g>
          );
        })}
        <text
          id="total-count"
          className="text-sm"
          fill="#0074d9"
          x={TEXT_X}
          y={TEXT_Y}
        >
          {total}
        </text>
      </g>
    </svg>
  );
}

BiosampleStateBar.propTypes = {
  states: PropTypes.object.isRequired,
};
