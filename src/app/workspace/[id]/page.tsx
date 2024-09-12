interface pageProps {
  params: { id: string };
}

const page = ({ params: { id } }: pageProps) => {
  return <div>page:{id}</div>;
};

export default page;
