import Image from 'next/image';
import { ContactForm } from './contact-form';

export default function Testimonials() {
  const logoSize = 120;

  return (
    <section className="relative">
      <div
        className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -mb-32"
        aria-hidden="true"
      >
        <svg
          width="1760"
          height="518"
          viewBox="0 0 1760 518"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              id="illustration-02"
            >
              <stop stopColor="#FFF" offset="0%" />
              <stop stopColor="#EAEAEA" offset="77.402%" />
              <stop stopColor="#DFDFDF" offset="100%" />
            </linearGradient>
          </defs>
          <g
            transform="translate(0 -3)"
            fill="url(#illustration-02)"
            fillRule="evenodd"
          >
            <circle cx="1630" cy="128" r="128" />
            <circle cx="178" cy="481" r="40" />
          </g>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
        <div className="pt-12 md:pt-20">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="h2 mb-4">
              TropTix is powered by industry leaders over the world
            </h2>
          </div>

          <div className="max-w-sm md:max-w-4xl mx-auto grid gap-2 grid-cols-2 md:grid-cols-3 mb-12 md:mb-16">
            {/* Item */}
            <div className="flex items-center justify-center py-2 md:col-auto">
              <Image
                width={logoSize}
                height={logoSize}
                className="w-auto"
                style={{ objectFit: 'contain' }}
                src={'/logos/google.png'}
                alt={'google logo'}
              />
            </div>

            <div className="flex items-center justify-center py-2 md:col-auto">
              <Image
                width={logoSize}
                height={logoSize}
                className="w-auto"
                style={{ objectFit: 'contain' }}
                src={'/logos/stripe.png'}
                alt={'stripe logo'}
              />
            </div>

            <div className="flex items-center justify-center py-2 mt-4 md:mt-0 col-span-2 md:col-auto">
              <Image
                width={logoSize}
                height={logoSize}
                className="w-auto"
                style={{ objectFit: 'contain' }}
                src={'/logos/microsoft.png'}
                alt={'microsoft logo'}
              />
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <h3 className="h3 text-center mb-8">Contact Us</h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
