import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  DataArea,
  DataAreaTitle,
  DataItemLabel,
  DataItemValue,
  DataPanel,
} from "./data-area";
import GenomeBrowser from "./genome-browser";
import {
  GenomeBrowserFacets,
  filterByAllSelectedFilters,
} from "./genome-browser-facets";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

// number of files to display on genome browser
const NUMBER_OF_FILES_FOR_DISPLAY = 20;

/**
 * This is the view for display data genome browser for a variant.
 * It contains facets for filter the files, genome browser to display the files and pagination if needed.
 */
export function GenomeBrowserView({ files, assembly, coordinates }) {
  const router = useRouter();
  useEffect(() => {
    const isBrowser = router.asPath.endsWith(`#!browser`);
    setShowBrowserData(isBrowser);
  }, [router]);
  const [showBrowserData, setShowBrowserData] = useState(false);
  const [filteredFiles, setFilteredFiles] = useState(files);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [totalPage, setTotalPage] = useState(
    Math.ceil(filteredFiles.length / NUMBER_OF_FILES_FOR_DISPLAY)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedFiles, setDisplayedFiles] = useState(
    filteredFiles.slice(0, 20)
  );

  function handleFacetList(selectedFilters) {
    const filteredFiles = filterByAllSelectedFilters(files, selectedFilters);
    setFilteredFiles(filteredFiles);
    setSelectedFilters(selectedFilters);
    // if there are more filtered files than we want to display on one page, we will paginate
    const browserTotalPages = Math.ceil(
      filteredFiles.length / NUMBER_OF_FILES_FOR_DISPLAY
    );
    setTotalPage(browserTotalPages);
    setCurrentPage(1);
    const includedFiles = filteredFiles.slice(0, NUMBER_OF_FILES_FOR_DISPLAY);
    setDisplayedFiles(includedFiles);
  }

  function handlePagination(pageDirection) {
    if (pageDirection === "plus") {
      const startIdx = currentPage * NUMBER_OF_FILES_FOR_DISPLAY;
      const endIdx = (currentPage + 1) * NUMBER_OF_FILES_FOR_DISPLAY;
      const displayedFiles = filteredFiles.slice(startIdx, endIdx);
      setDisplayedFiles(displayedFiles);
      setCurrentPage(currentPage + 1);
    } else {
      const startIdx = (currentPage - 2) * NUMBER_OF_FILES_FOR_DISPLAY;
      const endIdx = (currentPage - 1) * NUMBER_OF_FILES_FOR_DISPLAY;
      const displayedFiles = filteredFiles.slice(startIdx, endIdx);
      setDisplayedFiles(displayedFiles);
      setCurrentPage(currentPage - 1);
    }
  }

  return (
    showBrowserData && (
      <>
        {files.length > 0 ? (
          <>
            <DataAreaTitle>Genome Browser</DataAreaTitle>
            <DataPanel>
              <DataArea>
                <DataItemLabel>Number of tracks:</DataItemLabel>
                <DataItemValue>{filteredFiles.length}</DataItemValue>
              </DataArea>
              <GenomeBrowserFacets
                files={files}
                handleFacetList={handleFacetList}
                filteredFiles={filteredFiles}
                selectedFilters={selectedFilters}
              />
              <GenomeBrowser
                key={files.length}
                fixedHeight={false}
                files={displayedFiles}
                assembly={assembly}
                coordinates={coordinates}
                selectedFilters={selectedFilters}
              />
              {totalPage > 1 && (
                <div className="text-center mt-6">
                  <div>
                    <button
                      disabled={currentPage === 1}
                      onClick={() => handlePagination("minus")}
                    >
                      <ChevronLeftIcon
                        className={`h-8 w-8 ${
                          currentPage === 1
                            ? "text-gray-200"
                            : "hover:bg-gray-200"
                        }`}
                      />
                    </button>
                    <button
                      disabled={currentPage === totalPage}
                      onClick={() => handlePagination("plus")}
                    >
                      <ChevronRightIcon
                        className={`h-8 w-8 ${
                          currentPage === totalPage
                            ? "text-gray-200"
                            : "hover:bg-gray-200"
                        }`}
                      />
                    </button>
                  </div>
                  <div>
                    Page <b>{currentPage}</b> of <b>{totalPage}</b>
                  </div>
                </div>
              )}
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
