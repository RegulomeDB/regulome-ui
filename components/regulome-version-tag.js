import PropTypes from "prop-types";
import Link from "next/link";
import Image from "next/image";
/**
 * This function will display regulome icon with version tag for query or home page.
 * @param {*} version the version to display
 * @returns regulome icon with version tag
 */
export default function RegulomeVersionTag({ version = "2.2" }) {
  return (
    <div className="flex justify-center mb-10">
      <Link href="/">
        <Image
          src="/RegulomeLogoFinal.gif"
          alt="clickable image"
          width="0"
          height="0"
          sizes="100vw"
          className="w-full h-auto"
          priority
        />
        <span className="sr-only">Home</span>
      </Link>
      <div className="text-red-500 no-underline font-extrabold	">{version}</div>
    </div>
  );
}

RegulomeVersionTag.propTypes = {
  version: PropTypes.string,
};
