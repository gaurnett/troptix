import Features from '@/components/pages/home/features';
import LandingHero from '@/components/pages/home/hero';
import Testimonials from '@/components/pages/home/testimonials';
import Footer from '@/components/ui/footer';
import { InferGetServerSidePropsType } from 'next';
import { getServerSideProps } from '..';
export default function LandingPage({
  example,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main>
      <LandingHero example={example} />
      <Features />
      <Testimonials />
      {/* <Newsletter /> */}
      <Footer />
    </main>
  );
}
