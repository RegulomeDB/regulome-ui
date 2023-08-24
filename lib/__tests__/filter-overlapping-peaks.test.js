import filterOverlappingPeaks from "../filter-overlapping-peaks";

describe("Test filterOverlappingPeaks function", () => {
  it("return results when datasets is empty", () => {
    const datasets = [];

    expect(filterOverlappingPeaks(datasets)).toEqual([[], 0]);
  });
  it("return results when hits are in the same dataset and overlapping and have different values", () => {
    const datasets = [
      {
        start: 24411799,
        chrom: "chr7",
        end: 24412402,
        value: "42.10580",
        dataset_rel: "/experiments/ENCSR440UPD/",
      },
      {
        start: 24411799,
        chrom: "chr7",
        end: 24412402,
        value: "42.10520",
        dataset_rel: "/experiments/ENCSR440UPD/",
      },
    ];
    const expectedDataset = [
      {
        chrom: "chr7",
        dataset_rel: "/experiments/ENCSR440UPD/",
        end: 24412402,
        start: 24411799,
        value: "42.10580",
      },
    ];
    expect(filterOverlappingPeaks(datasets)).toEqual([expectedDataset, 1]);
  });
  it("return results when datasets are different", () => {
    const datasets = [
      {
        start: 24411799,
        chrom: "chr7",
        end: 24412400,
        value: "42.10520",
        dataset_rel: "/experiments/ENCSR440UPD/",
      },
      {
        start: 24411799,
        chrom: "chr7",
        end: 24412400,
        value: "42.10520",
        dataset_rel: "/experiments/ENCSR440UPP/",
      },
    ];

    expect(filterOverlappingPeaks(datasets)).toEqual([datasets, 0]);
  });
});
