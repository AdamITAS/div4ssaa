import { useState, useEffect, useRef } from "react";

// ── Fuzzy matching: distanza di Levenshtein ─────────────────────────────────
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

function fuzzyMatch(word, keyword) {
  if (word.length < 3) return word === keyword;
  if (keyword.length < 3) return word === keyword;
  const dist = levenshtein(word, keyword);
  const maxLen = Math.max(word.length, keyword.length);
  const threshold = maxLen <= 5 ? 1 : maxLen <= 8 ? 2 : 3;
  return dist <= threshold;
}

function inputMatches(input, keywords) {
  const words = input.toLowerCase().trim().split(/\s+/);
  return keywords.some(kw => {
    const kwLower = kw.toLowerCase();
    if (input.toLowerCase().includes(kwLower)) return true;
    return words.some(w => fuzzyMatch(w, kwLower));
  });
}

// ── Knowledge base completa ─────────────────────────────────────────────────
const KB = [
  {
    id: "saluto",
    keys: ["ciao","salve","hey","buongiorno","buonasera","hello","hola","hi","ola","cai","ciau","cioa","buon"],
    reply: () => {
      const g = [
        "Ciao! 👋 Sono l'assistente virtuale di **DIV4SSAA**. Posso aiutarti con i nostri prodotti, il team o qualsiasi domanda sul brand!",
        "Hey! 😊 Benvenuto da **DIV4SSAA** — cosmetici cruelty-free per chi non vuole rinunciare all'etica. Come posso aiutarti?",
        "Ciao! 🌿 Sono qui per rispondere a tutte le tue domande su **DIV4SSAA**. Da dove vuoi iniziare?",
      ];
      return g[Math.floor(Math.random() * g.length)];
    }
  },
  {
    id: "prodotti",
    keys: ["prodott","catalogo","cosa vend","cosa fate","cosa offr","acquist","comprare","articol","cosmetici","trucchi","makeup","make up","bellezza"],
    reply: () => "Il nostro catalogo **cruelty-free** include:\n\n💄 **VelvetLip** – Rossetto vegano €14.90\n🌿 **GreenBase** – Fondotinta biologico €22.50\n✨ **GlowSerum** – Siero vitamina C €28.00\n👁️ **PureLiner** – Eyeliner waterproof €11.90\n🌸 **BlushBio** – Blush naturale €16.00\n🧴 **SoftMask** – Maschera argilla €19.90\n💅 **NaturNail** – Smalto 5-free €8.90\n🌙 **NightCream** – Crema notte €24.50\n\nTutti al **100% cruelty-free** 🐰 Vuoi saperne di più su uno specifico?"
  },
  {
    id: "prezzi",
    keys: ["prezz","cost","quanto","economico","caro","saldo","offert","scont","promozione"],
    reply: () => "💰 I nostri prezzi vanno da **€8.90** (NaturNail) a **€28.00** (GlowSerum).\n\nIl prezzo medio è circa **€18** — qualità cruelty-free a un prezzo accessibile! 🌿\n\nHai qualche prodotto in mente?"
  },
  {
    id: "cruelty",
    keys: ["cruelty","animali","test","vegano","vegan","etico","natura","bio","biologico","sostenib","green","rispetto"],
    reply: () => "🐰 **Cruelty-free al 100%!**\n\nIl nostro slogan è *\"Bella senza colpa.\"* — nessuno dei nostri prodotti viene testato su animali, mai. Ingredienti certificati, packaging eco-compatibile, e una filosofia che mette l'etica al primo posto.\n\nBellezza e coscienza pulita possono coesistere! 🌿"
  },
  {
    id: "team",
    keys: ["team","soci","chi siete","fondator","persone","dipendent","lavora","staff","squadra","gruppo","classe","studenti"],
    reply: () => "Siamo **15 soci fondatori** della classe 4ª SSAA:\n\n👑 **Laura** – Amministratrice Delegata\n💰 **Maria** – Responsabile Finanziario\n💻 **Adam** – Sviluppatore Web\n🎨 **Mia & Erika** – Graphic Design\n📣 **Sara, Giorgia, Giulia, Alessandra** – Marketing\n🛒 **Sofia & Zoe** – Vendite\n✅ **Nicole** – Qualità\n📦 **Anita & Leonardo** – Operazioni\n👥 **Lara** – HR\n\nOgni socio ha investito **€2.000** nel progetto!"
  },
  {
    id: "stipendio",
    keys: ["stipendio","paga","guadagn","salario","compenso","quanto prendete"],
    reply: () => "💼 Ogni socio riceve uno stipendio di **€750/mese**.\n\nOltre allo stipendio, ciascuno ha versato una quota capitale di **€2.000** all'avvio — quindi siamo tutti investiti nel successo del brand!"
  },
  {
    id: "finanza",
    keys: ["capital","soldi","finanza","finanziario","debito","invest","budget","cassa","bilancio","entrate","uscite","break even"],
    reply: () => "📊 **Situazione finanziaria DIV4SSAA:**\n\n💰 Capitale sociale: **€30.000** (€2k × 15 soci)\n📋 Debito bancario: **€80.000**\n📅 Rata mensile: **€1.547** (piano 5 anni)\n💸 Uscite totali/mese: ~**€17.800**\n🎯 Break-even: **€17.800/mese**\n\nL'obiettivo è raggiungere **€45.000/mese** entro il 3° anno!"
  },
  {
    id: "azienda",
    keys: ["snc","societ","aziend","impres","ragione social","forma giuridic","struttura","legal"],
    reply: () => "🏢 **DIV4SSAA snc** è una *Società in Nome Collettivo*, nata dalla classe 4ª SSAA.\n\n📌 15 soci · €30.000 capitale · Cosmetici cruelty-free\n\nÈ un progetto didattico trasformato in brand reale!"
  },
  {
    id: "logo",
    keys: ["logo","design","brand","grafica","identit","visual","stile","colori"],
    reply: () => "🎨 Il brand e il logo di DIV4SSAA sono curati da **Mia ed Erika**, le nostre graphic designer.\n\nLo stile combina eleganza, natura e valori etici — proprio come i nostri prodotti. Il logo è in fase di finalizzazione! ✨"
  },
  {
    id: "sito",
    keys: ["sito","web","sviluppat","online","website","pagina","internet","railway","vercel","hosting","react"],
    reply: () => "💻 Il sito è sviluppato da **Adam**, il nostro Web Developer.\n\nCostruito con **React + Vite**, hostato su **Railway** (presto su Vercel) ed è completamente responsive!"
  },
  {
    id: "velvetlip",
    keys: ["velvetlip","velvet","rossetto","labbra","lipstick"],
    reply: () => "💄 **VelvetLip** — €14.90\n\nIl nostro **Best Seller**! 🏆 Rossetto vegano a texture vellutata. Idrata e colora con tenuta fino a **8 ore** senza trasferimento."
  },
  {
    id: "greenbase",
    keys: ["greenbase","fondotinta","foundation","spf","aloe"],
    reply: () => "🌿 **GreenBase** — €22.50\n\nFondotinta a base di **aloe vera biologica**. Copertura naturale con **SPF 15** incluso. Novità in catalogo! ✨"
  },
  {
    id: "glowserum",
    keys: ["glowserum","siero","serum","vitamina","ialuronico","glow","luminosit"],
    reply: () => "✨ **GlowSerum** — €28.00\n\nProdotto **Top**! 🌟 Siero con **vitamina C** e **acido ialuronico**. Luminosità visibile dalla prima settimana."
  },
  {
    id: "pureliner",
    keys: ["pureliner","eyeliner","liner","occhi","waterproof","matita"],
    reply: () => "👁️ **PureLiner** — €11.90\n\nEyeliner waterproof, punta fine, **asciugatura in 30 secondi**. Tratto preciso tutto il giorno!"
  },
  {
    id: "blushbio",
    keys: ["blushbio","blush","guance","incarnato"],
    reply: () => "🌸 **BlushBio** — €16.00\n\nBlush compatto con **pigmenti naturali**. Texture ultra-sfumabile per un incarnato fresco e sano!"
  },
  {
    id: "softmask",
    keys: ["softmask","maschera","argilla","pori","rosa canina"],
    reply: () => "🧴 **SoftMask** — €19.90\n\nProdotto **Esclusivo**! 💎 Maschera all'**argilla rosa** e olio di rosa canina. Purifica i pori in **10 minuti**."
  },
  {
    id: "naturnail",
    keys: ["naturnail","smalto","unghie","nail","manicure","5-free"],
    reply: () => "💅 **NaturNail** — €8.90\n\nSmalto **5-free** senza sostanze nocive. Asciugatura rapida, **18 colori** disponibili!"
  },
  {
    id: "nightcream",
    keys: ["nightcream","crema notte","notte","karite","retinolo","crema"],
    reply: () => "🌙 **NightCream** — €24.50\n\nAttualmente in **Promo**! 🎉 Crema rigenerante con **burro di karité** e retinolo vegetale. Pelle morbida al risveglio."
  },
  {
    id: "slogan",
    keys: ["slogan","motto","frase","payoff","bella senza colpa"],
    reply: () => "✨ Il nostro slogan è:\n\n*\"**Bella senza colpa.**\"*\n\nBellezza etica, senza compromessi, senza test sugli animali."
  },
  {
    id: "contatti",
    keys: ["contat","email","telefon","dove","indirizzo","scriver","info"],
    reply: () => "📬 Puoi contattarci direttamente attraverso questo sito!\n\nIl team di DIV4SSAA è sempre disponibile. La nostra base è la **Classe 4ª SSAA** 😊"
  },
  {
    id: "grazie",
    keys: ["grazie","perfetto","ottimo","bravo","bene","capito","ok","esatto","super","fantastico"],
    reply: () => {
      const r = ["Prego! 😊 Posso aiutarti con altro?","Di niente! 🌿 Sono a disposizione!","Figurati! ✨ Per qualsiasi cosa, sono qui!"];
      return r[Math.floor(Math.random() * r.length)];
    }
  },
  {
    id: "arrivederci",
    keys: ["arrivederci","bye","addio","a presto","ciao ciao","alla prossima"],
    reply: () => "A presto! 👋 Ricorda: **Bella senza colpa.** 💄🌿"
  },
];

const OFF_TOPIC = [
  { keys: ["meteo","piove","pioggia","sole","temperatura","caldo","freddo","neve"],
    reply: "Mmh, il meteo non è proprio il mio forte! 😄 Sono specializzato nel mondo di **DIV4SSAA**. Posso aiutarti con prodotti, prezzi o info sul brand?" },
  { keys: ["mangio","pizza","pasta","cibo","ristorante","ricetta","cucina","fame"],
    reply: "Non sono molto bravo in cucina! 😂 Però sono un esperto di cosmetici cruelty-free. Vuoi sapere qualcosa su **DIV4SSAA**? 🌿" },
  { keys: ["sei umano","sei un bot","sei intelligente","chi sei","cosa sei","come stai","come ti chiami","hai sentimenti"],
    reply: "Sono l'assistente virtuale di **DIV4SSAA** 🤖 — non proprio umano, ma abbastanza smart da rispondere a quasi tutto sul nostro brand!" },
  { keys: ["calcola","quanto fa","matematica","equazione","formula","percentuale"],
    reply: "La matematica non è la mia specialità! 😅 Però conosco bene i numeri di **DIV4SSAA**: capitale, stipendi, obiettivi... Vuoi che te ne parli?" },
  { keys: ["politica","governo","elezioni","presidente","legge","notizie","news"],
    reply: "L'attualità la lascio ad altri! 📰 Io mi concentro su cosmetici etici e cruelty-free. Posso raccontarti qualcosa di **DIV4SSAA**?" },
  { keys: ["calcio","sport","partita","squadra","campionato","gol","basket","tennis"],
    reply: "Non sono il massimo come commentatore sportivo! ⚽ Ma su **DIV4SSAA** posso essere molto più utile. Hai qualche domanda?" },
  { keys: ["iphone","android","computer","laptop","gioco","netflix","tiktok","instagram"],
    reply: "La mia area di expertise è un po' diversa 😄 — sono qui per tutto ciò che riguarda **DIV4SSAA** e il mondo dei cosmetici cruelty-free!" },
];

function getBotReply(input) {
  const lower = input.toLowerCase().trim();
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of KB) {
    let score = 0;
    for (const kw of entry.keys) {
      if (lower.includes(kw)) {
        score += kw.length * 2;
      } else {
        const words = lower.split(/\s+/);
        for (const w of words) {
          if (fuzzyMatch(w, kw)) score += kw.length;
        }
      }
    }
    if (score > bestScore) { bestScore = score; bestMatch = entry; }
  }

  if (bestScore > 2 && bestMatch)
    return typeof bestMatch.reply === 'function' ? bestMatch.reply() : bestMatch.reply;

  for (const entry of OFF_TOPIC)
    if (inputMatches(input, entry.keys)) return entry.reply;

  const fallbacks = [
    "Hmm, non sono sicuro di aver capito bene! 🤔 Stai chiedendo qualcosa sui **prodotti**, il **team** o la **filosofia cruelty-free** di DIV4SSAA?",
    "Interessante! Non ho la risposta giusta, ma posso dirti tutto su **DIV4SSAA** — prodotti, prezzi, team o la nostra storia. Cosa ti interessa?",
    "Non ho capito al 100%, ma sono qui per aiutarti! Prova a chiedermi di:\n\n🛍️ Prodotti e prezzi\n👥 Il team\n💰 Situazione finanziaria\n🌿 Filosofia cruelty-free",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

function FormattedText({ text }) {
  return (
    <span>
      {text.split('\n').map((line, li, arr) => (
        <span key={li}>
          {line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, pi) => {
            if (part.startsWith('**') && part.endsWith('**')) return <strong key={pi}>{part.slice(2,-2)}</strong>;
            if (part.startsWith('*') && part.endsWith('*')) return <em key={pi}>{part.slice(1,-1)}</em>;
            return <span key={pi}>{part}</span>;
          })}
          {li < arr.length - 1 && <br/>}
        </span>
      ))}
    </span>
  );
}

export default function Chatbot() {
  const [open, setOpen]       = useState(false);
  const [messages, setMsgs]   = useState([
    { from:'bot', text:'Ciao! 👋 Sono l\'assistente di **DIV4SSAA**.\nChiedimi qualsiasi cosa — prodotti, team, prezzi o la nostra filosofia cruelty-free!', time: new Date() }
  ]);
  const [input, setInput]     = useState('');
  const [typing, setTyping]   = useState(false);
  const [isMobile, setMobile] = useState(false);
  const [unread, setUnread]   = useState(0);
  const bottomRef             = useRef(null);
  const inputRef              = useRef(null);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, typing]);
  useEffect(() => { if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 300); } }, [open]);

  const send = (overrideText) => {
    const text = (overrideText !== undefined ? overrideText : input).trim();
    if (!text) return;
    setMsgs(prev => [...prev, { from:'user', text, time: new Date() }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = getBotReply(text);
      setTyping(false);
      setMsgs(prev => [...prev, { from:'bot', text: reply, time: new Date() }]);
      if (!open) setUnread(n => n+1);
    }, 700 + Math.random() * 900);
  };

  const handleKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };
  const formatTime = d => d.toLocaleTimeString('it', { hour:'2-digit', minute:'2-digit' });

  const GREEN = '#2d4a2d', ACCENT = '#b8603a';

  const windowStyle = isMobile ? {
    position:'fixed', bottom:0, left:0, right:0, width:'100%', height:'78vh',
    borderRadius:'20px 20px 0 0', zIndex:1000, display:'flex', flexDirection:'column',
    background:'#fff', boxShadow:'0 -8px 40px rgba(0,0,0,0.18)',
    transform: open ? 'translateY(0)' : 'translateY(100%)',
    transition:'transform 0.35s cubic-bezier(0.32,0.72,0,1)', overflow:'hidden',
  } : {
    position:'fixed', bottom:88, right:24, width:390, height:540,
    borderRadius:20, zIndex:1000, display:'flex', flexDirection:'column',
    background:'#fff', boxShadow:'0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)',
    opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none',
    transform: open ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
    transformOrigin:'bottom right', transition:'all 0.25s cubic-bezier(0.32,0.72,0,1)', overflow:'hidden',
  };

  return (
    <>
      {isMobile && open && (
        <div onClick={() => setOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:999 }}/>
      )}

      <div style={windowStyle}>
        {isMobile && (
          <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 4px' }}>
            <div style={{ width:40, height:4, background:'#e0dbd5', borderRadius:2 }}/>
          </div>
        )}

        {/* Header */}
        <div style={{ background:GREEN, padding: isMobile ? '12px 20px 14px' : '16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🌿</div>
            <div>
              <div style={{ color:'white', fontWeight:700, fontSize:14, fontFamily:"'DM Sans',sans-serif" }}>Assistente DIV4SSAA</div>
              <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:2 }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background: typing ? '#f0c040' : '#6de87a' }}/>
                <span style={{ color:'rgba(255,255,255,0.7)', fontSize:11 }}>{typing ? 'Sta scrivendo...' : 'Online ora'}</span>
              </div>
            </div>
          </div>
          <button onClick={() => setOpen(false)} style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:8, width:32, height:32, cursor:'pointer', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>✕</button>
        </div>

        {/* Messaggi */}
        <div style={{ flex:1, overflowY:'auto', padding:'16px', background:'#f8f6f2', display:'flex', flexDirection:'column', gap:10 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display:'flex', justifyContent: m.from==='user' ? 'flex-end' : 'flex-start', alignItems:'flex-end', gap:8 }}>
              {m.from==='bot' && (
                <div style={{ width:28, height:28, borderRadius:'50%', background:GREEN, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0, marginBottom:2 }}>🌿</div>
              )}
              <div style={{ maxWidth:'78%' }}>
                <div style={{
                  background: m.from==='user' ? GREEN : '#fff', color: m.from==='user' ? 'white' : '#1c1c1a',
                  padding:'10px 14px',
                  borderRadius: m.from==='user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  fontSize:13, lineHeight:1.6,
                  boxShadow: m.from==='bot' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  fontFamily:"'DM Sans',sans-serif",
                }}>
                  <FormattedText text={m.text}/>
                </div>
                <div style={{ fontSize:10, color:'#aaa', marginTop:3, textAlign: m.from==='user' ? 'right' : 'left', paddingLeft: m.from==='bot' ? 4 : 0, paddingRight: m.from==='user' ? 4 : 0 }}>{formatTime(m.time)}</div>
              </div>
            </div>
          ))}

          {typing && (
            <div style={{ display:'flex', alignItems:'flex-end', gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:GREEN, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>🌿</div>
              <div style={{ background:'#fff', borderRadius:'16px 16px 16px 4px', padding:'12px 16px', boxShadow:'0 1px 4px rgba(0,0,0,0.08)', display:'flex', alignItems:'center', gap:5 }}>
                {[0,1,2].map(d => (
                  <div key={d} style={{ width:7, height:7, borderRadius:'50%', background:'#c4a882', animation:'typingDot 1.2s ease infinite', animationDelay:`${d*0.2}s` }}/>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Quick replies */}
        <div style={{ padding:'8px 12px', background:'#fff', borderTop:'1px solid #f0ebe0', display:'flex', gap:6, overflowX:'auto', flexShrink:0 }}>
          {['Prodotti 🛍️','Prezzi 💰','Chi siamo 👥','Cruelty-free 🐰','Team 🧑‍🤝‍🧑'].map(q => (
            <button key={q} onClick={() => send(q.split(' ')[0])} style={{
              flexShrink:0, padding:'5px 12px', borderRadius:20,
              border:'1px solid #e8e0d5', background:'#faf7f2',
              fontSize:11, cursor:'pointer', color:'#6b6560',
              fontFamily:"'DM Sans',sans-serif", whiteSpace:'nowrap', transition:'all 0.2s',
            }}
            onMouseEnter={e => { e.target.style.background=GREEN; e.target.style.color='white'; e.target.style.borderColor=GREEN; }}
            onMouseLeave={e => { e.target.style.background='#faf7f2'; e.target.style.color='#6b6560'; e.target.style.borderColor='#e8e0d5'; }}
            >{q}</button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding:'12px 16px', background:'#fff', borderTop:'1px solid #f0ebe0', display:'flex', gap:8, alignItems:'flex-end', flexShrink:0 }}>
          <textarea
            ref={inputRef} value={input}
            onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
            placeholder="Scrivi un messaggio..." rows={1}
            style={{
              flex:1, border:'1.5px solid #e8e0d5', borderRadius:12,
              padding:'10px 14px', fontSize:13, resize:'none',
              fontFamily:"'DM Sans',sans-serif", outline:'none',
              background:'#faf7f2', color:'#1c1c1a', lineHeight:1.5,
              maxHeight:80, overflowY:'auto', transition:'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor=GREEN}
            onBlur={e => e.target.style.borderColor='#e8e0d5'}
          />
          <button onClick={() => send(undefined)} disabled={!input.trim()} style={{
            width:40, height:40, borderRadius:12, border:'none',
            background: input.trim() ? GREEN : '#e8e0d5',
            color:'white', cursor: input.trim() ? 'pointer' : 'default',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:16, transition:'all 0.2s', flexShrink:0,
          }}>→</button>
        </div>
      </div>

      {/* FAB — nascosto su mobile quando chat è aperta */}
      <button onClick={() => setOpen(o => !o)} style={{
        position:'fixed', bottom: isMobile ? 20 : 24, right: isMobile ? 20 : 24,
        width:56, height:56, borderRadius:'50%',
        background: open ? '#1e3320' : GREEN, border:'none', cursor:'pointer',
        boxShadow:'0 4px 20px rgba(45,74,45,0.4)',
        display: isMobile && open ? 'none' : 'flex',
        alignItems:'center', justifyContent:'center',
        fontSize:22, zIndex:1001, transition:'all 0.25s ease',
      }}>
        {open ? '✕' : '💬'}
        {unread > 0 && !open && (
          <div style={{ position:'absolute', top:-2, right:-2, width:20, height:20, borderRadius:'50%', background:ACCENT, color:'white', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{unread}</div>
        )}
      </button>

      <style>{`@keyframes typingDot { 0%,60%,100%{transform:translateY(0);opacity:0.4} 30%{transform:translateY(-5px);opacity:1} }`}</style>
    </>
  );
}