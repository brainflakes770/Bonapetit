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
  weeksSince: number
}

export default function Dishes() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [dishes, setDishes] = useState<Dish[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dishesRes, categoriesRes] = await Promise.all([
          fetch('/api/dishes'),
          fetch('/api/categories')
        ])

        if (!dishesRes.ok || !categoriesRes.ok) {
          throw new Error('שגיאה בטעינת הנתונים')
        }

        const [dishesData, categoriesData] = await Promise.all([
          dishesRes.json(),
          categoriesRes.json()
        ])

        setDishes(dishesData)
        setCategories(categoriesData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'שגיאה בטעינת הנתונים')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredDishes = selectedCategory === 'all'
    ? dishes
    : dishes.filter(dish => dish.category.id === selectedCategory)

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
            <h1 className="text-3xl font-bold text-gray-900">בנק המתכונים</h1>
            <Link 
              href="/dishes/new" 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              הוספת מתכון חדש
            </Link>
          </div>

          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              סינון לפי קטגוריה
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">הכל</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredDishes.map((dish) => (
                <li key={dish.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{dish.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {dish.category.name} {dish.subCategory ? `- ${dish.subCategory.name}` : ''}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        לא הוכן {dish.weeksSince} שבועות
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
} 