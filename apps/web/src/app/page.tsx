import LandingHero from './_components/hero';
import Footer from '@/components/ui/footer';
import Testimonials from './_components/testimonials';
import Features from './_components/features';

export default function Home() {
  return (
    <main>
      <LandingHero />
      <Features />
      <Testimonials />
      <Footer />
    </main>
  );
}
