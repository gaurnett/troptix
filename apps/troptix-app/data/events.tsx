const localImageSource = require('../assets/images/empty-state.jpg'); // eslint-disable-line
const rfbImage = require('../assets/images/rfb.jpeg');
const sunriseImage = require('../assets/images/sunrise.jpeg');
const strutImage = require('../assets/images/strut.jpeg');
const riseUpImage = require('../assets/images/riseup.jpeg');
const loveSocaImage = require('../assets/images/ilovesoca.jpeg');
const fuzionImage = require('../assets/images/fuzion.jpeg');

const events = [
  {
    coverImage: sunriseImage,
    title: 'Sunrise Breakfast Party',
    host: 'Sunnation Jamaica',
    location: 'Mountain Lodge Estate',
    price: '$150 - $1,000',
    status: 'Published',
    timestamp: '31 March 2023',
    description:
      'Reference this table when designing your app’s interface, and make sure',
    likes: 345,
  },
  {
    coverImage: rfbImage,
    title: 'Bacchanal Rum for Breakfast',
    host: 'Bacchanal',
    location: 'Hope Zoo, Kingston Jamaica',
    status: 'Draft',
    price: '$400',
    timestamp: '07 April 2023',
    description: 'This is the beginning of a new post',
    likes: 0,
  },
  {
    coverImage: strutImage,
    title: 'Strut Jamaica',
    host: 'Live in Love',
    location: 'Port Royal, Kingston Jamaica',
    price: '$60',
    status: 'Draft',
    timestamp: '19 May 2023',
    description: 'This is the beginning of a new post',
    likes: 0,
  },
  {
    coverImage: riseUpImage,
    title: 'Rise Up',
    host: 'Frenchmen',
    location: 'Pearly Beach, Ocho Rios',
    price: '$250',
    status: 'Draft',
    timestamp: '01 June 2023',
    description: 'This is the beginning of a new post',
    likes: 0,
  },
  {
    coverImage: loveSocaImage,
    title: 'i Love Soca',
    host: 'Absolut.',
    location: 'Sabina Park, Kingston Jamaica',
    price: '$120',
    status: 'Draft',
    timestamp: '26 July 2023',
    description: 'This is the beginning of a new post',
    likes: 0,
  },
  {
    coverImage: fuzionImage,
    title: 'Soca Fuzion',
    host: 'Kingston Carnival JA',
    location: 'The Kingston Waterfront',
    price: '$15',
    status: 'Draft',
    timestamp: '10 August 2023',
    description: 'This is the beginning of a new post',
    likes: 0,
  },
];

export default events;
