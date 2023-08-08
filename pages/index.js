import Breadcrumbs from "../components/breadcrumbs";

export default function Home() {
  return (
    <>
      <Breadcrumbs />
      <h1>Home</h1>
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}
