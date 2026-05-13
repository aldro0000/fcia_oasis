import { promises as fs } from "fs"
import path from "path"
const PRODUCT_IMAGE_FILES: Record<string, string[]> = {
  "kit-limpieza-facial-completa-leche-tonico-exfoliante": [
    "01-kit-limpieza-facial-completa.webp",
    "Kit Limpieza Facial Completa – Leche + Tónico + Exfoliante.webp",
    "Kit Limpieza Facial Completa – Rutina Día & Noche.webp",
  ],
  "balsamo-reparador-labial-vitamina-k-vitamina-e-15g": [
    "02-balsamo-reparador-labial-vitamina-k-e-15g.webp",
    "Bálsamo Reparador Labial con Vitamina K y Vitamina E – 15 g.webp",
    "Balsamo Reparador Labial con Vitamina K y Vitamina E – 15 g.webp",
  ],
  "emulsion-hidratante-fitoesteroles-fps-30": [
    "03-emulsion-hidratante-fitoesteroles-fps-30.webp",
    "Emulsión Hidratante con Fitoesteroles FPS 30.webp",
    "Emulsion Hidratante con Fitoesteroles FPS 30.webp",
  ],
  "kit-antiage-completo-rutina-dia-noche": [
    "04-kit-antiage-completo-dia-noche.webp",
    "Kit Antiage Completo – Rutina Día & Noche.webp",
    "Kit Antiage Completo – Rutina Dia & Noche.webp",
  ],
  "crema-antiage-noche-oasis-night-repair-50g": [
    "05-crema-antiage-noche-oasis-night-repair-50g.webp",
    "Crema Antiage Noche – Oasis Night Repair (50g).webp",
    "Crema Antiage Noche – Oasis Night Repair (50 g).webp",
  ],
  "crema-antiage-dia-oasis-day-balance-50g": [
    "06-crema-antiage-dia-oasis-day-balance-50g.webp",
    "Crema Antiage Día – Oasis Day Balance (50g).webp",
    "Crema Antiage Dia – Oasis Day Balance (50g).webp",
  ],
  "gel-contorno-ojos-cafeina-efecto-seda": [
    "07-gel-contorno-ojos-cafeina-efecto-seda.webp",
    "Gel Contorno de Ojos con Cafeína – Efecto Seda.webp",
    "Gel Contorno de Ojos con Cafeina – Efecto Seda.webp",
  ],
  "espuma-limpieza-facial-descongestiva-te-verde-malva": [
    "08-espuma-limpieza-facial-te-verde-malva.webp",
    "Espuma de Limpieza Facial Descongestiva – Té Verde & Malva.webp",
    "Espuma de Limpieza Facial Descongestiva.webp",
  ],
  "exfoliante-facial-suavidad-natural": [
    "09-exfoliante-facial-suavidad-natural.webp",
    "Exfoliante Facial Suavidad Natural.webp",
  ],
  "agua-micelar-facial": [
    "10-agua-micelar-facial.webp",
    "Agua Micelar Facial.webp",
  ],
  "crema-cuello-escote-40": [
    "11-crema-cuello-escote-40.webp",
    "Crema de Cuello y Escote +40.webp",
  ],
  "gel-flebotonico-250g-circulacion-piernas-cansadas": [
    "12-gel-flebotonico-250g.webp",
    "Gel Flebotónico 250g – Circulación y piernas cansadas.webp",
    "Gel Flebotonico 250g – Circulacion y piernas cansadas.webp",
  ],
  "agua-termal-facial": [
    "13-agua-termal-facial.webp",
    "Agua Termal Facial.webp",
  ],
  "serum-tensor-botox-argireline-10": [
    "14-serum-tensor-botox-argireline-10.webp",
    "Serum tensor botox con argilerine 10%.webp",
    "Serum tensor botox con argireline 10%.webp",
  ],
  "serum-regenerador-pepitas-uva": [
    "15-serum-regenerador-pepitas-uva.webp",
    "Serum regenerador pepitas de uva.webp",
  ],
  "serum-vit-c-acido-hialuronico": [
    "16-serum-vit-c-acido-hialuronico.webp",
    "Serum Vit C + Ácido Hialurónico.webp",
    "Serum Vit C + Acido Hialuronico.webp",
  ],
}

const ASSET_DIRECTORIES = [
  "public/products",
  "public/FOTOS WEB FCIA",
  "public/fotos web fcia",
]

function getContentType(filePath: string) {
  const extension = path.extname(filePath).toLowerCase()
  if (extension === ".png") return "image/png"
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg"
  if (extension === ".svg") return "image/svg+xml"
  return "image/webp"
}

async function fileExists(filePath: string) {
  try {
    const stat = await fs.stat(filePath)
    return stat.isFile()
  } catch {
    return false
  }
}

async function findLooseMatch(directory: string, names: string[]) {
  try {
    const files = await fs.readdir(directory)
    const lowerNames = names.map((name) => name.toLowerCase())
    return files.find((file) => lowerNames.includes(file.toLowerCase()))
  } catch {
    return null
  }
}

function assetPath(...segments: string[]) {
  return path.join(/*turbopackIgnore: true*/ process.cwd(), ...segments)
}

export async function findProductImage(slug: string) {
  const fileNames = PRODUCT_IMAGE_FILES[slug] ?? [`${slug}.webp`]

  for (const directory of ASSET_DIRECTORIES) {
    for (const fileName of fileNames) {
      const filePath = assetPath(directory, fileName)
      if (await fileExists(filePath)) {
        return {
          buffer: await fs.readFile(filePath),
          contentType: getContentType(filePath),
        }
      }
    }

    const looseMatch = await findLooseMatch(assetPath(directory), fileNames)
    if (looseMatch) {
      const filePath = assetPath(directory, looseMatch)
      return {
        buffer: await fs.readFile(filePath),
        contentType: getContentType(filePath),
      }
    }
  }

  return null
}

export async function findLogoImage() {
  const logoFiles = [
    "logo-farmacia.webp",
    "LOGO FARMACIA.webp",
    "LOGO FARMACIA.png",
    "logofcia.png",
    "logo.png",
  ]
  const directories = ["public", "public/products", "public/FOTOS WEB FCIA", "public/fotos web fcia"]

  for (const directory of directories) {
    for (const fileName of logoFiles) {
      const filePath = assetPath(directory, fileName)
      if (await fileExists(filePath)) {
        return {
          buffer: await fs.readFile(filePath),
          contentType: getContentType(filePath),
        }
      }
    }
  }

  return null
}

export function productPlaceholderSvg(slug: string) {
  const label = slug
    .split("-")
    .slice(0, 4)
    .join(" ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
    <rect width="900" height="900" fill="#eef8f7"/>
    <circle cx="450" cy="330" r="150" fill="#0e7a73" opacity="0.14"/>
    <path d="M450 180c72 86 118 160 118 226 0 70-53 124-118 124s-118-54-118-124c0-66 46-140 118-226z" fill="#0e7a73"/>
    <text x="450" y="635" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" font-weight="700" fill="#0f2730">Farmacia Oasis</text>
    <text x="450" y="695" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#33545c">${label}</text>
  </svg>`
}

export function logoPlaceholderSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
    <rect width="256" height="256" rx="128" fill="#ffffff"/>
    <path d="M128 36c44 52 72 97 72 137 0 43-32 76-72 76s-72-33-72-76c0-40 28-85 72-137z" fill="#0e7a73"/>
    <text x="128" y="145" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#ffffff">O</text>
  </svg>`
}
