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
    title: 'Eudossier — European Document Services & Dossier Solutions',
    description: 'Explore European document information, administrative guidance and dossier preparation resources.',
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
