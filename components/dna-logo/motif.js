import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import Base from "./base";

const BACKGROUND_FREQUENCY = 0.25;
const HEIGHT = 100;
// The base's height is 100, for nearby drawing, I set the base's max height to be 50
const SCALE_Y = 0.5;

const DNA_ALPHABET = ["A", "C", "G", "T"];
const COMPLEMENT_DNA_ALPHABET = ["T", "G", "C", "A"];

/**
 * Return a stack to display the possibility of a base showing up at the specific position
 */
function BaseStackMotif({ values, transform, strand }) {
  let height = HEIGHT * SCALE_Y;

  /* stack bases in order */
  const bases = values.map((element) => {
    if (element.value === 0.0) {
      return null;
    }

    height -= (element.value / 2) * HEIGHT * SCALE_Y;

    const base =
      strand === "+"
        ? DNA_ALPHABET[element.index]
        : COMPLEMENT_DNA_ALPHABET[element.index];
    return (
      <g transform={"translate(0," + height + ")"} key={element.index}>
        <Base
          xscale={0.01}
          yscale={(element.value / 2) * SCALE_Y}
          base={base}
        />
      </g>
    );
  });

  /* wrap bases in g */
  return <g transform={transform}>{bases}</g>;
}

BaseStackMotif.propTypes = {
  values: PropTypes.array.isRequired,
  transform: PropTypes.string.isRequired,
  strand: PropTypes.string.isRequired,
};

/**
 * Calculate the likelihood of each base at the certain posistion,
 * and sort the likelihoods from smallest to biggest for each position
 * @param {array} pwm data matrix used for calculation
 * @param {string} strand the strand of the motif
 * @returns an array of sorted likelihood
 */
function getSortedValuesWithIndex(pwm, strand) {
  let likelihood = pwm.map((row) => {
    const sum = row.reduce(
      (accumulator, currentValue) =>
        (accumulator +=
          currentValue === 0
            ? 0
            : currentValue * Math.log2(currentValue / BACKGROUND_FREQUENCY)),
      0
    );
    return row.map((x) => {
      const v = x * sum;
      return v <= 0.0 ? 0.0 : v;
    });
  });
  likelihood = strand === "-" ? likelihood.reverse() : likelihood;

  const sortedValuesWithIndex = likelihood.map((lv) => {
    const valuesWithIndex = lv.map((value, index) => {
      return {
        index,
        value,
      };
    });
    return _.orderBy(valuesWithIndex, ["value"]);
  });
  return sortedValuesWithIndex;
}

export function MotifDnaLogo({ pwm, strand, startX, startY, scaleX }) {
  const sortedValuesWithIndex = getSortedValuesWithIndex(pwm, strand);
  const bases = sortedValuesWithIndex.map((values, i) => {
    const transform = `translate(${(startX + i) * scaleX} ${startY}
          ) scale(${scaleX}, 1)`;

    return (
      <g key={i}>
        <BaseStackMotif values={values} strand={strand} transform={transform} />
      </g>
    );
  });
  return <g>{bases}</g>;
}
MotifDnaLogo.propTypes = {
  // data matrix used to caculate the likelihood for a base.
  pwm: PropTypes.array.isRequired,
  // the strand of the motif
  strand: PropTypes.string.isRequired,
  // the starting X position of the motif
  startX: PropTypes.number.isRequired,
  // the starting Y position of the motif
  startY: PropTypes.number.isRequired,
  // the X scale for the motif
  scaleX: PropTypes.number.isRequired,
};
