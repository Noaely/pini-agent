import anthropic
import json
import os

# Check for API key
if not os.environ.get("ANTHROPIC_API_KEY"):
    print("ERROR: ANTHROPIC_API_KEY environment variable not set")
    print("Run: export ANTHROPIC_API_KEY='your-api-key'")
    exit(1)

# Load agent config
with open("config/agent.json", "r", encoding="utf-8") as f:
    config = json.load(f)

# Load menu data
with open("data/meatown_menu.json", "r", encoding="utf-8") as f:
    menu = json.load(f)

# Load discounts data
with open("data/meatown_discounts.json", "r", encoding="utf-8") as f:
    discounts = json.load(f)

client = anthropic.Anthropic()

# Build categories summary for system prompt
categories_summary = []
for cat in menu['categories']:
    item_count = len(cat['items'])
    categories_summary.append(f"- {cat['name']}: {item_count} פריטים")

# Build discounts summary
discounts_summary = []
for d in discounts['discounts']:
    products = ", ".join([p['name'] for p in d['applicable_products'][:3]])
    if len(d['applicable_products']) > 3:
        products += "..."
    discounts_summary.append(f"- {d['title']} (על: {products})")

# System prompt with store context
system_prompt = f"""אתה {config['agent_name']}, עוזר מכירות של {config['store_info']['name']}.

התפקיד שלך: {config['goals']['description']}

היכולות שלך:
{chr(10).join(f'- {cap}' for cap in config['capabilities'])}

קטגוריות בתפריט:
{chr(10).join(categories_summary)}

הנחות פעילות:
{chr(10).join(discounts_summary)}

מטבע: ₪ (שקלים)

התפריט המלא:
{json.dumps(menu['categories'], ensure_ascii=False, indent=2)}

ההנחות המלאות:
{json.dumps(discounts['discounts'], ensure_ascii=False, indent=2)}

הוראות:
1. ענה בעברית
2. עזור ללקוחות למצוא מוצרים, לבדוק מחירים, ולהמליץ על הנחות רלוונטיות
3. כשלקוח מזמין, חשב את הסכום הכולל כולל הנחות אם רלוונטי
4. היה ידידותי ומקצועי
"""

# Conversation history for multi-turn chat
conversation_history = []

def chat(user_message: str) -> str:
    conversation_history.append({"role": "user", "content": user_message})

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        system=system_prompt,
        messages=conversation_history
    )

    assistant_message = response.content[0].text
    conversation_history.append({"role": "assistant", "content": assistant_message})

    return assistant_message

if __name__ == "__main__":
    print(f"\n{'='*50}")
    print(f"  ברוכים הבאים ל{config['store_info']['name']}!")
    print(f"  עוזר: {config['agent_name']}")
    print(f"{'='*50}")
    print(f"  תפריט: {sum(len(c['items']) for c in menu['categories'])} פריטים")
    print(f"  הנחות פעילות: {len(discounts['discounts'])}")
    print(f"{'='*50}")
    print("הקלד שאלות. הקלד 'יציאה' או 'quit' לסיום.\n")

    while True:
        try:
            user_input = input("אתה: ").strip()

            if not user_input:
                continue

            if user_input.lower() in ['quit', 'exit', 'q', 'יציאה']:
                print("\nתודה שביקרת! להתראות!")
                break

            response = chat(user_input)
            print(f"\nפנחס: {response}\n")

        except KeyboardInterrupt:
            print("\n\nתודה שביקרת! להתראות!")
            break
        except Exception as e:
            print(f"\nשגיאה: {e}\n")
