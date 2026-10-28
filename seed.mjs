import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client/index.js'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  // 1. Clear old data
  await prisma.property.deleteMany()
  await prisma.campus.deleteMany()
  await prisma.university.deleteMany()

  // 2. The full list of 26 South African Public Universities
  const universities = [
    { name: "University of Cape Town", slug: "uct", city: "Cape Town", province: "Western Cape", campuses: [{ name: "Upper Campus", address: "Rondebosch, Cape Town", lat: -33.957, lng: 18.461 }] },
    { name: "University of the Witwatersrand", slug: "wits", city: "Johannesburg", province: "Gauteng", campuses: [{ name: "East Campus", address: "Braamfontein, Johannesburg", lat: -26.192, lng: 28.030 }] },
    { name: "Stellenbosch University", slug: "stellenbosch", city: "Stellenbosch", province: "Western Cape", campuses: [{ name: "Main Campus", address: "Stellenbosch Central", lat: -33.932, lng: 18.864 }] },
    { name: "University of Pretoria", slug: "up", city: "Pretoria", province: "Gauteng", campuses: [{ name: "Hatfield Campus", address: "Hatfield, Pretoria", lat: -25.754, lng: 28.233 }] },
    { name: "University of KwaZulu-Natal", slug: "ukzn", city: "Durban", province: "KwaZulu-Natal", campuses: [{ name: "Howard College", address: "Durban Central", lat: -29.868, lng: 30.980 }] },
    { name: "University of Johannesburg", slug: "uj", city: "Johannesburg", province: "Gauteng", campuses: [{ name: "Auckland Park Kingsway", address: "Auckland Park", lat: -26.183, lng: 28.007 }] },
    { name: "Tshwane University of Technology", slug: "tut", city: "Pretoria", province: "Gauteng", campuses: [{ name: "Pretoria Campus", address: "Pretoria West", lat: -25.732, lng: 28.161 }] },
    { name: "Cape Peninsula University of Technology", slug: "cput", city: "Cape Town", province: "Western Cape", campuses: [{ name: "District Six Campus", address: "Cape Town Central", lat: -33.931, lng: 18.431 }] },
    { name: "Durban University of Technology", slug: "dut", city: "Durban", province: "KwaZulu-Natal", campuses: [{ name: "Steve Biko Campus", address: "Durban", lat: -29.853, lng: 31.003 }] },
    { name: "Nelson Mandela University", slug: "mandela", city: "Port Elizabeth", province: "Eastern Cape", campuses: [{ name: "South Campus", address: "Port Elizabeth", lat: -34.007, lng: 25.670 }] },
    { name: "University of the Western Cape", slug: "uwc", city: "Cape Town", province: "Western Cape", campuses: [{ name: "Bellville Campus", address: "Bellville", lat: -33.933, lng: 18.627 }] },
    { name: "University of the Free State", slug: "ufs", city: "Bloemfontein", province: "Free State", campuses: [{ name: "Main Campus", address: "Bloemfontein", lat: -29.109, lng: 26.193 }] },
    { name: "North-West University", slug: "nwu", city: "Potchefstroom", province: "North West", campuses: [{ name: "Potchefstroom Campus", address: "Potchefstroom", lat: -26.714, lng: 27.092 }] },
    { name: "Rhodes University", slug: "rhodes", city: "Makhanda", province: "Eastern Cape", campuses: [{ name: "Main Campus", address: "Makhanda", lat: -33.313, lng: 26.520 }] },
    { name: "University of Fort Hare", slug: "ufh", city: "Alice", province: "Eastern Cape", campuses: [{ name: "Alice Campus", address: "Alice", lat: -32.783, lng: 26.833 }] },
    { name: "University of Limpopo", slug: "ul", city: "Polokwane", province: "Limpopo", campuses: [{ name: "Turfloop Campus", address: "Mankweng", lat: -23.833, lng: 29.683 }] },
    { name: "University of Venda", slug: "univen", city: "Thohoyandou", province: "Limpopo", campuses: [{ name: "Main Campus", address: "Thohoyandou", lat: -22.979, lng: 30.444 }] },
    { name: "University of Zululand", slug: "unizulu", city: "KwaDlangezwa", province: "KwaZulu-Natal", campuses: [{ name: "KwaDlangezwa Campus", address: "KwaDlangezwa", lat: -28.852, lng: 31.746 }] },
    { name: "Walter Sisulu University", slug: "wsu", city: "Mthatha", province: "Eastern Cape", campuses: [{ name: "Nelson Mandela Drive", address: "Mthatha", lat: -31.588, lng: 28.784 }] },
    { name: "Sol Plaatje University", slug: "spu", city: "Kimberley", province: "Northern Cape", campuses: [{ name: "Central Campus", address: "Kimberley", lat: -28.738, lng: 24.762 }] },
    { name: "University of Mpumalanga", slug: "ump", city: "Mbombela", province: "Mpumalanga", campuses: [{ name: "Mbombela Campus", address: "Mbombela", lat: -25.475, lng: 30.969 }] },
    { name: "Mangosuthu University of Technology", slug: "mut", city: "Durban", province: "KwaZulu-Natal", campuses: [{ name: "Umlazi Campus", address: "Umlazi", lat: -29.973, lng: 30.888 }] },
    { name: "Vaal University of Technology", slug: "vut", city: "Vanderbijlpark", province: "Gauteng", campuses: [{ name: "Vanderbijlpark Campus", address: "Vanderbijlpark", lat: -26.708, lng: 27.833 }] },
    { name: "Central University of Technology", slug: "cut", city: "Bloemfontein", province: "Free State", campuses: [{ name: "Bloemfontein Campus", address: "Bloemfontein", lat: -29.116, lng: 26.213 }] },
    { name: "Sefako Makgatho Health Sciences University", slug: "smu", city: "Pretoria", province: "Gauteng", campuses: [{ name: "Ga-Rankuwa Campus", address: "Ga-Rankuwa", lat: -25.602, lng: 27.993 }] },
    { name: "UNISA", slug: "unisa", city: "Pretoria", province: "Gauteng", campuses: [{ name: "Muckleneuk Campus", address: "Pretoria", lat: -25.768, lng: 28.200 }] }
  ]

  // 3. Insert all universities
  for (const uni of universities) {
    await prisma.university.create({
      data: {
        name: uni.name,
        slug: uni.slug,
        city: uni.city,
        province: uni.province,
        campuses: {
          create: uni.campuses
        }
      }
    })
  }

  // 4. Add a couple of dummy properties to TUT and UCT so the site isn't empty
  const tut = await prisma.university.findUnique({ where: { slug: 'tut' }, include: { campuses: true } })
  const uct = await prisma.university.findUnique({ where: { slug: 'uct' }, include: { campuses: true } })

  if (tut) {
    await prisma.property.create({
      data: {
        campusId: tut.campuses[0].id,
        name: "The Lofts Student Res",
        description: "Modern student living right next to campus. Includes WiFi and backup power.",
        price: 4500,
        gender: "MIXED",
        imageUrl: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"
      }
    })
  }

  if (uct) {
    await prisma.property.create({
      data: {
        campusId: uct.campuses[0].id,
        name: "Rondebosch Luxury Apartments",
        description: "Premium student apartments with mountain views.",
        price: 8500,
        gender: "MIXED",
        imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
      }
    })
  }

  console.log('✅ ALL 26 South African Universities loaded successfully!')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())