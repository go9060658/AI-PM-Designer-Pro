import React, { useState, useEffect } from 'react';
import { validateApiKey } from '../utils/errorHandler';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [validationError, setValidationError] = useState<string | undefined>();

  useEffect(() => {
    // Check if key exists in localStorage on mount
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedKey = apiKey.trim();
    
    // 驗證 API Key
    const validation = validateApiKey(trimmedKey);
    if (!validation.valid) {
      setValidationError(validation.error);
      return;
    }
    
    setValidationError(undefined);
    localStorage.setItem('gemini_api_key', trimmedKey);
    onSave(trimmedKey);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-[#1a1a1f] border border-purple-500/30 rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-purple-900/20 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-purple-600 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-purple-600/40">
             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Setup Gemini API</h2>
          <p className="text-gray-400 text-sm">
            為了確保安全，請使用您自己的 API Key。<br/>
            您的 Key 只會儲存在瀏覽器中，不會上傳至伺服器。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Gemini API Key</label>
            <div className="relative">
                <input 
                    type={isVisible ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      if (validationError) {
                        setValidationError(undefined);
                      }
                    }}
                    placeholder="AIzaSy..."
                    className={`w-full bg-black/30 border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-colors pr-10 ${
                      validationError ? 'border-red-500' : 'border-white/10 focus:border-purple-500'
                    }`}
                    required
                />
                {validationError && (
                  <p className="text-red-400 text-xs mt-1">{validationError}</p>
                )}
                <button 
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                    {isVisible ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                </button>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={apiKey.trim().length === 0 || !!validationError}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            開始使用
          </button>
        </form>

        <div className="mt-6 text-center">
            <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-purple-400 hover:text-purple-300 underline"
            >
                還沒有 Key? 點此免費獲取
            </a>
        </div>
      </div>
    </div>
  );
};