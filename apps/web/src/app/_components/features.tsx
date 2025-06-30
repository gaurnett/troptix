'use client';
import { useState, useEffect } from 'react';

export default function Features() {
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

    const section = document.getElementById('features-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      title: 'Create Events',
      description: 'Build beautiful event pages in minutes. Set dates, add photos, and customize everything to match your style.',
      icon: 'calendar',
      color: 'from-primary to-chart-1',
      bgColor: 'from-primary/5 to-chart-1/10',
      borderColor: 'border-primary/20',
    },
    {
      title: 'Sell Tickets',
      description: 'Secure payment processing with instant confirmations. Your attendees get their tickets immediately.',
      icon: 'ticket',
      color: 'from-chart-2 to-chart-3',
      bgColor: 'from-chart-2/5 to-chart-3/10',
      borderColor: 'border-chart-2/20',
    },
    {
      title: 'Track Everything',
      description: 'Real-time analytics and attendee insights. Know exactly how your event is performing.',
      icon: 'analytics',
      color: 'from-chart-3 to-chart-4',
      bgColor: 'from-chart-3/5 to-chart-4/10',
      borderColor: 'border-chart-3/20',
    },
    {
      title: 'Easy Check-ins',
      description: 'Streamlined entry with QR codes and mobile scanning. No more long lines or paper tickets.',
      icon: 'check',
      color: 'from-chart-4 to-chart-5',
      bgColor: 'from-chart-4/5 to-chart-5/10',
      borderColor: 'border-chart-4/20',
    },
    {
      title: 'Get Paid Fast',
      description: 'Automatic payouts and transparent fee structure. Focus on your event, not the money stuff.',
      icon: 'payment',
      color: 'from-chart-5 to-primary',
      bgColor: 'from-chart-5/5 to-primary/10',
      borderColor: 'border-chart-5/20',
    },
    {
      title: 'Happy Attendees',
      description: 'Smooth experience from ticket purchase to event day. Your guests will love the simplicity.',
      icon: 'users',
      color: 'from-primary to-chart-2',
      bgColor: 'from-primary/5 to-chart-2/10',
      borderColor: 'border-primary/20',
    },
  ];

  return (
    <section id="features-section" className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-br from-background via-accent/10 to-background px-4">
      {/* Background decoration - mobile optimized with CSS variables */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-12 -right-12 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 md:-top-24 md:-right-24 rounded-full bg-gradient-to-br from-primary/20 to-chart-2/20 blur-3xl"></div>
        <div className="absolute -bottom-12 -left-12 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 md:-bottom-24 md:-left-24 rounded-full bg-gradient-to-br from-chart-3/20 to-chart-4/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-accent/15 to-primary/15 blur-2xl"></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto">
        {/* Section header - mobile first with enhanced colors */}
        <div className={`text-center mb-8 sm:mb-12 md:mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-foreground via-primary to-chart-2 bg-clip-text text-transparent">
            Everything you need to succeed
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xs sm:max-w-lg md:max-w-3xl mx-auto leading-relaxed">
            From creation to celebration, we've got every step covered.
            <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-muted-foreground to-primary/80 bg-clip-text text-transparent">No complexity, just results.</span>
          </p>
        </div>

        {/* Features grid - mobile first */}
        <div className="grid gap-4 sm:gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index, isVisible }) {
  return (
    <div
      className={`group relative p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-card to-background border ${feature.borderColor} shadow-lg hover:shadow-2xl transform transition-all duration-700 hover:scale-105 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Background gradient on hover */}
      <div className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.bgColor} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      {/* Content */}
      <div className="relative">
        {/* Icon */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-3 sm:mb-4 group-hover:animate-bounce-subtle">
          <FeatureIcon type={feature.icon} color={feature.color} />
        </div>
        
        {/* Title */}
        <h3 className={`text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-foreground group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:text-transparent group-hover:${feature.color} transition-all duration-300`}>
          {feature.title}
        </h3>
        
        {/* Description */}
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </div>

      {/* Decorative corner */}
      <div className={`absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br ${feature.color} rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform rotate-45 translate-x-6 sm:translate-x-8 md:translate-x-10 -translate-y-6 sm:-translate-y-8 md:-translate-y-10`}></div>
    </div>
  );
}

function FeatureIcon({ type, color }) {
  const iconClass = `w-full h-full bg-gradient-to-br ${color} rounded-lg p-1.5 sm:p-2`;
  
  switch (type) {
    case 'calendar':
      return (
        <div className={iconClass}>
          <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
          </svg>
        </div>
      );
    case 'ticket':
      return (
        <div className={iconClass}>
          <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 10V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2z"/>
          </svg>
        </div>
      );
    case 'analytics':
      return (
        <div className={iconClass}>
          <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
          </svg>
        </div>
      );
    case 'check':
      return (
        <div className={iconClass}>
          <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
      );
    case 'payment':
      return (
        <div className={iconClass}>
          <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
          </svg>
        </div>
      );
    case 'users':
      return (
        <div className={iconClass}>
          <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63c-.34-1.02-1.3-1.73-2.36-1.73-.8 0-1.54.43-1.95 1.12l-1.65 2.75 1.43.85 1.37-2.3L17.5 14H20v8h4zm-7.5-10.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm1.5 16v-7H9.5l-1.09-3.27c-.2-.6-.78-1.03-1.41-1.03-.83 0-1.5.67-1.5 1.5 0 .16.03.31.08.45L6.5 15.5H5V22H7z"/>
          </svg>
        </div>
      );
    default:
      return (
        <div className={iconClass}>
          <div className="w-full h-full bg-white rounded opacity-50"></div>
        </div>
      );
  }
}

