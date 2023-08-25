import PropTypes from "prop-types";
import { DataAreaTitle, DataPanel } from "./data-area";

const MIN_DITANCE_BETWEEN_LABELS = 90;
const TEXT_VERTICAL_DISTANCE = 20;
const LABEL_HEIGHT = 18;
const CHAR_SIZE = 8.5;
const DISTANCE_BETWEEN_FIRST_AND_LAST_SNP = 920;
const LINE_STARTING_X = 10;
const LINE_ENDING_X = 990;
const LINE_Y = 75;
const TICK_STARTING_Y_EVEN = 60;
const TICK_STARTING_Y_ODD = 90;
const TEXT_STARTING_Y_EVEN = 55;
const TEXT_STARTING_Y_ODD = 105;

/**
 * Display SNPs Matching Searched Coordinates and Nearby SNPs using line chart
 */
export default function SnpsDiagram({ data }) {
  const startSnpCoordinate = data.nearby_snps[0].coordinates.lt;
  const endSnpCoordinate =
    data.nearby_snps[data.nearby_snps.length - 1].coordinates.lt;
  const hitSnpX = getX(
    data.query_coordinates[0].split("-")[1],
    startSnpCoordinate,
    endSnpCoordinate
  );
  const chartElements = [];
  const yOffsets = [];
  let numberSign = 1;
  data.nearby_snps.map((snp, snpIndex) => {
    const isEven = snpIndex % 2 === 0;
    const snpX = getX(snp.coordinates.lt, startSnpCoordinate, endSnpCoordinate);
    const isHitSnp = snpX === hitSnpX;
    const labelX = snpX - MIN_DITANCE_BETWEEN_LABELS / 2;
    const labelWidth = snp.rsid.length * CHAR_SIZE;
    let yOffset = 0;
    const xYOffset = [snpX];
    yOffsets.push(xYOffset);

    if (snpX - yOffsets[snpIndex - 2]?.[0] < MIN_DITANCE_BETWEEN_LABELS) {
      yOffset = yOffsets[snpIndex - 2][1]
        ? yOffsets[snpIndex - 2][1] + TEXT_VERTICAL_DISTANCE * numberSign
        : TEXT_VERTICAL_DISTANCE * numberSign;
    }
    numberSign = numberSign * -1;

    xYOffset.push(yOffset);
    const lineChartElement = {
      line: {
        x1: String(snpX),
        x2: String(snpX),
        y1: isEven
          ? TICK_STARTING_Y_EVEN - yOffsets[snpIndex][1]
          : TICK_STARTING_Y_ODD - yOffsets[snpIndex][1],
        stroke: isHitSnp ? "#c13b42" : "#7F7F7F",
      },
      rect: {
        x: labelX - 2,
        y: isEven
          ? TICK_STARTING_Y_EVEN - LABEL_HEIGHT - yOffsets[snpIndex][1]
          : TICK_STARTING_Y_ODD - yOffsets[snpIndex][1],
        width: labelWidth,
        fill: isHitSnp ? "#c13b42" : "white",
        opacity: isHitSnp ? "1.0" : "0.6",
      },
      text: {
        x: labelX,
        y: isEven
          ? TEXT_STARTING_Y_EVEN - yOffsets[snpIndex][1]
          : TEXT_STARTING_Y_ODD - yOffsets[snpIndex][1],
        className: isHitSnp ? "fill-white" : null,
        rsid: snp.rsid,
      },
    };
    chartElements.push(lineChartElement);
  });
  chartElements.sort((a, b) => {
    if (a.line.y1 < b.line.y1) {
      return -1;
    }
    if (a.line.y1 > b.line.y1) {
      return 1;
    }
    return 0;
  });

  return (
    <>
      <DataAreaTitle>
        SNPs Matching Searched Coordinates and Nearby SNPs
      </DataAreaTitle>
      <DataPanel>
        <div className="flex justify-center mb-3 font-semibold">
          Chromosome {data.nearby_snps[0].chrom.split("chr")[1]}
        </div>
        <svg
          viewBox="0 -30 1050 220"
          preserveAspectRatio="xMidYMid meet"
          aria-labelledby="diagram-of-nearby-snps"
          role="img"
        >
          <title id="diagram-of-nearby-snps">Diagram of nearby SNPs</title>
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="5"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>
          <g id="x-axis">
            <line
              x1={LINE_STARTING_X}
              x2={LINE_ENDING_X}
              y1={LINE_Y}
              y2={LINE_Y}
              markerEnd="url(#arrow)"
              markerStart="url(#arrow)"
              stroke="#7F7F7F"
              strokeWidth="2"
            />
          </g>
          <g className="text-sm">
            {chartElements.map((item) => {
              return (
                <g key={item.text.rsid}>
                  <line
                    id="tick"
                    x1={item.line.x1}
                    x2={item.line.x2}
                    y1={item.line.y1}
                    y2={LINE_Y}
                    stroke={item.line.stroke}
                    strokeWidth="2"
                  />
                  <rect
                    id="lable-background-color"
                    x={item.rect.x}
                    y={item.rect.y}
                    height={LABEL_HEIGHT}
                    width={item.rect.width}
                    fill={item.rect.fill}
                    opacity={item.rect.opacity}
                    rx="2px"
                  />
                  <text
                    id="lable-text"
                    x={item.text.x}
                    y={item.text.y}
                    className={item.text.className}
                  >
                    {item.text.rsid}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </DataPanel>
    </>
  );
}

SnpsDiagram.propTypes = {
  data: PropTypes.object.isRequired,
};

function getX(snpCoordinate, startSnpCoordinate, endSnpCoordinate) {
  return (
    DISTANCE_BETWEEN_FIRST_AND_LAST_SNP *
      ((snpCoordinate - startSnpCoordinate) /
        (endSnpCoordinate - startSnpCoordinate)) +
    MIN_DITANCE_BETWEEN_LABELS / 2
  );
}
