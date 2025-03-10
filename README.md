# בון א פטיט - מערכת לתכנון תפריטי שבת

מערכת לניהול ותכנון תפריטי שבת, המאפשרת:
- ניהול בנק מתכונים מסודר לפי קטגוריות
- מעקב אחרי תדירות ההכנה של כל מתכון
- יצירת תפריט שבת אוטומטי המתעדף מנות שלא הוכנו זמן רב
- שמירת היסטוריית תפריטים

## דרישות מערכת

- Node.js 18 ומעלה
- PostgreSQL 12 ומעלה
- npm או yarn

## התקנה

1. התקנת PostgreSQL:
   - הורד והתקן את PostgreSQL מהאתר הרשמי: https://www.postgresql.org/download/
   - במהלך ההתקנה:
     - בחר בפורט 5432 (ברירת המחדל)
     - הגדר סיסמה למשתמש postgres
     - השאר את שאר האפשרויות כברירת מחדל
   - לאחר ההתקנה:
     - הפעל את pgAdmin (מנהל מסד הנתונים הגרפי)
     - צור מסד נתונים חדש בשם `bonapetit`

2. התקנת dependencies:
```bash
npm install
```

3. הגדרת מסד הנתונים:
   - העתק את הקובץ `.env.example` ל-`.env`
   - עדכן את הפרטים בקובץ `.env`:
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/bonapetit"
```
   החלף את `YOUR_PASSWORD` בסיסמה שהגדרת בהתקנת PostgreSQL

4. יצירת טבלאות במסד הנתונים:
```bash
npx prisma migrate dev
```

5. אתחול נתונים ראשוניים:
```bash
npx prisma db seed
```

## הפעלה

הפעלת הפרויקט בסביבת פיתוח:
```bash
npm run dev
```

הפרויקט יהיה זמין בכתובת: [http://localhost:3000](http://localhost:3000)

## טכנולוגיות

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
