import { FeaturesV2 } from './FeaturesV2'
import { FeaturesV3 } from './FeaturesV3'
import { FeaturesV5 } from './FeaturesV5'
import { FeaturesV6 } from './FeaturesV6'
import { FeaturesV7 } from './FeaturesV7'
import { FeaturesV8 } from './FeaturesV8'
import { FeaturesNachtblau } from './FeaturesNachtblau'
import { FeaturesGenussgut } from './FeaturesGenussgut'
import { FeaturesSchwarzweiss } from './FeaturesSchwarzweiss'
import { FeaturesGastgeber } from './FeaturesGastgeber'
import { FeaturesCinematic } from './FeaturesCinematic'
import type { SectionDef } from '../types'

export const featuresSection: SectionDef = {
  id: 'features',
  label: 'Features & Story',
  variants: [
    {
      id: 'v2',
      label: 'Story-Driven Split',
      Component: FeaturesV2,
    },
    {
      id: 'v3',
      label: 'Vintage Index',
      description: 'Editorial Hairline-Tabelle mit Index-Nummern und Serif-Headlines (Cream / Buchart Style).',
      Component: FeaturesV3,
    },
    {
      id: 'v5',
      label: 'Die Rieden (Domaine Privée)',
      description: 'Drei Terroirs als Rundbogen-Tafeln mit römischen Siegeln, gravierten Datenzeilen und stillen Hovers.',
      Component: FeaturesV5,
    },
    {
      id: 'v6',
      label: 'Maison Editorial',
      description: 'Geschichteter Magazin-Essay: Headline überlappt die Fotografie von rechts, hängende Zweit-Tafel, Grundsätze als Fig. 02–04.',
      Component: FeaturesV6,
    },
    {
      id: 'v7',
      label: 'Artisanal Minimal',
      description: 'Typografisches Manifest: Serif-Statement als Treppensatz, drei versetzte Randnotizen, extremer Weißraum — bewusst ohne Bild (Buchart Style).',
      Component: FeaturesV7,
    },
    {
      id: 'v8',
      label: 'Nocturne (Cinematic)',
      description: 'Drei Kellerszenen als Film-Stills: Kerzengold-Hairlines, Ghost-Numerale, Lower-Third-Captions und Staub im Dunkel.',
      Component: FeaturesV8,
    },
    {
      id: 'nachtblau',
      label: 'Nachtblau',
      description: 'Die vier Lagen als selbstgezeichnete Inline-SVG-Karte mit roten Ried-Markern, daneben das Datenblatt der aktiven Riede und ein Akkordeon der übrigen.',
      Component: FeaturesNachtblau,
    },
    {
      id: 'genussgut',
      label: 'Genussgut',
      description: 'Rhythmus durch großflächige Farbfelder statt Karten: Aprikose, Petrol und Creme laufen über die volle Breite, die Typo-Farbe kippt mit dem Feld.',
      Component: FeaturesGenussgut,
    },
    {
      id: 'schwarzweiss',
      label: 'Schwarzweiß',
      description: 'Der Dreitakt in Reinform: schmale zentrierte Textspalte, versetztes Bildraster aus 16:9 und 3:4, dann ein ganzseitiges Serif-Zitat als Rhythmuswechsel.',
      Component: FeaturesSchwarzweiss,
    },
    {
      id: 'gastgeber',
      label: 'Gastgeber',
      description: 'Weingut, Verkostung und Gästehaus als drei exakt gleich große, mittig gesetzte Blöcke mit gestempelten Glyphen; darunter die Auszeichnungen als ruhige Monochrom-Reihe.',
      Component: FeaturesGastgeber,
    },
    {
      id: 'cinematic',
      label: 'Cinematic Atmosphere',
      description: 'Eine lange Einstellung statt Triptychon: ein hohes Still links, rechts drei Gründe als nummerierte Hairline-Liste, die im Hover wächst.',
      Component: FeaturesCinematic,
    },
  ],
}
