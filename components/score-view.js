import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  DataArea,
  DataAreaTitle,
  DataItemLabel,
  DataItemValue,
  DataPanel,
} from "./data-area";
import { ScoreDataArea, ScoreDataItem } from "./score-view-data-area";
import { Button } from "./form-elements";
import SnpsDiagram from "./snps-diagram";
import VariantLDTable from "./variant-ld-table";

// Default number of populations to display for allele frequencies.
const DEFAULT_DISPLAY_COUNT = 3;

export default function ScoreView({ coordinates, data, hitSnps, variantLD }) {
  const [showMoreFreqs, setShowMoreFreqs] = useState(false);

  return (
    <>
      <DataAreaTitle>Score</DataAreaTitle>
      <DataPanel>
        <ScoreDataArea>
          <ScoreDataItem
            label="Searched Coordinates"
            value={coordinates}
          ></ScoreDataItem>
          <ScoreDataItem
            label="Genome Assembly"
            value={data.assembly}
          ></ScoreDataItem>
          <ScoreDataItem
            label="Rank"
            value={data.regulome_score.ranking}
          ></ScoreDataItem>
          <ScoreDataItem
            label="Score"
            value={data.regulome_score.probability}
          ></ScoreDataItem>
        </ScoreDataArea>
      </DataPanel>
      {Object.keys(hitSnps).length > 0 && (
        <>
          <DataAreaTitle>SNPs Matching Searched Coordinates</DataAreaTitle>
          <DataPanel>
            <DataArea>
              {Object.keys(hitSnps).map((rsid) => (
                <React.Fragment key={rsid}>
                  <DataItemLabel>{rsid}</DataItemLabel>
                  <DataItemValue>
                    <div>
                      {hitSnps[rsid].slice(0, 3).map((populationInfo) => (
                        <div
                          key={populationInfo.population}
                        >{`${populationInfo.info} (${populationInfo.population})`}</div>
                      ))}
                    </div>
                    {hitSnps[rsid].length > 3 && showMoreFreqs ? (
                      <div>
                        {hitSnps[rsid]
                          .slice(3, hitSnps[rsid].length)
                          .map((populationInfo) => (
                            <div
                              key={populationInfo.population}
                            >{`${populationInfo.info} (${populationInfo.population})`}</div>
                          ))}
                      </div>
                    ) : null}
                    {hitSnps[rsid].length > DEFAULT_DISPLAY_COUNT ? (
                      <Button
                        type="secondary"
                        onClick={() => setShowMoreFreqs(!showMoreFreqs)}
                      >
                        {hitSnps[rsid].length - 3}{" "}
                        {showMoreFreqs ? "fewer" : "more"}
                      </Button>
                    ) : null}
                  </DataItemValue>
                </React.Fragment>
              ))}
            </DataArea>
          </DataPanel>
        </>
      )}

      {data.nearby_snps?.length > 0 ? <SnpsDiagram data={data} /> : null}
      <div id="container"></div>

      {variantLD.length > 0 && (
        <>
          <DataAreaTitle>Variant LD Table</DataAreaTitle>
          <DataPanel>
            <VariantLDTable data={variantLD} />
          </DataPanel>
        </>
      )}
    </>
  );
}

ScoreView.propTypes = {
  data: PropTypes.object.isRequired,
  coordinates: PropTypes.string.isRequired,
  assembly: PropTypes.string.isRequired,
  hitSnps: PropTypes.object.isRequired,
  variantLD: PropTypes.array.isRequired,
};
