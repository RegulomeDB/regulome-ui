import Image from "next/image";
import Breadcrumbs from "../components/breadcrumbs";
import { DataPanel } from "../components/data-area";
import FAQ from "../components/faq";
import Navigation from "../components/navigation";
import PagePreamble from "../components/page-preamble";
import RegulomeVersionTag from "../components/regulome-version-tag";

export default function Help() {
  return (
    <>
      <RegulomeVersionTag />
      <Navigation />
      <Breadcrumbs />
      <PagePreamble />
      <DataPanel>
        <p className="pb-4">
          RegulomeDB is a database that provides functional context to variants
          or regions of interest and serves as a tool to prioritize functionally
          important single nucleotide variants (SNVs) located within the
          non-coding regions of the human genome. RegulomeDB queries any given
          variant by intersecting its position with the genomic intervals that
          were identified to be functionally active regions from the
          computational analysis outputs of functional genomic assays such as TF
          ChIP-seq and DNase-seq (from the ENCODE database) as well as those
          overlapping the footprints and QTL data.
        </p>
        <p className="pb-4">
          All the source data used in RegulomeDB v2.1 can be found on the ENCODE
          website using these two links under the Data button at the top of the
          page:{" "}
          <a
            className="font-semibold text-brand"
            href="https://www.encodeproject.org/search/?type=Experiment&internal_tags=RegulomeDB_2_2"
          >
            Experiments
          </a>{" "}
          and{" "}
          <a
            className="font-semibold text-brand"
            href="https://www.encodeproject.org/search/?type=Annotation&internal_tags=RegulomeDB_2_2"
          >
            Annotations
          </a>
          . RegulomeDB also provides further information about those hits by
          incorporating them into prediction scores, thereby, providing a way to
          interpret the probability of these variants to be of real functional
          significance.
        </p>
        <h4 className="text-lg font-bold pb-4">
          Querying variants with RegulomeDB
        </h4>
        <p className="pb-4">
          Users can submit queries to the RegulomeDB database in the following
          formats (Note: one can toggle between the hg19 and GRCh38 coordinates
          using the toggle button above the search box):
        </p>
        <ol className="list-decimal ml-4">
          <li>
            Rsids assigned by dbSNP (eg.{" "}
            <a
              className="font-semibold text-brand"
              href="https://www.ncbi.nlm.nih.gov/snp/rs190509934"
            >
              rs190509934
            </a>
            ).
          </li>
          <li>
            Single nucleotide positions: expressed in BED format, i.e.{" "}
            <b>chrom:chromStart-chromEnd</b>.
          </li>
          <li>
            Chromosomal regions: expressed in BED format, i.e.{" "}
            <b>chrom:chromStart-chromEnd</b>. In this case all the common dbSNPs
            with a minor allele frequency {">"}1% in this region will be queried
            and returned.
          </li>
        </ol>
        <div className="flex justify-center items-center py-4">
          <Image
            className="pb-4 "
            src="/help_page_screenshots/query_box.jpg"
            alt="image of a query box"
            width={800}
            height={500}
          />
        </div>
        <p className="pb-4">
          After supplying a list of search queries in the search box, and upon
          clicking the search button below, users are redirected to a summary
          table representing prediction scores for all the given query variants
          (see the explanation of scores in{" "}
          <a className="font-semibold text-brand" href="#FAQ">
            FAQ
          </a>
          ).
        </p>
        <div className="flex justify-center items-center pb-4">
          <Image
            src="/help_page_screenshots/scoring_table.jpg"
            alt="image of a scoring table"
            width={800}
            height={500}
          />
        </div>
        <p className="pb-4">
          Users can download the search result output table using the two
          download buttons on the top of the page: either in BED file format or
          a tab separated file format. One may also continue to explore each of
          the results individually by clicking on one of the outputs in the
          table. Upon clicking on any variant of interest, the users are
          redirected to the results page that is further subdivided into six
          sections as seen in the next screenshots. The data sources for each of
          the sections are explained in{" "}
          <a className="font-semibold text-brand" href="#FAQ">
            FAQ
          </a>
          .
        </p>
        <div className="flex justify-center items-center pb-4">
          <Image
            src="/help_page_screenshots/info_thumbnails.jpg"
            alt="image of an info thumbnails"
            width={800}
            height={500}
          />
        </div>
        <p className="pb-4">
          The top-most section of any variants page provides a summary of the
          results on the top, and includes key information such as the rsid of
          the variant, the number of peaks found intersecting that variant, its
          prediction rank and score values as well as the allelic frequency of
          that rsid in different populations as reported in different data
          sources such as GnomAD, 1000Geomes, TOPMED, and others.
        </p>
        <p className="pb-4">
          Each of the sub-sections can be further expanded by clicking on one of
          the six sections at a time individually.
        </p>

        <ul className="list-disc ml-4">
          <li>
            <b>TF binding sites (ChIP-seq):</b> This page provides further
            information about the TF (transcription factor) ChIP peaks that
            intersected the variant of interest.
          </li>
          <ul className="list-disc ml-8">
            <li>
              The first section on this page provides the users with a bar plot
              representation showing the number of peaks that intersected with
              the variant of interest along with their targets. The peak numbers
              on each of the bars within the chart represents the number of
              biosamples where the same TF target was found to be having a peak
              signal that contained the intersected variant position.
            </li>
            <li>
              Below the bar chart, a user can explore the underlying data on a
              tabular view that provides further metadata details of all the
              assays that produced the peak files: such as the intersecting peak
              location (chromosome start and end), the biosample information
              (along with the organ) that was used in each of the TF-ChIP assay,
              the ENCODE file ids (ENCFF ids) that was a source for the the peak
              information and its’ corresponding dataset ids (ENCSR ids). The
              ENCODE file accessions and the dataset accessions on this table
              are hyperlinked to the corresponding file objects and dataset
              objects on the ENCODE website for further metadata exploration.
            </li>
          </ul>
          <div className="flex justify-center items-center py-4">
            <Image
              src="/help_page_screenshots/section_1_ChIP.jpg"
              alt="image of ChIP data view"
              width={800}
              height={500}
            />
          </div>
          <li>
            <b>Chromatin accessibility:</b> This section provides the users with
            a bar plot graphical representation showing the number of times the
            variant was found to be within peaks called from chromatin
            accessibility assays using each biosample.
          </li>
          <ul className="list-disc ml-8">
            <li>
              Each of the bars on the bar plot can be further expanded to view
              the underlying data table by clicking the title to the left of
              each bar.
            </li>
            <li>
              Just like the ChIP data page, users can click on the hyperlinked
              ENCFF (file ids) or ENCSR (dataset ids) and that leads them to the
              corresponding ENCODE pages showing further metadata of the file or
              dataset information.
            </li>
            <li>
              Note: in cases where we have more than one biosample DNase peak,
              they are not necessarily redundant. The DNase-seq samples can be
              derived from different donors and different treatment conditions.
              One could explore the exact underlying metadata by looking on the
              dataset linkouts to the ENCODE portal.
            </li>
          </ul>
          <div className="flex justify-center items-center py-4">
            <Image
              src="/help_page_screenshots/section_2_accessibility.jpg"
              alt="image of accessibility data view"
              width={800}
              height={500}
            />
          </div>
          <li>
            <b>TF motifs & footprints:</b> This page provides information
            regarding the position weighted matrices (PWMs) representing TF
            motifs and matching with the sequence overlapping the variant of
            interest, as well as footprints information that intersected with
            the variant of interest.
          </li>
          <ul className="list-disc ml-8">
            <li>
              We provide a list of biosamples that were the source files for
              DNase-seq peak files used in the{" "}
              <a
                className="font-semibold text-brand"
                href="https://genome.cshlp.org/content/30/7/1040"
              >
                TRACE
              </a>{" "}
              pipeline for predicting the footprints. (See how TF motifs and
              footprints are computed in{" "}
              <a className="font-semibold text-brand" href="#FAQ">
                FAQ
              </a>
              .)
            </li>
            <li>
              The biosamples list is hyperlinked to the corresponding ENCODE
              annotation filesets that contain the TRACE output files in the bed
              format. The ENCODE page also provides information about the exact
              chromatin accessibility file used for the TRACE pipeline.
            </li>
            <li>
              Similarly the PWM file (when available) is also listed as a
              hyperlinked ENCFF id above the biosamples list box and can be
              further explored on the ENCODE website.
            </li>
            <li>
              The exact genome reference region that overlaps with all the
              output motifs is represented on the top section along with a
              “boxed” letter that represents the variant of interest.
            </li>
            <li>
              Each query could match a footprint (sometimes with no significant
              PWM score), or match the PWM itself outside of a footprint.
            </li>
          </ul>
          <div className="flex justify-center items-center py-4">
            <Image
              src="/help_page_screenshots/section_3_motifs.jpg"
              alt="image of motifs data view"
              width={800}
              height={500}
            />
          </div>
          <li>
            <b>eQTLs & caQTLs (chromatin accessibility QTLs):</b> The tables in
            this section show the information of eQTL and caQTL studies where
            the query variant is identified to be associated with gene
            expression levels and chromatin accessibility.{" "}
          </li>
          <ul className="list-disc ml-8">
            <li>
              The caQTL data comes from curated publications, viewable at{" "}
              <a
                className="font-semibold text-brand"
                href="https://www.encodeproject.org/report/?type=Publication&notes=*&field=%40id&field=title&field=identifiers&field=notes"
              >
                ENCODE portal
              </a>
              .
            </li>
            <li>
              The eQTL data comes from the{" "}
              <a
                className="font-semibold text-brand"
                href="https://pubmed.ncbi.nlm.nih.gov/32913098/"
              >
                GTEx
              </a>{" "}
              project (
              <a
                className="font-semibold text-brand"
                href="https://www.gtexportal.org/home/datasets"
              >
                source of GTEx_Analysis_v8_eQTL.tar file
              </a>
              ) and has also been uploaded on the{" "}
              <a
                className="font-semibold text-brand"
                href="https://www.encodeproject.org/search/?type=Annotation&internal_tags=RegulomeDB_2_1&annotation_type=eQTLs"
              >
                ENCODE portal
              </a>
              .
            </li>
            <li>
              The corresponding ENCODE file ids and their corresponding dataset
              ids are also listed on the table and hyperlinked for further
              exploration.
            </li>
            <li>
              The biosample information and population ethnicity information
              (when available) are also listed on the caQTL table and correspond
              to the original biosample information used for that study in the
              publication.
            </li>
            <li>
              Example:{" "}
              <a
                className="font-semibold text-brand"
                href="https://beta.regulomedb.org/regulome-search/?regions=chr10:11699181-11699182&genome=GRCh38/thumbnail=qtl"
              >
                rs75982468
              </a>{" "}
              has both biosample and population information that comes from the
              publication listed here:{" "}
              <a
                className="font-semibold text-brand"
                href="https://www.encodeproject.org/publications/7be44d09-ae33-43af-9af2-dad1df6b0d1e/"
              >
                PMID:30650056
              </a>
              .
            </li>
          </ul>
          <div className="flex justify-center items-center py-4">
            <Image
              src="/help_page_screenshots/section_4_QTLs.jpg"
              alt="image of QTLs data view"
              width={800}
              height={500}
            />
          </div>

          <li>
            <b>Chromatin states:</b>
          </li>
          <ul className="list-disc ml-8">
            <li>
              This section shows predicted chromatin states from{" "}
              <a
                className="font-semibold text-brand"
                href="https://www.encodeproject.org/search/?type=Annotation&annotation_type=chromatin+state&status=released"
              >
                chromHMM
              </a>
              .
            </li>
            <li>
              The variant positions are intersected with those chromatin states
              and displayed on an interactive human body map as well as in a
              tabular representation.
            </li>
            <li>
              The body map is colored by the most active state among all
              biosamples in each organ. Thus, it shows the users a pictorial
              representation of candidate organs where the query variant is
              likely to be functional and within different categories of
              regulatory elements.
            </li>
            <li>
              For example, if the variant is within an active enhancer region
              for that biosample, it might lead to changes in the gene
              expression that is regulated by that enhancer.
            </li>
            <li>
              Users can use the body map diagram to filter down the search
              results to display only a few organs of interest. Users can also
              filter the search results using the list of biosamples or the
              various chromatin states that are listed on the panels next to the
              body map.
            </li>
            <li>
              The tabular view below provides further details on the biosample,
              classification, organ as well as the source ENCODE datasets and
              files (hyperlinked to ENCODE for further metadata exploration).
            </li>
          </ul>
          <div className="flex justify-center items-center py-4">
            <Image
              src="/help_page_screenshots/section_5_chromatin_states.jpg"
              alt="image of chromatin states data view"
              width={800}
              height={500}
            />
          </div>

          <li>
            <b>Genome browser:</b> Users can explore the nearby genes of the
            variant (shown as a yellow highlight on the browser tracks). The
            browser shows the tracks from TF ChIP-seq and DNase-seq assays with
            overlapping peaks of the variant.
          </li>
          <ul className="list-disc ml-8">
            <li>
              Users can use the “Refine your search” interface located above the
              browser tracks to further narrow down the list of tracks as
              needed.
            </li>
            <li>
              This interface allows users to select from a variety of faceting
              options. For example, users can filter down the browser tracks
              displayed in the browser using the file types (bigWig or bigBed),
              dataset types (ChIP-seq or DNAse-seq), organ or cell type,
              biosamples as well as the targets used in respective ChIP-seq
              assays.
            </li>
            <li>
              Users can also expand the track information section using the
              expand button on the lower right corner of each track. This
              expanded view allows the users to see the underlying ENCODE file
              and ENCODE dataset (both of which are hyperlinked to the
              respective ENCODE pages).
            </li>
          </ul>
          <div className="flex justify-center items-center py-4">
            <Image
              src="/help_page_screenshots/section_6_browser.jpg"
              alt="image of genome browser view"
              width={800}
              height={500}
            />
          </div>
        </ul>

        <h4 className="text-lg font-bold pb-4">
          <a className="font-semibold text-brand" id="FAQ">
            FAQ
          </a>
        </h4>

        <FAQ question="Which reference genome is used?">
          <p className="pb-4">
            You can switch between assemblies GRCh38 and hg19 through the toggle
            bar above the search box. However, the GRCh38 query contains the
            most recent datasets and we recommend using the GRCh38 version over
            the hg19 version.
          </p>
        </FAQ>
        <FAQ question="What does the RegulomeDB ranking score represent?">
          <p className="pb-4">
            The scoring scheme refers to the following supporting evidence for
            that particular location or variant id. In general, if more
            supporting data is available, the higher is its likelihood of being
            functional and hence receives a higher score (with 1 being higher
            and 7 being lower score).
          </p>
          <table>
            <tbody>
              <tr>
                <th>Score</th>
                <th>Supporting data</th>
              </tr>
              <tr>
                <td>1a</td>
                <td>
                  eQTL/caQTL + TF binding + matched TF motif + matched Footprint
                  + chromatin accessibility peak
                </td>
              </tr>
              <tr>
                <td>1b</td>
                <td>
                  eQTL/caQTL + TF binding + any motif + Footprint + chromatin
                  accessibility peak
                </td>
              </tr>
              <tr>
                <td>1c</td>
                <td>
                  eQTL/caQTL + TF binding + matched TF motif + chromatin
                  accessibility peak
                </td>
              </tr>
              <tr>
                <td>1d</td>
                <td>
                  eQTL/caQTL + TF binding + any motif + chromatin accessibility
                  peak
                </td>
              </tr>
              <tr>
                <td>1e</td>
                <td>eQTL/caQTL + TF binding + matched TF motif</td>
              </tr>
              <tr>
                <td>1f</td>
                <td>eQTL/caQTL + TF binding / chromatin accessibility peak</td>
              </tr>
              <tr>
                <td>2a</td>
                <td>
                  TF binding + matched TF motif + matched Footprint + chromatin
                  accessibility peak
                </td>
              </tr>
              <tr>
                <td>2b</td>
                <td>
                  TF binding + any motif + Footprint + chromatin accessibility
                  peak
                </td>
              </tr>
              <tr>
                <td>2c</td>
                <td>
                  TF binding + matched TF motif + chromatin accessibility peak
                </td>
              </tr>
              <tr>
                <td>3a</td>
                <td>TF binding + any motif + chromatin accessibility peak</td>
              </tr>
              <tr>
                <td>3b</td>
                <td>TF binding + matched TF motif</td>
              </tr>
              <tr>
                <td>4</td>
                <td>TF binding + chromatin accessibility peak</td>
              </tr>
              <tr>
                <td>5</td>
                <td>TF binding or chromatin accessibility peak</td>
              </tr>
              <tr>
                <td>6</td>
                <td>Motif hit</td>
              </tr>
              <tr>
                <td>7</td>
                <td>Other</td>
              </tr>
            </tbody>
          </table>
        </FAQ>
        <FAQ question="How to interpret the RegulomeDB probability score?">
          <p className="pb-4">
            The RegulomeDB probability score is ranging from 0 to 1, with 1
            being most likely to be a regulatory variant. The probabilistic
            score is calculated from a random forest model,{" "}
            <a
              className="font-semibold text-brand"
              href="https://pubmed.ncbi.nlm.nih.gov/34648033/"
            >
              TURF
            </a>
            , trained with allele-specific TF binding SNVs. We used a simplified
            version here only including binary features from functional genomic
            evidence as used in the heuristic ranking, as well as numeric
            features from information content in matched PWMs. We will include
            the whole feature set in a future release.
          </p>
          <p className="pb-4">
            {" "}
            There is an overall positive correlation between the ranking scores
            and the probability scores, but there are some exceptions because 1)
            we added additional features when predicting probability scores. 2)
            features used in probability scoring were weighted differently from
            ranking scoring.{" "}
          </p>
        </FAQ>
        <FAQ question="What data sources does RegulomeDB use for each genomic annotation">
          <div className="regulomehelp-answer" id="regulomehelp-faq4-answer">
            <p className="pb-4">
              RegulomeDB currently query variants with genomic annotations from
              the following data types:
            </p>
            <p className="pb-4">
              <em>TF binding sites</em>
              <br /> Peaks from TF (transcription factor) ChIP-seq assays called
              by uniform pipeline from the latest release of the ENCODE project.
            </p>
            <p className="pb-4">
              <em>Chromatin states</em>
              <br /> Chromatin states in 833 biosamples were called from
              chromHMM in{" "}
              <a
                className="font-semibold text-brand"
                href="https://www.nature.com/articles/s41586-020-03145-z"
              >
                EpiMap
              </a>{" "}
              and were directly retrieved from the ENCODE portal.{" "}
            </p>
            <p className="pb-4">
              <em>Chromatin accessibility peaks</em>
              <br /> Peaks from DNase-seq assays called by uniform pipeline from
              the latest release of the ENCODE project.
            </p>
            <p className="pb-4">
              <em>TF motifs</em>
              <br /> PWM matching positions from 746 motifs in{" "}
              <a
                className="font-semibold text-brand"
                href="https://jaspar2020.genereg.net/downloads/"
              >
                JASPAR 2020 CORE collection
              </a>{" "}
              for vertebrates.
            </p>
            <p className="pb-4">
              <em>Footprints</em>
              <br /> Footprints were predicted with signals from 642 DNase-seq
              experiments and 591 TF motifs by the{" "}
              <a
                className="font-semibold text-brand"
                href="https://genome.cshlp.org/content/30/7/1040"
              >
                TRACE
              </a>{" "}
              pipeline.
            </p>
            <p className="pb-4">
              <em>eQTLs</em>
              <br /> The eQTLs from the{" "}
              <a
                className="font-semibold text-brand"
                href="https://gtexportal.org/home/datasets"
              >
                GTEx
              </a>{" "}
              project across 49 human tissues.
            </p>
            <p className="pb-4">
              <em>caQTLs</em>
              <br /> The chromatin accessibility QTLs (caQTLs) from{" "}
              <a
                className="font-semibold text-brand"
                href="https://www.encodeproject.org/report/?type=Publication&notes=*&field=%40id&field=title&field=identifiers&field=notes"
              >
                9 publications
              </a>
              .
            </p>
          </div>
        </FAQ>
        <FAQ question="How are TF motifs and footprints computed?">
          <p className="pb-4">
            For TF motifs, we downloaded the PWMs (position weight matrices) of
            746 non-redundant TF motifs from the{" "}
            <a
              className="font-semibold text-brand"
              href="https://jaspar2020.genereg.net/downloads/"
            >
              JASPAR 2020 CORE collection
            </a>
            . The kmers matching to TF motifs were called by{" "}
            <a
              className="font-semibold text-brand"
              href="https://github.com/j-andrews7/pytfmpval"
            >
              TFM P-value
            </a>{" "}
            with a threshold at 4<sup>-8</sup> for each PWM. Bowtie was used to
            map the kmers on the genome to determine the final PWM matching
            positions for the TF motifs.
          </p>
          <p className="pb-4">
            Footprints were predicted with the signals from DNase-seq
            experiments and the PWMs of TF motifs by the{" "}
            <a
              className="font-semibold text-brand"
              href="https://genome.cshlp.org/content/30/7/1040"
            >
              TRACE pipeline
            </a>
            . TRACE is a computational method that incorporates signals from
            chromatin accessibility assays and PWMs within a multivariate hidden
            Markov model to detect footprint regions with matching motifs.
          </p>
          <p className="pb-4">
            Note that TF motifs and Footprints are two separate genomic
            annotations. TF motifs are called totally from the DNA sequence,
            while footprints also consider signals from chromatin accessibility
            experiments and weigh less on the sequence side.
          </p>
        </FAQ>
        <FAQ question="Can I download precalculated scores from RegulomeDB?">
          <p className="pb-4">
            We currently have RegulomeDB rank scores available for common SNVs
            (Single Nucleotide Variants) in NCBI dbSNP Build 153. You can
            download the file here:{" "}
            <a
              className="font-semibold text-brand"
              href="https://regulome-master.demo.encodedcc.org/files/TSTFF344324/@@download/TSTFF344324.tsv"
            >
              regulomedb_dbsnp153_common_snv.tsv
            </a>
            .
          </p>
        </FAQ>
        <FAQ question="What version of dbSNP is RegulomeDB querying?">
          <p className="regulomehelp-answer" id="regulomehelp-faq7-answer">
            RegulomeDB is currently querying build 153 of dbSNP. See NCBI for
            additional information about{" "}
            <a
              className="font-semibold text-brand"
              href="https://www.ncbi.nlm.nih.gov/projects/SNP/snp_summary.cgi"
            >
              dbSNP 153
            </a>
            .{" "}
          </p>
        </FAQ>
        <FAQ question="Why is there no data for my chromosomal region?">
          <p className="pb-4">
            Entering a chromosomal region will identify all common SNPs (with an
            allele frequency &gt; 1%) in that region. These SNPs are used to
            query RegulomeDB. If there are no common SNPs in the uploaded
            genomic regions, there will be no data that can be returned.
          </p>
        </FAQ>

        <p className="pb-4">
          <strong>To cite RegulomeDB:</strong>
          <br />
          Dong, S., Zhao, N., Spragins, E., Kagda, M. S., Li, M., Assis, P. R.,
          Jolanki, O., Luo, Y., Michael Cherry, J., Boyle, A. P., & Hitz, B. C.
          (2022). Annotating and prioritizing human non-coding variants with
          RegulomeDB.{" "}
          <a
            className="font-semibold text-brand"
            href="https://doi.org/10.1101/2022.10.18.512627"
          >
            In bioRxiv
          </a>
          .
          <br /> Boyle AP, Hong EL, Hariharan M, Cheng Y, Schaub MA, Kasowski M,
          Karczewski KJ, Park J, Hitz BC, Weng S, Cherry JM, Snyder M.
          Annotation of functional variation in personal genomes
          usingRegulomeDB. Genome Research 2012, 22(9):1790-1797.{" "}
          <a
            className="font-semibold text-brand"
            href="https://pubmed.ncbi.nlm.nih.gov/22955989/"
          >
            PMID: 22955989
          </a>
          .
        </p>
        <p className="pb-4">
          <strong>To contact RegulomeDB:</strong>
          <br />{" "}
          <a data-reactid="104" href="mailto:regulomedb@mailman.stanford.edu">
            regulomedb@mailman.stanford.edu
          </a>
          &nbsp;
        </p>
      </DataPanel>
    </>
  );
}

export async function getServerSideProps() {
  const breadcrumbs = [
    {
      title: "Help",
      href: "/help",
    },
  ];

  return {
    props: {
      breadcrumbs,
      pageContext: { title: "Help" },
    },
  };
}
