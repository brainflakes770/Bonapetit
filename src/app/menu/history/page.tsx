'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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
}

type DishPreparation = {
  id: string
  dish: Dish
}

type ShabbatMenu = {
  id: string
  date: string
  isEvening: boolean
  dishes: DishPreparation[]
}

type MenuSection = {
  mainDishes: Dish[]
  sides: Dish[]
  vegetables: Dish[]
}

type FormattedMenu = {
  id: string
  date: string
  evening: MenuSection
  morning: MenuSection
}

export default function MenuHistory() {
  const [menus, setMenus] = useState<FormattedMenu[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await fetch('/api/menus')
        if (!res.ok) {
          throw new Error('שגיאה בטעינת התפריטים')
        }
        const data: ShabbatMenu[] = await res.json()

        // ארגון התפריטים לפי תאריך
        const menusByDate = data.reduce<{ [key: string]: ShabbatMenu[] }>((acc, menu) => {
          const date = menu.date.split('T')[0]
          if (!acc[date]) {
            acc[date] = []
          }
          acc[date].push(menu)
          return acc
        }, {})

        // המרת התפריטים למבנה הנדרש
        const formattedMenus = Object.entries(menusByDate).map(([date, menus]) => {
          const eveningMenu = menus.find(m => m.isEvening)
          const morningMenu = menus.find(m => !m.isEvening)

          const formatSection = (menu?: ShabbatMenu): MenuSection => ({
            mainDishes: menu?.dishes
              .filter(dp => dp.dish.category.name === 'מנות עיקריות')
              .map(dp => dp.dish) || [],
            sides: menu?.dishes
              .filter(dp => dp.dish.category.name === 'תוספות' && dp.dish.subCategory)
              .map(dp => dp.dish) || [],
            vegetables: menu?.dishes
              .filter(dp => dp.dish.category.name === 'תוספות' && !dp.dish.subCategory)
              .map(dp => dp.dish) || []
          })

          return {
            id: eveningMenu?.id || morningMenu?.id || date,
            date,
            evening: formatSection(eveningMenu),
            morning: formatSection(morningMenu)
          }
        })

        setMenus(formattedMenus)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'שגיאה בטעינת התפריטים')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMenus()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('he-IL', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  const MenuSection = ({ title, section }: { title: string, section: MenuSection }) => (
    <div className="border-t border-gray-200 pt-4">
      <h4 className="text-lg font-medium text-gray-900 mb-2">{title}</h4>
      <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-medium text-gray-500">מנות עיקריות</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {section.mainDishes.map(dish => dish.name).join(', ')}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">תוספות</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {section.sides.map(dish => dish.name).join(', ')}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">ירקות</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {section.vegetables.map(dish => dish.name).join(', ')}
          </dd>
        </div>
      </dl>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">טוען...</div>
      </div>
    )
  }

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
            <h1 className="text-3xl font-bold text-gray-900">היסטוריית תפריטים</h1>
            <Link 
              href="/menu/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              יצירת תפריט חדש
            </Link>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {menus.map((menu) => (
                <li key={menu.id} className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    שבת {formatDate(menu.date)}
                  </h3>
                  <MenuSection title="סעודת ליל שבת" section={menu.evening} />
                  <MenuSection title="סעודת שבת בבוקר" section={menu.morning} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
} 