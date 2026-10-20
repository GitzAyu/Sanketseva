import React from 'react';

interface BrandWordmarkProps {
  className?: string;
}

/** The product name stays joined; color marks the two parts of the wordmark. */
export const BrandWordmark: React.FC<BrandWordmarkProps> = ({ className = '' }) => (
  <span aria-label="Sanketseva" className={`inline-block ${className}`}>
    <span className="text-[#0b1f3a]">Sanket</span>
    <span className="text-emerald-600">seva</span>
  </span>
);
