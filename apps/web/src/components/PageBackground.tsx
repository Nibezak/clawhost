export function PageBackground() {
  return (
    <>
      {/* Fixed gradient background */}
      <div className="landing-gradient pointer-events-none fixed inset-0" />
      {/* Grid overlay in hero area */}
      <div className="landing-grid pointer-events-none absolute inset-0 h-screen" />
    </>
  )
}
