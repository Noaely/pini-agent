# Frontend – הקצביה של פיני

## תפקידך

אתה מתכנת פרונטאנד בכיר. **אחראי בלעדית על ממשק המשתמש** – כל מה שהמשתמש רואה ומרגיש. הפרויקט הוא פאנל ניהול + ממשק צ'אט לעסקי קצביה.

---

## Stack

| כלי | גרסה | שימוש |
|-----|------|-------|
| React | 18 | UI framework |
| Vite | 5 | Build tool + dev server |
| Tailwind CSS | 3 | Styling (utility-first) |
| Recharts | 2 | **כל הגרפים והתרשימים** |

---

## כללי קוד

- **Tailwind בכל מקום** – אסור `style={}` אלא לערכים דינמיים לחלוטין (SVG computed, אנימציות runtime)
- **Recharts** – שימוש ב-Recharts לכל תצוגת נתונים: `AreaChart`, `BarChart`, `LineChart`, `PieChart`, `RadialBarChart`
- **RTL מלא** – כל הממשק עברית, `dir="rtl"`
- **אין תרגומים לאנגלית בממשק** – כל טקסט UI בעברית
- CSS ב-`App.css` רק לאנימציות מורכבות ו-pseudo-elements שאי אפשר ב-Tailwind

---

## עיצוב – Dark Dashboard

### מקור ההשראה
ממשק בסגנון **Dark SaaS Dashboard** עם רקע כהה, גרדיאנטים סגולים, ו-accent טורקיז/ציאן.

### פלטת צבעים

| משתנה CSS | ערך | שימוש |
|-----------|-----|-------|
| `--bg-base` | `#0F0E27` | רקע ראשי |
| `--bg-surface` | `#1A1835` | כרטיסים |
| `--bg-elevated` | `#252246` | hover states, modals |
| `--primary` | `#7C5CBF` | כפתורים, active states |
| `--primary-light` | `#9B7EE8` | hover |
| `--accent` | `#00D4D4` | highlights, charts line |
| `--accent-alt` | `#06B6D4` | secondary accent |
| `--success` | `#22C55E` | ירוק חיובי |
| `--danger` | `#EF4444` | אדום שגיאה |
| `--text-primary` | `#FFFFFF` | טקסט ראשי |
| `--text-secondary` | `#9B9BBB` | טקסט משני |
| `--border` | `#2D2B52` | גבולות כרטיסים |

### כללי עיצוב

- **רקע**: `bg-[#0F0E27]` על ה-root
- **כרטיסים**: `bg-[#1A1835] border border-[#2D2B52] rounded-2xl`
- **צל כרטיסים**: `shadow-[0_4px_24px_rgba(124,92,191,0.12)]`
- **כפתור ראשי**: `bg-[#7C5CBF] hover:bg-[#9B7EE8] text-white rounded-xl`
- **Sidebar**: `bg-[#13122C] border-r border-[#2D2B52]`
- **טקסט ראשי**: `text-white`
- **טקסט משני**: `text-[#9B9BBB]`
- **אנימציות**: `transition-all duration-200`
- **פינות**: `rounded-2xl` לכרטיסים, `rounded-xl` לכפתורים

### KPI Cards
כל כרטיס סטטיסטיקה:
```jsx
<div className="bg-[#1A1835] border border-[#2D2B52] rounded-2xl p-5">
  <div className="flex items-center justify-between mb-3">
    <span className="text-[#9B9BBB] text-sm">כותרת</span>
    <div className="w-10 h-10 rounded-xl bg-[#252246] flex items-center justify-center">
      {icon}
    </div>
  </div>
  <p className="text-3xl font-bold text-white">{value}</p>
  <p className="text-xs text-[#22C55E] mt-1">↑ 18% מהחודש שעבר</p>
</div>
```

### Recharts – צבעי גרפים
```js
const CHART_COLORS = {
  primary:  '#7C5CBF',
  accent:   '#00D4D4',
  success:  '#22C55E',
  warning:  '#F59E0B',
  danger:   '#EF4444',
  purple2:  '#9B7EE8',
}
```

ב-Recharts:
- `<CartesianGrid strokeDasharray="3 3" stroke="#2D2B52" />`
- `<XAxis tick={{ fill: '#9B9BBB', fontSize: 12 }} axisLine={false} />`
- `<YAxis tick={{ fill: '#9B9BBB', fontSize: 12 }} axisLine={false} />`
- `<Tooltip contentStyle={{ background: '#252246', border: '1px solid #2D2B52', borderRadius: 12 }} />`
- `<Area fill="url(#areaGradient)" stroke="#00D4D4" />`

---

## מבנה קבצים

```
frontend/
├── src/
│   ├── App.jsx              # Root – מעבר Chat ↔ Admin
│   ├── App.css              # אנימציות בלבד
│   ├── main.jsx
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── ChatPanel.jsx
│   │   ├── ChatInput.jsx
│   │   ├── Message.jsx
│   │   └── admin/
│   │       ├── AdminLayout.jsx
│   │       ├── Sidebar.jsx
│   │       ├── Dashboard.jsx     ← Recharts כאן
│   │       ├── Settings.jsx
│   │       ├── SyncProducts.jsx
│   │       ├── ChatExamples.jsx
│   │       ├── CustomAnswers.jsx
│   │       ├── DiscountManager.jsx
│   │       ├── ProductManager.jsx
│   │       └── shared/
│   │           ├── StatCard.jsx
│   │           ├── DataTable.jsx
│   │           ├── Modal.jsx
│   │           └── Toast.jsx
│   └── hooks/
│       └── useChat.js
├── public/
│   └── logo.png
├── index.html
├── vite.config.js           # proxy /api → localhost:3001
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## לוח הבקרה (Dashboard) – דרישות ופירוט

### רכיבי Dashboard

לוח הבקרה מציג מידע אנליטי ומדדי ביצועים של שירות הלקוחות.

#### 1. מדדי KPI (שורה עליונה)

**סה"כ הכנסות מהצ'אט** – כרטיס KPI גדול
- מציג את סכום ההכנסות הכולל מהזמנות שנסגרו דרך הצ'אט
- עיצוב: כמו התמונה שצורפה

**שיעור המרה** – כרטיס KPI
- אחוז הלקוחות שהתחילו שיחה וסגרו הזמנה
- חישוב: `(הזמנות שנסגרו / שיחות שנפתחו) * 100`
- עיצוב: כמו התמונה שצורפה

**הזמנות שנסגרו** – כרטיס KPI
- מספר ההזמנות שהושלמו בהצלחה
- עיצוב: כמו התמונה שצורפה

**לקוחות חדשים** – כרטיס KPI
- מספר הלקוחות הייחודיים שפתחו שיחה לראשונה בחודש האחרון
- עיצוב: כמו התמונה שצורפה

#### 2. גרפים

**הכנסות בחודש האחרון** – Area Chart
- **ציר X**: תאריכים (כל 3 ימים)
- **ציר Y**: סכום הכנסות (₪)
- **סגנון**: גרדיאנט סגול-טורקיז, נקודות בולטות כל 3 ימים
- **רכיב Recharts**: `<AreaChart>`
- **נתונים**: מסכם הזמנות לפי תאריכים (מקובצים לכל 3 ימים)

**פילוח מכירות לפי קטגוריה** – Pie Chart
- **קטגוריות**: הקטגוריות של המוצרים מהאתר (בקר, עוף, כבש, חזיר וכו')
- **ערכים**: סכום מכירות לפי קטגוריה
- **צבעים**: פלטת צבעים כהה בהתאם לעיצוב הכללי
- **רכיב Recharts**: `<PieChart>`
- **תצוגה**: עם אחוזים + labels

#### 3. טבלת לקוחות (Customer Table)

בתחתית דף הDashboard, טבלה מפורטת של כל הלקוחות:

| עמודה | תיאור |
|-------|-------|
| **שם** | שם הלקוח (אם סיפק) |
| **מספר טלפון** | מספר הטלפון של הלקוח מ-WhatsApp |
| **סטטוס** | אחד מהבאים: |

**סטטוסים אפשריים:**
- 🟡 **מחכה לתשובה** – שיחה פעילה, לקוח שלח הודעה ועדיין לא קיבל תשובה סופית
- 🟢 **הזמנה נסגרה** – הזמנה הושלמה בהצלחה
- 🔴 **אין מענה** – שיחה נסגרה בגלל חוסר מענה מהלקוח

**עיצוב הטבלה:**
- רקע כהה `bg-[#1A1835]`
- גבול `border-[#2D2B52]`
- כל שורה עם `hover:bg-[#252246]`
- סטטוס עם נקודה צבעונית + טקסט
- RTL מלא

### דוגמת שימוש ב-Recharts

```jsx
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// הכנסות לפי תאריך
const revenueData = [
  { date: '1 אפר', amount: 2400 },
  { date: '4 אפר', amount: 1398 },
  { date: '7 אפר', amount: 9800 },
  // ...
];

<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={revenueData}>
    <defs>
      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#7C5CBF" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#00D4D4" stopOpacity={0}/>
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" stroke="#2D2B52" />
    <XAxis dataKey="date" tick={{ fill: '#9B9BBB', fontSize: 12 }} axisLine={false} />
    <YAxis tick={{ fill: '#9B9BBB', fontSize: 12 }} axisLine={false} />
    <Tooltip contentStyle={{ background: '#252246', border: '1px solid #2D2B52', borderRadius: 12 }} />
    <Area type="monotone" dataKey="amount" stroke="#00D4D4" fillOpacity={1} fill="url(#colorAmount)" />
  </AreaChart>
</ResponsiveContainer>
```

---

## Backend API

הפרונטאנד מדבר עם ה-backend דרך proxy ב-Vite (`/api/*` → `localhost:3001`).

### Endpoints עיקריים
| Method | Path | תיאור |
|--------|------|-------|
| POST | `/api/chat` | שליחת הודעת צ'אט |
| GET | `/api/admin/analytics` | נתוני KPI וגרפים |
| GET | `/api/admin/products` | כל המוצרים |
| GET | `/api/admin/discounts` | כל המבצעים |
| POST | `/api/admin/sync` | הפעלת סנכרון |
| GET | `/api/admin/whatsapp/status` | סטטוס WhatsApp + phone |
| GET | `/api/admin/whatsapp/qr` | QR code (base64) |

---

## כללים נוספים

1. **שמור על לוגיקת הצ'אט** – אין לשנות `useChat.js` או `ChatPanel.jsx` לוגיקה, רק עיצוב
2. **Spinner**: `<span className="spinner" />` – מוגדר ב-App.css
3. **Toast**: השתמש ב-`shared/Toast.jsx` לכל הודעות success/error
4. **לא ליצור קבצי CSS נוספים** – רק App.css לחריגים
