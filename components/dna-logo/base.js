import PropTypes from "prop-types";

function A() {
  return (
    <g>
      <path
        fill="red"
        d="M 0 100 L 33 0 L 66 0 L 100 100 L 75 100 L 66 75 L 33 75 L 25 100 L 0 100"
      />
      <path fill="#ffffff" d="M 41 55 L 50 25 L 58 55 L 41 55" />
    </g>
  );
}

function T() {
  return (
    <path
      fill="#228b22"
      d="M 0 0 L 0 20 L 35 20 L 35 100
    L 65 100 L 65 20 L 100 20
    L 100 0 L 0 0"
    />
  );
}

function C() {
  return (
    <path
      fill="blue"
      d="M 100 28 C 100 -13 0 -13 0 50
    C 0 113 100 113 100 72 L 75 72
    C 75 90 30 90 30 50 C 30 10 75 10 75 28
    L 100 28"
    />
  );
}

function G() {
  return (
    <path
      fill="orange"
      d="M 100 28 C 100 -13 0 -13 0 50 C 0 113 100 113 100 72
    L 100 48 L 55 48 L 55 72 L 75 72 C 75 90 30 90 30 50
    C 30 10 75 5 75 28 L 100 28"
    />
  );
}
/**
 * Draw one symble at given scale.
 *
 */
export default function Base({ yscale, xscale, base }) {
  return (
    <g transform={"scale(" + xscale + "," + yscale + ")"}>
      {base === "A" && <A />}
      {base === "T" && <T />}
      {base === "G" && <G />}
      {base === "C" && <C />}
    </g>
  );
}
Base.propTypes = {
  yscale: PropTypes.number.isRequired,
  xscale: PropTypes.number.isRequired,
  base: PropTypes.string.isRequired,
};
