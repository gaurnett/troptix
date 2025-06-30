'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function LandingHero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-8 bg-gradient-to-br from-background via-background to-accent/30">
      {/* Animated background elements - mobile optimized with CSS variables */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating circles with animation - responsive sizes using CSS variables */}
        <div className="absolute top-10 left-4 w-32 h-32 md:w-64 md:h-64 md:top-20 md:left-20 rounded-full bg-gradient-to-br from-primary/30 to-chart-2/30 animate-float shadow-lg"></div>
        <div className="absolute top-20 right-8 w-24 h-24 md:w-48 md:h-48 md:top-40 md:right-32 rounded-full bg-gradient-to-br from-chart-1/25 to-primary/25 animate-float-delayed shadow-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 md:w-32 md:h-32 md:bottom-32 md:left-1/3 rounded-full bg-gradient-to-br from-chart-3/30 to-chart-4/30 animate-float-slow shadow-lg"></div>
        
        {/* Additional colorful elements */}
        <div className="absolute top-1/2 left-8 w-20 h-20 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-chart-5/20 to-destructive/20 animate-float-delayed blur-xl"></div>
        <div className="absolute bottom-1/3 right-16 w-12 h-12 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-accent/40 to-primary/40 animate-float-slow blur-lg"></div>
        
        {/* Subtle grid pattern with primary color */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" style={{ backgroundImage: `radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)` }}></div>
      </div>

      <div className="w-full max-w-6xl mx-auto relative z-10">
        <div className="text-center">
          {/* Beta badge with animation - enhanced with CSS variables */}
          <div className={`mx-auto w-fit mb-6 md:mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-full bg-gradient-to-r from-primary/15 to-accent/25 border border-primary/30 backdrop-blur-sm shadow-lg">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-chart-1 to-chart-2 animate-pulse shadow-sm"></div>
              <span className="text-xs md:text-sm font-medium bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">TropTix is now in Beta!</span>
            </div>
          </div>

          {/* Main heading with staggered animation - mobile first with enhanced gradients */}
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-4 md:mb-6 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <span className="block mb-1 md:mb-2 text-foreground">Your next</span>
            <span className="block bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent animate-gradient drop-shadow-sm">
              amazing event
            </span>
            <span className="block mt-1 md:mt-2 text-foreground">awaits</span>
          </h1>

          {/* Subtitle with animation - mobile first */}
          <p className={`text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 md:mb-12 max-w-xs sm:max-w-lg md:max-w-3xl mx-auto leading-relaxed transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Discover incredible events, grab your tickets instantly, and create memories that last forever.
            <span className="block mt-1 md:mt-2 text-sm sm:text-base md:text-lg">It's that simple. It's that fun.</span>
          </p>

          {/* CTA buttons with animation - mobile first with enhanced gradients */}
          <div className={`flex flex-col gap-3 sm:gap-4 justify-center items-center transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <Link
              href="/events"
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-primary to-chart-2 text-primary-foreground font-semibold text-base sm:text-lg hover:from-chart-1 hover:to-chart-3 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span className="relative z-10">Explore Events</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-chart-2 to-chart-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <Link
              href="/organizer/events"
              className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full border-2 border-primary/30 bg-gradient-to-r from-background to-accent/20 text-foreground font-semibold text-base sm:text-lg hover:border-primary hover:from-primary/10 hover:to-chart-1/20 transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
            >
              <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">Create Event</span>
            </Link>
          </div>

          {/* Stats with animations - mobile first grid with colorful stats */}
          <div className={`mt-12 md:mt-16 grid grid-cols-2 gap-4 sm:gap-6 max-w-sm sm:max-w-md md:max-w-2xl mx-auto transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="text-center group hover:scale-105 transition-transform duration-300 p-3 rounded-xl bg-gradient-to-br from-primary/5 to-chart-1/10 border border-primary/10 hover:border-primary/20">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent mb-1">1000+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Events Created</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300 p-3 rounded-xl bg-gradient-to-br from-chart-2/5 to-chart-3/10 border border-chart-2/10 hover:border-chart-2/20">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-chart-2 to-chart-3 bg-clip-text text-transparent mb-1">50K+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Tickets Sold</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300 p-3 rounded-xl bg-gradient-to-br from-chart-3/5 to-chart-4/10 border border-chart-3/10 hover:border-chart-3/20">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-chart-3 to-chart-4 bg-clip-text text-transparent mb-1">10K+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Happy Users</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300 p-3 rounded-xl bg-gradient-to-br from-chart-4/5 to-chart-5/10 border border-chart-4/10 hover:border-chart-4/20">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-chart-4 to-chart-5 bg-clip-text text-transparent mb-1">99%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
