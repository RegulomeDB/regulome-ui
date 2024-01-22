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
  getFillColorHex,
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
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.ArterialBloodVessel
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.Limb
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.Stomach
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.Vein
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.Nerve
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.Pancreas
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.MusculatureOfBody
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.Lung
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.Bronchus
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.SmallIntestine
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.LargeIntestine
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.Liver
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.Kidney
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.AdrenalGland
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />

      <HumanBodyParts.Esophagus
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.Mouth
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.Nose
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.ThyroidGland
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.Thymus
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.Heart
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.Testis
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.Ureter
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.Uterus
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.UrinaryBladder
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.Ovary
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.Penis
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.SpinalCord
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.Brain
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.Eye
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.Breast
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.MammaryGland
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.Tongue
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.BoneElement
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.ProstateGland
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.Spleen
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
      />
      <HumanBodyParts.Vagina
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColorHex={getFillColorHex}
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
  getFillColorHex: PropTypes.func.isRequired,
};

export default HumanBodyDiagram;
