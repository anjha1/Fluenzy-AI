import React from 'react';

interface PolicyLayoutProps {
  children: React.ReactNode;
}

const PolicyLayout: React.FC<PolicyLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PolicyLayout;