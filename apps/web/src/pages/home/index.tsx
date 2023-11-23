import Footer from "@/components/ui/footer";
import LandingHero from "@/components/home/hero";
import CurrentEvents from "@/components/home/current-events";
import Features from "@/components/home/features";
import Testimonials from "@/components/home/testimonials";
import Newsletter from "@/components/home/newsletter";

export default function LandingPage() {
  return (
    <main>
      <LandingHero />
      <CurrentEvents />
      <Features />
      <Testimonials />
      <Newsletter />
      <Footer />
    </main>
  );
}
