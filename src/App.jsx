import { useState, useEffect } from "react";

if (!document.querySelector('#d4-fonts')) {
  const l = document.createElement('link');
  l.id = 'd4-fonts';
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap';
  document.head.appendChild(l);
}
if (!document.querySelector('#d4-style')) {
  const s = document.createElement('style');
  s.id = 'd4-style';
  s.textContent = `
    @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
    @keyframes leafSway { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
    .leaf-icon { animation: leafSway 3s ease-in-out infinite; transform-origin: bottom center; }
    .team-card:hover { transform: translateY(-3px) !important; box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; }
    * { box-sizing: border-box; }
    ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #c4b8a8; border-radius: 4px; }
  `;
  document.head.appendChild(s);
}

const C = {
  bg: '#f5f0e8', dark: '#1a1a14', green: '#2d4a2d',
  accent: '#b8603a', muted: '#8a8278', card: '#ffffff',
  border: '#e4ddd2', softGreen: '#e8f0e8',
};

const DEPT_COLORS = {
  "Direzione": "#b8603a", "Tech": "#3a6eb8", "Creativo": "#8b3ab8",
  "Marketing": "#2980b9", "Vendite": "#c0892a", "Qualità": "#27ae60",
  "Operazioni": "#c0392b", "HR": "#16a085",
};

const TEAM = [
  { name: "Laura", role: "CEO & Amministratrice", dept: "Direzione" },
  { name: "Maria", role: "CFO – Resp. Finanziario", dept: "Direzione" },
  { name: "Adam", role: "Web Developer & IT", dept: "Tech" },
  { name: "Mia", role: "Graphic Designer – Brand", dept: "Creativo" },
  { name: "Erika", role: "Graphic Designer – Logo", dept: "Creativo" },
  { name: "Sara", role: "Marketing Manager", dept: "Marketing" },
  { name: "Giorgia", role: "Social Media Manager", dept: "Marketing" },
  { name: "Giulia", role: "PR & Comunicazione", dept: "Marketing" },
  { name: "Alessandra", role: "Brand & Influencer", dept: "Marketing" },
  { name: "Sofia", role: "Sales Manager", dept: "Vendite" },
  { name: "Zoe", role: "Customer Service", dept: "Vendite" },
  { name: "Nicole", role: "Qualità & Certificazioni", dept: "Qualità" },
  { name: "Anita", role: "Logistica & Supply Chain", dept: "Operazioni" },
  { name: "Leonardo", role: "Resp. Produzione", dept: "Operazioni" },
  { name: "Lara", role: "HR Manager", dept: "HR" },
];

const USCITE = [
  { label: "Stipendi (300€ × 15)", value: 4500 },
  { label: "Prodotti & materie prime", value: 2500 },
  { label: "Affitto sede", value: 800 },
  { label: "Marketing & ADV", value: 600 },
  { label: "Packaging cruelty-free", value: 500 },
  { label: "Certificazioni (rata)", value: 150 },
  { label: "Hosting & Tech (Railway)", value: 50 },
  { label: "Spese varie", value: 400 },
];
const TOT_USCITE = USCITE.reduce((a, b) => a + b.value, 0);
const RATA = 1547;

function LeafSVG({ size = 32, color = C.green }) {
  return (
    <svg className="leaf-icon" width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2C16 2,27 10,27 20c0 5.5-4.9 9-11 9S5 25.5,5 20C5 10,16 2,16 2Z" fill={color}/>
      <line x1="16" y1="29" x2="16" y2="14" stroke={C.bg} strokeWidth="1.4"/>
      <line x1="16" y1="18" x2="21" y2="13" stroke={C.bg} strokeWidth="1"/>
      <line x1="16" y1="24" x2="11" y2="19" stroke={C.bg} strokeWidth="1"/>
    </svg>
  );
}

function LogoBlock({ scale = 1 }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 10*scale }}>
      <LeafSVG size={36*scale} />
      <div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize: 26*scale, fontWeight:700, color:C.dark, lineHeight:1, letterSpacing:-0.5 }}>
          DIV<span style={{color:C.accent}}>4</span>SSAA
        </div>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize: 9*scale, fontWeight:300, color:C.muted, letterSpacing:3, textTransform:'uppercase', marginTop:2 }}>
          SNC · Cruelty Free
        </div>
      </div>
    </div>
  );
}

function Tag({ children, color }) {
  return (
    <span style={{ display:'inline-block', background: color+'20', color, fontSize:10, fontWeight:600,
      padding:'2px 8px', borderRadius:20, letterSpacing:0.5, textTransform:'uppercase' }}>
      {children}
    </span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background:C.card, borderRadius:14, padding:20,
      boxShadow:'0 1px 10px rgba(0,0,0,0.06)', ...style }}>
      {children}
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState(0);
  const [tab, setTab] = useState('team');

  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ background: C.bg, minHeight:'100vh', fontFamily:"'DM Sans',sans-serif", color:C.dark }}>

      {/* ── INTRO OVERLAY ── */}
      <div style={{
        position:'fixed', inset:0, zIndex:100, background:C.bg,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        opacity: phase===0 ? 1 : 0, pointerEvents: phase===0 ? 'all' : 'none',
        transition:'opacity 1s ease',
      }}>
        <div style={{ animation:'fadeUp 0.8s ease both' }}>
          <LogoBlock scale={2} />
        </div>
        <div style={{ marginTop:28, fontSize:12, color:C.muted, letterSpacing:3, textTransform:'uppercase', animation:'fadeUp 0.8s ease 0.3s both' }}>
          Piano Aziendale · 2025
        </div>
      </div>

      {/* ── CORNER LOGO (fixed) ── */}
      <div style={{
        position:'fixed', top:14, left:14, zIndex:50,
        opacity: phase===1 ? 1 : 0, transition:'opacity 0.8s ease 0.6s',
        background: C.bg+'dd', backdropFilter:'blur(10px)',
        padding:'8px 14px', borderRadius:10,
        boxShadow:'0 2px 14px rgba(0,0,0,0.09)',
      }}>
        <LogoBlock scale={0.55} />
      </div>

      {/* ── MAIN ── */}
      <div style={{
        maxWidth:980, margin:'0 auto', padding:'72px 16px 48px',
        opacity: phase===1 ? 1 : 0, transition:'opacity 0.6s ease 1s',
      }}>

        {/* Title */}
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(26px,5vw,44px)', fontWeight:700, marginBottom:6 }}>
            Piano Aziendale
          </h1>
          <p style={{ color:C.muted, fontSize:13 }}>DIV4SSAA snc · 15 soci fondatori · Cruelty-Free Cosmetics</p>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:28 }}>
          <div style={{ display:'flex', gap:3, background:C.border, padding:4, borderRadius:12 }}>
            {[{id:'team',label:'👥 Team'},{id:'finanza',label:'💰 Finanza'},{id:'info',label:'📋 Azienda'}].map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{
                padding:'8px 18px', borderRadius:9, border:'none', cursor:'pointer',
                fontSize:13, fontWeight:500, fontFamily:"'DM Sans',sans-serif",
                background: tab===t.id ? C.card : 'transparent',
                color: tab===t.id ? C.dark : C.muted,
                boxShadow: tab===t.id ? '0 1px 6px rgba(0,0,0,0.1)' : 'none',
                transition:'all 0.2s',
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* ── TEAM ── */}
        {tab==='team' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:12 }}>
            {TEAM.map((p,i)=>(
              <div key={i} className="team-card" style={{
                background:C.card, borderRadius:12, padding:16,
                borderLeft:`3px solid ${DEPT_COLORS[p.dept]}`,
                boxShadow:'0 1px 8px rgba(0,0,0,0.05)',
                transition:'all 0.25s ease', cursor:'default',
              }}>
                <div style={{marginBottom:8}}><Tag color={DEPT_COLORS[p.dept]}>{p.dept}</Tag></div>
                <div style={{fontWeight:600, fontSize:16, marginBottom:2}}>{p.name}</div>
                <div style={{color:C.muted, fontSize:12, lineHeight:1.4}}>{p.role}</div>
                <div style={{marginTop:10, paddingTop:10, borderTop:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', fontSize:11}}>
                  <span style={{color:C.green, fontWeight:600}}>€300/mese</span>
                  <span style={{color:C.muted}}>quota €2k</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── FINANZA ── */}
        {tab==='finanza' && (
          <div>
            {/* KPI top */}
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:12, marginBottom:20}}>
              {[
                {label:'Capitale Sociale', val:'€30.000', sub:'2.000€ × 15 soci', col:C.green},
                {label:'Debito Bancario', val:'€80.000', sub:'Finanziamento iniziale', col:'#c0392b'},
                {label:'Rata Mensile', val:'€1.547', sub:'5 anni · tasso 6%', col:'#c0392b'},
                {label:'Stipendio/Socio', val:'€300/m', sub:'+ quota capitale €2k', col:C.accent},
              ].map((k,i)=>(
                <Card key={i} style={{borderTop:`3px solid ${k.col}`, padding:'14px 16px'}}>
                  <div style={{fontSize:10, color:C.muted, textTransform:'uppercase', letterSpacing:1, marginBottom:6}}>{k.label}</div>
                  <div style={{fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:k.col}}>{k.val}</div>
                  <div style={{fontSize:11, color:C.muted, marginTop:3}}>{k.sub}</div>
                </Card>
              ))}
            </div>

            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))', gap:16, marginBottom:16}}>
              {/* Uscite */}
              <Card>
                <h3 style={{fontSize:15, fontWeight:600, marginBottom:14}}>📤 Uscite Mensili</h3>
                {USCITE.map((item,i)=>(
                  <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'7px 0',
                    borderBottom: i<USCITE.length-1 ? `1px solid ${C.border}` : 'none', fontSize:13}}>
                    <span style={{color:C.muted}}>{item.label}</span>
                    <span style={{fontWeight:500}}>€{item.value.toLocaleString('it')}</span>
                  </div>
                ))}
                <div style={{display:'flex', justifyContent:'space-between', paddingTop:10, marginTop:4, fontWeight:700, fontSize:15, color:'#c0392b'}}>
                  <span>Totale uscite</span><span>€{TOT_USCITE.toLocaleString('it')}</span>
                </div>
                <div style={{fontSize:11, color:C.muted, marginTop:4}}>
                  Con rata debito → €{(TOT_USCITE+RATA).toLocaleString('it')}/mese
                </div>
              </Card>

              {/* Target fatturato */}
              <Card>
                <h3 style={{fontSize:15, fontWeight:600, marginBottom:14}}>📈 Target Fatturato</h3>
                {[
                  {label:'Anno 1', val:12000},
                  {label:'Anno 2', val:18000},
                  {label:'Anno 3', val:25000},
                ].map((t,i)=>{
                  const net = t.val - TOT_USCITE - RATA;
                  return (
                    <div key={i} style={{background:C.bg, borderRadius:8, padding:'10px 12px', marginBottom:8}}>
                      <div style={{display:'flex', justifyContent:'space-between', marginBottom:3}}>
                        <span style={{fontWeight:600, fontSize:14}}>{t.label}</span>
                        <span style={{fontWeight:700, color:C.green}}>€{t.val.toLocaleString('it')}/m</span>
                      </div>
                      <div style={{fontSize:12, color:C.muted}}>
                        Margine netto:&nbsp;
                        <span style={{color: net>=0 ? C.green : '#c0392b', fontWeight:600}}>
                          {net>=0?'+':''}€{net.toLocaleString('it')}/mese
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div style={{marginTop:10, padding:'9px 12px', background:C.softGreen, borderRadius:8, fontSize:12, color:C.green, fontWeight:600}}>
                  🎯 Break-even: €{(TOT_USCITE+RATA).toLocaleString('it')}/mese
                </div>
              </Card>
            </div>

            {/* Piano rimborso debito */}
            <Card>
              <h3 style={{fontSize:15, fontWeight:600, marginBottom:16}}>📅 Piano Rimborso Debito — 5 Anni</h3>
              <div style={{display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10}}>
                {[1,2,3,4,5].map(anno=>{
                  const pagato = RATA*12*anno;
                  const perc = Math.min(100, (pagato/80000)*100);
                  const rimasto = Math.max(0, 80000-pagato);
                  return (
                    <div key={anno} style={{textAlign:'center'}}>
                      <div style={{fontSize:11, color:C.muted, marginBottom:8, fontWeight:500}}>Anno {anno}</div>
                      <div style={{height:90, background:C.border, borderRadius:6, position:'relative', overflow:'hidden'}}>
                        <div style={{
                          position:'absolute', bottom:0, left:0, right:0,
                          height:`${perc}%`,
                          background:`linear-gradient(to top, ${C.green}, ${C.green}99)`,
                          transition:'height 1.2s ease', borderRadius:'0 0 4px 4px',
                        }}/>
                        <div style={{position:'absolute', top:'50%', left:0, right:0, transform:'translateY(-50%)', color:perc>45?'white':C.muted, fontSize:11, fontWeight:700}}>
                          {Math.round(perc)}%
                        </div>
                      </div>
                      <div style={{fontSize:10, color:rimasto===0?C.green:C.accent, fontWeight:600, marginTop:5}}>
                        {rimasto===0 ? '✅ SALDATO' : `€${Math.round(rimasto/1000)}k`}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{marginTop:12, fontSize:12, color:C.muted, textAlign:'center'}}>
                €1.547/mese × 60 mesi = €92.820 totale rimborsato (incl. interessi)
              </div>
            </Card>
          </div>
        )}

        {/* ── INFO ── */}
        {tab==='info' && (
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))', gap:16}}>
            {[
              {title:'🏢 Dati Societari', rows:[
                ['Forma giuridica','SNC – Soc. in Nome Collettivo'],
                ['Ragione sociale','DIV4SSAA snc'],
                ['N° soci','15'],
                ['Conferimento p/c','€2.000 a socio'],
                ['Capitale totale','€30.000'],
                ['Debito iniziale','€80.000'],
              ]},
              {title:'🌿 Oggetto Sociale', rows:[
                ['Settore','Cosmetica & Beauty'],
                ['Specializzazione','Trucchi cruelty-free'],
                ['Certificazione target','Leaping Bunny / PETA'],
                ['Target cliente','18–35 anni, eco-conscious'],
                ['Canali vendita','E-commerce + Social'],
                ['Distribuzione','Online-first'],
              ]},
              {title:'💻 Struttura Tech', rows:[
                ['Sito web','Adam (Web Dev)'],
                ['Hosting','Railway'],
                ['Logo & Brand','Mia & Erika'],
                ['Social Media','Giorgia'],
                ['Framework','In definizione'],
                ['Stato','🟡 In sviluppo'],
              ]},
            ].map((sec,i)=>(
              <Card key={i}>
                <h3 style={{fontSize:15, fontWeight:600, marginBottom:14}}>{sec.title}</h3>
                {sec.rows.map(([label,val],j)=>(
                  <div key={j} style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start',
                    padding:'7px 0', borderBottom: j<sec.rows.length-1?`1px solid ${C.border}`:'none', gap:8}}>
                    <span style={{color:C.muted, fontSize:12, flexShrink:0}}>{label}</span>
                    <span style={{fontWeight:500, fontSize:12, textAlign:'right'}}>{val}</span>
                  </div>
                ))}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}