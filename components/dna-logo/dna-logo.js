import React from "react";
import PropTypes from "prop-types";
import Base from "./base";
import _ from "lodash";

const BACKGROUND_FREQUENCY = 0.25;
const HEIGHT = 100;
const BASE_WIDTH = 40;
const VIEW_BOX_WIDTH_OFFSET = 100;
const START_POSITION = 1;
const FONT_SIZE = 18;
const Y_AXIS_WIDTH = 65;
const BASE_START_X = 80;
const BASE_START_Y = 10;
const Y_AXIS_START_X = 0;
const Y_AXIS_START_Y = 10;
const Y_TICK_LENGTH = 15;
const Y_TICK_HEIGHT = 4;

const DNA_ALPHABET = ["A", "C", "G", "T"];
const COMPLEMENT_DNA_ALPHABET = ["T", "G", "C", "A"];

/**
 * Return a stack to display the possibility of a base showing up at the specific position
 */
function BaseStack({ values, baseMaxHeight, transform, strand, heightScale }) {
  let height = baseMaxHeight;

  /* move up from bottom */
  const xscale = BASE_WIDTH / HEIGHT;
  /* stack bases in order */
  const bases = values.map((element) => {
    if (element.value === 0.0) {
      return null;
    }

    height -= ((element.value / 2) * HEIGHT) / heightScale;

    const base =
      strand === "+"
        ? DNA_ALPHABET[element.index]
        : COMPLEMENT_DNA_ALPHABET[element.index];
    return (
      <g transform={"translate(0," + height + ")"} key={element.index}>
        <Base
          xscale={xscale}
          yscale={element.value / 2 / heightScale}
          base={base}
        />
      </g>
    );
  });

  /* wrap bases in g */
  return <g transform={transform}>{bases}</g>;
}

BaseStack.propTypes = {
  values: PropTypes.array.isRequired,
  baseMaxHeight: PropTypes.number.isRequired,
  transform: PropTypes.string.isRequired,
  strand: PropTypes.string.isRequired,
  heightScale: PropTypes.number.isRequired,
};

/**
 * Renders a y-axis for a logo scaled by information content.
 */
function YAxis({ baseMaxHeight }) {
  const ticks = [0, 1, 2];
  return (
    <g transform={`translate(${Y_AXIS_START_X},${Y_AXIS_START_Y})`}>
      <rect
        height={baseMaxHeight}
        width={4}
        x={Y_AXIS_WIDTH + 1}
        y={0}
        fill="#000000"
      />
      {ticks.map((i) => (
        <g
          key={i}
          transform={
            "translate(0," + (baseMaxHeight - (i * baseMaxHeight) / 2) + ")"
          }
        >
          <text
            x={Y_AXIS_WIDTH - FONT_SIZE}
            textAnchor="end"
            y="4"
            fontSize={FONT_SIZE}
          >
            {i}
          </text>
          <rect
            x={Y_AXIS_WIDTH - 10}
            width={Y_TICK_LENGTH}
            height={Y_TICK_HEIGHT}
            y="-2"
            fill="#000000"
          />
        </g>
      ))}
      <g transform="rotate(-90)">
        <text
          y={FONT_SIZE}
          x={-baseMaxHeight / 2}
          textAnchor="middle"
          fontSize={FONT_SIZE}
        >
          bits
        </text>
      </g>
    </g>
  );
}
YAxis.propTypes = {
  baseMaxHeight: PropTypes.number.isRequired,
};

/**
 * Renders an x-axis with logo position numbers.
 *
 */
function XAxis({ n, baseMaxHeight }) {
  const numbers = [...Array(n).keys()];
  const xLableStartY = baseMaxHeight + FONT_SIZE;
  return (
    <g
      fontSize={FONT_SIZE}
      transform={`translate(${BASE_START_X},${xLableStartY})`}
    >
      <text x="0" y="35">
        5'
      </text>
      <text x={BASE_WIDTH * n} y="35">
        3'
      </text>
      <g transform="rotate(-90)">
        {numbers.map((n) => (
          <text x="0" y={BASE_WIDTH * n + 30} textAnchor="end" key={n}>
            {n + START_POSITION}
          </text>
        ))}
      </g>
    </g>
  );
}

XAxis.propTypes = {
  // the total number of positions in the logo
  n: PropTypes.number.isRequired,
  // the max height a base can have
  baseMaxHeight: PropTypes.number.isRequired,
};

/**
 * Renders a DNA logo without axes.
 *
 */
function RawLogo({ values, baseMaxHeight, strand, heightScale }) {
  values = strand === "-" ? values.reverse() : values;

  return values.map((lv, i) => {
    const valuesWithIndex = lv.map((value, index) => {
      return {
        index,
        value,
      };
    });
    const sortedValuesWithIndex = _.orderBy(valuesWithIndex, ["value"]);

    return (
      <BaseStack
        values={sortedValuesWithIndex}
        baseMaxHeight={baseMaxHeight}
        transform={"translate(" + BASE_WIDTH * i + ",0)"}
        key={i}
        strand={strand}
        heightScale={heightScale}
      />
    );
  });
}
RawLogo.propTypes = {
  // matrix containing symbol values
  values: PropTypes.array.isRequired,
  // the max height a base can have
  baseMaxHeight: PropTypes.number.isRequired,
  strand: PropTypes.string.isRequired,
  heightScale: PropTypes.number.isRequired,
};
/**
 * Return a rectangle box the hightlight the snp queried.
 */
function SnpBox({ snpCoordinate, baseMaxHeight }) {
  const x = BASE_WIDTH * (snpCoordinate - 1);
  return (
    <rect
      height={baseMaxHeight}
      width={BASE_WIDTH}
      x={x}
      stroke="#000000"
      fillOpacity="0.1"
      strokeWidth="5"
    />
  );
}
SnpBox.propTypes = {
  snpCoordinate: PropTypes.number.isRequired,
  baseMaxHeight: PropTypes.number.isRequired,
};

/**
 * Renders a DNA logo with x- and y-axes.
 *
 */
function LogoRef({ pwm, strand, snpCoordinate, hideY, heightScale }, ref) {
  if (pwm.length === 0 || pwm[0].length === 0) return <div />;
  const likelihood = pwm.map((r) => {
    let sum = 0.0;
    r.map(
      (x) => (sum += x === 0 ? 0 : x * Math.log2(x / BACKGROUND_FREQUENCY))
    );
    return r.map((x) => {
      const v = x * sum;
      return v <= 0.0 ? 0.0 : v;
    });
  });

  /* compute viewBox and padding for the x-axis labels */
  const viewBoxW = pwm.length * BASE_WIDTH + VIEW_BOX_WIDTH_OFFSET;
  heightScale = heightScale || 1;
  const baseMaxHeight = HEIGHT / heightScale;
  const viewBoxH =
    baseMaxHeight + FONT_SIZE * (pwm.length.toString().length + 1.5);

  return (
    <svg viewBox={"0 0 " + viewBoxW + " " + viewBoxH} ref={ref}>
      <XAxis n={pwm.length} baseMaxHeight={baseMaxHeight} />
      {!hideY && <YAxis baseMaxHeight={baseMaxHeight} />}
      <g transform={`translate(${BASE_START_X},${BASE_START_Y})`}>
        <RawLogo
          values={likelihood}
          strand={strand}
          baseMaxHeight={baseMaxHeight}
          heightScale={heightScale}
        />
        <SnpBox snpCoordinate={snpCoordinate} baseMaxHeight={baseMaxHeight} />
      </g>
    </svg>
  );
}

LogoRef.propTypes = {
  // position probability wighted matrix, for each row there are 4 colums and the values sum to 1
  pwm: PropTypes.array.isRequired,
  // whether to show Yaxis
  hideY: PropTypes.bool,
  strand: PropTypes.string.isRequired,
  snpCoordinate: PropTypes.number.isRequired,
  heightScale: PropTypes.number,
};

const DnaLogo = React.forwardRef(LogoRef);
export default DnaLogo;
