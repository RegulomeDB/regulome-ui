import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ButtonLink } from "./form-elements";

/**
 * Display the header above the data areas of a search page. This generally comprises controls on
 * the left and right side of the header to show different components.
 */
export default function SearchPageHeader({
  queryString,
  motifDocListNum,
  chipDatasetsNum,
  accessibilityDatasetsNum,
  qtlDatasetsNum,
  filesForGenomeBrowserNum,
  chromatinDatasetsNum,
}) {
  const [buttonInFocus, setButtonInFocus] = useState("summary");
  const router = useRouter();

  useEffect(() => {
    const path = router.asPath;
    if (path.endsWith(`#!chip`)) {
      setButtonInFocus("chip");
    } else if (path.endsWith(`#!accessibility`)) {
      setButtonInFocus("accessibility");
    } else if (path.endsWith(`#!qtl`)) {
      setButtonInFocus("qtl");
    } else if (path.endsWith(`#!motifs`)) {
      setButtonInFocus("motifs");
    } else if (path.endsWith(`#!chromatin`)) {
      setButtonInFocus("chromatin");
    } else if (path.endsWith(`#!browser`)) {
      setButtonInFocus("browser");
    } else {
      setButtonInFocus("summary");
    }
  }, [router]);

  return (
    <div className="mb-1 flex flex-wrap gap-2 justify-center">
      <HeaderButton
        queryString={queryString}
        buttonInFocus={buttonInFocus}
        buttonType="summary"
        buttonText="Summary"
      />
      <HeaderButton
        queryString={queryString}
        buttonInFocus={buttonInFocus}
        buttonType="chip"
        buttonText="ChIP Data"
        value={chipDatasetsNum}
        suffix
      />
      <HeaderButton
        queryString={queryString}
        buttonInFocus={buttonInFocus}
        buttonType="accessibility"
        buttonText="Accessibility Data"
        value={accessibilityDatasetsNum}
        suffix
      />
      <HeaderButton
        queryString={queryString}
        buttonInFocus={buttonInFocus}
        buttonType="qtl"
        buttonText="QTL Data"
        value={qtlDatasetsNum}
        suffix
      />
      <HeaderButton
        queryString={queryString}
        buttonInFocus={buttonInFocus}
        buttonType="motifs"
        buttonText="Motifs"
        value={motifDocListNum}
        suffix
      />
      <HeaderButton
        queryString={queryString}
        buttonInFocus={buttonInFocus}
        buttonType="chromatin"
        buttonText="Chromatin State"
        value={chromatinDatasetsNum}
        suffix
      />
      <HeaderButton
        queryString={queryString}
        buttonInFocus={buttonInFocus}
        buttonType="browser"
        buttonText="Genome Browser"
        value={filesForGenomeBrowserNum}
        suffix
      />
    </div>
  );
}

SearchPageHeader.propTypes = {
  queryString: PropTypes.string.isRequired,
  // the number of motif docs
  motifDocListNum: PropTypes.number.isRequired,
  // the number of chip datasets
  chipDatasetsNum: PropTypes.number.isRequired,
  // the number of accessibility datasets
  accessibilityDatasetsNum: PropTypes.number.isRequired,
  // the number of qtl datasets
  qtlDatasetsNum: PropTypes.number.isRequired,
  // the number of files for genome browser
  filesForGenomeBrowserNum: PropTypes.number.isRequired,
  // the number of chromatin state datasets
  chromatinDatasetsNum: PropTypes.number.isRequired,
};

function HeaderButton({
  queryString,
  buttonInFocus,
  buttonType,
  buttonText,
  value,
  suffix,
}) {
  const path = suffix
    ? `/search?${queryString}#!${buttonType}`
    : `/search?${queryString}`;
  const className =
    buttonInFocus === buttonType
      ? "text-button-primary outline-none bg-button-primary"
      : "bg-button-secondary text-button-secondary border-brand ";
  return (
    <div className="flex justify-end">
      <ButtonLink
        className={className}
        label={buttonType}
        href={path}
        type="primary"
        size="sm"
        hasIconOnly
      >
        <div className="shrink">
          <div>{buttonText}</div>
          <div className="text-xl font-light">{value}</div>
        </div>
      </ButtonLink>
    </div>
  );
}
HeaderButton.propTypes = {
  // the query string for this page
  queryString: PropTypes.string.isRequired,
  // which button to add focus style
  buttonInFocus: PropTypes.string.isRequired,
  // the button type to display
  buttonType: PropTypes.string.isRequired,
  // the text shown on the button
  buttonText: PropTypes.string.isRequired,
  // whether the url path need to add button type as suffix
  suffix: PropTypes.bool,
  // the number of datasets
  value: PropTypes.number.isRequired,
};
