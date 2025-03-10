import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const dishes = await prisma.dish.findMany({
      include: {
        category: true,
        subCategory: true
      }
    })

    // חישוב מספר השבועות מאז ההכנה האחרונה
    const dishesWithWeeks = dishes.map(dish => {
      const weeksSince = dish.lastPrepared
        ? Math.floor((new Date().getTime() - dish.lastPrepared.getTime()) / (1000 * 60 * 60 * 24 * 7))
        : dish.weeksSince
      return { ...dish, weeksSince }
    })

    return NextResponse.json(dishesWithWeeks)
  } catch (error) {
    console.error('Error fetching dishes:', error)
    return NextResponse.json(
      { error: 'שגיאה בטעינת המתכונים' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, categoryId, subCategoryId } = body

    const dish = await prisma.dish.create({
      data: {
        name,
        categoryId,
        subCategoryId: subCategoryId || undefined,
        weeksSince: 0
      },
      include: {
        category: true,
        subCategory: true
      }
    })

    return NextResponse.json(dish)
  } catch (error) {
    console.error('Error creating dish:', error)
    return NextResponse.json(
      { error: 'שגיאה ביצירת מתכון חדש' },
      { status: 500 }
    )
  }
} 