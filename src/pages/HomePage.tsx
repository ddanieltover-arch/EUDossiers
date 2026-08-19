import React from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { CategoryShowcase } from '../components/CategoryShowcase';
import { HomepageFeatured } from '../components/HomepageFeatured';
import { ProcessSection } from '../components/ProcessSection';
import { TrustSection } from '../components/TrustSection';

const HomePage: React.FC = () => (
  <>
    <HeroBanner />
    <CategoryShowcase />
    <HomepageFeatured />
    <ProcessSection />
    <TrustSection />
  </>
);

export default HomePage;
