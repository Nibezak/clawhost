export function PageBackground() {
  return (
    <>
      {/* Fixed gradient background */}
      <div className="fixed inset-0 landing-gradient pointer-events-none" />
      {/* Grid overlay in hero area */}
      <div className="absolute inset-0 h-screen landing-grid pointer-events-none" />
    </>
  )
}
