import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // שליפת כל המנות עם החישוב של מספר השבועות מאז ההכנה האחרונה
    const dishes = await prisma.dish.findMany({
      include: {
        category: true,
        subCategory: true
      }
    })

    const dishesWithWeeks = dishes.map(dish => {
      const weeksSince = dish.lastPrepared
        ? Math.floor((new Date().getTime() - dish.lastPrepared.getTime()) / (1000 * 60 * 60 * 24 * 7))
        : dish.weeksSince
      return { ...dish, weeksSince }
    })

    // מיון המנות לפי קטגוריות
    const mainDishes = dishesWithWeeks
      .filter(dish => dish.category.name === 'מנות עיקריות')
      .sort((a, b) => b.weeksSince - a.weeksSince)
      .slice(0, 4) // 2 מנות לכל סעודה

    const sides = dishesWithWeeks
      .filter(dish => dish.category.name === 'תוספות' && dish.subCategory)
      .sort((a, b) => b.weeksSince - a.weeksSince)
      .slice(0, 4) // 2 תוספות לכל סעודה

    const vegetables = dishesWithWeeks
      .filter(dish => dish.category.name === 'תוספות' && !dish.subCategory)
      .sort((a, b) => b.weeksSince - a.weeksSince)
      .slice(0, 2) // ירק אחד לכל סעודה

    // חלוקת המנות לסעודות
    const suggestions = {
      evening: {
        mainDishes: mainDishes.slice(0, 2),
        sides: sides.slice(0, 2),
        vegetables: [vegetables[0]]
      },
      morning: {
        mainDishes: mainDishes.slice(2, 4),
        sides: sides.slice(2, 4),
        vegetables: [vegetables[1]]
      }
    }

    return NextResponse.json(suggestions)
  } catch (error) {
    console.error('Error generating menu suggestions:', error)
    return NextResponse.json(
      { error: 'שגיאה בהצעת מנות לתפריט' },
      { status: 500 }
    )
  }
} 