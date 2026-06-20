export interface Accommodation {
  id: number
  name: string
  type: 'Hotel' | 'Boutique Hotel' | 'Resort' | 'Airbnb'
  distance: string
  description: string
  stars: number
  image: string
  bookingUrl: string
  priceRange: string
}

export const accommodations: Accommodation[] = [
  {
    id: 1,
    name: 'Mercure Conacul Cozieni',
    type: 'Resort',
    distance: '35 km',
    description: 'A beautiful Mercure estate resort set in the Romanian countryside, offering a peaceful retreat with elegant rooms and scenic grounds.',
    stars: 4,
    image: '/images/hotels/Mercure_Conacul_Cozieni.png',
    bookingUrl: 'https://all.accor.com/hotel/B9U8/index.en.shtml',
    priceRange: '€€',
  },
  {
    id: 2,
    name: 'ibis Styles Bucharest City Center',
    type: 'Hotel',
    distance: '13 km',
    description: 'A modern, colourful ibis Styles in the heart of Bucharest. Great value with a central location and easy access to the city.',
    stars: 3,
    image: '/images/hotels/ibis-styles-bucharest.jpg',
    bookingUrl: 'https://all.accor.com/booking/en/accor/hotel/B089?destination=bucharest-romania&compositions=1&dateIn=2027-06-12&dateOut=2027-06-13&nights=1&hideWDR=false&accessibleRoom=false',
    priceRange: '€',
  },
  {
    id: 3,
    name: 'Mercure Bucharest Unirii',
    type: 'Hotel',
    distance: '14 km',
    description: 'A well-positioned Mercure hotel near Unirii Square, offering comfortable rooms and modern amenities in central Bucharest.',
    stars: 4,
    image: '/images/hotels/Mercure_Bucharest_Unirii.png',
    bookingUrl: 'https://all.accor.com/booking/en/accor/hotel/A1H4?destination=bucharest-romania&compositions=1&dateIn=2027-06-12&dateOut=2027-06-13&nights=1&hideWDR=false&accessibleRoom=false',
    priceRange: '€€',
  },
  {
    id: 4,
    name: 'Novotel Bucharest City Centre',
    type: 'Hotel',
    distance: '13 km',
    description: "A reliable international brand with modern amenities, central location and easy access to Bucharest's attractions.",
    stars: 4,
    image: '/images/hotels/NovotelBucharestCityCentre.png',
    bookingUrl: 'https://www.novotelbucharestcitycentre.com/',
    priceRange: '€€€',
  },
  {
    id: 5,
    name: 'Corinthia Bucharest',
    type: 'Hotel',
    distance: '14 km',
    description: 'One of Bucharest\'s most prestigious five-star hotels, combining timeless elegance with world-class service in the heart of the city.',
    stars: 5,
    image: '/images/hotels/Corinthia_bucharest.png',
    bookingUrl: 'https://www.corinthia.com/en-gb/bucharest/',
    priceRange: '€€€€',
  },
  {
    id: 6,
    name: 'Hotel Epoque Bucharest',
    type: 'Boutique Hotel',
    distance: '14 km',
    description: 'Bucharest\'s most celebrated boutique hotel, evoking the golden era of the city\'s Belle Époque. World-class service and interiors.',
    stars: 5,
    image: '/images/hotels/HotelEpoque.png',
    bookingUrl: 'https://www.booking.com/searchresults.html?ss=Hotel+Epoque+Bucharest&checkin=2027-06-12&checkout=2027-06-13&group_adults=2&no_rooms=1',
    priceRange: '€€€€',
  },
  {
    id: 7,
    name: 'InterContinental Athenee Palace Bucharest',
    type: 'Hotel',
    distance: '14 km',
    description: 'An iconic Bucharest landmark offering panoramic city views. Premier rooms, a rooftop pool and world-class dining.',
    stars: 5,
    image: '/images/hotels/InterContinental_Bucharest.png',
    bookingUrl: 'https://intercontinental-athenee-palace-bucharest.h-rez.com/index.htm',
    priceRange: '€€€€',
  },
  {
    id: 8,
    name: 'Grand Hotel Bucharest',
    type: 'Hotel',
    distance: '14 km',
    description: 'A grand five-star hotel in the heart of Bucharest, blending classic architecture with contemporary luxury and impeccable service.',
    stars: 5,
    image: '/images/hotels/GrandHotelBucharest.png',
    bookingUrl: 'https://www.grandhotelbucharest.com/',
    priceRange: '€€€€',
  },
]
