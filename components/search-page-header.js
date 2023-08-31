import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ButtonLink } from "./form-elements";

/**
 * Display the header above the data areas of a search page. This generally comprises controls on
 * the left and right side of the header to show different components.
 */
export default function SearchPageHeader({ queryString }) {
  const buttonStyle = useButtonFocus();

  return (
    <>
      <div className="mb-1 flex justify-between">
        <div className="flex justify-end gap-1">
          <ScoreViewLink queryString={queryString} buttonStyle={buttonStyle} />
          <ChipDataViewLink
            queryString={queryString}
            buttonStyle={buttonStyle}
          />
          <AccessibilityDataViewLink
            queryString={queryString}
            buttonStyle={buttonStyle}
          />
        </div>
      </div>
    </>
  );
}

SearchPageHeader.propTypes = {
  queryString: PropTypes.string.isRequired,
};

function useButtonFocus() {
  /**
   * check which button need to be in focus
   */
  const [buttonStyle, setButtonStyle] = useState("score");
  const router = useRouter();

  useEffect(() => {
    const path = router.asPath;
    if (path.endsWith(`#!chip`)) {
      setButtonStyle("chip");
    } else if (path.endsWith(`#!accessibility`)) {
      setButtonStyle("accessibility");
    } else {
      setButtonStyle("score");
    }
  }, [router]);
  return buttonStyle;
}

function ChipDataViewLink({ queryString, buttonStyle }) {
  const editPath = `/search?${queryString}#!chip`;
  let className = "bg-button-secondary text-button-secondary border-brand ";
  if (buttonStyle === "chip") {
    className = "text-button-primary outline-none bg-button-primary";
  }
  return (
    <div className="flex justify-end">
      <ButtonLink
        className={className}
        label="Chip"
        href={editPath}
        type="primary"
        size="sm"
        hasIconOnly
      >
        ChIP Data
      </ButtonLink>
    </div>
  );
}
ChipDataViewLink.propTypes = {
  queryString: PropTypes.string.isRequired,
  buttonStyle: PropTypes.string.isRequired,
};

function AccessibilityDataViewLink({ queryString, buttonStyle }) {
  const editPath = `/search?${queryString}#!accessibility`;
  let className = "bg-button-secondary text-button-secondary border-brand ";
  if (buttonStyle === "accessibility") {
    className = "text-button-primary outline-none bg-button-primary";
  }
  return (
    <div className="flex justify-end">
      <ButtonLink
        className={className}
        label="Accessibility"
        href={editPath}
        type="primary"
        size="sm"
        hasIconOnly
      >
        Accessibility Data
      </ButtonLink>
    </div>
  );
}
AccessibilityDataViewLink.propTypes = {
  queryString: PropTypes.string.isRequired,
  buttonStyle: PropTypes.string.isRequired,
};

function ScoreViewLink({ queryString, buttonStyle }) {
  const editPath = `/search?${queryString}`;
  let className = "bg-button-secondary text-button-secondary border-brand ";
  if (buttonStyle === "score") {
    className = "text-button-primary outline-none bg-button-primary";
  }
  return (
    <div className="flex justify-end">
      <ButtonLink
        className={className}
        label="Edit"
        href={editPath}
        type="primary"
        size="sm"
        hasIconOnly
      >
        Score
      </ButtonLink>
    </div>
  );
}
ScoreViewLink.propTypes = {
  queryString: PropTypes.string.isRequired,
  buttonStyle: PropTypes.string.isRequired,
};
