import React from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { CategoryShowcase } from '../components/CategoryShowcase';
import { HomepageFeatured } from '../components/HomepageFeatured';
import { ProcessSection } from '../components/ProcessSection';
import { TrustSection } from '../components/TrustSection';
import { BuyerFaqSection } from '../components/BuyerFaqSection';

const HomePage: React.FC = () => (
  <>
    <HeroBanner />
    <CategoryShowcase />
    <HomepageFeatured />
    <BuyerFaqSection />
    <ProcessSection />
    <TrustSection />
  </>
);

export default HomePage;
