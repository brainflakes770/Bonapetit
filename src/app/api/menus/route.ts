import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const menus = await prisma.shabbatMenu.findMany({
      include: {
        dishes: {
          include: {
            dish: {
              include: {
                category: true,
                subCategory: true
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json(menus)
  } catch (error) {
    console.error('Error fetching menus:', error)
    return NextResponse.json(
      { error: 'שגיאה בטעינת התפריטים' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { date, isEvening, dishes } = body

    // יצירת תפריט חדש עם המנות שנבחרו
    const menu = await prisma.shabbatMenu.create({
      data: {
        date: new Date(date),
        isEvening,
        dishes: {
          create: dishes.map((dishId: string) => ({
            dishId
          }))
        }
      },
      include: {
        dishes: {
          include: {
            dish: true
          }
        }
      }
    })

    // עדכון תאריך ההכנה האחרון לכל המנות בתפריט
    await Promise.all(
      dishes.map((dishId: string) =>
        prisma.dish.update({
          where: { id: dishId },
          data: {
            lastPrepared: new Date(date),
            weeksSince: 0
          }
        })
      )
    )

    return NextResponse.json(menu)
  } catch (error) {
    console.error('Error creating menu:', error)
    return NextResponse.json(
      { error: 'שגיאה ביצירת תפריט חדש' },
      { status: 500 }
    )
  }
} 