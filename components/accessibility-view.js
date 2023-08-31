import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { DataAreaTitle, DataPanel } from "./data-area";

export function useAccessibilityData() {
  const [showChipData, setShowChipData] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isChip = router.asPath.endsWith(`#!accessibility`);
    setShowChipData(isChip);
  }, [router]);
  return showChipData;
}
/**
 * This is the view for diasplay accessibility data for a variant.
 */
export function AccessibilityDataView({ data }) {
  const showData = useAccessibilityData();
  return showData ? (
    <React.Fragment>
      {data.length > 0 ? (
        <DataAreaTitle>Accessibility Data</DataAreaTitle>
      ) : (
        <React.Fragment>
          <DataPanel>
            <DataAreaTitle>
              No accessibility data available to display, please choose a
              different SNP.
            </DataAreaTitle>
          </DataPanel>
        </React.Fragment>
      )}
    </React.Fragment>
  ) : null;
}

AccessibilityDataView.propTypes = {
  data: PropTypes.array.isRequired,
};
