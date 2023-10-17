import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { DataAreaTitle, DataPanel } from "./data-area";
import GenomeBrowser from "./genome-browser";

/**
 * This is the view for display chromatin state data for a variant.
 * It contains three facets group: Organ slim facets, biosample facets and chromatin state facets
 * and a cortable table to display the chromatin state datasets
 */
export function GenomeBrowserView({ files, assembly, coordinates }) {
  const router = useRouter();
  useEffect(() => {
    const isBrowser = router.asPath.endsWith(`#!browser`);
    setShowBrowserData(isBrowser);
  }, [router]);
  const [showBrowserData, setShowBrowserData] = useState(false);

  return (
    showBrowserData && (
      <>
        {files.length > 0 ? (
          <>
            <DataAreaTitle>Genome Browser</DataAreaTitle>
            <DataPanel>
              <GenomeBrowser
                key={files.length}
                fixedHeight={false}
                files={files}
                expanded
                assembly={assembly}
                coordinates={coordinates}
                selectedFilters={[]}
              />
            </DataPanel>
          </>
        ) : (
          <DataPanel>
            <DataAreaTitle>
              No genome browser data available to display, please choose a
              different SNP.
            </DataAreaTitle>
          </DataPanel>
        )}
      </>
    )
  );
}

GenomeBrowserView.propTypes = {
  files: PropTypes.array.isRequired,
  assembly: PropTypes.string.isRequired,
  coordinates: PropTypes.string.isRequired,
};
