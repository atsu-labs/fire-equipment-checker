'use client';

import { BuildingInputForm } from '@/components/forms/BuildingInputForm';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 items-center">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            消防用設備規制判別システム
          </h1>
          <p className="text-gray-600">
            建築物情報入力
          </p>
        </div>

        <BuildingInputForm />
      </div>
    </div>
  );
}
