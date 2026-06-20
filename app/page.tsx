import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Welcome from '@/components/Welcome'
import Program from '@/components/Program'
import RSVP from '@/components/RSVP'
import Accommodation from '@/components/Accommodation'
import HoneymoonFund from '@/components/HoneymoonFund'
import Parking from '@/components/Parking'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import SectionImage from '@/components/SectionImage'
import SectionVideo from '@/components/SectionVideo'

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
        <SectionVideo src="/videos/parking.mp4" />
        <section id="parking"><Parking /></section>
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
