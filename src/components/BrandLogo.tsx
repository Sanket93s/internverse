interface BrandLogoProps {
  size?: "sm" | "md";
}

const SIZE_CLASS: Record<NonNullable<BrandLogoProps["size"]>, string> = {
  sm: "w-8 h-8 rounded-xl",
  md: "w-10 h-10 rounded-xl",
};

export function BrandLogo({ size = "md" }: BrandLogoProps) {
  return (
    <div
      className={`${SIZE_CLASS[size]} relative overflow-hidden shadow-lg`}
      style={{ background: "linear-gradient(135deg, hsl(221 83% 53%) 0%, hsl(221 83% 45%) 100%)" }}
      aria-hidden="true"
    >
      <span className="absolute left-[30%] top-[20%] h-[60%] w-[14%] rounded-full bg-white" />
      <span className="absolute right-[23%] top-[20%] h-[60%] w-[14%] rounded-full bg-white" />
      <span className="absolute left-1/2 top-[42%] h-[16%] w-[40%] -translate-x-1/2 rounded-full bg-white/80" />
    </div>
  );
}