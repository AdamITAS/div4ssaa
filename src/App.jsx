import { useState, useEffect, useRef } from "react";
import Chatbot from "./Chatbot";

if (!document.querySelector('#d4-fonts')) {
  const l = document.createElement('link');
  l.id = 'd4-fonts'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap';
  document.head.appendChild(l);
}

if (!document.querySelector('#d4-css')) {
  const s = document.createElement('style');
  s.id = 'd4-css';
  s.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #faf7f2; color: #1c1c1a; font-family: 'DM Sans', sans-serif; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-thumb { background: #c4a882; border-radius: 4px; }

    @keyframes fadeUp  { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:none; } }
    @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
    @keyframes reveal  { from { opacity:0; letter-spacing:0.5em; filter:blur(8px); } to { opacity:1; letter-spacing:-0.01em; filter:blur(0); } }
    @keyframes leafSway{ 0%,100%{transform:rotate(-4deg);}50%{transform:rotate(4deg);} }
    @keyframes slideIn { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:none; } }

    .leaf { animation: leafSway 4s ease-in-out infinite; transform-origin: bottom center; display:inline-block; }

    .nav-link {
      font-size: 13px; color: #6b6560; text-decoration: none; font-weight: 500;
      transition: color 0.2s; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif;
    }
    .nav-link:hover, .nav-link.active { color: #2d4a2d; }

    .btn-primary {
      background: #2d4a2d; color: white; border: none; border-radius: 8px;
      padding: 13px 28px; font-size: 14px; font-weight: 600; cursor: pointer;
      font-family: 'DM Sans', sans-serif; transition: all 0.2s; letter-spacing: 0.3px;
    }
    .btn-primary:hover { background: #1e3320; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(45,74,45,0.25); }

    .btn-outline {
      background: transparent; color: #2d4a2d; border: 1.5px solid #2d4a2d; border-radius: 8px;
      padding: 12px 26px; font-size: 14px; font-weight: 600; cursor: pointer;
      font-family: 'DM Sans', sans-serif; transition: all 0.2s;
    }
    .btn-outline:hover { background: #2d4a2d; color: white; }

    .section-fade { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
    .section-fade.visible { opacity: 1; transform: none; }

    .member-row:hover { background: #f0ebe0 !important; }
    .member-row:hover .member-arrow { opacity: 1 !important; transform: translateX(4px) !important; }

    .prod-card { transition: transform 0.25s, box-shadow 0.25s; }
    .prod-card:hover { transform: translateY(-5px); box-shadow: 0 16px 48px rgba(0,0,0,0.10) !important; }

    .filter-btn { transition: all 0.2s; cursor: pointer; font-family: 'DM Sans', sans-serif; }
    .filter-btn:hover { border-color: #2d4a2d !important; color: #2d4a2d !important; }

    /* ── RESPONSIVE ── */
    @media (max-width: 900px) {
      .chi-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
      .chi-values { grid-template-columns: repeat(2, 1fr) !important; }
      .dati-box { padding: 24px 20px !important; }
    }
    @media (max-width: 768px) {
      .hero-flex { flex-direction: column !important; text-align: center; }
      .hero-img { display: none !important; }
      .stats-row { grid-template-columns: repeat(2, 1fr) !important; }
      .prod-grid { grid-template-columns: repeat(2, 1fr) !important; }
      .fin-grid { grid-template-columns: 1fr !important; }
      .anni-grid { grid-template-columns: repeat(3, 1fr) !important; }
      .team-dept-label { display: none !important; }
      .nav-links { gap: 14px !important; }
      .nav-links button { font-size: 11px !important; }
    }
    @media (max-width: 480px) {
      .prod-grid { grid-template-columns: 1fr !important; }
      .chi-values { grid-template-columns: 1fr 1fr !important; }
      .stats-row { grid-template-columns: repeat(2, 1fr) !important; }
    }
  `;
  document.head.appendChild(s);
}

const GREEN  = '#2d4a2d';
const ACCENT = '#b8603a';
const GOLD   = '#c4a882';
const MUTED  = '#6b6560';
const BORDER = '#e8e0d5';
const CARD   = '#ffffff';
const BG     = '#faf7f2';
const SOFT   = '#f0ebe0';

const DEPT_COLORS = {
  "Direzione":  { bg:'#fdf0ea', text:'#b8603a', dot:'#b8603a' },
  "Tech":       { bg:'#eaf0fd', text:'#2d5fb8', dot:'#2d5fb8' },
  "Creativo":   { bg:'#f4eafd', text:'#7b3ab8', dot:'#7b3ab8' },
  "Marketing":  { bg:'#eaf4fd', text:'#2980b9', dot:'#2980b9' },
  "Vendite":    { bg:'#fdf6ea', text:'#c07a20', dot:'#c07a20' },
  "Qualità":    { bg:'#eafdf0', text:'#1e8a40', dot:'#1e8a40' },
  "Operazioni": { bg:'#fdeaea', text:'#b83030', dot:'#b83030' },
  "HR":         { bg:'#eafaf7', text:'#0f8a70', dot:'#0f8a70' },
};

const TEAM = [
  { name:"Laura",      role:"Amministratrice Delegata",  dept:"Direzione"  },
  { name:"Maria",      role:"Responsabile Finanziario",  dept:"Direzione"  },
  { name:"Adam",       role:"Sviluppatore Web & IT",     dept:"Tech"       },
  { name:"Mia",        role:"Graphic Designer – Brand",  dept:"Creativo"   },
  { name:"Erika",      role:"Graphic Designer – Logo",   dept:"Creativo"   },
  { name:"Sara",       role:"Marketing Manager",         dept:"Marketing"  },
  { name:"Giorgia",    role:"Social Media Manager",      dept:"Marketing"  },
  { name:"Giulia",     role:"PR & Comunicazione",        dept:"Marketing"  },
  { name:"Alessandra", role:"Brand & Influencer",        dept:"Marketing"  },
  { name:"Sofia",      role:"Responsabile Vendite",      dept:"Vendite"    },
  { name:"Zoe",        role:"Assistenza Clienti",        dept:"Vendite"    },
  { name:"Nicole",     role:"Qualità & Certificazioni",  dept:"Qualità"    },
  { name:"Anita",      role:"Logistica & Supply Chain",  dept:"Operazioni" },
  { name:"Leonardo",   role:"Responsabile Produzione",   dept:"Operazioni" },
  { name:"Lara",       role:"Gestione Risorse Umane",    dept:"HR"         },
];

const PRODOTTI = [
  { emoji:"💄", nome:"VelvetLip",   cat:"Labbra",   prezzo:14.90, tag:"Best Seller", tagCol:"#b8603a",
    desc:"Rossetto vegano a texture vellutata. Idrata e colora in un gesto, tenuta fino a 8 ore senza trasferimento." },
  { emoji:"🌿", nome:"GreenBase",  cat:"Viso",     prezzo:22.50, tag:"Novità",      tagCol:"#2d4a2d",
    desc:"Fondotinta leggero a base di aloe vera biologica. Copertura naturale con SPF 15 incluso." },
  { emoji:"✨", nome:"GlowSerum",  cat:"Skincare",  prezzo:28.00, tag:"Top",         tagCol:"#7b3ab8",
    desc:"Siero illuminante con vitamina C e acido ialuronico. Luminosità visibile già dalla prima settimana." },
  { emoji:"👁️",nome:"PureLiner",  cat:"Occhi",    prezzo:11.90, tag:null,          tagCol:null,
    desc:"Eyeliner waterproof a punta fine. Tratto preciso e intenso, asciugatura in 30 secondi." },
  { emoji:"🌸", nome:"BlushBio",   cat:"Viso",     prezzo:16.00, tag:null,          tagCol:null,
    desc:"Blush in polvere compatta con pigmenti naturali. Dona un incarnato fresco, texture ultra-sfumabile." },
  { emoji:"🧴", nome:"SoftMask",   cat:"Skincare",  prezzo:19.90, tag:"Esclusivo",  tagCol:"#2980b9",
    desc:"Maschera viso all'argilla rosa e olio di rosa canina. Purifica i pori in soli 10 minuti." },
  { emoji:"💅", nome:"NaturNail",  cat:"Unghie",   prezzo:8.90,  tag:null,          tagCol:null,
    desc:"Smalto 5-free privo di sostanze nocive. Asciugatura rapida, disponibile in 18 colori." },
  { emoji:"🌙", nome:"NightCream", cat:"Skincare",  prezzo:24.50, tag:"Promo",      tagCol:"#e67e22",
    desc:"Crema notte rigenerante con burro di karité e retinolo vegetale. Pelle morbida al risveglio." },
];

// MODIFICA 1: stipendi aggiornati a €750
const USCITE = [
  { label:"Stipendi (€750 × 15 soci)", v:11250 },
  { label:"Prodotti & materie prime",   v:2500  },
  { label:"Affitto sede operativa",     v:800   },
  { label:"Marketing & pubblicità",     v:600   },
  { label:"Packaging cruelty-free",     v:500   },
  { label:"Certificazioni (rata mese)", v:150   },
  { label:"Hosting & infrastruttura",   v:50    },
  { label:"Spese generali",            v:400   },
];
const TOT_USCITE = USCITE.reduce((a,b) => a+b.v, 0);
const RATA = 1547;

// ── Utilities ───────────────────────────────────────────────────────────────

function useInView(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold:0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

function Section({ id, children, style={} }) {
  const ref = useRef(null);
  const visible = useInView(ref);
  return (
    <section id={id} ref={ref} className={`section-fade${visible?' visible':''}`}
      style={{ padding:'80px 0', ...style }}>
      {children}
    </section>
  );
}

function Container({ children, style={} }) {
  return (
    <div style={{
      maxWidth: 1400,
      width: '100%',
      margin: '0 auto',
      padding: '0 clamp(16px, 4vw, 80px)',
      ...style,
    }}>{children}</div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
      <div style={{ width:28, height:2, background:GREEN, borderRadius:2 }}/>
      <span style={{ fontSize:11, fontWeight:600, letterSpacing:3, textTransform:'uppercase', color:GREEN }}>{children}</span>
    </div>
  );
}

function SectionTitle({ children, style={} }) {
  return (
    <h2 style={{
      fontFamily:"'Cormorant Garamond',serif",
      fontSize:'clamp(30px,4vw,52px)',
      fontWeight:600, lineHeight:1.1, color:'#1c1c1a', ...style,
    }}>{children}</h2>
  );
}

function LogoMark({ size=32 }) {
  const [hasPng, setHasPng] = useState(true);
  return hasPng
    ? <img src="/logo.png" alt="logo" height={size} style={{ width:'auto', objectFit:'contain' }}
        onError={() => setHasPng(false)} />
    : (
      <svg className="leaf" width={size} height={size} viewBox="0 0 32 32" fill="none">
        <path d="M16 2C16 2,27 10,27 20c0 5.5-4.9 9-11 9S5 25.5,5 20C5 10,16 2,16 2Z" fill={GREEN}/>
        <line x1="16" y1="29" x2="16" y2="14" stroke={BG} strokeWidth="1.4"/>
        <line x1="16" y1="18" x2="21" y2="13" stroke={BG} strokeWidth="1"/>
        <line x1="16" y1="24" x2="11" y2="19" stroke={BG} strokeWidth="1"/>
      </svg>
    );
}

// ── Navbar ──────────────────────────────────────────────────────────────────

function Navbar({ active }) {
  const links = [
    { id:'chi-siamo', label:'Chi siamo' },
    { id:'team',      label:'Team'      },
    { id:'prodotti',  label:'Prodotti'  },
    { id:'finanza',   label:'Finanza'   },
  ];
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior:'smooth' });
  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:100,
      background:'rgba(250,247,242,0.92)', backdropFilter:'blur(14px)',
      borderBottom:`1px solid ${BORDER}`,
      padding:'0 clamp(16px,4vw,80px)', height:60,
      display:'flex', alignItems:'center', justifyContent:'space-between',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}
        onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}>
        <LogoMark size={36}/>
        <div>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:700, letterSpacing:-0.3 }}>
            DIV<span style={{color:ACCENT}}>4</span>SSAA
          </span>
          <span style={{ fontSize:9, color:MUTED, letterSpacing:2, textTransform:'uppercase', marginLeft:8 }}>snc</span>
        </div>
      </div>
      <div className="nav-links" style={{ display:'flex', alignItems:'center', gap:28 }}>
        {links.map(l => (
          <button key={l.id} className={`nav-link${active===l.id?' active':''}`}
            onClick={() => scrollTo(l.id)}>{l.label}</button>
        ))}
      </div>
    </nav>
  );
}

// ── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 100); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center',
      background:`linear-gradient(160deg, #f0ebe0 0%, ${BG} 60%)`,
      paddingTop:60,
    }}>
      <Container>
        <div className="hero-flex" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:60 }}>
          <div style={{ maxWidth:640, opacity:show?1:0, transform:show?'none':'translateY(30px)', transition:'all 1s ease' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
              <div style={{ width:20, height:2, background:GREEN, borderRadius:2 }}/>
              <span style={{ fontSize:11, fontWeight:600, letterSpacing:3, textTransform:'uppercase', color:GREEN }}>
                Società in Nome Collettivo
              </span>
            </div>
            <h1 style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:'clamp(40px,6vw,80px)',
              fontWeight:600, lineHeight:1.05, letterSpacing:'-0.01em', marginBottom:24,
            }}>
              Bellezza<br/>
              <span style={{ color:ACCENT, fontStyle:'italic' }}>senza compromessi.</span>
            </h1>
            <p style={{ fontSize:16, color:MUTED, lineHeight:1.8, maxWidth:480, marginBottom:12 }}>
              DIV4SSAA è un progetto di 15 giovani fondatori che credono in una cosmetica etica, cruelty-free e accessibile.
            </p>
            <p style={{ fontSize:13, color:GOLD, fontStyle:'italic', marginBottom:36 }}>
              "Bella senza colpa."
            </p>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <button className="btn-primary" onClick={() => document.getElementById('prodotti')?.scrollIntoView({behavior:'smooth'})}>
                Scopri i prodotti
              </button>
              <button className="btn-outline" onClick={() => document.getElementById('chi-siamo')?.scrollIntoView({behavior:'smooth'})}>
                Chi siamo
              </button>
            </div>
          </div>

          <div className="hero-img" style={{
            width:380, height:380, flexShrink:0, position:'relative',
            opacity:show?1:0, transition:'opacity 1.2s ease 0.4s',
          }}>
            <div style={{
              width:'100%', height:'100%',
              borderRadius:'40% 60% 60% 40% / 50% 40% 60% 50%',
              background:`linear-gradient(135deg, #e8f0e8, #fdf0ea)`,
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:120,
            }}>🪞</div>
            {[
              { top:10,  right:20,  emoji:'💄', size:52 },
              { top:60,  left:-10,  emoji:'✨', size:44 },
              { bottom:30, right:0, emoji:'🌸', size:48 },
              { bottom:60, left:20, emoji:'💅', size:40 },
            ].map((b,i) => (
              <div key={i} style={{
                position:'absolute', top:b.top, right:b.right, bottom:b.bottom, left:b.left,
                width:b.size+16, height:b.size+16,
                background:CARD, borderRadius:14, boxShadow:'0 4px 16px rgba(0,0,0,0.08)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:b.size*0.7,
                animation:`fadeIn 0.6s ease ${0.6+i*0.15}s both`,
              }}>{b.emoji}</div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row" style={{
          display:'grid', gridTemplateColumns:'repeat(4,1fr)',
          gap:1, marginTop:60,
          background:BORDER, borderRadius:16, overflow:'hidden',
          opacity:show?1:0, transition:'opacity 0.8s ease 0.8s',
        }}>
          {[
            { val:'15',      label:'Soci fondatori'    },
            { val:'€30.000', label:'Capitale sociale'  },
            { val:'8',       label:'Prodotti a catalogo'},
            { val:'100%',    label:'Cruelty-Free'      },
          ].map((s,i) => (
            <div key={i} style={{ background:CARD, padding:'24px 20px', textAlign:'center' }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:700, color:GREEN, marginBottom:4 }}>
                {s.val}
              </div>
              <div style={{ fontSize:12, color:MUTED }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

// ── Chi siamo ───────────────────────────────────────────────────────────────

function ChiSiamo() {
  return (
    <Section id="chi-siamo" style={{ background:SOFT }}>
      <Container>
        <div className="chi-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'start' }}>
          <div>
            <SectionLabel>Chi siamo</SectionLabel>
            <SectionTitle style={{ marginBottom:20 }}>
              Un'idea nata<br/>
              <span style={{ color:ACCENT, fontStyle:'italic' }}>in classe.</span>
            </SectionTitle>
            <p style={{ fontSize:14, color:MUTED, lineHeight:1.8, marginBottom:12 }}>
              Siamo la <strong style={{color:'#1c1c1a'}}>4ª SSAA</strong>, 15 studenti dell'indirizzo socio-sanitario che hanno trasformato una simulazione d'impresa in un brand reale.
            </p>
            <p style={{ fontSize:14, color:MUTED, lineHeight:1.8 }}>
              Vendiamo cosmetici e trucchi <strong style={{color:GREEN}}>non testati su animali</strong>: perché la bellezza non dovrebbe avere un costo etico.
            </p>

            <div className="chi-values" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:28 }}>
              {[
                { icon:'🌿', title:'Cruelty-Free',  desc:'Zero test su animali.' },
                { icon:'♻️', title:'Sostenibile',   desc:'Packaging eco-compatibile.' },
                { icon:'💎', title:'Qualità',       desc:'Ingredienti certificati.' },
                { icon:'🤝', title:'Trasparenza',   desc:'15 soci, un progetto.' },
              ].map((v,i) => (
                <div key={i} style={{
                  background:CARD, borderRadius:12, padding:'16px 14px',
                  boxShadow:'0 1px 8px rgba(0,0,0,0.05)',
                }}>
                  <div style={{ fontSize:24, marginBottom:8 }}>{v.icon}</div>
                  <div style={{ fontWeight:600, fontSize:13, marginBottom:4 }}>{v.title}</div>
                  <div style={{ fontSize:12, color:MUTED, lineHeight:1.5 }}>{v.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background:GREEN, borderRadius:20, padding:'32px 28px' }} className="dati-box">
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', letterSpacing:3, textTransform:'uppercase', marginBottom:24 }}>
              Dati societari
            </div>
            {[
              ['Forma giuridica',  'SNC'],
              ['Ragione sociale',  'DIV4SSAA snc'],
              ['Numero soci',      '15'],
              ['Conferimento p/c', '€2.000'],
              ['Capitale totale',  '€30.000'],
              ['Sede',             'Classe 4ª SSAA'],
              ['Slogan',           '"Bella senza colpa."'],
            ].map(([label, val], i, arr) => (
              <div key={i} style={{
                display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12,
                padding:'12px 0',
                borderBottom: i < arr.length-1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
              }}>
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>{label}</span>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:'white', textAlign:'right' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

// ── Team ────────────────────────────────────────────────────────────────────

function Team() {
  const depts = [...new Set(TEAM.map(m => m.dept))];
  const [activeFilter, setActiveFilter] = useState('Tutti');
  const filtered = activeFilter === 'Tutti' ? TEAM : TEAM.filter(m => m.dept === activeFilter);

  return (
    <Section id="team">
      <Container>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:20, marginBottom:36 }}>
          <div>
            <SectionLabel>Il team</SectionLabel>
            <SectionTitle>15 soci,<br/><span style={{color:ACCENT,fontStyle:'italic'}}>15 ruoli.</span></SectionTitle>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {['Tutti',...depts].map(d => {
              const col = d==='Tutti' ? GREEN : DEPT_COLORS[d]?.dot;
              const active = activeFilter===d;
              return (
                <button key={d} className="filter-btn" onClick={() => setActiveFilter(d)} style={{
                  padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:500,
                  border:`1.5px solid ${active ? col : BORDER}`,
                  background: active ? col : 'transparent',
                  color: active ? 'white' : MUTED,
                }}>{d}</button>
              );
            })}
          </div>
        </div>

        <div style={{ background:CARD, borderRadius:16, overflow:'hidden', boxShadow:'0 2px 16px rgba(0,0,0,0.06)' }}>
          <div style={{
            display:'grid', gridTemplateColumns:'1fr 2fr 1fr 1fr',
            padding:'12px 24px', background:SOFT, borderBottom:`1px solid ${BORDER}`,
          }}>
            {['Nome','Ruolo','Dipartimento','Stipendio'].map((h,i) => (
              <span key={i} style={{ fontSize:10, fontWeight:600, letterSpacing:2, textTransform:'uppercase', color:MUTED }}>{h}</span>
            ))}
          </div>
          {filtered.map((m,i) => {
            const dc = DEPT_COLORS[m.dept];
            return (
              <div key={m.name} className="member-row" style={{
                display:'grid', gridTemplateColumns:'1fr 2fr 1fr 1fr',
                padding:'16px 24px', alignItems:'center',
                borderBottom: i<filtered.length-1 ? `1px solid ${BORDER}` : 'none',
                background:CARD, transition:'background 0.2s',
                animation:`slideIn 0.4s ease ${i*0.04}s both`,
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{
                    width:36, height:36, borderRadius:10,
                    background:dc.bg, border:`1px solid ${dc.dot}30`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:"'Cormorant Garamond',serif",
                    fontSize:15, fontWeight:700, color:dc.dot, flexShrink:0,
                  }}>{m.name.slice(0,2).toUpperCase()}</div>
                  <span style={{ fontWeight:600, fontSize:15 }}>{m.name}</span>
                </div>
                <span style={{ fontSize:13, color:MUTED }}>{m.role}</span>
                <div className="team-dept-label">
                  <span style={{
                    display:'inline-block', background:dc.bg, color:dc.text,
                    fontSize:10, fontWeight:600, letterSpacing:1,
                    padding:'3px 10px', borderRadius:20, textTransform:'uppercase',
                  }}>{m.dept}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  {/* MODIFICA 2: stipendio €750/mese */}
                  <span style={{ fontSize:13, fontWeight:600, color:GREEN }}>€750/mese</span>
                  <span className="member-arrow" style={{ color:MUTED, opacity:0, transition:'all 0.2s' }}>→</span>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop:12, fontSize:12, color:MUTED, textAlign:'right' }}>
          Quota capitale: €2.000 a socio · Totale conferimenti: €30.000
        </div>
      </Container>
    </Section>
  );
}

// ── Prodotti ────────────────────────────────────────────────────────────────

function Prodotti() {
  const cats = ['Tutti', ...[...new Set(PRODOTTI.map(p => p.cat))]];
  const [filter, setFilter] = useState('Tutti');
  const list = filter==='Tutti' ? PRODOTTI : PRODOTTI.filter(p => p.cat===filter);

  return (
    <Section id="prodotti" style={{ background:SOFT }}>
      <Container>
        <div style={{ marginBottom:36 }}>
          <SectionLabel>Catalogo</SectionLabel>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
            <SectionTitle>I nostri<br/><span style={{color:ACCENT,fontStyle:'italic'}}>prodotti.</span></SectionTitle>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {cats.map(c => (
                <button key={c} className="filter-btn" onClick={() => setFilter(c)} style={{
                  padding:'7px 16px', borderRadius:20, fontSize:12, fontWeight:500,
                  border:`1.5px solid ${filter===c ? GREEN : BORDER}`,
                  background: filter===c ? GREEN : CARD,
                  color: filter===c ? 'white' : MUTED,
                }}>{c}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="prod-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))', gap:16 }}>
          {list.map((p,i) => (
            <div key={p.nome} className="prod-card" style={{
              background:CARD, borderRadius:16, overflow:'hidden',
              boxShadow:'0 2px 12px rgba(0,0,0,0.06)',
              animation:`fadeUp 0.5s ease ${i*0.07}s both`,
            }}>
              <div style={{
                height:130, background:`linear-gradient(135deg,#e8f0e8,#fdf0ea)`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:52, position:'relative',
              }}>
                {p.emoji}
                {p.tag && (
                  <div style={{
                    position:'absolute', top:10, right:10,
                    background:p.tagCol, color:'white',
                    fontSize:9, fontWeight:700, letterSpacing:1, textTransform:'uppercase',
                    padding:'3px 10px', borderRadius:20,
                  }}>{p.tag}</div>
                )}
              </div>
              <div style={{ padding:'14px 16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:15, marginBottom:2 }}>{p.nome}</div>
                    <div style={{ fontSize:10, color:MUTED, letterSpacing:1.5, textTransform:'uppercase' }}>{p.cat}</div>
                  </div>
                  <div style={{
                    fontFamily:"'Cormorant Garamond',serif",
                    fontSize:20, fontWeight:700, color:ACCENT, flexShrink:0, marginLeft:8,
                  }}>€{p.prezzo.toFixed(2)}</div>
                </div>
                <p style={{ fontSize:12, color:MUTED, lineHeight:1.65 }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

// ── Finanza ─────────────────────────────────────────────────────────────────

function Finanza() {
  const ref = useRef(null);
  const visible = useInView(ref);

  return (
    <Section id="finanza">
      <Container>
        <div style={{ marginBottom:44 }}>
          <SectionLabel>Situazione finanziaria</SectionLabel>
          <SectionTitle>Numeri<br/><span style={{color:ACCENT,fontStyle:'italic'}}>reali.</span></SectionTitle>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:14, marginBottom:28 }}>
          {[
            { label:'Capitale Sociale', val:'€30.000', sub:'2.000€ × 15 soci',      col:GREEN,     icon:'💰' },
            { label:'Debito Bancario',  val:'€80.000', sub:'Finanziamento iniziale', col:'#c0392b',  icon:'📋' },
            { label:'Rata Mensile',     val:'€1.547',  sub:'Piano 5 anni · tasso 6%',col:'#e67e22',  icon:'📅' },
            // MODIFICA 3: KPI stipendio aggiornato
            { label:'Stipendio/Socio',  val:'€750/m',  sub:'+ quota capitale €2k',   col:ACCENT,    icon:'👤' },
          ].map((k,i) => (
            <div key={i} style={{
              background:CARD, borderRadius:16, padding:'22px 20px',
              boxShadow:'0 2px 12px rgba(0,0,0,0.05)', borderLeft:`3px solid ${k.col}`,
            }}>
              <div style={{ fontSize:22, marginBottom:10 }}>{k.icon}</div>
              <div style={{ fontSize:10, color:MUTED, letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>{k.label}</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:700, color:k.col, lineHeight:1 }}>{k.val}</div>
              <div style={{ fontSize:11, color:MUTED, marginTop:6 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        <div className="fin-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
          <div style={{ background:CARD, borderRadius:16, padding:28, boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:600, marginBottom:20 }}>Uscite mensili</h3>
            {USCITE.map((u,i) => (
              <div key={i} style={{
                display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'9px 0', borderBottom:i<USCITE.length-1?`1px solid ${BORDER}`:'none',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:3, height:16, background:GOLD, borderRadius:2, flexShrink:0 }}/>
                  <span style={{ fontSize:13, color:MUTED }}>{u.label}</span>
                </div>
                <span style={{ fontSize:13, fontWeight:500 }}>€{u.v.toLocaleString('it')}</span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', paddingTop:14, marginTop:4, fontWeight:700 }}>
              <span>Totale</span>
              <span style={{ color:'#c0392b', fontFamily:"'Cormorant Garamond',serif", fontSize:22 }}>
                €{TOT_USCITE.toLocaleString('it')}
              </span>
            </div>
            <div style={{ fontSize:11, color:MUTED, marginTop:6 }}>
              Con rata debito → €{(TOT_USCITE+RATA).toLocaleString('it')}/mese
            </div>
          </div>

          <div style={{ background:CARD, borderRadius:16, padding:28, boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:600, marginBottom:20 }}>Obiettivi fatturato</h3>
            {[
              { label:'Anno 1 – Avvio',         val:20000, col:'#3a6eb8' },
              { label:'Anno 2 – Crescita',       val:30000, col:ACCENT },
              { label:'Anno 3 – Consolidamento', val:45000, col:GREEN },
            ].map((t,i) => {
              const net  = t.val-TOT_USCITE-RATA;
              const perc = Math.min(100, Math.round((t.val/(TOT_USCITE+RATA))*100));
              return (
                <div key={i} style={{ marginBottom:18 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ fontSize:13, color:MUTED }}>{t.label}</span>
                    <span style={{ fontWeight:700, color:t.col, fontSize:14 }}>€{t.val.toLocaleString('it')}/m</span>
                  </div>
                  <div style={{ height:6, background:SOFT, borderRadius:4, marginBottom:6, overflow:'hidden' }}>
                    <div style={{
                      height:'100%', borderRadius:4, background:t.col,
                      width:visible?`${perc}%`:'0%',
                      transition:`width 1.2s cubic-bezier(0.34,1.56,0.64,1) ${i*0.25}s`,
                    }}/>
                  </div>
                  <div style={{ fontSize:11, color:MUTED }}>
                    Margine netto:&nbsp;
                    <span style={{ fontWeight:600, color:net>=0?GREEN:'#c0392b' }}>
                      {net>=0?'+':''}€{net.toLocaleString('it')}/mese
                    </span>
                  </div>
                </div>
              );
            })}
            <div style={{ padding:'12px 14px', background:'#e8f0e8', borderRadius:10, fontSize:13, color:GREEN, fontWeight:600 }}>
              🎯 Break-even: €{(TOT_USCITE+RATA).toLocaleString('it')}/mese
            </div>
          </div>
        </div>

        <div ref={ref} style={{ background:CARD, borderRadius:16, padding:28, boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:600, marginBottom:28 }}>
            Piano rimborso debito – 5 anni
          </h3>
          <div className="anni-grid" style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, alignItems:'end' }}>
            {[1,2,3,4,5].map(anno => {
              const pagato  = RATA*12*anno;
              const perc    = Math.min(100,(pagato/80000)*100);
              const rimasto = Math.max(0,80000-pagato);
              return (
                <div key={anno} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:11, color:MUTED, marginBottom:10, fontWeight:500 }}>Anno {anno}</div>
                  <div style={{ height:120, background:SOFT, borderRadius:10, position:'relative', overflow:'hidden' }}>
                    <div style={{
                      position:'absolute', bottom:0, left:0, right:0,
                      height:visible?`${perc}%`:'0%',
                      background:`linear-gradient(to top,${GREEN},${GREEN}80)`,
                      transition:`height 1.4s cubic-bezier(0.34,1.56,0.64,1) ${anno*0.15}s`,
                      borderRadius:'0 0 8px 8px',
                    }}/>
                    <div style={{
                      position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
                      fontWeight:700, fontSize:14, color:perc>50?'white':MUTED,
                    }}>{Math.round(perc)}%</div>
                  </div>
                  <div style={{ fontSize:11, fontWeight:600, marginTop:8, color:rimasto===0?GREEN:ACCENT }}>
                    {rimasto===0?'✅ Saldato':`€${Math.round(rimasto/1000)}k`}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop:20, textAlign:'center', fontSize:12, color:MUTED }}>
            €1.547/mese × 60 mesi = <strong style={{color:GREEN}}>€92.820 totale rimborsato</strong> (inclusi interessi ~6%)
          </div>
        </div>
      </Container>
    </Section>
  );
}

// ── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ background:GREEN, color:'rgba(255,255,255,0.85)', padding:'40px clamp(16px,4vw,80px)' }}>
      <div style={{ maxWidth:1400, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <LogoMark size={40}/>
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:'white' }}>DIV4SSAA snc</div>
            <div style={{ fontSize:10, letterSpacing:2, opacity:0.5, textTransform:'uppercase' }}>Bella senza colpa · Cruelty-Free 2025</div>
          </div>
        </div>
        <div style={{ fontSize:12, opacity:0.5, textAlign:'right' }}>
          Sito sviluppato da Adam · Hosting Railway<br/>
          Logo — Mia & Erika
        </div>
      </div>
    </footer>
  );
}

// ── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeNav, setActiveNav]       = useState('');
  const [introVisible, setIntroVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIntroVisible(false), 2400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (introVisible) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveNav(e.target.id); });
    }, { threshold:0.3 });
    ['chi-siamo','team','prodotti','finanza'].forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [introVisible]);

  return (
    <>
      {/* Intro */}
      <div style={{
        position:'fixed', inset:0, zIndex:200,
        background:`radial-gradient(ellipse at center, #ede5d0, ${BG})`,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        opacity:introVisible?1:0, pointerEvents:introVisible?'all':'none',
        transition:'opacity 1s ease',
      }}>
        <LogoMark size={80}/>
        <div style={{
          fontFamily:"'Cormorant Garamond',serif",
          fontSize:'clamp(52px,12vw,96px)', fontWeight:600,
          color:'#1c1c1a', marginTop:16,
          animation:'reveal 1.6s cubic-bezier(0.16,1,0.3,1) 0.3s both',
        }}>
          DIV<span style={{color:ACCENT}}>4</span>SSAA
        </div>
        <div style={{ fontSize:11, letterSpacing:4, color:MUTED, textTransform:'uppercase', marginTop:10, animation:'fadeIn 1s ease 1s both' }}>
          Bella senza colpa · Cosmetici Cruelty-Free
        </div>
      </div>

      <div style={{ opacity:introVisible?0:1, transition:'opacity 0.6s ease' }}>
        <Navbar active={activeNav}/>
        <Hero/>
        <ChiSiamo/>
        <Team/>
        <Prodotti/>
        <Finanza/>
        <Footer/>
        {/* MODIFICA 4: Chatbot aggiunto */}
        <Chatbot/>
      </div>
    </>
  );
}