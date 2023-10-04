import React from "react";
import PropTypes from "prop-types";
import {
  SkinOfBody,
  Limb,
  Spleen,
  Stomach,
  ArterialBloodVessel,
  Vein,
  Nerve,
  Pancreas,
  Lung,
  Bronchus,
  UrinaryBladder,
  SmallIntestine,
  LargeIntestine,
  Liver,
  Kidney,
  AdrenalGland,
  Esophagus,
  Mouth,
  Nose,
  ThyroidGland,
  Thymus,
  Heart,
  Testis,
  ProstateGland,
  Ureter,
  Penis,
  Uterus,
  SpinalCord,
  Brain,
  Eye,
  MusculatureOfBody,
  BoneElement,
  Breast,
  MammaryGland,
  Tongue,
  Ovary,
  Vagina,
} from "./human-body-parts";

/**
 * There are 37 parts in the human body diagram. Other than that, some parts share the same svg.
 * large intestine and colon share the same svf <LargeIntestine />
 *
 */
function HumanBodyDiagram({
  facets,
  organFilters,
  handleClickOrgan,
  organList,
  enabledBodyMapFilters,
}) {
  const opacity = 0.4;
  return (
    <svg
      fill="white"
      stroke="#545659"
      id="BodyMap"
      className="human-map"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 607 768"
      onClick={
        handleClickOrgan
          ? (e) =>
              handleClickOrgan(
                e.target.classList[0].replaceAll("-", " "),
                organList,
                enabledBodyMapFilters
              )
          : null
      }
    >
      <title>Homo sapiens clickable body map</title>
      <SkinOfBody
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
      />
      <Limb facets={facets} opacity={0.8} organFilters={organFilters} />
      <Stomach facets={facets} opacity={opacity} organFilters={organFilters} />
      <ArterialBloodVessel
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
      />
      <Vein facets={facets} opacity={opacity} organFilters={organFilters} />
      <Nerve facets={facets} opacity={opacity} organFilters={organFilters} />
      <Pancreas facets={facets} opacity={opacity} organFilters={organFilters} />
      <MusculatureOfBody
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
      />
      <Lung facets={facets} opacity={opacity} organFilters={organFilters} />
      <Bronchus facets={facets} opacity={opacity} organFilters={organFilters} />
      <SmallIntestine
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
      />
      <LargeIntestine
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
      />
      <Liver facets={facets} opacity={opacity} organFilters={organFilters} />
      <Kidney facets={facets} opacity={opacity} organFilters={organFilters} />
      <AdrenalGland
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
      />
      <UrinaryBladder
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
      />
      <Esophagus
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
      />
      <Mouth facets={facets} opacity={opacity} organFilters={organFilters} />
      <Nose facets={facets} opacity={opacity} organFilters={organFilters} />
      <ThyroidGland
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
      />
      <Thymus facets={facets} opacity={opacity} organFilters={organFilters} />
      <Heart facets={facets} opacity={opacity} organFilters={organFilters} />
      <Testis facets={facets} opacity={opacity} organFilters={organFilters} />
      <Ureter facets={facets} opacity={opacity} organFilters={organFilters} />
      <Uterus facets={facets} opacity={opacity} organFilters={organFilters} />
      <Ovary facets={facets} opacity={opacity} organFilters={organFilters} />
      <Penis facets={facets} opacity={opacity} organFilters={organFilters} />
      <SpinalCord
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
      />
      <Brain facets={facets} opacity={opacity} organFilters={organFilters} />
      <Eye facets={facets} opacity={opacity} organFilters={organFilters} />
      <Breast facets={facets} opacity={opacity} organFilters={organFilters} />
      <MammaryGland
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
      />
      <Tongue facets={facets} opacity={opacity} organFilters={organFilters} />
      <BoneElement
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
      />
      <ProstateGland
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
      />
      <Spleen facets={facets} opacity={opacity} organFilters={organFilters} />
      <Vagina facets={facets} opacity={opacity} organFilters={organFilters} />
    </svg>
  );
}

HumanBodyDiagram.propTypes = {
  handleClickOrgan: PropTypes.func,
  facets: PropTypes.object.isRequired,
  organFilters: PropTypes.array.isRequired,
  organList: PropTypes.array.isRequired,
  enabledBodyMapFilters: PropTypes.array.isRequired,
};

export default HumanBodyDiagram;
