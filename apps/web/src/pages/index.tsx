import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import LandingPage from './home';
import { exampleFlag } from '@/flags';
export const getServerSideProps = (async ({ req }) => {
  const example = await exampleFlag(req);
  return { props: { example } };
}) satisfies GetServerSideProps<{ example: boolean }>;

export default function Home({
  example,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <LandingPage example={example} />;
}
