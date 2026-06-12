import "dotenv/config"
import { PrismaClient } from "../app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import bcrypt from "bcryptjs"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Starting database seeding...")

  try {
    // Clear existing data
    await prisma.review.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.cartItem.deleteMany()
    await prisma.cart.deleteMany()
    await prisma.product.deleteMany()
    await prisma.farmer.deleteMany()
    await prisma.account.deleteMany()
    await prisma.session.deleteMany()
    await prisma.verificationToken.deleteMany()
    await prisma.user.deleteMany()

    console.log("✅ Cleared existing data")

    // Create users
    const hashedPassword = await bcrypt.hash("password123", 10)

    const customer = await prisma.user.create({
      data: {
        email: "customer@example.com",
        name: "John Customer",
        password: hashedPassword,
        role: "CUSTOMER",
      },
    })

    const farmerUser = await prisma.user.create({
      data: {
        email: "farmer@example.com",
        name: "Sarah Farmer",
        password: hashedPassword,
        role: "FARMER",
      },
    })

    const admin = await prisma.user.create({
      data: {
        email: "admin@example.com",
        name: "Admin User",
        password: hashedPassword,
        role: "ADMIN",
      },
    })

    console.log("✅ Created users")

    // Create farmers
    const greenValley = await prisma.farmer.create({
      data: {
        userId: farmerUser.id,
        farmName: "Green Valley Farm",
        description: "Organic vegetables and fruits grown with sustainable practices",
        location: "Springfield, CA",
        latitude: 37.7749,
        longitude: -122.4194,
        rating: 4.8,
        totalSales: 150,
        image: "/images/farmers/farm1.jpg",
        bannerImage: "/images/farmers/banner1.jpg",
      },
    })

    const sunnyMeadows = await prisma.farmer.create({
      data: {
        userId: farmerUser.id,
        farmName: "Sunny Meadows",
        description: "Fresh dairy products and free-range eggs",
        location: "Riverside, TX",
        latitude: 33.9534,
        longitude: -117.3962,
        rating: 4.9,
        totalSales: 89,
        image: "/images/farmers/farm2.jpg",
        bannerImage: "/images/farmers/banner2.jpg",
      },
    })

    console.log("✅ Created farmers")

    // Create products
    const products = await prisma.product.createMany({
      data: [
        {
          name: "Organic Tomatoes",
          description: "Fresh, ripe organic tomatoes",
          price: 3.99,
          unit: "lb",
          category: "Vegetables",
          stock: 50,
          images: ["/images/products/tomatoes.jpg"],
          farmerId: greenValley.id,
        },
        {
          name: "Fresh Eggs",
          description: "Free-range chicken eggs",
          price: 5.99,
          unit: "dozen",
          category: "Dairy & Eggs",
          stock: 30,
          images: ["/images/products/eggs.jpg"],
          farmerId: sunnyMeadows.id,
        },
        {
          name: "Honey Jar",
          description: "Pure, raw local honey",
          price: 12.99,
          unit: "16oz",
          category: "Sweeteners",
          stock: 20,
          images: ["/images/products/honey.jpg"],
          farmerId: sunnyMeadows.id,
        },
        {
          name: "Grass-fed Beef",
          description: "Premium grass-fed beef steaks",
          price: 24.99,
          unit: "lb",
          category: "Meat",
          stock: 15,
          images: ["/images/products/beef.jpg"],
          farmerId: greenValley.id,
        },
      ],
    })

    console.log("✅ Created products")

    // Create reviews
    const tomatoProduct = await prisma.product.findFirst({
      where: { name: "Organic Tomatoes" },
    })

    if (tomatoProduct) {
      await prisma.review.create({
        data: {
          userId: customer.id,
          productId: tomatoProduct.id,
          rating: 5,
          comment: "Best tomatoes I've ever had!",
        },
      })
    }

    console.log("✅ Created reviews")

    console.log("🎉 Database seeding completed!")
  } catch (error) {
    console.error("❌ Error during seeding:", error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })