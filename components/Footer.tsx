import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--card-border)] bg-[var(--background)] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">
                Trust<span className="text-[var(--accent)]">Builds</span>
                <span className="text-[var(--muted)]">.gg</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-[var(--muted)] max-w-md">
              Zero-research gaming PC builds with reliability data. We analyze
              brand failure rates, warranty quality, and RMA experiences so you
              don&apos;t have to.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-[var(--muted)] hover:text-white transition-colors"
                >
                  All Builds
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-[var(--muted)] hover:text-white transition-colors"
                >
                  Trust Methodology
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-[var(--muted)] hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Affiliate Disclosure */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <span className="text-sm text-[var(--muted)]">
                  Affiliate Disclosure
                </span>
              </li>
            </ul>
            <p className="mt-4 text-xs text-[var(--muted)]">
              We earn commissions from qualifying purchases through affiliate
              links. This doesn&apos;t affect our recommendations.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--card-border)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--muted)]">
            &copy; {new Date().getFullYear()} TrustBuilds.gg. All rights
            reserved.
          </p>
          <p className="text-xs text-[var(--muted)]">
            Prices updated weekly. Last update: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </footer>
  );
}
