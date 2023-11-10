import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ButtonLink } from "./form-elements";

/**
 * Display the header above the data areas of a search page. This generally comprises controls on
 * the left and right side of the header to show different components.
 */
export default function SearchPageHeader({ queryString }) {
  const [buttonInFocus, setButtonInFocus] = useState("score");
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
      setButtonInFocus("score");
    }
  }, [router]);

  return (
    <>
      <div className="mb-1 flex flex-wrap gap-1">
        <HeaderButton
          queryString={queryString}
          buttonInFocus={buttonInFocus}
          buttonType="score"
          buttonText="Score"
        />
        <HeaderButton
          queryString={queryString}
          buttonInFocus={buttonInFocus}
          buttonType="chip"
          buttonText="ChIP Data"
          suffix
        />
        <HeaderButton
          queryString={queryString}
          buttonInFocus={buttonInFocus}
          buttonType="accessibility"
          buttonText="Accessibility Data"
          suffix
        />
        <HeaderButton
          queryString={queryString}
          buttonInFocus={buttonInFocus}
          buttonType="qtl"
          buttonText="QTL Data"
          suffix
        />
        <HeaderButton
          queryString={queryString}
          buttonInFocus={buttonInFocus}
          buttonType="motifs"
          buttonText="Motifs"
          suffix
        />
        <HeaderButton
          queryString={queryString}
          buttonInFocus={buttonInFocus}
          buttonType="chromatin"
          buttonText="Chromatin state"
          suffix
        />
        <HeaderButton
          queryString={queryString}
          buttonInFocus={buttonInFocus}
          buttonType="browser"
          buttonText="Genome Browser"
          suffix
        />
      </div>
    </>
  );
}

SearchPageHeader.propTypes = {
  queryString: PropTypes.string.isRequired,
};

function HeaderButton({
  queryString,
  buttonInFocus,
  buttonType,
  buttonText,
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
        {buttonText}
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
};
