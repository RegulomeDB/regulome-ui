import Breadcrumbs from "../components/breadcrumbs";
import PagePreamble from "../components/page-preamble";

export default function Contact() {
  return (
    <>
      <Breadcrumbs />
      <PagePreamble />
      <h1>Contact</h1>
    </>
  );
}

export async function getServerSideProps() {
  const breadcrumbs = [
    {
      title: "Contact",
      href: "/contact",
    },
  ];

  return {
    props: {
      breadcrumbs,
      pageContext: { title: "Contact" },
    },
  };
}
