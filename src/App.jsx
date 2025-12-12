import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import YouTube from './components/YouTube';
import Spotify from './components/Spotify';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen antialiased selection:bg-green selection:text-black dark:selection:text-navy">
      <Navbar />
      <main>
        <Hero />
        <About />
        {/* <Projects /> */}
        <YouTube />
        <Spotify />
        <Footer />
      </main>
    </div>
  );
}

export default App;
