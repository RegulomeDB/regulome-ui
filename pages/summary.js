import PropTypes from "prop-types";
import Breadcrumbs from "../components/breadcrumbs";
import { DataPanel, DataAreaTitle } from "../components/data-area";
import { ButtonLink } from "../components/form-elements";
import Navigation from "../components/navigation";
import Notifications from "../components/notifications";
import PagePreamble from "../components/page-preamble";
import RegulomeVersionTag from "../components/regulome-version-tag";
import SummaryTable from "../components/summary-table";
import { API_URL } from "../lib/constants";
import errorObjectToProps from "../lib/errors";
import FetchRequest from "../lib/fetch-request";
import { getQueryStringFromServerQuery } from "../lib/query-utils";

export default function Summary({ data, queryString }) {
  const total = data.total || 0;
  const variants = [];
  const assembly = data.assembly;
  if (total >= 1) {
    for (let i = 0; i < data.variants.length; i++) {
      const variant = {};
      variant.chrom_location = `${data.variants[i].chrom}:${data.variants[i].start}-${data.variants[i].end}`;
      variant.ref = data.variants[i].ref;
      variant.alt = data.variants[i].alt;
      variant.rsids = data.variants[i].rsids;
      variant.rank = data.variants[i].regulome_score.ranking;
      variant.score = parseFloat(data.variants[i].regulome_score.probability);
      variant.tissue_specific_scores =
        data.variants[i].regulome_score.tissue_specific_scores;
      variant.assembly = assembly;
      const sortedScores = Object.fromEntries(
        Object.entries(variant.tissue_specific_scores).sort(
          ([, a], [, b]) => b - a
        )
      );
      const organs = Object.keys(sortedScores);
      variant.top_organs = organs.slice(0, 3);
      variants[i] = variant;
    }
  }

  return (
    <>
      <RegulomeVersionTag />
      <Navigation />
      <Breadcrumbs />
      <PagePreamble />
      <DataPanel>
        <DataAreaTitle>
          This search has found <b>{total}</b> variant(s).{" "}
          {total > variants.length ? (
            <span>
              {" "}
              Only <b>{variants.length}</b> are shown.
            </span>
          ) : null}
        </DataAreaTitle>
        {total >= 1 && (
          <>
            <div className="flex justify-end gap-1 mb-1">
              <ButtonLink
                href={`${API_URL}/summary/?${queryString}&format=bed`}
                type="primary"
              >
                Download BED
              </ButtonLink>
              <ButtonLink
                href={`${API_URL}/summary/?${queryString}&format=tsv`}
                type="primary"
              >
                Download TSV
              </ButtonLink>
            </div>
            <SummaryTable data={variants} assembly={assembly} />
          </>
        )}
      </DataPanel>
      {Object.keys(data.notifications).length > 0 && (
        <Notifications notifications={data.notifications} />
      )}
    </>
  );
}

Summary.propTypes = {
  data: PropTypes.object.isRequired,
  queryString: PropTypes.string.isRequired,
};

export async function getServerSideProps({ query }) {
  const queryString = getQueryStringFromServerQuery(query);
  const request = new FetchRequest();
  const data = await request.getObject(`/summary?${queryString}`);
  if (FetchRequest.isResponseSuccess(data)) {
    if (data["@type"][0] === "search") {
      return {
        redirect: {
          destination: `/search?${queryString}`,
          permanent: true,
        },
      };
    }

    const breadcrumbs = [
      {
        title: "Summary",
        href: `/summary?${queryString}`,
      },
    ];

    return {
      props: {
        data,
        breadcrumbs,
        pageContext: { title: "Summary" },
        queryString,
      },
    };
  }
  return errorObjectToProps(data);
}
