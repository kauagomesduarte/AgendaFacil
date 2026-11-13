import '../../CSS/global.css';
import './LandingPage.css';

import Navbar from '../../components/Navbar/Navbar';
import HeroSection from './components/HeroSection';
import InteractiveShowcaseSection from './components/InteractiveShowcaseSection';
import AudienceSection from './components/AudienceSection';
import FeaturesCarouselSection from './components/FeaturesCarouselSection';
import BusinessSection from './components/BusinessSection';
import CtaAndFooter from './components/CtaAndFooter';

export default function LandingPage() {
  return (
    <div className="lp-shell">
      <Navbar />
      <main className="lp-main">
        <HeroSection />
        <InteractiveShowcaseSection />
        <AudienceSection />
        <FeaturesCarouselSection />
        <BusinessSection />
        <CtaAndFooter />
      </main>
    </div>
  );
}