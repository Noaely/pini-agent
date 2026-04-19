import Anthropic from '@anthropic-ai/sdk'
import express from 'express'
import cors from 'cors'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())

// Load data files
const menuPath = join(__dirname, '..', 'data', 'meatown_menu.json')
const discountsPath = join(__dirname, '..', 'data', 'meatown_discounts.json')

let menu, discounts

try {
  menu = JSON.parse(readFileSync(menuPath, 'utf-8'))
  discounts = JSON.parse(readFileSync(discountsPath, 'utf-8'))
  console.log(`Loaded menu: ${menu.categories.reduce((sum, c) => sum + c.items.length, 0)} items`)
  console.log(`Loaded discounts: ${discounts.discounts.length} active`)
} catch (error) {
  console.error('Error loading data files:', error.message)
  process.exit(1)
}

// Build system prompt with real data
const categoriesSummary = menu.categories.map(c => `- ${c.name}: ${c.items.length} פריטים`).join('\n')
const discountsSummary = discounts.discounts.map(d => {
  const products = d.applicable_products.slice(0, 3).map(p => p.name).join(', ')
  return `- ${d.title} (על: ${products}${d.applicable_products.length > 3 ? '...' : ''})`
}).join('\n')

const SYSTEM_PROMPT = `אתה עוזר מכירות של פנחס הקצב.

התפקיד שלך: לעזור ללקוחות למצוא מוצרים, לבדוק מחירים, להמליץ על הנחות ולעבד הזמנות.

קטגוריות בתפריט:
${categoriesSummary}

הנחות פעילות:
${discountsSummary}

מטבע: ₪ (שקלים)

התפריט המלא:
${JSON.stringify(menu.categories, null, 2)}

ההנחות המלאות:
${JSON.stringify(discounts.discounts, null, 2)}

הוראות:
1. ענה בעברית
2. עזור ללקוחות למצוא מוצרים, לבדוק מחירים, ולהמליץ על הנחות רלוונטיות
3. כשלקוח מזמין, חשב את הסכום הכולל כולל הנחות אם רלוונטי
4. אם הלקוח הזמין מוצר שיש עליו הנחה תציע לו את ההנחה
5. היה ידידותי ומקצועי
6. המחירים הם לקילוגרם אלא אם צוין אחרת`

const client = new Anthropic()

// Endpoint to get store info
app.get('/api/store-info', (req, res) => {
  res.json({
    name: menu.store_name,
    totalItems: menu.categories.reduce((sum, c) => sum + c.items.length, 0),
    categories: menu.categories.length,
    activeDiscounts: discounts.discounts.length
  })
})

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: messages
    })

    res.json({ content: response.content[0].text })
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: error.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
