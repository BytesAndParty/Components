export interface TextFormatValues {
  fontFamily:   string
  fontSize:     number
  bold:         boolean
  italic:       boolean
  underline:    boolean
  textAlign:    'left' | 'center' | 'right' | 'justify'
  charSpacing:  number   // Fabric units: 1/1000 em  (range: -200…800)
  lineHeight:   number   // multiplier: 0.8…3.0
  color:        string   // hex
}

export const defaultTextFormat: TextFormatValues = {
  fontFamily:  'Playfair Display',
  fontSize:    24,
  bold:        false,
  italic:      false,
  underline:   false,
  textAlign:   'left',
  charSpacing: 0,
  lineHeight:  1.2,
  color:       '#000000',
}

export interface TextToolOptionsMessages {
  bold: string
  italic: string
  underline: string
  alignLeft: string
  alignCenter: string
  alignRight: string
  alignJustify: string
  textColor: string
}

export const FONTS = [
  { family: 'Playfair Display',    category: 'Serif' },
  { family: 'Cormorant Garamond',  category: 'Serif' },
  { family: 'Lora',                category: 'Serif' },
  { family: 'EB Garamond',         category: 'Serif' },
  { family: 'Libre Baskerville',   category: 'Serif' },
  { family: 'Cinzel',              category: 'Display' },
  { family: 'Great Vibes',         category: 'Script' },
  { family: 'Dancing Script',      category: 'Script' },
  { family: 'Montserrat',          category: 'Sans-serif' },
  { family: 'Inter',               category: 'Sans-serif' },
]

export const GOOGLE_FONTS_URL =
  `https://fonts.googleapis.com/css2?${FONTS.map(f =>
    `family=${f.family.replace(/ /g, '+')}:ital,wght@0,400;0,700;1,400`
  ).join('&')}&display=swap`
