'use client';
import Image from 'next/image';
import { ContactForm } from './contact-form';
import { useState, useEffect } from 'react';

export default function Testimonials() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('testimonials-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const partners = [
    { name: 'Google', logo: '/logos/google.png' },
    { name: 'Stripe', logo: '/logos/stripe.png' },
    { name: 'Microsoft', logo: '/logos/microsoft.png' },
  ];

  return (
    <section id="testimonials-section" className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-br from-background via-accent/5 to-background px-4">
      {/* Background elements with enhanced colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        <div className="absolute -top-24 left-1/4 w-48 h-48 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-chart-1/10 to-chart-2/10 blur-3xl"></div>
        <div className="absolute -bottom-24 right-1/4 w-48 h-48 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-chart-3/10 to-chart-4/10 blur-3xl"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto relative">
        {/* Partners section - mobile first with enhanced styling */}
        <div className={`text-center mb-12 sm:mb-16 md:mb-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold bg-gradient-to-r from-muted-foreground to-primary bg-clip-text text-transparent mb-8 sm:mb-10 md:mb-12 tracking-wide">
            Trusted by industry leaders
          </h2>
          
          <div className="flex justify-center items-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 flex-wrap">
            {partners.map((partner, index) => (
              <div
                key={partner.name}
                className={`group relative p-3 sm:p-4 rounded-xl bg-gradient-to-br from-card/50 to-background/50 border border-primary/10 hover:border-primary/20 transform transition-all duration-700 hover:scale-110 backdrop-blur-sm ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <Image
                  width={80}
                  height={48}
                  className="w-auto h-8 sm:h-10 md:h-12 lg:h-16 opacity-60 group-hover:opacity-100 transition-opacity duration-300 filter grayscale group-hover:grayscale-0"
                  style={{ objectFit: 'contain' }}
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-chart-1/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact section - mobile first with enhanced colors */}
        <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="max-w-xs sm:max-w-lg md:max-w-2xl mx-auto text-center mb-8 sm:mb-10 md:mb-12">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 md:mb-6 bg-gradient-to-r from-foreground via-primary to-chart-2 bg-clip-text text-transparent">
              Ready to get started?
            </h3>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
              Have questions or want to see TropTix in action?
              <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-muted-foreground to-primary/70 bg-clip-text text-transparent">We'd love to hear from you!</span>
            </p>
          </div>

          <div className="relative">
            {/* Contact form with modern styling - mobile first with enhanced gradients */}
            <div className="relative bg-gradient-to-br from-card via-background to-accent/20 p-4 sm:p-6 md:p-8 lg:p-12 rounded-2xl sm:rounded-3xl border border-primary/20 shadow-xl backdrop-blur-sm">
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-chart-2/5 pointer-events-none"></div>
              <div className="relative">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
