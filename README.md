# fcia_oasis

## Variables de entorno para checkout

### Mercado Pago

- `MERCADOPAGO_ACCESS_TOKEN`: access token privado de Mercado Pago para crear preferencias y consultar pagos. Cargarlo solo como variable secreta en Vercel/local; no commitearlo. Si falta, el checkout no falla: redirige el pedido armado a WhatsApp.
- `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`: public key de Mercado Pago. Para Checkout Pro no es obligatorio, pero queda documentado para futuras integraciones client-side.
- `NEXT_PUBLIC_BASE_URL`: URL pública del sitio, por ejemplo `https://fcia-oasis.vercel.app`. Mercado Pago usa esta URL para volver al checkout y enviar webhooks.

## Configuración rápida en Vercel

En `Vercel → Project → Settings → Environment Variables` cargar:

```env
NEXT_PUBLIC_BASE_URL=https://fcia-oasis.vercel.app
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=TEST-b21e59d6-6943-4f0f-a29f-d943429fee03
MERCADOPAGO_ACCESS_TOKEN=tu_access_token_privado
NEXT_PUBLIC_WHATSAPP_PHONE=541153324146
```

El access token que compartiste es de prueba (`TEST-...`). No lo guardo en el repositorio por seguridad: debe quedar cargado únicamente como variable de entorno en Vercel. Después de guardar variables, ejecutar un redeploy.

### Correo Argentino MiCorreo

La cotización usa la API oficial de MiCorreo cuando estas variables están completas. Si falta alguna o la API no responde, el checkout muestra una estimación local marcada como estimada.

- `CORREO_ARGENTINO_API_URL`: opcional. Por defecto usa `https://api.correoargentino.com.ar/micorreo/v1`. Para testing usar `https://apitest.correoargentino.com.ar/micorreo/v1`.
- `CORREO_ARGENTINO_USER`: usuario de API entregado por Correo Argentino.
- `CORREO_ARGENTINO_PASSWORD`: contraseña de API entregada por Correo Argentino.
- `CORREO_ARGENTINO_CUSTOMER_ID`: identificador de cliente MiCorreo.
- `CORREO_ARGENTINO_ORIGIN_POSTAL_CODE`: código postal de origen de la farmacia.

## Catálogo de productos

Los 16 productos enviados están listos para vender con precios y stock iniciales. También se pueden cargar en Supabase con `supabase/seed-oasis-products.sql`.

1. Guardar las fotos en `public/products/` usando los nombres indicados en `public/products/README.md`.
2. Ejecutar `supabase/seed-oasis-products.sql` en el SQL editor de Supabase.
3. Ajustar `price`, `promotional_price` y `stock` en Supabase cuando cambien los valores reales.

Mientras un producto tenga `price = 0` o `stock = 0`, la tienda muestra “Consultar precio” y redirige a WhatsApp en vez de agregarlo al carrito.

## Modo fallback para Vercel

La tienda puede abrir y tomar pedidos aunque Vercel todavía no tenga configuradas las variables de Supabase o Mercado Pago. En ese caso usa un catálogo local de respaldo (`lib/fallback-products.ts`) con los 16 productos, precios y stock; al confirmar el checkout genera el detalle del pedido y redirige a WhatsApp para terminar la compra.

Para que Vercel muestre la versión corregida, el último commit debe estar en el branch conectado al proyecto y luego se debe ejecutar un deploy nuevo desde Vercel.

## Copiar fotos desde Windows

Si las fotos están en `C:\fotos web fcia`, ejecutar en PowerShell desde la raíz del proyecto:

```powershell
.\scripts\copy-product-images.ps1
```

El script copia y renombra las imágenes `.webp` a `public/products/` con los nombres que usa la tienda. Luego subir esos archivos a GitHub y redeployar en Vercel.

## Emails de pedidos

Para enviar email automático al comprador y al vendedor se usa Resend. Cargar en Vercel:

```env
RESEND_API_KEY=tu_api_key_de_resend
EMAIL_FROM=Farmacia Oasis <ventas@tu-dominio.com>
ORDER_NOTIFICATION_EMAIL=farmaciaoasis13@gmail.com
```

Si `RESEND_API_KEY` no está configurado, la compra y el pago funcionan igual, pero los emails se omiten y queda un aviso en los logs de Vercel.
