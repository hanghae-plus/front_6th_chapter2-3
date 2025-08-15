import React from 'react';

type Props = {
  label?: string;
  className?: string;
};

export const Spinner: React.FC<Props> = ({ label = '로딩 중…', className = '' }) => (
  <div className={`py-8 text-center text-sm text-gray-500 ${className}`}>{label}</div>
);

export default Spinner;
