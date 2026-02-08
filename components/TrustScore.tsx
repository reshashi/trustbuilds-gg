import { getTrustColorClass, getTrustBgClass, getTrustLabel } from "@/lib/trustScore";

interface TrustScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function TrustScore({
  score,
  size = "md",
  showLabel = false,
}: TrustScoreProps) {
  const colorClass = getTrustColorClass(score);
  const bgClass = getTrustBgClass(score);
  const label = getTrustLabel(score);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClasses[size]} ${colorClass} ${bgClass}`}
      >
        <span className="opacity-70">Trust:</span>
        {score}
      </span>
      {showLabel && (
        <span className={`text-sm ${colorClass}`}>{label}</span>
      )}
    </div>
  );
}

interface TrustScoreBreakdownProps {
  trustFactors: {
    failureRate: number;
    warrantyYears: number;
    brandReputation: number;
    rmaRating: number;
  };
}

export function TrustScoreBreakdown({ trustFactors }: TrustScoreBreakdownProps) {
  const factors = [
    {
      label: "Failure Rate",
      value: `${trustFactors.failureRate.toFixed(1)}%`,
      description: "Lower is better",
      good: trustFactors.failureRate < 1.5,
    },
    {
      label: "Warranty",
      value: `${trustFactors.warrantyYears} years`,
      description: "Industry standard: 3 years",
      good: trustFactors.warrantyYears >= 3,
    },
    {
      label: "Brand Rep",
      value: `${trustFactors.brandReputation}/100`,
      description: "Based on reviews",
      good: trustFactors.brandReputation >= 85,
    },
    {
      label: "RMA Experience",
      value: `${trustFactors.rmaRating.toFixed(1)}/5`,
      description: "Customer feedback",
      good: trustFactors.rmaRating >= 4.0,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {factors.map((factor) => (
        <div
          key={factor.label}
          className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-3"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[var(--muted)]">{factor.label}</span>
            <span
              className={`text-xs ${
                factor.good ? "text-green-400" : "text-orange-400"
              }`}
            >
              {factor.good ? "Good" : "Fair"}
            </span>
          </div>
          <div className="text-lg font-semibold text-white">{factor.value}</div>
          <div className="text-xs text-[var(--muted)] mt-0.5">
            {factor.description}
          </div>
        </div>
      ))}
    </div>
  );
}
