// node_modules
import PropTypes from "prop-types";
// components
import Breadcrumbs from "../../components/breadcrumbs";
import {
  Collection,
  CollectionContent,
  CollectionHeader,
  CollectionItem,
  CollectionItemName,
} from "../../components/collection";
import { NoCollectionData } from "../../components/no-content";
import PagePreamble from "../../components/page-preamble";
// lib
import buildBreadcrumbs from "../../lib/breadcrumbs";
import Request from "../../lib/request";

const AwardList = ({ awards }) => {
  return (
    <>
      <Breadcrumbs />
      <PagePreamble />
      <Collection>
        {awards.length > 0 ? (
          <>
            <CollectionHeader count={awards.length} />
            <CollectionContent collection={awards}>
              {awards.map((award) => (
                <CollectionItem
                  key={award.uuid}
                  testid={award.uuid}
                  href={award["@id"]}
                  label={`Award ${award.name}`}
                  status={award.status}
                >
                  <CollectionItemName>{award.name}</CollectionItemName>
                  <div>{award.title}</div>
                </CollectionItem>
              ))}
            </CollectionContent>
          </>
        ) : (
          <NoCollectionData />
        )}
      </Collection>
    </>
  );
};

AwardList.propTypes = {
  // Awards to display in the list
  awards: PropTypes.array.isRequired,
};

export default AwardList;

export const getServerSideProps = async ({ req }) => {
  const request = new Request(req?.headers?.cookie);
  const awards = await request.getCollection("awards");
  const breadcrumbs = await buildBreadcrumbs(awards, "title");
  return {
    props: {
      awards: awards["@graph"],
      pageContext: { title: awards.title },
      breadcrumbs,
      sessionCookie: req?.headers?.cookie || "",
    },
  };
};
