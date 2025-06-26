import React from 'react';

export function FormDivider({ text = 'Or' }: { text?: string }) {
  return (
    <div className="flex items-center my-6">
      <div className="border-t border-gray-300 grow mr-3" aria-hidden="true" />
      <div className="text-gray-600 italic text-sm">{text}</div>
      <div className="border-t border-gray-300 grow ml-3" aria-hidden="true" />
    </div>
  );
}
