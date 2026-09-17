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
      <section
        aria-label="Legal Disclaimer Notice"
        className={`bg-amber-950/50 border border-amber-500/50 rounded-xl p-4 text-amber-100 text-sm flex items-start gap-3 shadow-lg backdrop-blur-md ${className}`}
      >
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <span className="font-bold text-amber-300 uppercase tracking-wide text-xs block mb-0.5">
            Legal Disclaimer & Terms of Use
          </span>
          <p className="leading-relaxed text-amber-100">
            This tool provides informational structuring only and does not constitute legal advice. Always consult a qualified Advocate-on-Record for legal representation.
          </p>
        </div>
      </section>
    );
  }

  return (
    <aside
      aria-label="Mandatory Legal Disclaimer"
      className={`w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 px-4 py-2.5 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-md z-50 transition-all ${className}`}
    >
      <ShieldAlert className="w-4 h-4 text-slate-950 shrink-0" aria-hidden="true" />
      <span className="text-center">
        <strong className="underline underline-offset-2 uppercase tracking-wider mr-1">
          Mandatory Legal Notice:
        </strong>
        This tool provides informational structuring only and does not constitute legal advice.
      </span>
    </aside>
  );
};
