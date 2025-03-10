import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">בון א פטיט</h1>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/dishes" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
              <div className="px-4 py-5 sm:p-6 text-center">
                <h3 className="text-lg font-medium text-gray-900">בנק המתכונים</h3>
                <p className="mt-2 text-sm text-gray-500">ניהול והוספת מתכונים חדשים</p>
              </div>
            </Link>
            
            <Link href="/menu/new" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
              <div className="px-4 py-5 sm:p-6 text-center">
                <h3 className="text-lg font-medium text-gray-900">תכנון תפריט שבת</h3>
                <p className="mt-2 text-sm text-gray-500">יצירת תפריט חדש לשבת הקרובה</p>
              </div>
            </Link>
            
            <Link href="/menu/history" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
              <div className="px-4 py-5 sm:p-6 text-center">
                <h3 className="text-lg font-medium text-gray-900">היסטוריית תפריטים</h3>
                <p className="mt-2 text-sm text-gray-500">צפייה בתפריטים קודמים</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
