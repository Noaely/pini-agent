import Anthropic from '@anthropic-ai/sdk'
import express from 'express'
import cors from 'cors'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { exec } from 'child_process'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { randomUUID } from 'crypto'

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env') })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const dataDir = join(__dirname, '..', 'data')

const app = express()
app.use(cors())
app.use(express.json())

// ─── DATA HELPERS ───────────────────────────────────────────────
function readJSON(file, fallback) {
  const path = join(dataDir, file)
  if (!existsSync(path)) return fallback
  try { return JSON.parse(readFileSync(path, 'utf-8')) } catch { return fallback }
}

function writeJSON(file, data) {
  writeFileSync(join(dataDir, file), JSON.stringify(data, null, 2), 'utf-8')
}

// ─── LOAD CORE DATA ─────────────────────────────────────────────
let menu, scraperDiscounts

try {
  menu = JSON.parse(readFileSync(join(dataDir, 'meatown_menu.json'), 'utf-8'))
  scraperDiscounts = JSON.parse(readFileSync(join(dataDir, 'meatown_discounts.json'), 'utf-8'))
  console.log(`Loaded menu: ${menu.categories.reduce((s, c) => s + c.items.length, 0)} items`)
  console.log(`Loaded discounts: ${scraperDiscounts.discounts.length} active`)
} catch (error) {
  console.error('Error loading data files:', error.message)
  process.exit(1)
}

// ─── SYSTEM PROMPT BUILDER ──────────────────────────────────────
function buildSystemPrompt() {
  const customDiscounts = readJSON('custom_discounts.json', { discounts: [] }).discounts
  const customProducts  = readJSON('custom_products.json',  { products: [] }).products
  const customAnswers   = readJSON('custom_answers.json',   { answers: [] }).answers

  const allDiscounts = [...scraperDiscounts.discounts, ...customDiscounts]

  const categoriesSummary = menu.categories.map(c => `- ${c.name}: ${c.items.length} פריטים`).join('\n')
  const discountsSummary  = allDiscounts.map(d => {
    const prods = d.applicable_products?.slice(0, 3).map(p => p.name).join(', ') || ''
    return `- ${d.title} (על: ${prods}${(d.applicable_products?.length ?? 0) > 3 ? '...' : ''})`
  }).join('\n')

  const answersSummary = customAnswers.length
    ? '\n\nתשובות מוכנות:\n' + customAnswers.map(a => `שאלה: ${a.trigger}\nתשובה: ${a.answer}`).join('\n\n')
    : ''

  const customProductsSection = customProducts.length
    ? '\n\nמוצרים נוספים שנוספו ידנית:\n' + JSON.stringify(customProducts, null, 2)
    : ''

  return `אתה עוזר מכירות של Meattown.

התפקיד שלך: לעזור ללקוחות למצוא מוצרים, לבדוק מחירים, להמליץ על הנחות ולעבד הזמנות.

קטגוריות בתפריט:
${categoriesSummary}

הנחות פעילות:
${discountsSummary}

מטבע: ₪ (שקלים)

התפריט המלא:
${JSON.stringify(menu.categories, null, 2)}

ההנחות המלאות:
${JSON.stringify(allDiscounts, null, 2)}
${customProductsSection}${answersSummary}

הוראות:
1. ענה בעברית
2. עזור ללקוחות למצוא מוצרים, לבדוק מחירים, ולהמליץ על הנחות רלוונטיות
3. כשלקוח מזמין, חשב את הסכום הכולל כולל הנחות אם רלוונטי
4. אם הלקוח הזמין מוצר שיש עליו הנחה תציע לו את ההנחה
5. היה ידידותי ומקצועי
6. המחירים הם לקילוגרם אלא אם צוין אחרת`
}

const client = new Anthropic()

// WhatsApp sessions
const whatsappSessions = new Map()
setInterval(() => {
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
  for (const [phone, session] of whatsappSessions.entries()) {
    if (session.lastActivity < oneDayAgo) whatsappSessions.delete(phone)
  }
}, 60 * 60 * 1000)

async function sendWhatsAppMessage(chatId, text) {
  const instanceId = process.env.GREEN_API_INSTANCE_ID
  const token = process.env.GREEN_API_TOKEN
  if (!instanceId || !token) return false
  try {
    const url = `https://api.green-api.com/waInstance${instanceId}/sendMessage/${token}`
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, message: text })
    })
    return true
  } catch { return false }
}

async function handleWhatsAppMessage(chatId, messageText) {
  let session = whatsappSessions.get(chatId)
  if (!session) { session = { messages: [], lastActivity: Date.now() }; whatsappSessions.set(chatId, session) }
  session.messages.push({ role: 'user', content: messageText })
  session.lastActivity = Date.now()
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: buildSystemPrompt(),
      messages: session.messages
    })
    const msg = response.content[0].text
    session.messages.push({ role: 'assistant', content: msg })
    return msg
  } catch { return 'מצטער, נתקלתי בבעיה. אנא נסה שוב.' }
}

// ─── EXISTING ENDPOINTS ─────────────────────────────────────────

app.get('/api/store-info', (req, res) => {
  res.json({
    name: menu.store_name,
    totalItems: menu.categories.reduce((s, c) => s + c.items.length, 0),
    categories: menu.categories.length,
    activeDiscounts: scraperDiscounts.discounts.length,
  })
})

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: buildSystemPrompt(),
      messages,
    })
    res.json({ content: response.content[0].text })
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/webhook/whatsapp', async (req, res) => {
  try {
    const webhook = req.body
    if (webhook.typeWebhook === 'incomingMessageReceived') {
      const md = webhook.messageData
      if (md.typeMessage === 'textMessage') {
        const chatId = webhook.senderData?.chatId
        const messageText = md.textMessageData?.textMessage
        if (chatId && messageText) {
          const response = await handleWhatsAppMessage(chatId, messageText)
          await sendWhatsAppMessage(chatId, response)
        }
      }
    }
    res.status(200).json({ status: 'ok' })
  } catch (error) {
    res.status(200).json({ status: 'error', message: error.message })
  }
})

// ─── ADMIN: ANALYTICS ───────────────────────────────────────────

app.get('/api/admin/analytics', (req, res) => {
  const { events } = readJSON('analytics.json', { events: [] })

  const conversations = events.filter(e => e.type === 'conversation_started').length
  const orders = events.filter(e => e.type === 'order_closed').length
  const revenue = events.filter(e => e.type === 'order_closed').reduce((s, e) => s + (e.amount || 0), 0)

  const monthlyMap = {}
  const revenueMap = {}
  const MONTHS = ['ינו׳', 'פבר׳', 'מרץ', 'אפר׳', 'מאי', 'יוני', 'יולי', 'אוג׳', 'ספט׳', 'אוק׳', 'נוב׳', 'דצמ׳']

  events.forEach(e => {
    const d = new Date(e.timestamp)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const month = MONTHS[d.getMonth()]
    if (!monthlyMap[key]) monthlyMap[key] = { month, conversations: 0, orders: 0 }
    if (!revenueMap[key]) revenueMap[key] = { month, revenue: 0 }
    if (e.type === 'conversation_started') monthlyMap[key].conversations++
    if (e.type === 'order_closed') { monthlyMap[key].orders++; revenueMap[key].revenue += e.amount || 0 }
  })

  res.json({
    kpi: { conversations, orders, revenue },
    monthly: Object.values(monthlyMap),
    revenueByMonth: Object.values(revenueMap),
  })
})

app.post('/api/analytics/event', (req, res) => {
  const data = readJSON('analytics.json', { events: [] })
  data.events.push({ ...req.body, timestamp: new Date().toISOString() })
  writeJSON('analytics.json', data)
  res.json({ ok: true })
})

// ─── ADMIN: CHAT EXAMPLES ───────────────────────────────────────

app.get('/api/admin/chat-examples', (req, res) => {
  res.json(readJSON('chat_examples.json', { examples: [] }))
})

app.post('/api/admin/chat-examples', (req, res) => {
  const data = readJSON('chat_examples.json', { examples: [] })
  const item = { id: randomUUID(), ...req.body }
  data.examples.push(item)
  writeJSON('chat_examples.json', data)
  res.json(item)
})

app.put('/api/admin/chat-examples/:id', (req, res) => {
  const data = readJSON('chat_examples.json', { examples: [] })
  const idx = data.examples.findIndex(e => e.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  data.examples[idx] = { ...data.examples[idx], ...req.body }
  writeJSON('chat_examples.json', data)
  res.json(data.examples[idx])
})

app.delete('/api/admin/chat-examples/:id', (req, res) => {
  const data = readJSON('chat_examples.json', { examples: [] })
  data.examples = data.examples.filter(e => e.id !== req.params.id)
  writeJSON('chat_examples.json', data)
  res.json({ ok: true })
})

// ─── ADMIN: CUSTOM ANSWERS ──────────────────────────────────────

app.get('/api/admin/custom-answers', (req, res) => {
  res.json(readJSON('custom_answers.json', { answers: [] }))
})

app.post('/api/admin/custom-answers', (req, res) => {
  const data = readJSON('custom_answers.json', { answers: [] })
  const item = { id: randomUUID(), ...req.body }
  data.answers.push(item)
  writeJSON('custom_answers.json', data)
  res.json(item)
})

app.put('/api/admin/custom-answers/:id', (req, res) => {
  const data = readJSON('custom_answers.json', { answers: [] })
  const idx = data.answers.findIndex(a => a.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  data.answers[idx] = { ...data.answers[idx], ...req.body }
  writeJSON('custom_answers.json', data)
  res.json(data.answers[idx])
})

app.delete('/api/admin/custom-answers/:id', (req, res) => {
  const data = readJSON('custom_answers.json', { answers: [] })
  data.answers = data.answers.filter(a => a.id !== req.params.id)
  writeJSON('custom_answers.json', data)
  res.json({ ok: true })
})

// ─── ADMIN: SYNC ────────────────────────────────────────────────

let syncStatus = 'idle'

app.post('/api/admin/sync', (req, res) => {
  syncStatus = 'running'
  const rootDir = join(__dirname, '..')
  const cmd = `cd "${rootDir}" && python3 scrape_json.py && python3 scrape_discounts.py`

  exec(cmd, (error, stdout, stderr) => {
    const logData = readJSON('sync_log.json', { log: [] })
    if (error) {
      syncStatus = 'error'
      logData.log.push({ timestamp: new Date().toISOString(), status: 'error', message: stderr?.slice(0, 200) || error.message })
    } else {
      syncStatus = 'idle'
      // Reload scraped data
      try {
        scraperDiscounts = JSON.parse(readFileSync(join(dataDir, 'meatown_discounts.json'), 'utf-8'))
        menu = JSON.parse(readFileSync(join(dataDir, 'meatown_menu.json'), 'utf-8'))
      } catch {}
      logData.log.push({ timestamp: new Date().toISOString(), status: 'success', message: 'סנכרון הושלם בהצלחה' })
    }
    writeJSON('sync_log.json', logData)
  })

  res.json({ status: 'started' })
})

app.get('/api/admin/sync/status', (req, res) => {
  const { log } = readJSON('sync_log.json', { log: [] })
  const lastSync = log.filter(l => l.status === 'success').at(-1)?.timestamp || null
  res.json({ status: syncStatus, log, lastSync })
})

// ─── ADMIN: DISCOUNTS ────────────────────────────────────────────

app.get('/api/admin/discounts', (req, res) => {
  const custom = readJSON('custom_discounts.json', { discounts: [] }).discounts
  res.json({ scraped: scraperDiscounts.discounts, custom })
})

app.post('/api/admin/discounts', (req, res) => {
  const data = readJSON('custom_discounts.json', { discounts: [] })
  const item = { id: randomUUID(), source: 'custom', ...req.body }
  data.discounts.push(item)
  writeJSON('custom_discounts.json', data)
  res.json(item)
})

app.put('/api/admin/discounts/:id', (req, res) => {
  const data = readJSON('custom_discounts.json', { discounts: [] })
  const idx = data.discounts.findIndex(d => d.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  data.discounts[idx] = { ...data.discounts[idx], ...req.body }
  writeJSON('custom_discounts.json', data)
  res.json(data.discounts[idx])
})

app.delete('/api/admin/discounts/:id', (req, res) => {
  const data = readJSON('custom_discounts.json', { discounts: [] })
  data.discounts = data.discounts.filter(d => d.id !== req.params.id)
  writeJSON('custom_discounts.json', data)
  res.json({ ok: true })
})

// ─── ADMIN: PRODUCTS ────────────────────────────────────────────

app.get('/api/admin/products', (req, res) => {
  const scraped = menu.categories.flatMap(cat =>
    cat.items.map(item => ({ ...item, category: cat.name, source: 'scraped' }))
  )
  const custom = readJSON('custom_products.json', { products: [] }).products.map(p => ({ ...p, source: 'custom' }))
  res.json({ products: [...scraped, ...custom] })
})

app.post('/api/admin/products', (req, res) => {
  const data = readJSON('custom_products.json', { products: [] })
  const item = { id: randomUUID(), source: 'custom', ...req.body }
  data.products.push(item)
  writeJSON('custom_products.json', data)
  res.json(item)
})

app.put('/api/admin/products/:id', (req, res) => {
  const data = readJSON('custom_products.json', { products: [] })
  const idx = data.products.findIndex(p => p.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  data.products[idx] = { ...data.products[idx], ...req.body }
  writeJSON('custom_products.json', data)
  res.json(data.products[idx])
})

app.delete('/api/admin/products/:id', (req, res) => {
  const data = readJSON('custom_products.json', { products: [] })
  data.products = data.products.filter(p => p.id !== req.params.id)
  writeJSON('custom_products.json', data)
  res.json({ ok: true })
})

// ─── ADMIN: WHATSAPP SETTINGS ───────────────────────────────────

async function greenAPI(path) {
  const instanceId = process.env.GREEN_API_INSTANCE_ID
  const token = process.env.GREEN_API_TOKEN
  const subdomain = String(instanceId).slice(0, 4)
  const r = await fetch(`https://${subdomain}.api.greenapi.com/waInstance${instanceId}/${path}/${token}`)
  const text = await r.text()
  return text ? JSON.parse(text) : {}
}

app.get('/api/admin/whatsapp/status', async (req, res) => {
  try {
    const data = await greenAPI('getStateInstance')
    console.log('[WhatsApp] status:', data)
    res.json(data)
  } catch (e) {
    console.error('[WhatsApp] status error:', e.message)
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/admin/whatsapp/qr', async (req, res) => {
  try {
    const data = await greenAPI('getQR')
    console.log('[WhatsApp] qr:', data.type ?? '(empty)')
    res.json(data)
  } catch (e) {
    console.error('[WhatsApp] qr error:', e.message)
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/admin/whatsapp/logout', async (req, res) => {
  try {
    const data = await greenAPI('logout')
    console.log('[WhatsApp] logout:', data)
    res.json({ isLogout: true, ...data })
  } catch (e) {
    console.error('[WhatsApp] logout error:', e.message)
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/admin/whatsapp/reboot', async (req, res) => {
  try {
    const data = await greenAPI('reboot')
    console.log('[WhatsApp] reboot:', data)
    res.json({ isReboot: true, ...data })
  } catch (e) {
    console.error('[WhatsApp] reboot error:', e.message)
    res.status(500).json({ error: e.message })
  }
})

// ─── START ───────────────────────────────────────────────────────

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
