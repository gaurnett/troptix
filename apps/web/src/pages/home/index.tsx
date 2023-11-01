import Footer from "@/components/ui/footer";
import LandingHero from "./hero";
import CurrentEvents from "./current-events";
import Features from "./features";
import Testimonials from "./testimonials";
import Newsletter from "./newsletter";

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
