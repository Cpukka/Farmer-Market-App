const fs = require('fs').promises
const path = require('path')
const { createCanvas } = require('canvas')

async function createDirectory(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true })
  } catch (err) {
    // Directory already exists
  }
}

function createPlaceholderImage(width, height, text, bgColor, textColor) {
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  
  // Background
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, width, height)
  
  // Text
  ctx.fillStyle = textColor
  ctx.font = 'bold 24px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, width / 2, height / 2)
  
  return canvas.toBuffer('image/jpeg')
}

async function generatePlaceholders() {
  console.log('Generating placeholder images...')
  
  const directories = [
    'public/images/farmers',
    'public/images/products', 
    'public/images/avatars',
    'public/images/team',
    'public/images/logos'
  ]
  
  // Create directories
  for (const dir of directories) {
    await createDirectory(dir)
  }
  
  // Farmer images (400x300)
  const farmers = [
    { name: 'farm1', text: 'Green Valley Farm' },
    { name: 'farm2', text: 'Sunny Meadows' },
    { name: 'farm3', text: 'Heritage Farm' },
    { name: 'farm4', text: 'Mountain View' },
    { name: 'farm5', text: 'River Bend' },
    { name: 'farm6', text: 'Prairie Harvest' },
    { name: 'banner1', text: 'Farm Banner 1' },
    { name: 'banner2', text: 'Farm Banner 2' }
  ]
  
  // Product images (300x300)
  const products = [
    'tomatoes', 'eggs', 'honey', 'beef', 'kale', 'milk', 
    'apples', 'chicken', 'carrots', 'greens', 'basil', 
    'garlic', 'cherry-tomatoes', 'tomatoes2'
  ]
  
  // Avatar images (200x200)
  const avatars = [
    'default', 'sarah', 'michael', 'david', 'emma'
  ]
  
  // Team images (200x200)
  const team = [
    'sarah', 'michael', 'emma', 'david'
  ]
  
  // Generate farmer images
  for (const farmer of farmers) {
    const buffer = createPlaceholderImage(
      400, 300, 
      farmer.text, 
      '#4ade80', // Green background
      '#ffffff'  // White text
    )
    await fs.writeFile(`public/images/farmers/${farmer.name}.jpg`, buffer)
    console.log(`Created: public/images/farmers/${farmer.name}.jpg`)
  }
  
  // Generate product images
  for (const product of products) {
    const buffer = createPlaceholderImage(
      300, 300,
      product.replace('-', ' ').toUpperCase(),
      '#fbbf24', // Yellow background
      '#000000'  // Black text
    )
    await fs.writeFile(`public/images/products/${product}.jpg`, buffer)
    console.log(`Created: public/images/products/${product}.jpg`)
  }
  
  // Generate avatar images
  for (const avatar of avatars) {
    const buffer = createPlaceholderImage(
      200, 200,
      avatar === 'default' ? 'USER' : avatar.charAt(0).toUpperCase(),
      '#3b82f6', // Blue background
      '#ffffff'  // White text
    )
    await fs.writeFile(`public/images/avatars/${avatar}.jpg`, buffer)
    console.log(`Created: public/images/avatars/${avatar}.jpg`)
  }
  
  // Generate team images
  for (const member of team) {
    const buffer = createPlaceholderImage(
      200, 200,
      member.charAt(0).toUpperCase(),
      '#8b5cf6', // Purple background
      '#ffffff'  // White text
    )
    await fs.writeFile(`public/images/team/${member}.jpg`, buffer)
    console.log(`Created: public/images/team/${member}.jpg`)
  }
  
  // Generate logo
  const logoBuffer = createPlaceholderImage(
    200, 200,
    'FARM\nCONNECT',
    '#10b981', // Emerald background
    '#ffffff'  // White text
  )
  await fs.writeFile('public/images/logos/logo.png', logoBuffer)
  console.log('Created: public/images/logos/logo.png')
  
  console.log('\n✅ All placeholder images generated successfully!')
}

// Run the script
generatePlaceholders().catch(console.error)