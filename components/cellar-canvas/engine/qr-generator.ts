import QRCode from 'qrcode'

/**
 * Generates a QR Code as a Data URL.
 * Used for EU nutritional information on wine labels.
 */
export async function generateQRCodeDataURL(url: string): Promise<string> {
  if (!url) return ''
  try {
    return await QRCode.toDataURL(url, {
      margin: 1,
      width: 256,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
  } catch (err) {
    console.error('QR Generation Error:', err)
    return ''
  }
}
