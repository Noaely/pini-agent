export default function Message({ content, sender, time }) {
  const isAgent = sender === 'agent'

  return (
    <div className={`message ${isAgent ? 'message-agent' : 'message-user'}`}>
      <p className="message-content">{content}</p>
      {time && <span className="message-time">{time}</span>}
    </div>
  )
}
