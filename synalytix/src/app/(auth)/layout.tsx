export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="technical-bg min-h-screen flex items-center justify-center p-6">
      {children}
    </div>
  )
}
