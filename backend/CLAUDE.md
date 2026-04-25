# Backend – הקצביה של פיני

## תפקידך

אתה מתכנת בקאנד בכיר. **אחראי על ה-Express server, לוגיקת העסק, Green API (WhatsApp), ו-Claude AI.**
הפרויקט הוא שירות לקוחות אוטומטי לקצביות קטנות.

---

## מהות הפרויקט

### מה זה?
אוטומציה של שירות לקוחות לקצביות דרך **WhatsApp**. לקוח שולח הודעה → Claude מבין → עונה ומעבד הזמנה.

### מה הלקוח יכול לעשות?
1. **לברר מחירים** – "כמה עולה קילו אנטריקוט?"
2. **לשאול על מבצעים** – "יש מבצעים היום?"
3. **לבנות תפריט** – "בנה לי תפריט ל-10 אנשים ב-₪1,000"
4. **לבצע הזמנה** – משלוח או איסוף עצמי

### תהליך הזמנה
```
לקוח בוחר מוצרים
    ↓
שואל משלוח או איסוף עצמי?
    ↓
[משלוח]                    [איסוף עצמי]
שם + טלפון                 שם + טלפון
כתובת מלאה                 תאריך (לא יותר מ-3 ימים קדימה)
טווח שעות מועדף            שעה מועדפת (לפי שעות פתיחה)
    ↓                           ↓
שולח סיכום הזמנה מלא:
- פירוט מוצרים + מחירים
- חיסכון ממבצעים (אם יש)
- משלוח: זמן הגעה משוער
- איסוף: כתובת + שעה
    ↓
[[ORDER_COMPLETE:{"amount":NNN}]]  ← סמן פנימי לאנליטיקס
```

**שעות פתיחה:**
- א׳–ה׳: 07:00–20:00
- שישי: 07:00–14:00

**עלות משלוח:** ₪35 (לכל אזור המרכז)

---

## Stack

| כלי | תפקיד |
|-----|-------|
| Node.js 18+ ESM | Runtime |
| Express 4 | HTTP server (port 3001) |
| `@anthropic-ai/sdk` | Claude AI (claude-sonnet-4-20250514) |
| Green API | WhatsApp Business integration |
| `node-fetch` | HTTP calls ל-Green API |
| `dotenv` | משתני סביבה |
| Python 3 | Scrapers (`scrape_json.py`, `scrape_discounts.py`) |

---

## איך להריץ את הפרויקט

### דרישות מקדימות
1. Node.js 18+
2. Python 3.9+
3. חשבון ngrok (לחשיפת localhost ל-webhook של Green API)

### שלבי הרצה

**שלב 1: התקנת תלויות**
```bash
npm install
```

**שלב 2: הגדרת משתני סביבה**
צור קובץ `.env` בתיקיית `backend/`:
```
GREEN_API_INSTANCE_ID=<instance_id>
GREEN_API_TOKEN=<token>
ANTHROPIC_API_KEY=<api_key>
```

**שלב 3: הפעלת ngrok**
פתח טרמינל חדש והפעל:
```bash
ngrok http 3001
```
שמור את ה-URL שngrok יוצר (למשל: `https://abc123.ngrok.io`)

**שלב 4: הגדרת Webhook ב-Green API**
הגדר את ה-webhook URL ב-Green API ל:
```
https://your-ngrok-url.ngrok.io/api/webhook/whatsapp
```

**שלב 5: הפעלת השרת**
בטרמינל נפרד, מתיקיית הפרויקט (root):
```bash
npm start
```

השרת יעלה על `http://localhost:3001`

### לסיכום - 2 טרמינלים צריכים להיות פעילים:
1. **טרמינל 1:** `ngrok http 3001` (חשיפת localhost)
2. **טרמינל 2:** `npm start` (הפעלת השרת)

---

## Green API – חיבור WhatsApp

### מה זה Green API?
שירות שמחבר בין WhatsApp Business לבין קוד Node.js. כל הודעה WhatsApp → webhook → Express → Claude.

### משתני סביבה נדרשים (`.env`)
```
GREEN_API_INSTANCE_ID=<id>
GREEN_API_TOKEN=<token>
ANTHROPIC_API_KEY=<key>
```

### URL פורמט
```
https://{id_first4}.api.greenapi.com/waInstance{id}/{method}/{token}
```

### Methods חשובים
| Method | תיאור |
|--------|-------|
| `qr` | מחזיר QR code כ-JSON `{ type, message }` |
| `getStateInstance` | סטטוס: `authorized` / `notAuthorized` |
| `getWaSettings` | פרטי החשבון כולל `phone` |
| `logout` | ניתוק מספר |
| `sendMessage` | שליחת הודעה |

### Webhook
Green API שולח POST ל-`/api/webhook/whatsapp` לכל הודעה נכנסת.

---

## אדריכלות נתונים

כל הנתונים שמורים בקבצי JSON (ב-`data/`). **אין מסד נתונים חיצוני.**

```
backend/data/
├── meatown_menu.json        # קטלוג מוצרים (מ-scraper, קריאה בלבד)
├── meatown_discounts.json   # מבצעים מהאתר (מ-scraper)
├── custom_products.json     # מוצרים שנוספו ידנית
├── custom_discounts.json    # מבצעים מותאמים
├── custom_answers.json      # תשובות מוכנות ל-Claude
├── chat_examples.json       # דוגמאות צ'אט לפאנל אדמין
├── analytics.json           # אירועי orders + conversations
└── sync_log.json            # לוג הרצות scrapers
```

---

## עקרונות ביצועים – חשוב מאוד!

הלקוחות ב-WhatsApp מצפים לתגובה תוך **שניות**. כל עיכוב פוגע בחוויה.

1. **buildSystemPrompt()** – קורא קבצי JSON בכל קריאת chat. מקובל לפרויקט הזה בגודלו.
2. **לא לחסום את event loop** – כל פעולות I/O חייבות להיות async.
3. **WhatsApp sessions** – שמורות ב-Map עם פינוי אוטומטי לאחר 24 שעות.
4. **Scraper** מורץ ב-`child_process.exec` – לא חוסם את השרת.
5. **טיימאות** – Green API calls יכולים להאט; תמיד wrap ב-try/catch.

---

## מבנה קבצים

```
backend/
├── server.js          # כל הלוגיקה (endpoints + WhatsApp + Claude)
├── data/              # JSON data files
├── config/
│   └── agent.json
├── scrape_json.py     # Scraper תפריט מיטאון
├── scrape_discounts.py # Scraper מבצעים
├── .env               # משתני סביבה (לא ב-git)
└── package.json
```

---

## Endpoints – רשימה מלאה

### Chat
| Method | Path | תיאור |
|--------|------|-------|
| POST | `/api/chat` | צ'אט web UI |
| POST | `/api/webhook/whatsapp` | Webhook מ-Green API |

### Analytics
| Method | Path | תיאור |
|--------|------|-------|
| GET | `/api/admin/analytics` | KPI + גרפים + טבלת לקוחות |
| POST | `/api/analytics/event` | רישום אירוע |

**תוכן התשובה מ-`/api/admin/analytics`:**
```json
{
  "kpi": {
    "conversations": 13,      // סה״כ שיחות שהתחילו
    "orders": 6,              // סה״כ הזמנות שנסגרו
    "revenue": 2910,          // סה״כ הכנסות (₪)
    "conversionRate": 46.2,   // אחוז המרה
    "newCustomers": 1         // לקוחות חדשים מהחודש האחרון
  },
  "revenueByDate": [          // הכנסות לפי תאריכים (כל 3 ימים)
    { "date": "1 אפר", "amount": 450 },
    { "date": "4 אפר", "amount": 620 },
    ...
  ],
  "salesByCategory": [        // פילוח מכירות לפי קטגוריה
    { "name": "בקר טרי", "value": 1550 },
    { "name": "עוף", "value": 820 },
    { "name": "כבש", "value": 540 }
  ],
  "customerTable": [          // טבלת לקוחות עם סטטוסים
    {
      "name": "יוסי כהן",
      "phone": "972501234568",
      "status": "הזמנה נסגרה",
      "lastActivity": "2026-01-22T14:45:00Z"
    },
    ...
  ],
  "monthly": [...],           // תאימות לאחור - נתונים חודשיים
  "revenueByMonth": [...]     // תאימות לאחור - הכנסות חודשיות
}
```

**מבנה אירועים ב-`analytics.json`:**
- `conversation_started` – שיחה חדשה התחילה (שומר `phone`)
- `order_closed` – הזמנה נסגרה (שומר `amount`, `phone`, `customerName`, `categories`)

**מבנה לקוחות ב-`analytics.json`:**
```json
{
  "phone": "972501234568",
  "name": "יוסי כהן",
  "status": "order_completed|waiting|no_response",
  "lastActivity": "2026-01-22T14:45:00Z"
}
```

### Admin – Products
| Method | Path | תיאור |
|--------|------|-------|
| GET | `/api/admin/products` | כל המוצרים (scraped + custom) |
| POST | `/api/admin/products` | הוסף מוצר ידני |
| PUT | `/api/admin/products/:id` | עדכן מוצר ידני |
| DELETE | `/api/admin/products/:id` | מחק מוצר ידני |

### Admin – Discounts
| Method | Path | תיאור |
|--------|------|-------|
| GET | `/api/admin/discounts` | כל המבצעים |
| POST | `/api/admin/discounts` | הוסף מבצע |
| PUT | `/api/admin/discounts/:id` | עדכן מבצע |
| DELETE | `/api/admin/discounts/:id` | מחק מבצע |

### Admin – Sync
| Method | Path | תיאור |
|--------|------|-------|
| POST | `/api/admin/sync` | הפעל scrapers |
| GET | `/api/admin/sync/status` | סטטוס + לוג |

### Admin – WhatsApp
| Method | Path | תיאור |
|--------|------|-------|
| GET | `/api/admin/whatsapp/status` | סטטוס + phone |
| GET | `/api/admin/whatsapp/qr` | QR code base64 |
| POST | `/api/admin/whatsapp/logout` | ניתוק |
| POST | `/api/admin/whatsapp/reboot` | אתחול instance |

---

## Claude System Prompt

`buildSystemPrompt()` בונה prompt דינמי שכולל:
1. קטלוג מוצרים מלא (JSON)
2. מבצעים פעילים (scraped + custom)
3. מוצרים מותאמים
4. תשובות מוכנות (`custom_answers.json`)
5. הוראות תהליך הזמנה מפורטות

**מודל:** `claude-sonnet-4-20250514` | **max_tokens:** 2048

---

## אבטחה

- לא לחשוף `ANTHROPIC_API_KEY` או `GREEN_API_TOKEN` ל-frontend
- ה-`.env` **לא** נכנס ל-git
- CORS מוגדר עבור dev; בפרודקשן לצמצם ל-origin ספציפי
