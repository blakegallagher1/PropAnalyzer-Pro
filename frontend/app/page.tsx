import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">PropAnalyzer Pro</h1>
        <p className="text-lg text-slate-200">
          Analyze deals faster, manage your portfolio, and discover your next investment opportunity with our AI-powered
          toolkit.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-full bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-600"
          >
            Get Started
          </Link>
          <Link href="/login" className="rounded-full border border-white/40 px-6 py-3 font-semibold hover:bg-white/10">
            Sign In
          </Link>
        </div>
      </div>
    </main>
  )
}
