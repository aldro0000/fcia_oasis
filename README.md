# fcia_oasis

## Variables de entorno para checkout

### Mercado Pago

- `MERCADOPAGO_ACCESS_TOKEN`: access token privado de Mercado Pago para crear preferencias y consultar pagos.
- `NEXT_PUBLIC_BASE_URL`: URL pública del sitio, por ejemplo `https://tudominio.com`. Mercado Pago usa esta URL para volver al checkout y enviar webhooks.

### Correo Argentino MiCorreo

La cotización usa la API oficial de MiCorreo cuando estas variables están completas. Si falta alguna o la API no responde, el checkout muestra una estimación local marcada como estimada.

- `CORREO_ARGENTINO_API_URL`: opcional. Por defecto usa `https://api.correoargentino.com.ar/micorreo/v1`. Para testing usar `https://apitest.correoargentino.com.ar/micorreo/v1`.
- `CORREO_ARGENTINO_USER`: usuario de API entregado por Correo Argentino.
- `CORREO_ARGENTINO_PASSWORD`: contraseña de API entregada por Correo Argentino.
- `CORREO_ARGENTINO_CUSTOMER_ID`: identificador de cliente MiCorreo.
- `CORREO_ARGENTINO_ORIGIN_POSTAL_CODE`: código postal de origen de la farmacia.

## Catálogo de productos

Los 16 productos enviados están listos para cargar en Supabase con `supabase/seed-oasis-products.sql`.

1. Guardar las fotos en `public/products/` usando los nombres indicados en `public/products/README.md`.
2. Ejecutar `supabase/seed-oasis-products.sql` en el SQL editor de Supabase.
3. Actualizar `price`, `promotional_price` y `stock` en Supabase cuando estén definidos los precios finales.

Mientras un producto tenga `price = 0` o `stock = 0`, la tienda muestra “Consultar precio” y redirige a WhatsApp en vez de agregarlo al carrito.

