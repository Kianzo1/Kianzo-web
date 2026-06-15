export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        body, body *, body a, body button, body input, body select, body textarea {
          cursor: default !important;
        }
        body button, body a { cursor: pointer !important; }
        body input, body textarea, body select { cursor: text !important; }
      `}</style>
      {children}
    </>
  )
}
