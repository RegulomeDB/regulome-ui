import Breadcrumbs from "../components/breadcrumbs";

export default function Page() {
  return (
    <>
      <Breadcrumbs />
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
    },
  };
}
