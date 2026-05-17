import Cursor from '@/components/ui/Cursor';
import ScrollProgress from '@/components/ui/ScrollProgress';
import RevealObserver from '@/components/ui/RevealObserver';
import IntroScreen from '@/components/IntroScreen';
import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import Stats from '@/components/sections/Stats';
import Services from '@/components/sections/Services';
import Portfolio from '@/components/sections/Portfolio';
import AutomationSection from '@/components/sections/AutomationSection';
import Process from '@/components/sections/Process';
import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <IntroScreen />
      <Cursor />
      <ScrollProgress />
      <RevealObserver />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Services />
        <Portfolio />
        <AutomationSection />
        <Process />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
