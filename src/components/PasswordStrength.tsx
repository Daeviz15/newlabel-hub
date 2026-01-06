import { useMemo } from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
}

interface PasswordRequirement {
  label: string;
  met: boolean;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const requirements = useMemo<PasswordRequirement[]>(() => {
    return [
      { label: "At least 6 characters", met: password.length >= 6 },
      { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
      { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
      { label: "Contains a number", met: /[0-9]/.test(password) },
    ];
  }, [password]);

  const strength = useMemo(() => {
    const metCount = requirements.filter((r) => r.met).length;
    if (metCount === 0) return { label: "", color: "", width: "0%" };
    if (metCount === 1) return { label: "Weak", color: "bg-red-500", width: "25%" };
    if (metCount === 2) return { label: "Fair", color: "bg-orange-500", width: "50%" };
    if (metCount === 3) return { label: "Good", color: "bg-yellow-500", width: "75%" };
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  }, [requirements]);

  if (!password) return null;

  return (
    <div className="space-y-3 mt-2">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${strength.color} transition-all duration-300 rounded-full`}
            style={{ width: strength.width }}
          />
        </div>
        {strength.label && (
          <p className={`text-xs ${
            strength.label === "Weak" ? "text-red-500" :
            strength.label === "Fair" ? "text-orange-500" :
            strength.label === "Good" ? "text-yellow-500" :
            "text-green-500"
          }`}>
            Password strength: {strength.label}
          </p>
        )}
      </div>

      {/* Requirements Checklist */}
      <div className="grid grid-cols-2 gap-1">
        {requirements.map((req, idx) => (
          <div
            key={idx}
            className={`flex items-center text-xs ${
              req.met ? "text-green-500" : "text-zinc-500"
            }`}
          >
            {req.met ? (
              <Check className="w-3 h-3 mr-1 flex-shrink-0" />
            ) : (
              <X className="w-3 h-3 mr-1 flex-shrink-0" />
            )}
            <span>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PasswordStrength;
