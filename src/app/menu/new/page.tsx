'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Category = {
  id: string
  name: string
}

type SubCategory = {
  id: string
  name: string
}

type Dish = {
  id: string
  name: string
  category: Category
  subCategory?: SubCategory
  weeksSince: number
}

type MenuSection = {
  mainDishes: Dish[]
  sides: Dish[]
  vegetables: Dish[]
}

type ShabbatMenu = {
  evening: MenuSection
  morning: MenuSection
}

export default function NewMenu() {
  const router = useRouter()
  const [menu, setMenu] = useState<ShabbatMenu>({
    evening: {
      mainDishes: [],
      sides: [],
      vegetables: []
    },
    morning: {
      mainDishes: [],
      sides: [],
      vegetables: []
    }
  })
  const [error, setError] = useState<string | null>(null)

  const generateRandomMenu = async () => {
    try {
      const res = await fetch('/api/menus/suggestions')
      if (!res.ok) {
        throw new Error('שגיאה בקבלת הצעות לתפריט')
      }
      const suggestions = await res.json()
      setMenu(suggestions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בקבלת הצעות לתפריט')
    }
  }

  const handleSave = async () => {
    try {
      // יצירת רשימת מנות לסעודת ערב שבת
      const eveningDishes = [
        ...menu.evening.mainDishes.map(dish => dish.id),
        ...menu.evening.sides.map(dish => dish.id),
        ...menu.evening.vegetables.map(dish => dish.id)
      ]

      // יצירת רשימת מנות לסעודת בוקר שבת
      const morningDishes = [
        ...menu.morning.mainDishes.map(dish => dish.id),
        ...menu.morning.sides.map(dish => dish.id),
        ...menu.morning.vegetables.map(dish => dish.id)
      ]

      // שמירת שתי הסעודות
      await Promise.all([
        fetch('/api/menus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: new Date(),
            isEvening: true,
            dishes: eveningDishes
          }),
        }),
        fetch('/api/menus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: new Date(),
            isEvening: false,
            dishes: morningDishes
          }),
        })
      ])

      router.push('/menu/history')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בשמירת התפריט')
    }
  }

  const MenuSection = ({ title, section }: { title: string, section: MenuSection }) => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">מנות עיקריות</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {section.mainDishes.map(dish => dish.name).join(', ') || 'לא נבחר'}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">תוספות</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {section.sides.map(dish => dish.name).join(', ') || 'לא נבחר'}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">ירקות</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {section.vegetables.map(dish => dish.name).join(', ') || 'לא נבחר'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">תכנון תפריט שבת</h1>
            <button
              onClick={generateRandomMenu}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              יצירת תפריט אוטומטי
            </button>
          </div>

          <MenuSection title="סעודת ליל שבת" section={menu.evening} />
          <MenuSection title="סעודת שבת בבוקר" section={menu.morning} />

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => router.back()}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ביטול
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              שמירת התפריט
            </button>
          </div>
        </div>
      </main>
    </div>
  )
} 