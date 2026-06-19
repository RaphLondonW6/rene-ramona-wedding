import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Welcome from '@/components/Welcome'
import Program from '@/components/Program'
import RSVP from '@/components/RSVP'
import Accommodation from '@/components/Accommodation'
import HoneymoonFund from '@/components/HoneymoonFund'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import Image from 'next/image'

function SectionImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-full overflow-hidden" style={{ lineHeight: 0 }}>
      <Image
        src={src}
        alt={alt}
        width={2400}
        height={900}
        className="w-full h-auto object-cover"
        style={{ display: 'block' }}
        sizes="100vw"
      />
    </div>
  )
}

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <section id="welcome"><Welcome /></section>
        <SectionImage
          src="/images/sections/ceremony-program.jpg"
          alt="Ceremony & Program"
        />
        <section id="program"><Program /></section>
        <SectionImage
          src="/images/sections/confirm-presence.jpg"
          alt="Confirm Your Presence"
        />
        <section id="rsvp"><RSVP /></section>
        <SectionImage
          src="/images/sections/hotels-accommodation.jpg"
          alt="Hotels & Accommodation"
        />
        <section id="accommodation"><Accommodation /></section>
        <SectionImage
          src="/images/sections/honeymoon-fund.jpg"
          alt="Honeymoon Fund"
        />
        <section id="honeymoon"><HoneymoonFund /></section>
        <SectionImage
          src="/images/sections/contact.jpg"
          alt="Contact Us"
        />
        <section id="contact"><Contact /></section>
      </main>
      <Footer />
    </>
  )
}
