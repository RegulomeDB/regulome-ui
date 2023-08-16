export default function Home() {}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: `/search`,
      permanent: true,
    },
  };
}
