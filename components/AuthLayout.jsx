import React from "react";
import BackButton from "@/components/BackButton";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen bg-white text-neutral-900 px-6 pt-32 pb-20 flex flex-col items-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-black mb-4 shadow-md">
            <Icon className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-display font-black uppercase tracking-widest text-black">{title}</h1>
          {subtitle && <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mt-2 font-medium">{subtitle}</p>}
        </div>
        <div className="bg-neutral-50 rounded-lg shadow-sm border border-neutral-200 p-6 md:p-8">
          {children}
        </div>
        {footer && (
          <p className="text-center text-xs font-mono uppercase tracking-wider text-neutral-600 mt-6">{footer}</p>
        )}
        <div className="mt-8 pt-4 border-t border-neutral-200 flex justify-center">
          <BackButton label="BACK" to="/" />
        </div>
      </div>
    </div>
  );
}
