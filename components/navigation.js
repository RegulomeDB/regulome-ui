import PropTypes from "prop-types";
import Link from "next/link";

import {
  QuestionMarkCircleIcon,
  EnvelopeIcon,
} from "@heroicons/react/20/solid";

function NavigationLink({ id, href, label, children, isExternalLink }) {
  const cssClasses =
    "flex rounded-full items-center border border-transparent px-2 py-1 text-left no-underline hover:bg-nav-highlight text-black md:hover:border md:hover:border-nav-border md:hover:bg-nav-highlight md:dark:text-gray-200 text-base font-medium";
  if (isExternalLink) {
    return (
      <a
        href={href}
        data-testid={`navigation-${id}`}
        className={cssClasses}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} data-testid={`navigation-${id}`} className={cssClasses}>
      {children}
    </Link>
  );
}

NavigationLink.propTypes = {
  // The id of the navigation item
  id: PropTypes.string.isRequired,
  // The URI for the navigation item
  href: PropTypes.string.isRequired,
  // Accessible label for the link
  label: PropTypes.string,
  isExternalLink: PropTypes.bool,
};

export default function Navigation() {
  return (
    <>
      <div className="flex justify-end">
        <NavigationLink
          id="contact"
          href="mailto:regulomedb@mailman.stanford.edu"
          label="Email the RegulomeDB help desk"
          isExternalLink
        >
          <EnvelopeIcon className="h-8 w-8" />
        </NavigationLink>
        <NavigationLink id="help" href="/help">
          <QuestionMarkCircleIcon className="h-8 w-8" />
        </NavigationLink>
        <NavigationLink
          id="annotations"
          href="https://www.encodeproject.org/search/?type=Annotation&internal_tags=RegulomeDB_2_2"
          isExternalLink
        >
          Annotations
        </NavigationLink>
        <NavigationLink
          id="experiments"
          href="https://www.encodeproject.org/search/?type=Experiment&internal_tags=RegulomeDB_2_2"
          isExternalLink
        >
          Experiments
        </NavigationLink>
      </div>
    </>
  );
}
