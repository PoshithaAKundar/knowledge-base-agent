export default function MessageBubble({ role, text, citations }: any) {
  return (
    <div style={{
      textAlign: role==="user" ? "right" : "left",
      marginBottom: 14
    }}>
      <div style={{
        display:"inline-block",
        background: role==="user" ? "#007AFF" : "#E5E5EA",
        color: role==="user" ? "white" : "black",
        padding:"10px 14px",
        borderRadius:10,
        maxWidth:"70%",
        whiteSpace:"pre-wrap"
      }}>
        {text}

        {citations && citations.length > 0 && (
          <div style={{ fontSize:12, marginTop:6, opacity:0.7 }}>
            📎 Sources:
            {citations.map((c:any,i:number)=>(
              <div key={i}>🔗 {c.uri}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
