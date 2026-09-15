import React from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";

interface DisclaimerProps {
  variant?: "top" | "bottom" | "card";
  className?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerProps> = ({
  variant = "top",
  className = "",
}) => {
  if (variant === "card") {
    return (
      <div className={`bg-amber-950/40 border border-amber-500/40 rounded-xl p-4 text-amber-200 text-sm flex items-start gap-3 shadow-lg backdrop-blur-md ${className}`}>
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-300 uppercase tracking-wide text-xs block mb-0.5">
            Legal Disclaimer & Terms of Use
          </span>
          <p className="leading-relaxed">
            This tool provides informational structuring only and does not constitute legal advice.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 px-4 py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md z-50 transition-all ${className}`}
    >
      <ShieldAlert className="w-4 h-4 text-slate-950 shrink-0" />
      <span className="text-center">
        <strong className="underline underline-offset-2 uppercase tracking-wide mr-1">
          Notice:
        </strong>
        This tool provides informational structuring only and does not constitute legal advice.
      </span>
    </div>
  );
};
