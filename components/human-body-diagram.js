import PropTypes from "prop-types";
import HumanBodyParts from "./human-body-parts";

/**
 * HumanBodyDiagram is separated into 37 parts for easy management.
 *
 */
function HumanBodyDiagram({
  facets,
  organFilters,
  handleClickOrgan,
  organList,
  enabledBodyMapFilters,
  highlightedOrgans,
  highlightOrgans,
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
                e.target.id.replaceAll("-", " ") ||
                  e.target.parentElement.id.replaceAll("-", " "),
                organList,
                enabledBodyMapFilters
              )
          : null
      }
      onMouseOver={
        highlightOrgans
          ? (e) => {
              const organ =
                e.target.id.replaceAll("-", " ") ||
                e.target.parentElement.id.replaceAll("-", " ");
              if (enabledBodyMapFilters.includes(organ)) {
                highlightOrgans(organ);
              }
            }
          : null
      }
      onMouseOut={highlightOrgans ? () => highlightOrgans() : null}
    >
      <title>Homo sapiens clickable body map</title>
      <HumanBodyParts.SkinOfBody
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.ArterialBloodVessel
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.Limb
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.Stomach
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.Vein
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.Nerve
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.Pancreas
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.MusculatureOfBody
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.Lung
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.Bronchus
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.SmallIntestine
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.LargeIntestine
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.Liver
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.Kidney
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.AdrenalGland
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />

      <HumanBodyParts.Esophagus
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.Mouth
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.Nose
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.ThyroidGland
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.Thymus
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.Heart
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.Testis
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.Ureter
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.Uterus
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.UrinaryBladder
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.Ovary
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.Penis
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.SpinalCord
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.Brain
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.Eye
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.Breast
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.MammaryGland
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.Tongue
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.BoneElement
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.ProstateGland
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.Spleen
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
      <HumanBodyParts.Vagina
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
      />
    </svg>
  );
}

HumanBodyDiagram.propTypes = {
  handleClickOrgan: PropTypes.func,
  facets: PropTypes.object.isRequired,
  organFilters: PropTypes.array.isRequired,
  organList: PropTypes.array.isRequired,
  enabledBodyMapFilters: PropTypes.array.isRequired,
  highlightedOrgans: PropTypes.array,
  highlightOrgans: PropTypes.func,
};

export default HumanBodyDiagram;
