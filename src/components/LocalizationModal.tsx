import React from 'react';
import { X, Check, Globe, Euro, Info, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { EU_COUNTRIES, SUPPORTED_CURRENCIES } from '../data/mockData';
import { EUCountryCode } from '../types';

export const LocalizationModal: React.FC = () => {
  const { 
    isLocalizationModalOpen, 
    setIsLocalizationModalOpen, 
    selectedCountry, 
    setSelectedCountryByCode, 
    selectedCurrency, 
    setSelectedCurrencyByCode 
  } = useStore();

  if (!isLocalizationModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">EU Regional & Currency Settings</h3>
              <p className="text-xs text-slate-400">Configure delivery VAT rate & price reference currency</p>
            </div>
          </div>
          <button
            onClick={() => setIsLocalizationModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Banner about Euro Default */}
        <div className="bg-blue-950/40 border border-blue-800/50 rounded-xl p-3 mb-5 flex items-start space-x-3 text-xs text-blue-200">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Euro (€ / EUR) Transaction Standard: </span>
            All checkout totals, invoice ledgers, and bank clearing are processed strictly in <strong>Euro (€)</strong> by default. Selecting an alternative currency provides instant live price estimation for your convenience.
          </div>
        </div>

        {/* 1. Destination EU Country Selection */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            EU Delivery Country & Destination VAT Rate
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            {EU_COUNTRIES.map(country => {
              const isSelected = country.code === selectedCountry.code;
              return (
                <button
                  key={country.code}
                  onClick={() => setSelectedCountryByCode(country.code as EUCountryCode)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-white font-semibold'
                      : 'bg-slate-800/50 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-base">{country.flag}</span>
                    <span className="truncate">{country.name}</span>
                  </div>
                  <span className="text-[10px] text-blue-400 font-medium shrink-0 ml-1">
                    {(country.vatRate * 100).toFixed(0)}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Display Reference Currency */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Price Tag Reference Currency
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SUPPORTED_CURRENCIES.map(curr => {
              const isSelected = curr.code === selectedCurrency.code;
              return (
                <button
                  key={curr.code}
                  onClick={() => setSelectedCurrencyByCode(curr.code)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                      : 'bg-slate-800/50 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    <span>{curr.flag}</span>
                    <span>{curr.code}</span>
                  </div>
                  <span className="font-bold text-slate-400">{curr.symbol}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            Selected VAT: <span className="text-slate-200 font-semibold">{selectedCountry.name} ({(selectedCountry.vatRate * 100).toFixed(1)}%)</span>
          </div>
          <button
            onClick={() => setIsLocalizationModalOpen(false)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md"
          >
            Save & Apply Regional Settings
          </button>
        </div>

      </div>
    </div>
  );
};
