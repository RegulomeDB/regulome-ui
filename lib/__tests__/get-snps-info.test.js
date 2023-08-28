import getSnpsInfo from "../get-snps-info";

describe("Test getSnpsInfo function", () => {
  it("should return snps with allele frequency info", () => {
    const data = {
      query_coordinates: ["chr7:11571772-11571773"],
      nearby_snps: [
        {
          alt_allele_freq: {
            T: {
              "1000Genomes": 0.0001997,
            },
          },
          chrom: "chr7",
          coordinates: {
            gte: 11571771,
            lt: 11571772,
          },
          maf: 0.0001997,
          ref_allele_freq: {
            C: {
              "1000Genomes": 0.9998,
            },
          },
          rsid: "rs538700452",
          variation_type: "SNV",
        },
        {
          alt_allele_freq: {},
          chrom: "chr7",
          coordinates: {
            gte: 11571772,
            lt: 11571773,
          },
          maf: 0.18,
          ref_allele_freq: {
            G: {
              "1000Genomes": 0.8636,
              ALSPAC: 0.8207,
              Estonian: 0.8368,
              GnomAD: 0.8544,
            },
          },
          rsid: "rs78",
          variation_type: "SNV",
        },
      ],
    };

    const expectedResult = {
      rs78: [
        { population: "GnomAD", info: "G=0.8544" },
        { population: "1000Genomes", info: "G=0.8636" },
        { population: "ALSPAC", info: "G=0.8207" },
        { population: "Estonian", info: "G=0.8368" },
      ],
    };
    expect(getSnpsInfo(data)).toEqual(expectedResult);
  });
  it("should return snps with no allele frequency info", () => {
    const data = {
      query_coordinates: ["chr7:11571772-11571773"],
      nearby_snps: [
        {
          alt_allele_freq: {
            C: {},
          },
          chrom: "chr7",
          coordinates: {
            gte: 11571772,
            lt: 11571773,
          },
          ref_allele_freq: {
            G: {},
          },
          rsid: "rs78",
          variation_type: "SNV",
        },
      ],
    };

    const expectedResult = {
      rs78: [{ population: "source unknown", info: "G=N/A, C=N/A" }],
    };
    expect(getSnpsInfo(data)).toEqual(expectedResult);
  });

  it("should return snps with ref_allele_freq is null for a population", () => {
    const data = {
      query_coordinates: ["chr7:11571772-11571773"],
      nearby_snps: [
        {
          alt_allele_freq: {},
          chrom: "chr7",
          coordinates: {
            gte: 11571772,
            lt: 11571773,
          },
          maf: 0.18,
          ref_allele_freq: {
            G: {
              "1000Genomes": null,
              ALSPAC: 0.8207,
              Estonian: 0.8368,
              GnomAD: 0.8544,
            },
          },
          rsid: "rs78",
          variation_type: "SNV",
        },
      ],
    };

    const expectedResult = {
      rs78: [
        { population: "GnomAD", info: "G=0.8544" },
        { population: "1000Genomes", info: "G=N/A" },
        { population: "ALSPAC", info: "G=0.8207" },
        { population: "Estonian", info: "G=0.8368" },
      ],
    };
    console.log(getSnpsInfo(data));

    expect(getSnpsInfo(data)).toEqual(expectedResult);
  });

  it("should return snps with alt_allele_freq is null for a population", () => {
    const data = {
      query_coordinates: ["chr7:11571772-11571773"],
      nearby_snps: [
        {
          alt_allele_freq: {
            G: {
              TOPMED: 0.000007964,
              ALSPAC: null,
            },
          },
          chrom: "chr7",
          coordinates: {
            gte: 11571772,
            lt: 11571773,
          },
          maf: 0.18,
          ref_allele_freq: {
            T: {
              TOPMED: 1,
              ALSPAC: 0.99,
            },
          },
          rsid: "rs78",
          variation_type: "SNV",
        },
      ],
    };

    const expectedResult = {
      rs78: [
        { population: "TOPMED", info: "T=1, G=0.000007964" },
        { population: "ALSPAC", info: "T=0.99, G=N/A" },
      ],
    };
    expect(getSnpsInfo(data)).toEqual(expectedResult);
  });
});
