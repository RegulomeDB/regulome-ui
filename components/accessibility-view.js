import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { DataAreaTitle, DataPanel } from "./data-area";
import AccessibilityDataTable from "./accessibility-table";

// To dynamically load component ChipDataBarChart on the client side,
// use the ssr option to disable server-rendering since ChipDataBarChart relies on browser APIs like window.
const AccessibilityChart = dynamic(() => import("./accessibility-chart"), {
  ssr: false,
});

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
          <>
            <DataAreaTitle>Accessibility Data</DataAreaTitle>
            <DataPanel>
              <AccessibilityChart accessibilityData={data}></AccessibilityChart>
            </DataPanel>
            <DataAreaTitle>Datasets Table</DataAreaTitle>
            <DataPanel>
              <AccessibilityDataTable data={data} />
            </DataPanel>
          </>
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
