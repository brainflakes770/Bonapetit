import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // יצירת קטגוריות ראשיות
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'מרקים'
      }
    }),
    prisma.category.create({
      data: {
        name: 'דגים'
      }
    }),
    prisma.category.create({
      data: {
        name: 'סלטים'
      }
    }),
    prisma.category.create({
      data: {
        name: 'מנות עיקריות',
        subCategories: {
          create: [
            { name: 'עוף' },
            { name: 'בשר' },
            { name: 'צמחוני' }
          ]
        }
      }
    }),
    prisma.category.create({
      data: {
        name: 'תוספות',
        subCategories: {
          create: [
            { name: 'תפוחי אדמה' },
            { name: 'אורז' },
            { name: 'פסטה' }
          ]
        }
      }
    }),
    prisma.category.create({
      data: {
        name: 'קינוחים'
      }
    })
  ])

  // מציאת הקטגוריות ותתי-הקטגוריות
  const mainDishesCategory = categories.find(c => c.name === 'מנות עיקריות')
  const sidesCategory = categories.find(c => c.name === 'תוספות')
  
  if (!mainDishesCategory || !sidesCategory) {
    throw new Error('לא נמצאו קטגוריות נדרשות')
  }

  const chickenSubCategory = await prisma.subCategory.findFirst({
    where: { name: 'עוף', categoryId: mainDishesCategory.id }
  })

  const meatSubCategory = await prisma.subCategory.findFirst({
    where: { name: 'בשר', categoryId: mainDishesCategory.id }
  })

  const potatoesSubCategory = await prisma.subCategory.findFirst({
    where: { name: 'תפוחי אדמה', categoryId: sidesCategory.id }
  })

  const riceSubCategory = await prisma.subCategory.findFirst({
    where: { name: 'אורז', categoryId: sidesCategory.id }
  })

  if (!chickenSubCategory || !meatSubCategory || !potatoesSubCategory || !riceSubCategory) {
    throw new Error('לא נמצאו תתי-קטגוריות נדרשות')
  }

  // יצירת מתכונים לדוגמה
  await Promise.all([
    // מנות עיקריות
    prisma.dish.create({
      data: {
        name: 'עוף בתנור',
        categoryId: mainDishesCategory.id,
        subCategoryId: chickenSubCategory.id
      }
    }),
    prisma.dish.create({
      data: {
        name: 'שניצל',
        categoryId: mainDishesCategory.id,
        subCategoryId: chickenSubCategory.id
      }
    }),
    prisma.dish.create({
      data: {
        name: 'קציצות בקר',
        categoryId: mainDishesCategory.id,
        subCategoryId: meatSubCategory.id
      }
    }),
    // תוספות
    prisma.dish.create({
      data: {
        name: 'תפוחי אדמה בתנור',
        categoryId: sidesCategory.id,
        subCategoryId: potatoesSubCategory.id
      }
    }),
    prisma.dish.create({
      data: {
        name: 'אורז לבן',
        categoryId: sidesCategory.id,
        subCategoryId: riceSubCategory.id
      }
    }),
    prisma.dish.create({
      data: {
        name: 'גזר בתנור',
        categoryId: sidesCategory.id
      }
    })
  ])

  console.log('נתונים ראשוניים נוצרו בהצלחה')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 