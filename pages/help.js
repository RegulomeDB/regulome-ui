import Breadcrumbs from "../components/breadcrumbs";
import PagePreamble from "../components/page-preamble";

export default function Help() {
  return (
    <>
      <Breadcrumbs />
      <PagePreamble />
      <h1>Help</h1>
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
