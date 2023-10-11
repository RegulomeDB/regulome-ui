import PropTypes from "prop-types";
import { ChromatinStateColor } from "../lib/chromatin-data";

const BAR_HEIGHT = 20;
const WIDTH_PER_DATASET = 10;
const TEXT_X = 10;
const TEXT_Y = 18;

/**
 * Display a horizontal bar line matching the number of files for different chromatin states for a give biosample.
 * The bars along the line is sorted by chromatin states from high transcription activity to low transcription activity
 * the states contains count for each states. Example data looks like this:
 * {
 *   "Flanking TSS upstream": 1
 *   "Active enhancer": 3
 * }
 */
export default function BiosampleStateBar({ states }) {
  console.log(states);
  const total = Object.keys(states).reduce((sum, key) => sum + states[key], 0);
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
      <g>
        {rectsData.map((rect) => {
          return (
            <g key={rect.key}>
              <rect
                id="bar"
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
