import Link from "next/link";
import type { EnrichedBuild } from "@/lib/types";
import { formatPrice } from "@/lib/data";
import TrustScore from "./TrustScore";

interface BuildCardProps {
  build: EnrichedBuild;
}

export default function BuildCard({ build }: BuildCardProps) {
  const resolutionBadgeColors = {
    "1080p": "bg-blue-500/20 text-blue-400",
    "1440p": "bg-purple-500/20 text-purple-400",
    "4K": "bg-amber-500/20 text-amber-400",
  };

  const difficultyColors = {
    Easy: "text-green-400",
    Medium: "text-yellow-400",
    Hard: "text-red-400",
  };

  return (
    <Link href={`/builds/${build.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 transition-all duration-300 hover:border-[var(--accent)]/50 hover:shadow-lg hover:shadow-[var(--accent)]/5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-[var(--accent)] transition-colors">
              {build.name}
            </h3>
            <p className="text-sm text-[var(--muted)] mt-1">{build.useCase}</p>
          </div>
          <TrustScore score={build.trustScore} size="md" />
        </div>

        {/* Performance Target */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              resolutionBadgeColors[build.targetResolution]
            }`}
          >
            {build.targetResolution}
          </span>
          <span className="text-sm text-[var(--muted)]">
            {build.targetFps} FPS
          </span>
          <span className="text-[var(--card-border)]">|</span>
          <span
            className={`text-sm ${difficultyColors[build.difficulty]}`}
          >
            {build.difficulty} Build
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--muted)] mb-6 line-clamp-2">
          {build.description}
        </p>

        {/* Component Preview */}
        <div className="flex flex-wrap gap-2 mb-6">
          {build.components.slice(0, 3).map((component) => (
            <span
              key={component.id}
              className="px-2 py-1 rounded-md bg-[var(--background)] text-xs text-[var(--muted)]"
            >
              {component.brand} {component.model.split(" ").slice(0, 2).join(" ")}
            </span>
          ))}
          {build.components.length > 3 && (
            <span className="px-2 py-1 rounded-md bg-[var(--background)] text-xs text-[var(--muted)]">
              +{build.components.length - 3} more
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-white">
              {formatPrice(build.lowestTotalPrice)}
            </div>
            <div className="text-xs text-[var(--muted)]">
              as low as • {build.components.length} components
            </div>
          </div>
          <div className="flex items-center gap-2 text-[var(--accent)] font-medium text-sm group-hover:translate-x-1 transition-transform">
            View Build
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
