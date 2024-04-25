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
  getFillColor,
}) {
  const opacity = "opacity-40";
  return (
    <svg
      className="fill-white stroke-gray-600"
      id="BodyMap"
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
        getFillColor={getFillColor}
        organName={"skin of body"}
      />
      <HumanBodyParts.ArterialBloodVessel
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"arterial blood vessel"}
      />
      <HumanBodyParts.Limb
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"limb"}
      />
      <HumanBodyParts.Stomach
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"stomach"}
      />
      <HumanBodyParts.Vein
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"vein"}
      />
      <HumanBodyParts.Nerve
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"nerve"}
      />
      <HumanBodyParts.Pancreas
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"pancreas"}
      />
      <HumanBodyParts.MusculatureOfBody
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"musculature of body"}
      />
      <HumanBodyParts.Lung
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"lung"}
      />
      <HumanBodyParts.Bronchus
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"bronchus"}
      />
      <HumanBodyParts.SmallIntestine
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"small intestine"}
      />
      <HumanBodyParts.LargeIntestine
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"large intestine"}
      />
      <HumanBodyParts.Liver
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"liver"}
      />
      <HumanBodyParts.Kidney
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"kidney"}
      />
      <HumanBodyParts.AdrenalGland
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"adrenal gland"}
      />

      <HumanBodyParts.Esophagus
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"esophagus"}
      />
      <HumanBodyParts.Mouth
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"mouth"}
      />
      <HumanBodyParts.Nose
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"nose"}
      />
      <HumanBodyParts.ThyroidGland
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"thyroid gland"}
      />
      <HumanBodyParts.Thymus
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"thymus"}
      />
      <HumanBodyParts.Heart
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"heart"}
      />
      <HumanBodyParts.Testis
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"testis"}
      />
      <HumanBodyParts.Ureter
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"ureter"}
      />
      <HumanBodyParts.Uterus
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"uterus"}
      />
      <HumanBodyParts.UrinaryBladder
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"urinary bladder"}
      />
      <HumanBodyParts.Ovary
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"ovary"}
      />
      <HumanBodyParts.Penis
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"penis"}
      />
      <HumanBodyParts.SpinalCord
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"spinal cord"}
      />
      <HumanBodyParts.Brain
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"brain"}
      />
      <HumanBodyParts.Eye
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"eye"}
      />
      <HumanBodyParts.Breast
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"breast"}
      />
      <HumanBodyParts.MammaryGland
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"mammary gland"}
      />
      <HumanBodyParts.Tongue
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"tongue"}
      />
      <HumanBodyParts.BoneElement
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"bone element"}
      />
      <HumanBodyParts.ProstateGland
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"prostate gland"}
      />
      <HumanBodyParts.Spleen
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"spleen"}
      />
      <HumanBodyParts.Vagina
        facets={facets}
        opacity={opacity}
        organFilters={organFilters}
        highlightedOrgans={highlightedOrgans}
        getFillColor={getFillColor}
        organName={"vagina"}
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
  getFillColor: PropTypes.func.isRequired,
};

export default HumanBodyDiagram;
