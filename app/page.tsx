export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#0D0D0D',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      color: '#F7F5F2',
      textAlign: 'center',
      gap: '1.5rem',
      padding: '2rem',
    }}>
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 64, height: 64 }}>
        <circle cx="20" cy="20" r="19" stroke="#C0001A" strokeWidth="1" />
        <path d="M20 7L34 30H6Z" fill="none" stroke="#F7F5F2" strokeWidth="1.2" />
        <path d="M13 30Q20 15 27 30" fill="#C0001A" />
        <path d="M15.5 30Q20 19 24.5 30" fill="#0D0D0D" />
        <line x1="5" y1="30" x2="35" y2="30" stroke="#F7F5F2" strokeWidth=".8" opacity=".5" />
      </svg>

      <div style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '0.1em' }}>
        Kianzo<span style={{ color: '#C0001A' }}>.</span>
      </div>

      <div style={{ color: '#888', fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        キアンゾ
      </div>

      <div style={{
        width: 40,
        height: 1,
        background: '#C0001A',
        margin: '0.5rem auto',
      }} />

      <div style={{ fontSize: '1.1rem', color: '#aaa', maxWidth: 320 }}>
        Estamos trabajando en algo especial.<br />Volvé pronto.
      </div>

      <div style={{ fontSize: '0.8rem', color: '#555', marginTop: '1rem' }}>
        Mendoza · AR &nbsp;·&nbsp; hola@kianzo.com
      </div>
    </main>
  );
}
