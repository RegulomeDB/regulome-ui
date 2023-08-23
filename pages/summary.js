import PropTypes from "prop-types";
import { API_URL } from "../lib/constants";
import { getQueryStringFromServerQuery } from "../lib/query-utils";
import Breadcrumbs from "../components/breadcrumbs";
import { DataPanel, DataAreaTitle } from "../components/data-area";
import { ButtonLink } from "../components/form-elements";
import PagePreamble from "../components/page-preamble";
import RegulomeVersionTag from "../components/regulome-version-tag";
import SummaryTable from "../components/summary-table";
import Notifications from "../components/notifications";

export default function Summary({ data, queryString }) {
  const total = data.total || 0;
  const variants = [];
  const assembly = data.assembly;
  if (total > 1) {
    for (let i = 0; i < data.variants.length; i++) {
      const variant = {};
      variant.chrom_location = `${data.variants[i].chrom}:${data.variants[i].start}-${data.variants[i].end}`;
      variant.rsids = data.variants[i].rsids;
      variant.rank = data.variants[i].regulome_score.ranking;
      variant.score = data.variants[i].regulome_score.probability;
      variant.assembly = assembly;
      variants[i] = variant;
    }
  }
  return (
    <>
      <Breadcrumbs />
      <PagePreamble />
      <RegulomeVersionTag />
      <DataPanel>
        <DataAreaTitle>This search has found {total} variant(s).</DataAreaTitle>
        {total > 1 && (
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
            <SummaryTable data={variants} />
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
  const url = `${API_URL}/summary?${queryString}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.total === 1) {
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
