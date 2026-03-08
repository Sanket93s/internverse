interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  gradient: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
}

export function StatCard({ title, value, icon: Icon, gradient, change, changeType }: StatCardProps) {
  const changeColor =
    changeType === "up"
      ? "hsl(142 71% 45%)"
      : changeType === "down"
      ? "hsl(0 84% 60%)"
      : "hsl(var(--muted-foreground))";

  return (
    <div className="stat-card shadow-md" style={{ background: gradient }}>
      {/* Decorative blob */}
      <div
        className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10"
        style={{ background: "rgba(255,255,255,0.5)" }}
      />
      <div
        className="absolute right-4 bottom-0 w-16 h-16 rounded-full opacity-10"
        style={{ background: "rgba(255,255,255,0.4)" }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg font-medium opacity-90 mb-1">{title}</p>
            <p className="text-4xl font-bold">{value}</p>
            {change && (
              <p className="text-sm mt-1.5 font-medium" style={{ color: changeColor }}>
                {change}
              </p>
            )}
          </div>
          <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm">
            <Icon size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}

