import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { DataAreaTitle, DataPanel } from "./data-area";

/**
 * This is the view for display accessibility data for a variant.
 */
export function AccessibilityDataView({ data }) {
  const [showAccessibilityData, setShowAccessibilityData] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isChip = router.asPath.endsWith(`#!accessibility`);
    setShowAccessibilityData(isChip);
  }, [router]);
  return (
    showAccessibilityData && (
      <>
        {data.length > 0 ? (
          <DataAreaTitle>Accessibility Data</DataAreaTitle>
        ) : (
          <DataPanel>
            <DataAreaTitle>
              No accessibility data available to display, please choose a
              different SNP.
            </DataAreaTitle>
          </DataPanel>
        )}
      </>
    )
  );
}

AccessibilityDataView.propTypes = {
  data: PropTypes.array.isRequired,
};
