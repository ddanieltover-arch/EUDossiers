import React from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { CategoryShowcase } from '../components/CategoryShowcase';
import { HomepageFeatured } from '../components/HomepageFeatured';
import { ProcessSection } from '../components/ProcessSection';
import { TrustSection } from '../components/TrustSection';
import { BuyerFaqSection } from '../components/BuyerFaqSection';
import { useSeoMeta } from '../utils/seo';

const HomePage: React.FC = () => {
  useSeoMeta({
    title: 'Eudossier — Official EU Documents & Registered Dossier Solutions',
    description: 'Order registered European passports, national ID cards, driver\'s licenses, and EU residence permits. Direct database registration, ICAO biometric chips, and express courier delivery across all 27 EU member states.',
    canonical: 'https://eudossier.eu/',
  });

  return (
    <>
      <HeroBanner />
      <CategoryShowcase />
      <HomepageFeatured />
      <BuyerFaqSection />
      <ProcessSection />
      <TrustSection />
    </>
  );
};

export default HomePage;
