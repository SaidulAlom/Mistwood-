/* ============================================================
   Mistwood Restaurant — the single page.
   Section order mirrors the original brief: preloader → hero →
   marquee → story → dishes → marquee → TO … panels → menu →
   gallery → reviews → info → reserve → location → footer.
   ============================================================ */

import Preloader from '@/components/Preloader';
import Cursor from '@/components/Cursor';
import Atmosphere from '@/components/Atmosphere';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Story from '@/components/Story';
import Dishes from '@/components/Dishes';
import ToBlocks from '@/components/ToBlocks';
import Menu from '@/components/Menu';
import Gallery from '@/components/Gallery';
import Reviews from '@/components/Reviews';
import Info from '@/components/Info';
import Reserve from '@/components/Reserve';
import Location from '@/components/Location';
import Footer from '@/components/Footer';
import Chili from '@/components/Chili';
import ConfettiCanvas from '@/components/ConfettiCanvas';
import ScrollFX from '@/components/ScrollFX';

export default function Home() {
  return (
    <>
      <Preloader />
      <Cursor />
      <Atmosphere />

      <Navbar />

      <main>
        <Hero />
        <Marquee />
        <Story />
        <Dishes />
        <Marquee variant="reverse" />
        <ToBlocks />
        <Menu />
        <Gallery />
        <Reviews />
        <Info />
        <Reserve />
        <Location />
      </main>

      <Footer />

      <Chili />
      <ConfettiCanvas />

      {/* all imperative motion lives in this one client component */}
      <ScrollFX />
    </>
  );
}
