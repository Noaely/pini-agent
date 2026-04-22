# Meattown – תיעוד פיתוח

## סקירת הפרויקט

אפליקציית ווב עבור "הקצביה של פיני" – צ'אטבוט מבוסס Claude AI לסיוע ללקוחות בבחירת מוצרים, חישוב תפריטים ומתן מידע על מבצעים. האפליקציה כוללת שני מצבים: **פאנל צ'אט** (ממשק לקוח) ו**פאנל אדמין** (ניהול).

---

## ארכיטקטורה כללית

```
butcher-pini/
├── ui/                        # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx            # Root – מנהל מעבר בין Admin ו-Chat
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── ChatPanel.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   ├── Message.jsx
│   │   │   └── admin/         # כל רכיבי פאנל האדמין (חדש)
│   │   ├── hooks/
│   │   │   └── useChat.js
│   │   └── App.css
│   └── server.js              # Express + Claude API + WhatsApp
├── scrape_discounts.py        # סקריפר מבצעים
├── scrape_json.py             # סקריפר תפריט
├── data/
│   ├── meatown_menu.json      # קטלוג מוצרים
│   └── meatown_discounts.json # מבצעים פעילים
└── config/agent.json
```

**Stack:** React 18, Vite 5, Express 4, Claude `claude-sonnet-4-20250514`, Green API (WhatsApp).

---

## כללי כתיבת קוד

- **Tailwind CSS בכל מקום שאפשר** – להשתמש ב-utility classes של Tailwind לכל layout, spacing, colors, typography, flex/grid.
- **אסור `style={}`** – לא להשתמש ב-inline styles אלא אם הערך הוא דינמי לחלוטין (חישוב runtime, SVG computed values, צבעים מ-props).
- CSS classes ב-`App.css` – רק לדברים שאי אפשר לבטא ב-Tailwind (animations מורכבות, pseudo-elements).
- צבעים מהדיזיין סיסטם זמינים ב-Tailwind: `bg-primary`, `text-t2`, `border-border`, `bg-surface` וכו׳ (ראה `tailwind.config.js`).

---

## עיצוב ופלטת צבעים

### עקרונות עיצוב

הממשק מבוסס על סגנון **SaaS Dashboard מודרני** (בהשראת התמונה המצורפת):

| משתנה | ערך |
|-------|-----|
| `--color-primary` | `#6C5CE7` (סגול עיקרי) |
| `--color-primary-light` | `#A29BFE` (סגול בהיר) |
| `--color-primary-dark` | `#5A4BD1` (סגול כהה – hover) |
| `--color-background` | `#F0EFFF` (רקע לבנדר בהיר) |
| `--color-surface` | `#FFFFFF` (כרטיסים) |
| `--color-text-primary` | `#2D3436` |
| `--color-text-secondary` | `#636E72` |
| `--color-success` | `#00B894` |
| `--color-danger` | `#D63031` |
| `--color-border` | `#E8E8F8` |

### כללי עיצוב

- כל הממשק **RTL** (מימין לשמאל) בעברית מלאה
- גופן: `Assistant` (Google Fonts) – תומך עברית מעולה
- פינות מעוגלות: `border-radius: 12px` לכרטיסים, `8px` לכפתורים
- צל כרטיסים: `box-shadow: 0 2px 12px rgba(108, 92, 231, 0.08)`
- אנימציות מעבר: `transition: all 0.2s ease`
- Sidebar קבועה ברוחב 220px

---

## מיתוג ראשי (Header)

- לוגו: 🥩 **הקצביה של פיני**
- כפתורי מעבר בHeader: **"לוח בקרה"** | **"צ'אט"**
- הכפתור הפעיל מקבל רקע `--color-primary` וטקסט לבן
- אייקון משתמש (Admin) בפינה שמאלית עליונה

---

## פאנל צ'אט (ללא שינויים בלוגיקה)

הצ'אט קיים ופועל. **אין לשנות את הלוגיקה**, רק להתאים עיצוב:

- רקע הצ'אט: `--color-background`
- בועות הודעות:
  - לקוח: `--color-primary` + טקסט לבן, צד שמאל (RTL)
  - סוכן: `--color-surface` + גבול `--color-border`, צד ימין (RTL)
- אינדיקטור טעינה (typing): שלוש נקודות בצבע `--color-primary-light`
- שדה קלט: פינות מעוגלות, גבול `--color-primary` בפוקוס
- כפתור שליחה: `--color-primary` עם hover ל-`--color-primary-dark`

### קבצים רלוונטיים לצ'אט
- `ui/src/components/ChatPanel.jsx`
- `ui/src/components/ChatInput.jsx`
- `ui/src/components/Message.jsx`
- `ui/src/hooks/useChat.js`
- `ui/server.js` – endpoint `POST /api/chat`

---

## פאנל אדמין

### ניווט (Sidebar)

Sidebar ימנית (RTL) עם קטגוריות:

**תפריט**
- 📊 לוח בקרה (Dashboard)
- 💬 דוגמאות צ'אט
- 📝 תשובות לדוגמה
- 🔄 סנכרון מוצרים
- 🏷️ ניהול מבצעים
- 🥩 ניהול מוצרים

**מערכת**
- ⚙️ הגדרות

---

### 1. לוח בקרה (Dashboard)

#### כרטיסי KPI (שורה עליונה)
ארבעה כרטיסי סטטיסטיקה:

| כרטיס | מדד | אייקון |
|-------|-----|--------|
| שיחות שהתחילו | מספר שיחות שנפתחו דרך הצ'אט | 💬 |
| הזמנות שנסגרו | מספר משתמשים שסגרו הזמנה | ✅ |
| הכנסות מהצ'אט | סכום כולל ב-₪ | 💰 |
| שיעור המרה | % שיחות → הזמנות | 📈 |

כל כרטיס מציג: ערך גדול, כיוון שינוי (↑/↓ עם צבע ירוק/אדום), ותווית תקופה.

#### גרפים

**גרף 1 – פעילות שיחות לאורך זמן** (Bar Chart):
- ציר X: חודשים / שבועות (בעברית)
- שני עמודות לכל תקופה: "שיחות שנפתחו" (סגול) ו"הזמנות שנסגרו" (ירוק)
- כותרת: "פעילות שיחות"
- מסנן: "החודש" / "השנה"

**גרף 2 – הכנסות מהצ'אט לאורך זמן** (Line Chart):
- ציר X: תאריכים
- ציר Y: ₪
- צבע קו: `--color-primary`

**גרף 3 – מבצעים פופולריים** (Donut/Pie):
- פילוח לפי קטגוריות (בקר, עוף, כבש וכו')
- מיקום: צד שמאל של הדשבורד

#### אחסון נתוני אנליטיקס
- הוסף endpoint `POST /api/analytics/event` לשמירת אירועים:
  - `conversation_started` – כשמשתמש פותח שיחה
  - `order_closed` – כשמשתמש מאשר הזמנה (זיהוי מתוך תשובת הצ'אט)
  - `revenue` – סכום הזמנה בשקלים
- שמור ב-`data/analytics.json` (מערך אירועים עם timestamp)

---

### 2. דוגמאות צ'אט

**מטרה:** הצגת שאלות/בקשות לדוגמה שהצ'אט יודע לטפל בהן, לעזור למנהל לראות מה הצ'אט מסוגל לעשות.

#### ממשק
- רשימת "כרטיסי דוגמה" – כל כרטיס מכיל:
  - **כותרת:** למשל "תפריט ל-10 אנשים ב-1,000 ₪"
  - **בקשה לדוגמה:** הטקסט שנשלח לצ'אט
  - **כפתור "נסה":** פותח את פאנל הצ'אט ומזין את הבקשה אוטומטית
  - **כפתור "ערוך":** מאפשר לשנות את הבקשה

- כפתור **"הוסף דוגמה"** (+ כחול/סגול) בראש הדף

#### דוגמאות ברירת מחדל לטעון
```json
[
  {
    "title": "תפריט ל-10 אנשים ב-1,000 ₪",
    "prompt": "בנה לי תפריט לאירוע של 10 אנשים עם תקציב של 1000 שקל"
  },
  {
    "title": "מה המבצעים היום?",
    "prompt": "אילו מבצעים יש היום?"
  },
  {
    "title": "כמה עולה קילו אנטריקוט?",
    "prompt": "מה המחיר של אנטריקוט לקילו?"
  },
  {
    "title": "המלצה לבשר לצלייה",
    "prompt": "תמליץ לי על נתחים לצלייה על האש לשישה אנשים"
  }
]
```

#### שמירה
- `data/chat_examples.json` – מערך אובייקטים `{ id, title, prompt }`
- Endpoints:
  - `GET /api/admin/chat-examples`
  - `POST /api/admin/chat-examples`
  - `PUT /api/admin/chat-examples/:id`
  - `DELETE /api/admin/chat-examples/:id`

---

### 3. תשובות לדוגמה

**מטרה:** מאגר תשובות מוכנות שהאדמין יכול לערוך, שמשמשות כ"זיכרון" או "הנחיות נוספות" לצ'אט.

#### ממשק
- טבלה/רשימה של תשובות עם עמודות:
  - **קטגוריה** (למשל: "מחיר", "מבצעים", "הכנת בשר")
  - **שאלה/טריגר** (מה הלקוח שואל)
  - **תשובה מוכנה** (מה הצ'אט צריך לענות)
  - **פעולות:** ערוך / מחק

- כפתור **"הוסף תשובה"** בראש הדף
- חיפוש וסינון לפי קטגוריה

#### אינטגרציה עם הצ'אט
- הקובץ `data/custom_answers.json` נטען ב-`server.js` ומוזרק ל-system prompt:
  ```
  תשובות מוכנות שעליך להשתמש בהן כשרלוונטי:
  [רשימת תשובות מ-custom_answers.json]
  ```

#### Endpoints
- `GET /api/admin/custom-answers`
- `POST /api/admin/custom-answers`
- `PUT /api/admin/custom-answers/:id`
- `DELETE /api/admin/custom-answers/:id`

---

### 4. סנכרון מוצרים

**מטרה:** הרצת הסקריפרים מהממשק כדי לעדכן את קטלוג המוצרים והמבצעים.

#### ממשק
- כרטיס גדול עם:
  - **כותרת:** "סנכרון נתונים מהאתר"
  - **תיאור:** "לחץ לעדכון רשימת המוצרים והמבצעים ממתאון"
  - **כפתור "סנכרן עכשיו"** (סגול, גדול, עם אייקון 🔄)
  - **אחרון סנכרון:** תאריך ושעה של הסנכרון האחרון
  - **סטטוס:** "מעודכן" / "מסנכרן..." / "שגיאה"

- **לוג סנכרון:** רשימה של הרצות אחרונות עם סטטוס וזמן

#### Backend
- Endpoint `POST /api/admin/sync`:
  - מריץ `python3 scrape_json.py` ו-`python3 scrape_discounts.py` בתהליך ילד (`child_process.exec`)
  - מחזיר `{ status: "started" }`
  - Endpoint `GET /api/admin/sync/status` מחזיר סטטוס ולוג

- שמור `data/sync_log.json`:
  ```json
  [{ "timestamp": "ISO", "status": "success|error", "message": "..." }]
  ```

#### הגבלות
- הכפתור מושבת בזמן ריצה (spinner + "מסנכרן...")
- הצג שגיאות בעברית אם הסקריפר נכשל

---

### 5. ניהול מבצעים

**מטרה:** הצגה, הוספה ומחיקה של מבצעים – הן מהסקריפר והן מבצעים מותאמים אישית של האדמין.

#### ממשק

**טאב "מבצעים מהאתר"** (קריאה בלבד, מ-`meatown_discounts.json`):
- טבלה עם עמודות: שם מבצע, כמות, מינימום מוצרים, מוצרים רלוונטיים
- אייקון 🔒 מציין שאלו מבצעי סקריפר

**טאב "מבצעים מותאמים"** (עריכה מלאה):
- אותה טבלה + כפתורי ערוך/מחק
- כפתור **"הוסף מבצע"** פותח מודל עם שדות:

```
שם המבצע: [________]
תיאור:    [________]
מחיר מבצע (₪): [___]
מינימום מוצרים: [_]
מוצרים רלוונטיים: [multi-select מתוך קטלוג]
```

#### Data Model
```json
{
  "id": "uuid",
  "title": "4 קבב ב-200 ₪",
  "description": "",
  "amount": 200,
  "min_products": 4,
  "applicable_products": [{ "id": "507", "name": "...", "price": 55 }],
  "source": "admin"
}
```

#### Endpoints
- `GET /api/admin/discounts` – כל המבצעים (סקריפר + מותאמים)
- `POST /api/admin/discounts` – הוספת מבצע מותאם
- `PUT /api/admin/discounts/:id` – עדכון (רק מותאמים)
- `DELETE /api/admin/discounts/:id` – מחיקה (רק מותאמים)

#### אינטגרציה
- `server.js` ב-`/api/chat` טוען גם `data/meatown_discounts.json` וגם `data/custom_discounts.json` ומאחד אותם ל-system prompt.

---

### 6. ניהול מוצרים

**מטרה:** תצוגה מלאה של כל המוצרים שהצ'אט יודע עליהם, עם אפשרות לעריכה ידנית.

#### ממשק

- **סרגל חיפוש** (חפש לפי שם)
- **סינון לפי קטגוריה** (dropdown)
- **טבלה:**

| שם מוצר | קטגוריה | מחיר | יחידה | מקור | פעולות |
|---------|---------|------|-------|------|---------|
| רוסטביף אנטריקוט | בקר טרי | 200 ₪ | ק״ג | 🌐 סקריפר | 👁️ |
| נתח מותאם | בקר טרי | 150 ₪ | ק״ג | ✏️ ידני | ✏️ 🗑️ |

- מוצרי סקריפר: צפייה בלבד (אייקון 🔒)
- מוצרים ידניים: עריכה ומחיקה

- כפתור **"הוסף מוצר"** פותח מודל:

```
שם המוצר:   [________]
קטגוריה:    [dropdown / חדשה]
מחיר (₪):   [___]
יחידה:      [ק״ג / יח' / מנה]
```

#### Data Files
- `data/meatown_menu.json` – קריאה בלבד (מסקריפר)
- `data/custom_products.json` – מוצרים ידניים של האדמין

#### Endpoints
- `GET /api/admin/products` – כל המוצרים (מאוחד)
- `POST /api/admin/products` – הוסף מוצר ידני
- `PUT /api/admin/products/:id` – עדכן מוצר ידני
- `DELETE /api/admin/products/:id` – מחק מוצר ידני

#### אינטגרציה
- System prompt בצ'אט יכלול גם מוצרים מ-`custom_products.json`

---

## מבנה קבצים לפיתוח (חדשים)

```
ui/src/components/admin/
├── AdminLayout.jsx          # Layout עם Sidebar
├── Sidebar.jsx              # תפריט ניווט
├── Dashboard.jsx            # לוח בקרה + גרפים
├── ChatExamples.jsx         # דוגמאות צ'אט
├── CustomAnswers.jsx        # תשובות לדוגמה
├── SyncProducts.jsx         # סנכרון
├── DiscountManager.jsx      # ניהול מבצעים
├── ProductManager.jsx       # ניהול מוצרים
└── shared/
    ├── StatCard.jsx         # כרטיס KPI
    ├── DataTable.jsx        # טבלה משותפת
    └── Modal.jsx            # מודל הוספה/עריכה

data/
├── custom_discounts.json    # מבצעים ידניים
├── custom_products.json     # מוצרים ידניים
├── custom_answers.json      # תשובות מותאמות
├── chat_examples.json       # דוגמאות צ'אט
├── analytics.json           # אירועי אנליטיקס
└── sync_log.json            # לוג סנכרון
```

---

## מעבר בין פאנלים

- ב-`App.jsx` – state: `activePanel: 'chat' | 'admin'`
- Header מציג שני כפתורי toggle:
  - **"צ'אט"** → מציג `ChatPanel`
  - **"לוח בקרה"** → מציג `AdminLayout`
- ניווט בין פאנלים **לא מרענן את הדף** (client-side state)
- פאנל הצ'אט שומר על ה-state (היסטוריית שיחה) גם כשעוברים לאדמין

---

## כללי פיתוח

1. **הכל בעברית** – כל טקסט UI, הודעות שגיאה, placeholder, label
2. **RTL בכל מקום** – `dir="rtl"` על ה-root, margins/paddings מתאימים
3. **אין שינוי בלוגיקת הצ'אט** – רק עיצוב מותאם
4. **אין שינוי ב-WhatsApp webhook** – ממשיך לעבוד כרגיל
5. **אימות Admin** – לא נדרש בשלב זה (אין login)
6. **שמות עברים בקבצי JSON** – שמור כ-UTF-8
7. **טעינה** – כל קריאת API מציגה spinner בצבע `--color-primary`
8. **שגיאות** – הצג toast notification בעברית (אדום עם טקסט)
