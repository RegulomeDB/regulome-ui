import _ from "lodash";
import filterOverlappingPeaks from "./filter-overlapping-peaks";

/**
 * Return a list of motifs. Each motifs contain info about pwm id, href, targets, files, datasets, peak start and end,
 * strand, biosamples, description and data matrix that will use for draw DNA logo.
 * @param {object} request to fetch data for data matrix
 * @param {Array} data contain motifs info
 * @returns Return a list of motifs.
 */
export default async function fetchMotifDoc(request, data) {
  const motifsData = filterOverlappingPeaks(
    data.filter((d) => d.method === "footprints" || d.method === "PWMs")
  );
  // Filter results to find ones with PWM data
  const pwmLinkListFull = motifsData.filter(
    (d) =>
      d.documents &&
      d.documents[0] &&
      d.documents[0].document_type === "position weight matrix"
  );
  // Find all pwms that have both matching document and matching target(s)
  // Group pwms based on these two properties
  // Result is object with keys that are "[document link]#[target list linked by '-'s]"
  const groupedMotifsData = _.groupBy(
    pwmLinkListFull,
    (dataset) =>
      `${dataset.documents[0]["@id"]}#${dataset.targets.sort().join("-")}`
  );
  // Flatten group to create an array of pwms
  // Properties that are identical across the group (for instance: pwm document, strand, and targets) are collapsed
  // Properties that are not the same across the group (for instance: biosamples, accessions, datasets) are merged into an array
  // Also fetch pwm data for each motif from Encode
  const motifsList = await Promise.all(
    _.map(groupedMotifsData, async (group) => {
      const pwm = group[0].documents[0]["@id"];
      const href = group[0].documents[0].attachment.href;
      const fileLink = `${pwm}${href}`;

      const data = await request.getTextByUrl(fileLink);
      const fileType = pwm.includes(".pwm") ? "pwm" : "jaspar";
      const dataMatrix =
        fileType === "pwm"
          ? convertPwmTextToObj(data)
          : convertJasparTextToObj(data);

      return {
        pwm,
        href,
        targets: group[0].targets.join(", "),
        accessions: _.map(group, "file"),
        datasets: _.map(group, "dataset"),
        start: group[0].start,
        end: group[0].end,
        strand: group[0].strand,
        biosamples: _.map(group, "biosample_ontology")
          .map((d) => d.term_name)
          .map((termName) => termName || ""),
        description: group[0].description ? group[0].description : null,
        data,
        dataMatrix,
      };
    })
  );

  return _.sortBy(motifsList, ["targets"]);
}

/**
 * Convert PWM file text into a matrix array of nucleotide frequency information.
 * In the matrix, each row is an array of 4 elements long (one element is the frenquency value for each nucleotide) and there are n rows
 * The PWM file text looks like this:
 * >MA0630.1	SHOX
 * A  [   179     74    852    991     15     98    416    301 ]
 * C  [   301     30     48      2     15     50     48    187 ]
 * G  [   162      9     55      5     27     84    424    379 ]
 * T  [   357    886     45      2    943    768    111    133 ]
 *
 * @param {string} text PWM file text
 * @returns an array of matrix
 */
function convertPwmTextToObj(text) {
  // Split the file by row and create a new object
  // The new object has an element corresponding to each row and each element is an array of the entries in that row, split by tab (the PWM file is tab-delineated)
  const cells = text.split("\n").map((el) => el.split(/\s+/));
  const matrix = [];
  // Create a matrix without the index or rows that contain comments or unnecessary information and convert the frequency values from strings to numbers
  cells.forEach((cell) => {
    if (cell.length === 6) {
      matrix.push([+cell[1], +cell[2], +cell[3], +cell[4]]);
    }
  });
  const newMatrix = convert(matrix);
  return newMatrix;
}
/**
 * Convert jaspar file text into a matrix array of nucleotide frequency information
 * The format of .jaspar files is approximately an inverted structure as .pwm files
 * @param {string} text the jaspar file text
 * @returns an array of matrix
 */
function convertJasparTextToObj(text) {
  const cells = text.split("\n").map((el) => el.split(/\s+/));
  let matrix = [];
  const nucleotides = ["A", "C", "G", "T"];
  for (let idx = 0; idx < cells.length; idx += 1) {
    const cell = cells[idx];
    // Finding first row of nuceotide information
    if (nucleotides.includes(cell[0][0])) {
      matrix = new Array(cell.length - 3);
      for (let i = 0; i < matrix.length; i += 1) {
        matrix[i] = new Array(4).fill(0);
      }
      break;
    }
  }
  // Populating the arrays with the retrieved data
  cells.forEach((cell) => {
    if (nucleotides.includes(cell[0][0])) {
      let rIdx = 0;
      const nIdx = nucleotides.indexOf(cell[0][0]);
      cell.forEach((c, cIdx) => {
        if (c !== "]" && c !== "[" && cIdx > 0) {
          matrix[rIdx][nIdx] = +c;
          rIdx += 1;
        }
      });
    }
  });
  const newMatrix = convert(matrix);
  return newMatrix;
}
/**
 * This function convert the values in pwm matrix so the values in each row sum to 1.
 * @param {*} matrix matrix to convert
 * @returns a cnverted matrix
 */
function convert(matrix) {
  const newMatrix = matrix.map((cell) => {
    const sum = cell.reduce((a, b) => +a + +b, 0);
    const newCell = cell.map((element) => (element = +element / sum));
    return newCell;
  });
  return newMatrix;
}
