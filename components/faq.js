import PropTypes from "prop-types";
import { useState } from "react";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

/**
 * Display the question and the answer. You can click the question to display or hide the answer.
 */
export default function FAQ({ question, children }) {
  const [displayAnswer, setDisplayAnswer] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setDisplayAnswer(!displayAnswer)}
        className="flex pb-4 cursor-pointer hover:underline"
        id="regulomehelp-faq3-question"
      >
        {displayAnswer ? (
          <ChevronDownIcon className="h-6 w-6" />
        ) : (
          <ChevronRightIcon className="h-6 w-6" />
        )}
        <strong>{question}</strong>
      </button>
      {displayAnswer && <div>{children}</div>}
    </>
  );
}

FAQ.propTypes = {
  // question to display
  question: PropTypes.string.isRequired,
};
