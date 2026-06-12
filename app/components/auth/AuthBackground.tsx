export default function AuthBackground() {
  return (
    <>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top left shape */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        
        {/* Bottom right shape */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-green-500/5 blur-3xl" />
        
        {/* Center shape */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/3 blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Mobile decorative elements */}
      <div className="lg:hidden absolute top-0 left-0 w-full h-48 bg-linear-to-b from-primary/10 to-transparent pointer-events-none" />
      <div className="lg:hidden absolute bottom-0 left-0 w-full h-48 bg-linear-to-t from-green-500/10 to-transparent pointer-events-none" />
    </>
  )
}