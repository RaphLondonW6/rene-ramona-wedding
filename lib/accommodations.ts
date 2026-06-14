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
    name: 'Hotel Cernica',
    type: 'Hotel',
    distance: '2 km',
    description: 'The closest hotel to the venue, situated near the serene Cernica Lake. Perfect for guests who want to be steps from the celebrations.',
    stars: 3,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    bookingUrl: 'https://www.booking.com/search.html?ss=Pantelimon+Romania',
    priceRange: '€€',
  },
  {
    id: 2,
    name: 'Casa Belvedere',
    type: 'Boutique Hotel',
    distance: '5 km',
    description: 'A charming boutique property with elegant rooms and lush gardens, offering a tranquil retreat just minutes from the venue.',
    stars: 4,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
    bookingUrl: 'https://www.booking.com/search.html?ss=Cernica+Romania',
    priceRange: '€€',
  },
  {
    id: 3,
    name: 'Hotel Caro Bucharest',
    type: 'Hotel',
    distance: '10 km',
    description: 'A stylish 4-star hotel in eastern Bucharest with spacious rooms, a spa, and excellent dining. Convenient for guests flying in.',
    stars: 4,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
    bookingUrl: 'https://www.hotelcaro.ro',
    priceRange: '€€€',
  },
  {
    id: 4,
    name: 'Novotel Bucharest City Centre',
    type: 'Hotel',
    distance: '13 km',
    description: "A reliable international brand with modern amenities, central location and easy access to Bucharest's attractions.",
    stars: 4,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
    bookingUrl: 'https://all.accor.com/hotel/3155/index.en.shtml',
    priceRange: '€€€',
  },
  {
    id: 5,
    name: 'Grand Hotel du Boulevard',
    type: 'Boutique Hotel',
    distance: '13 km',
    description: 'A beautifully restored historic hotel on Bucharest\'s famous Calea Victoriei. Refined elegance with a timeless Art Deco aesthetic.',
    stars: 5,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
    bookingUrl: 'https://www.grandhoteldubulevard.ro',
    priceRange: '€€€€',
  },
  {
    id: 6,
    name: 'Hotel Epoque Bucharest',
    type: 'Boutique Hotel',
    distance: '14 km',
    description: 'Bucharest\'s most celebrated boutique hotel, evoking the golden era of the city\'s Belle Époque. World-class service and interiors.',
    stars: 5,
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80',
    bookingUrl: 'https://www.hotelepoque.ro',
    priceRange: '€€€€',
  },
  {
    id: 7,
    name: 'InterContinental Bucharest',
    type: 'Hotel',
    distance: '14 km',
    description: 'An iconic Bucharest landmark offering panoramic city views. Premier rooms, a rooftop pool and world-class dining.',
    stars: 5,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
    bookingUrl: 'https://www.ihg.com/intercontinental/hotels/gb/en/bucharest/buhha/hoteldetail',
    priceRange: '€€€€',
  },
  {
    id: 8,
    name: 'Radisson Blu Hotel Bucharest',
    type: 'Hotel',
    distance: '15 km',
    description: 'One of Bucharest\'s finest five-star hotels, featuring contemporary design, an indoor pool and the acclaimed Elysée restaurant.',
    stars: 5,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80',
    bookingUrl: 'https://www.radissonhotels.com/en-us/hotels/radisson-blu-bucharest',
    priceRange: '€€€€',
  },
  {
    id: 9,
    name: 'JW Marriott Grand Hotel Bucharest',
    type: 'Hotel',
    distance: '15 km',
    description: 'A grand five-star landmark in the heart of Bucharest, adjacent to the Palace of Parliament. Impeccable service and facilities.',
    stars: 5,
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80',
    bookingUrl: 'https://www.marriott.com/en-us/hotels/buhbr-jw-marriott-bucharest-grand-hotel',
    priceRange: '€€€€',
  },
  {
    id: 10,
    name: 'Ibis Bucharest Palatul Parlamentului',
    type: 'Hotel',
    distance: '16 km',
    description: 'An affordable and comfortable option for budget-conscious guests. Clean, modern rooms in a convenient Bucharest location.',
    stars: 3,
    image: 'https://images.unsplash.com/photo-1586611292717-f828b167408c?w=600&q=80',
    bookingUrl: 'https://all.accor.com/hotel/6688/index.en.shtml',
    priceRange: '€',
  },
]
