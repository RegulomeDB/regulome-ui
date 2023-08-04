import Breadcrumbs from "../components/breadcrumbs";

export default function Page() {
  return (
    <>
      <Breadcrumbs />
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
    },
  };
}
