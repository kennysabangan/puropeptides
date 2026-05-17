// Resolve the primary and gallery image URLs for a product.
// Prefers Supabase Storage URLs if set; falls back to the legacy
// /images/products/{slug}/... paths from the public/ folder so
// products that haven't been re-uploaded still render.

export function getPrimaryImage(product) {
  if (product?.image_url) return product.image_url
  if (!product?.slug) return ''
  return `/images/products/${product.slug}/${product.slug}-vial.png`
}

export function getHeroImage(product) {
  if (product?.image_url) return product.image_url
  if (!product?.slug) return ''
  return `/images/products/${product.slug}/00.png`
}

export function getGalleryImages(product) {
  if (Array.isArray(product?.gallery_urls) && product.gallery_urls.length > 0) {
    return product.gallery_urls
  }
  if (!product?.slug) return []
  return Array.from({ length: 5 }, (_, i) =>
    `/images/products/${product.slug}/${String(i).padStart(2, '0')}.png`,
  )
}
