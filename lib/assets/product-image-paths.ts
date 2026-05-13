export const PRODUCT_IMAGE_PATHS: Record<string, string> = {
  "kit-limpieza-facial-completa-leche-tonico-exfoliante": "/api/assets/product/kit-limpieza-facial-completa-leche-tonico-exfoliante",
  "balsamo-reparador-labial-vitamina-k-vitamina-e-15g": "/api/assets/product/balsamo-reparador-labial-vitamina-k-vitamina-e-15g",
  "emulsion-hidratante-fitoesteroles-fps-30": "/api/assets/product/emulsion-hidratante-fitoesteroles-fps-30",
  "kit-antiage-completo-rutina-dia-noche": "/api/assets/product/kit-antiage-completo-rutina-dia-noche",
  "crema-antiage-noche-oasis-night-repair-50g": "/api/assets/product/crema-antiage-noche-oasis-night-repair-50g",
  "crema-antiage-dia-oasis-day-balance-50g": "/api/assets/product/crema-antiage-dia-oasis-day-balance-50g",
  "gel-contorno-ojos-cafeina-efecto-seda": "/api/assets/product/gel-contorno-ojos-cafeina-efecto-seda",
  "espuma-limpieza-facial-descongestiva-te-verde-malva": "/api/assets/product/espuma-limpieza-facial-descongestiva-te-verde-malva",
  "exfoliante-facial-suavidad-natural": "/api/assets/product/exfoliante-facial-suavidad-natural",
  "agua-micelar-facial": "/api/assets/product/agua-micelar-facial",
  "crema-cuello-escote-40": "/api/assets/product/crema-cuello-escote-40",
  "gel-flebotonico-250g-circulacion-piernas-cansadas": "/api/assets/product/gel-flebotonico-250g-circulacion-piernas-cansadas",
  "agua-termal-facial": "/api/assets/product/agua-termal-facial",
  "serum-tensor-botox-argireline-10": "/api/assets/product/serum-tensor-botox-argireline-10",
  "serum-regenerador-pepitas-uva": "/api/assets/product/serum-regenerador-pepitas-uva",
  "serum-vit-c-acido-hialuronico": "/api/assets/product/serum-vit-c-acido-hialuronico",
}

export function getProductImagePath(slug: string) {
  return PRODUCT_IMAGE_PATHS[slug] ?? `/api/assets/product/${slug}`
}
