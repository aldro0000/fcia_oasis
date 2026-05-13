# Imágenes de productos Oasis

La tienda ahora usa rutas seguras `/api/assets/product/[slug]`. Esa API busca las fotos en estas ubicaciones:

- `public/products/`
- `public/FOTOS WEB FCIA/`
- `public/fotos web fcia/`
- `FOTOS WEB FCIA/`
- `fotos web fcia/`

Nombres canónicos esperados si copiás las fotos a `public/products/`:

01. `01-kit-limpieza-facial-completa.webp`
02. `02-balsamo-reparador-labial-vitamina-k-e-15g.webp`
03. `03-emulsion-hidratante-fitoesteroles-fps-30.webp`
04. `04-kit-antiage-completo-dia-noche.webp`
05. `05-crema-antiage-noche-oasis-night-repair-50g.webp`
06. `06-crema-antiage-dia-oasis-day-balance-50g.webp`
07. `07-gel-contorno-ojos-cafeina-efecto-seda.webp`
08. `08-espuma-limpieza-facial-te-verde-malva.webp`
09. `09-exfoliante-facial-suavidad-natural.webp`
10. `10-agua-micelar-facial.webp`
11. `11-crema-cuello-escote-40.webp`
12. `12-gel-flebotonico-250g.webp`
13. `13-agua-termal-facial.webp`
14. `14-serum-tensor-botox-argireline-10.webp`
15. `15-serum-regenerador-pepitas-uva.webp`
16. `16-serum-vit-c-acido-hialuronico.webp`

Si falta una foto, la API devuelve un placeholder visible para evitar imágenes rotas.
