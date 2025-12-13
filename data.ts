import { MainCategory } from './types';

export const PROLABEL_DATA: MainCategory[] = [
  {
    id: 'etykiety',
    title: 'Etykiety na Rolce',
    description: 'Wysokiej jakości etykiety do zadruku termicznego i termotransferowego.',
    iconName: 'Scroll',
    image: 'https://picsum.photos/id/175/800/600',
    subCategories: [
      {
        title: 'Rodzaje Etykiet',
        items: [
          { name: 'Etykiety termiczne' },
          { name: 'Etykiety papierowe' },
          { name: 'Etykiety foliowe' },
          { name: 'Etykiety metalizowane (srebrne, złote)' },
          { name: 'Etykiety fluorestencyjne' },
        ]
      }
    ]
  },
  {
    id: 'kalki',
    title: 'Kalki Termotransferowe',
    description: 'Materiały eksploatacyjne do drukarek przemysłowych zapewniające trwały nadruk.',
    iconName: 'Printer',
    image: 'https://picsum.photos/id/250/800/600',
    subCategories: [
      {
        title: 'Rodzaje Kalek',
        items: [
          { name: 'Kalki woskowe czarne' },
          { name: 'Kalki woskowo-żywiczne czarne' },
          { name: 'Kalki żywiczne czarne' },
          { name: 'Kalki kolorowe' },
          { name: 'Kalki metalizowane (srebrne, złote)' },
        ]
      }
    ]
  },
  {
    id: 'naklejki',
    title: 'Naklejki Samoprzylepne',
    description: 'Szeroki wybór folii samoprzylepnych do zastosowań reklamowych i dekoracyjnych.',
    iconName: 'Sticker',
    image: 'https://picsum.photos/id/180/800/600',
    subCategories: [
      {
        title: 'Folie Podstawowe',
        items: [
          { name: 'Folia biała (błysk, mat)' },
          { name: 'Folia przezroczysta (błysk, mat)' },
        ]
      },
      {
        title: 'Folie Specjalne',
        items: [
          { name: 'Folia plombowa krusząca' },
          { name: 'Folia odblaskowa' },
          { name: 'Folia holograficzna' },
          { name: 'Folia brokatowa' },
          { name: 'Folia metalizowana (złota, srebrna, błysk, mat)' },
          { name: 'Folia fluorestencyjna (żółta, zielona, czerwona)' },
        ]
      },
      {
        title: 'Folie Okienne i Podłogowe',
        items: [
          { name: 'Adhezyjna bezklejowa' },
          { name: 'OWV dziurkowana' },
          { name: 'Podłogowa z laminatem antypoślizgowym' },
          { name: 'Folia mrożona, piaskowana' },
          { name: 'Folia przyciemniająca' },
          { name: 'Folia lustro weneckie' },
        ]
      },
      {
        title: 'Cennik (Netto)',
        items: [
          { name: 'Folia biała (błysk, mat)', price: '45 zł / m²' },
          { name: 'Folia przezroczysta (błysk, mat)', price: '45 zł / m²' },
          { name: 'Folia OWV dziurkowana', price: '65 zł / m²' },
          { name: 'Folia odblaskowa', price: '130 zł / m²' },
          { name: 'Folia mrożona piaskowana', description: 'Wycena indywidualna' },
          { name: 'Folia podłogowa', price: '90 zł / m²' },
          { name: 'Okleiny na meble', price: '60 zł / m²' },
          { name: 'Naklejki ścienne', price: '120 zł / m²' },
          { name: 'Naklejki magnetyczne 100x60', price: '110 zł / mb' },
          { name: 'Naklejki z laminatem suchościeralnym', price: '120 zł / m²' },
        ]
      }
    ]
  },
  {
    id: 'plakaty',
    title: 'Plakaty Reklamowe',
    description: 'Druk cyfrowy i wielkoformatowy w najwyższej rozdzielczości.',
    iconName: 'Image',
    image: 'https://picsum.photos/id/433/800/600',
    subCategories: [
      {
        title: 'Formaty Standardowe',
        items: [
          { name: 'Plakaty papier 130g (A4, A3, B2, A1)' },
        ]
      },
      {
        title: 'Wielki Format',
        items: [
          { name: 'Wielkoformatowe papier 200g', price: '500 zł / m²' },
        ]
      }
    ]
  },
  {
    id: 'podloza',
    title: 'Podłoża Twarde',
    description: 'Sztywne podłoża do tablic, szyldów i konstrukcji reklamowych.',
    iconName: 'Layers',
    image: 'https://picsum.photos/id/48/800/600',
    subCategories: [
      {
        title: 'Płyty',
        items: [
          { name: 'Płyty PCV biała spieniona (1mm, 2mm, 5mm)' },
          { name: 'Płyty Dibond srebrny mat' },
        ]
      }
    ]
  }
];
