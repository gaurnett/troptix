import Footer from '@/components/ui/footer';
import ContactFormPage from '../../components/pages/contact/contact-form';
import ContactHero from '@/components/pages/contact/contact-hero';

export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <ContactFormPage />
      <Footer />
    </main>
  );
}
