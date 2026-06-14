import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Welcome from '@/components/Welcome'
import Program from '@/components/Program'
import RSVP from '@/components/RSVP'
import Accommodation from '@/components/Accommodation'
import HoneymoonFund from '@/components/HoneymoonFund'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <section id="welcome"><Welcome /></section>
        <section id="program"><Program /></section>
        <section id="rsvp"><RSVP /></section>
        <section id="accommodation"><Accommodation /></section>
        <section id="honeymoon"><HoneymoonFund /></section>
        <section id="contact"><Contact /></section>
      </main>
      <Footer />
    </>
  )
}
