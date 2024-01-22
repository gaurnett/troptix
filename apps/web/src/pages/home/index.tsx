import Features from '@/components/pages/home/features';
import LandingHero from '@/components/pages/home/hero';
import Testimonials from '@/components/pages/home/testimonials';
import Footer from '@/components/ui/footer';

export default function LandingPage() {
  return (
    <main>
      <LandingHero />
      <Features />
      <Testimonials />
      {/* <Newsletter /> */}
      <Footer />
    </main>
  );
}
