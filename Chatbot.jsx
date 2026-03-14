import { useState, useEffect, useRef } from "react";

// ── Knowledge base DIV4SSAA ─────────────────────────────────────────────────
const KB = [
  {
    keys: ["ciao","salve","hey","buongiorno","buonasera","hello"],
    reply: "Ciao! 👋 Sono l'assistente virtuale di **DIV4SSAA**. Posso aiutarti con info sui nostri prodotti, il team, o la nostra storia. Come posso aiutarti?"
  },
  {
    keys: ["prodott","catalogo","cosa vendete","cosa vende","offrite","acquist"],
    reply: "Il nostro catalogo cruelty-free include:\n\n💄 **VelvetLip** – Rossetto vegano €14.90\n🌿 **GreenBase** – Fondotinta biologico €22.50\n✨ **GlowSerum** – Siero vitamina C €28.00\n👁️ **PureLiner** – Eyeliner waterproof €11.90\n🌸 **BlushBio** – Blush naturale €16.00\n🧴 **SoftMask** – Maschera argilla €19.90\n💅 **NaturNail** – Smalto 5-free €8.90\n🌙 **NightCream** – Crema notte €24.50\n\nTutti i prodotti sono **100% cruelty-free**! 🐰"
  },
  {
    keys: ["prezzo","costa","quanto","costo","economico","costano"],
    reply: "I nostri prezzi vanno da **€8.90** (NaturNail) a **€28.00** (GlowSerum). Il prezzo medio è circa **€18**. Tutti i prodotti sono cruelty-free e di alta qualità! Vuoi info su un prodotto specifico?"
  },
  {
    keys: ["cruelty","animali","test","vegano","vegan","etico"],
    reply: "🐰 **Cruelty-free al 100%!**\n\nIl nostro slogan è *\"Bella senza colpa.\"* — nessuno dei nostri prodotti viene testato su animali, mai. Utilizziamo solo ingredienti certificati e packaging eco-compatibile. La bellezza etica è il nostro DNA!"
  },
  {
    keys: ["team","soci","chi","fondator","persone","dipendent","lavora"],
    reply: "Siamo **15 soci fondatori** della 4ª SSAA:\n\n👑 Laura – CEO\n💰 Maria – CFO\n💻 Adam – Web Dev\n🎨 Mia & Erika – Design\n📣 Sara, Giorgia, Giulia, Alessandra – Marketing\n🛒 Sofia & Zoe – Vendite\n✅ Nicole – Qualità\n📦 Anita & Leonardo – Operazioni\n👥 Lara – HR\n\nOgni socio ha investito **€2.000** nel progetto!"
  },
  {
    keys: ["stipendio","paga","guadagn","salario","compenso"],
    reply: "Ogni socio riceve uno stipendio di **€750/mese**. Oltre allo stipendio, ciascuno ha versato una quota capitale di **€2.000** all'avvio della società."
  },
  {
    keys: ["capitale","soldi","finanza","finanziario","debito","investimento","euro"],
    reply: "📊 **Situazione finanziaria:**\n\n💰 Capitale sociale: **€30.000** (€2k × 15 soci)\n📋 Debito bancario: **€80.000**\n📅 Rata mensile: **€1.547** (piano 5 anni)\n💸 Uscite totali/mese: ~**€11.000**\n🎯 Break-even: **€11.000/mese**\n\nL'obiettivo è raggiungere **€25.000/mese** entro il 3° anno!"
  },
  {
    keys: ["snc","società","azienda","impresa","ragione sociale","forma"],
    reply: "**DIV4SSAA snc** è una *Società in Nome Collettivo*, nata dalla classe 4ª SSAA (indirizzo socio-sanitario). La ragione sociale completa è **DIV4SSAA snc**.\n\n📌 15 soci · €30.000 capitale · Cosmetici cruelty-free"
  },
  {
    keys: ["logo","design","brand","grafica","identità"],
    reply: "🎨 Il logo e il brand di DIV4SSAA sono curati da **Mia ed Erika**, le nostre graphic designer. Lo stile combina eleganza e valori etici — proprio come i nostri prodotti!"
  },
  {
    keys: ["sito","web","sviluppat","online","app"],
    reply: "💻 Il sito è sviluppato da **Adam**, il nostro Web Developer. È hostato su **Railway** (presto su Vercel) ed è costruito con **React + Vite**. Completamente responsive per mobile e desktop!"
  },
  {
    keys: ["velvetlip","rossetto","labbra"],
    reply: "💄 **VelvetLip** — €14.90\nRossetto vegano a texture vellutata. Idrata e colora in un gesto, tenuta fino a **8 ore** senza trasferimento. Il nostro **Best Seller**! 🏆"
  },
  {
    keys: ["greenbase","fondotinta","base","viso"],
    reply: "🌿 **GreenBase** — €22.50\nFondotinta leggero a base di **aloe vera biologica**. Copertura naturale e uniforme con **SPF 15** incluso. Novità in catalogo! ✨"
  },
  {
    keys: ["glowserum","siero","serum","vitamina c","acido ialuronico"],
    reply: "✨ **GlowSerum** — €28.00\nSiero illuminante con **vitamina C** e **acido ialuronico**. Luminosità visibile già dalla prima settimana. Il nostro prodotto Top! 🌟"
  },
  {
    keys: ["pureliner","eyeliner","occhi","liner"],
    reply: "👁️ **PureLiner** — €11.90\nEyeliner waterproof a punta fine. Tratto preciso e intenso, **asciugatura in 30 secondi**. Perfetto per look precisi!"
  },
  {
    keys: ["blushbio","blush","guance"],
    reply: "🌸 **BlushBio** — €16.00\nBlush in polvere compatta con **pigmenti naturali**. Dona un incarnato fresco e sano, texture ultra-sfumabile!"
  },
  {
    keys: ["softmask","maschera","mask","argilla"],
    reply: "🧴 **SoftMask** — €19.90\nMaschera viso all'**argilla rosa** e olio di rosa canina. Purifica i pori e nutre la pelle in soli **10 minuti**. Esclusivo! 💎"
  },
  {
    keys: ["naturnail","smalto","unghie","nail"],
    reply: "💅 **NaturNail** — €8.90\nSmalto **5-free** privo di sostanze nocive. Asciugatura rapida, disponibile in **18 colori**. Il più accessibile del catalogo!"
  },
  {
    keys: ["nightcream","crema notte","notte","cream"],
    reply: "🌙 **NightCream** — €24.50\nCrema notte rigenerante con **burro di karité** e retinolo vegetale. Agisce durante il sonno per una pelle morbida al risveglio. In promozione! 🎉"
  },
  {
    keys: ["slogan","motto","frase"],
    reply: "✨ Il nostro slogan è:\n\n*\"**Bella senza colpa.**\"*\n\nPerché crediamo che la bellezza non debba mai avere un costo etico!"
  },
  {
    keys: ["contatt","email","telefono","dove","indirizzo"],
    reply: "📬 Per contattarci puoi scrivere direttamente tramite questo sito! Il team di DIV4SSAA è sempre disponibile. La nostra base è la **Classe 4ª SSAA**. 😊"
  },
  {
    keys: ["grazie","perfetto","ottimo","bravo","bene","capito","ok"],
    reply: "Prego! 😊 Se hai altre domande su DIV4SSAA, i nostri prodotti o il team, sono qui! 🌿"
  },
  {
    keys: ["ciao","arrivederci","bye","addio","a presto"],
    reply: "A presto! 👋 Ricorda: **Bella senza colpa.** 💄🌿"
  },
];

function getBotReply(input) {
  const lower = input.toLowerCase().trim();
  for (const entry of KB) {
    if (entry.keys.some(k => lower.includes(k))) {
      return entry.reply;
    }
  }
  return "Hmm, non sono sicuro di capire! 🤔 Puoi chiedermi di:\n- 🛍️ Prodotti e prezzi\n- 👥 Il team\n- 💰 Finanza\n- 🌿 Filosofia cruelty-free\n- 🏢 Info sull'azienda";
}

// Formatta il testo con bold (**testo**) e newline
function FormattedText({ text }) {
  const lines = text.split('\n');
  return (
    <span>
      {lines.map((line, li) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <span key={li}>
            {parts.map((part, pi) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={pi}>{part.slice(2,-2)}</strong>;
              }
              if (part.startsWith('*') && part.endsWith('*')) {
                return <em key={pi}>{part.slice(1,-1)}</em>;
              }
              return <span key={pi}>{part}</span>;
            })}
            {li < lines.length - 1 && <br/>}
          </span>
        );
      })}
    </span>
  );
}

// ── Chatbot Component ───────────────────────────────────────────────────────
export default function Chatbot() {
  const [open, setOpen]       = useState(false);
  const [messages, setMsgs]   = useState([
    { from:'bot', text:'Ciao! 👋 Sono l\'assistente di **DIV4SSAA**. Come posso aiutarti?', time: new Date() }
  ]);
  const [input, setInput]     = useState('');
  const [typing, setTyping]   = useState(false);
  const [isMobile, setMobile] = useState(false);
  const [unread, setUnread]   = useState(0);
  const bottomRef             = useRef(null);
  const inputRef              = useRef(null);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg = { from:'user', text, time: new Date() };
    setMsgs(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    // Simula tempo di risposta realistico
    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      const reply = getBotReply(text);
      setTyping(false);
      setMsgs(prev => [...prev, { from:'bot', text: reply, time: new Date() }]);
      if (!open) setUnread(n => n+1);
    }, delay);
  };

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const formatTime = d => d.toLocaleTimeString('it', { hour:'2-digit', minute:'2-digit' });

  // ── Stili responsive ──
  const GREEN  = '#2d4a2d';
  const ACCENT = '#b8603a';
  const BG     = '#faf7f2';

  const windowStyle = isMobile ? {
    // Mobile: bottom sheet full width
    position: 'fixed', bottom: 0, left: 0, right: 0, top: 'auto',
    width: '100%', height: '75vh',
    borderRadius: '20px 20px 0 0',
    zIndex: 1000,
    display: 'flex', flexDirection: 'column',
    background: '#fff',
    boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
    transform: open ? 'translateY(0)' : 'translateY(100%)',
    transition: 'transform 0.35s cubic-bezier(0.32,0.72,0,1)',
    overflow: 'hidden',
  } : {
    // Desktop: floating window bottom-right
    position: 'fixed', bottom: 88, right: 24,
    width: 380, height: 520,
    borderRadius: 20,
    zIndex: 1000,
    display: 'flex', flexDirection: 'column',
    background: '#fff',
    boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)',
    opacity: open ? 1 : 0,
    pointerEvents: open ? 'all' : 'none',
    transform: open ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
    transformOrigin: 'bottom right',
    transition: 'all 0.25s cubic-bezier(0.32,0.72,0,1)',
    overflow: 'hidden',
  };

  // Overlay mobile per chiudere toccando fuori
  const showOverlay = isMobile && open;

  return (
    <>
      {/* Overlay mobile */}
      {showOverlay && (
        <div onClick={() => setOpen(false)} style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
          zIndex:999, transition:'opacity 0.3s',
        }}/>
      )}

      {/* Finestra chat */}
      <div style={windowStyle}>
        {/* Handle mobile */}
        {isMobile && (
          <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 4px' }}>
            <div style={{ width:40, height:4, background:'#e0dbd5', borderRadius:2 }}/>
          </div>
        )}

        {/* Header */}
        <div style={{
          background: GREEN,
          padding: isMobile ? '12px 20px 14px' : '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{
              width:38, height:38, borderRadius:'50%',
              background:'rgba(255,255,255,0.15)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:18, flexShrink:0,
            }}>🌿</div>
            <div>
              <div style={{ color:'white', fontWeight:700, fontSize:14, fontFamily:"'DM Sans',sans-serif" }}>
                Assistente DIV4SSAA
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:2 }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:'#6de87a' }}/>
                <span style={{ color:'rgba(255,255,255,0.7)', fontSize:11 }}>Online ora</span>
              </div>
            </div>
          </div>
          <button onClick={() => setOpen(false)} style={{
            background:'rgba(255,255,255,0.15)', border:'none', borderRadius:8,
            width:32, height:32, cursor:'pointer', color:'white',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:16, fontFamily:"'DM Sans',sans-serif",
          }}>✕</button>
        </div>

        {/* Messaggi */}
        <div style={{
          flex:1, overflowY:'auto', padding:'16px',
          background: '#f8f6f2',
          display:'flex', flexDirection:'column', gap:10,
        }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              display:'flex',
              justifyContent: m.from==='user' ? 'flex-end' : 'flex-start',
              alignItems:'flex-end', gap:8,
            }}>
              {m.from==='bot' && (
                <div style={{
                  width:28, height:28, borderRadius:'50%', background:GREEN,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:13, flexShrink:0, marginBottom:2,
                }}>🌿</div>
              )}
              <div style={{ maxWidth:'75%' }}>
                <div style={{
                  background: m.from==='user' ? GREEN : '#fff',
                  color: m.from==='user' ? 'white' : '#1c1c1a',
                  padding:'10px 14px',
                  borderRadius: m.from==='user'
                    ? '16px 16px 4px 16px'
                    : '16px 16px 16px 4px',
                  fontSize:13, lineHeight:1.6,
                  boxShadow: m.from==='bot' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  fontFamily:"'DM Sans',sans-serif",
                  whiteSpace:'pre-line',
                }}>
                  <FormattedText text={m.text}/>
                </div>
                <div style={{
                  fontSize:10, color:'#aaa', marginTop:3,
                  textAlign: m.from==='user' ? 'right' : 'left',
                  paddingLeft: m.from==='bot' ? 4 : 0,
                  paddingRight: m.from==='user' ? 4 : 0,
                }}>{formatTime(m.time)}</div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div style={{ display:'flex', alignItems:'flex-end', gap:8 }}>
              <div style={{
                width:28, height:28, borderRadius:'50%', background:GREEN,
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:13,
              }}>🌿</div>
              <div style={{
                background:'#fff', borderRadius:'16px 16px 16px 4px',
                padding:'12px 16px', boxShadow:'0 1px 4px rgba(0,0,0,0.08)',
                display:'flex', alignItems:'center', gap:4,
              }}>
                {[0,1,2].map(d => (
                  <div key={d} style={{
                    width:7, height:7, borderRadius:'50%', background:'#c4a882',
                    animation:'typingDot 1.2s ease infinite',
                    animationDelay:`${d*0.2}s`,
                  }}/>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Suggerimenti rapidi */}
        <div style={{
          padding:'8px 12px', background:'#fff',
          borderTop:'1px solid #f0ebe0',
          display:'flex', gap:6, overflowX:'auto',
          flexShrink:0,
        }}>
          {['Prodotti 🛍️','Prezzi 💰','Chi siamo 👥','Cruelty-free 🐰'].map(q => (
            <button key={q} onClick={() => { setInput(q.split(' ')[0]); setTimeout(send,50); }}
              style={{
                flexShrink:0, padding:'5px 12px', borderRadius:20,
                border:'1px solid #e8e0d5', background:'#faf7f2',
                fontSize:11, cursor:'pointer', color:'#6b6560',
                fontFamily:"'DM Sans',sans-serif", whiteSpace:'nowrap',
                transition:'all 0.2s',
              }}
              onMouseEnter={e => { e.target.style.background=GREEN; e.target.style.color='white'; e.target.style.borderColor=GREEN; }}
              onMouseLeave={e => { e.target.style.background='#faf7f2'; e.target.style.color='#6b6560'; e.target.style.borderColor='#e8e0d5'; }}
            >{q}</button>
          ))}
        </div>

        {/* Input */}
        <div style={{
          padding:'12px 16px',
          background:'#fff',
          borderTop:'1px solid #f0ebe0',
          display:'flex', gap:8, alignItems:'flex-end',
          flexShrink:0,
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Scrivi un messaggio..."
            rows={1}
            style={{
              flex:1, border:'1.5px solid #e8e0d5', borderRadius:12,
              padding:'10px 14px', fontSize:13, resize:'none',
              fontFamily:"'DM Sans',sans-serif", outline:'none',
              background:'#faf7f2', color:'#1c1c1a', lineHeight:1.5,
              maxHeight:80, overflowY:'auto',
              transition:'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor=GREEN}
            onBlur={e => e.target.style.borderColor='#e8e0d5'}
          />
          <button onClick={send} disabled={!input.trim()} style={{
            width:40, height:40, borderRadius:12, border:'none',
            background: input.trim() ? GREEN : '#e8e0d5',
            color:'white', cursor: input.trim() ? 'pointer' : 'default',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:16, transition:'all 0.2s', flexShrink:0,
          }}>→</button>
        </div>
      </div>

      {/* FAB button */}
      <button onClick={() => setOpen(o => !o)} style={{
        position:'fixed',
        bottom: isMobile ? 20 : 24,
        right: isMobile ? 20 : 24,
        width:56, height:56, borderRadius:'50%',
        background: open ? '#1e3320' : GREEN,
        border:'none', cursor:'pointer',
        boxShadow:'0 4px 20px rgba(45,74,45,0.4)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:22, zIndex:1001,
        transition:'all 0.25s ease',
        transform: open ? 'rotate(0deg)' : 'rotate(0deg)',
      }}>
        <span style={{ transition:'all 0.2s', display:'flex' }}>
          {open ? '✕' : '💬'}
        </span>
        {/* Badge unread */}
        {unread > 0 && !open && (
          <div style={{
            position:'absolute', top:-2, right:-2,
            width:20, height:20, borderRadius:'50%',
            background:ACCENT, color:'white',
            fontSize:11, fontWeight:700,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>{unread}</div>
        )}
      </button>

      {/* CSS animazione typing */}
      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </>
  );
}