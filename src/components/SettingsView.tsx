import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2, RotateCcw, Trash2 } from 'lucide-react';
import { InterfaceLanguage, StudioSettings } from '../types/studio';
import { TRANSLATIONS } from '../i18n/translations';

interface SettingsViewProps {
  settings: StudioSettings;
  onUpdateSettings: (patch: Partial<StudioSettings>) => void;
  onRemoveSampleData: () => void;
  onRestoreSampleData: () => void;
  onResetAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onRemoveSampleData,
  onRestoreSampleData,
  onResetAllData,
}) => {
  const t = TRANSLATIONS[settings.interfaceLanguage];
  const [testingArgon, setTestingArgon] = useState(false);
  const [argonTestResult, setArgonTestResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  const handleTestArgon = async () => {
    setTestingArgon(true);
    setArgonTestResult(null);
    try {
      const res = await fetch('/api/campaign/argon-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt:
            'Verify Gemini 4 Argon studio connection for Forma Atelier with a minimal test brief.',
        }),
      });
      const data = await res.json();
      if (data.argonAvailable) {
        setArgonTestResult({
          ok: true,
          message:
            'Connected to Gemini 4 Argon (gemini-4-argon) successfully.',
        });
      } else {
        setArgonTestResult({
          ok: false,
          message:
            data.setupMessage ||
            'Gemini 4 Argon (gemini-4-argon) could not be accessed. Configure a billing-enabled API key in Settings > Secrets.',
        });
      }
    } catch {
      setArgonTestResult({
        ok: false,
        message: 'Could not reach server endpoint /api/campaign/argon-plan.',
      });
    } finally {
      setTestingArgon(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="border-b border-[#14201D]/15 pb-5 space-y-1">
        <h1 className="text-3xl font-serif-editorial font-semibold text-[#14201D]">
          {t.settingsTitle}
        </h1>
        <p className="text-xs text-[#5A6561]">{t.settingsSubtitle}</p>
      </div>

      {/* 1. Interface Language & RTL Configuration */}
      <section className="p-6 bg-[#FAF7F0] border border-[#14201D]/15 space-y-4">
        <h2 className="text-lg font-serif-editorial font-semibold text-[#14201D]">
          {t.interfaceLanguageSetting}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(
            [
              {
                id: 'en',
                title: 'English (LTR)',
                sub: 'International Editorial Studio',
              },
              {
                id: 'fr',
                title: 'Français (LTR)',
                sub: 'Atelier Créatif & Direction Artistique',
              },
              {
                id: 'ar',
                title: 'العربية (RTL)',
                sub: 'واجهة عربية كاملة من اليمين إلى اليسار',
              },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                onUpdateSettings({ interfaceLanguage: item.id as InterfaceLanguage })
              }
              className={`p-4 text-left rtl:text-right border transition-colors cursor-pointer ${
                settings.interfaceLanguage === item.id
                  ? 'bg-[#14201D] text-[#F5F1E8] border-[#14201D]'
                  : 'bg-[#F5F1E8] text-[#14201D] border-[#14201D]/20 hover:border-[#14201D]'
              }`}
            >
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="text-xs opacity-75 mt-1">{item.sub}</p>
            </button>
          ))}
        </div>
      </section>

      {/* 2. Studio Default Preferences */}
      <section className="p-6 bg-[#FAF7F0] border border-[#14201D]/15 space-y-4">
        <h2 className="text-lg font-serif-editorial font-semibold text-[#14201D]">
          {t.studioDefaultsSection}
        </h2>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 bg-[#F5F1E8] border border-[#14201D]/15 cursor-pointer">
            <div>
              <span className="font-semibold text-[#14201D] block">
                {t.preserveProductPhotoLabel}
              </span>
              <span className="text-[#5A6561]">
                {t.preserveProductPhotoDesc}
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.defaultPreserveProduct}
              onChange={(e) =>
                onUpdateSettings({ defaultPreserveProduct: e.target.checked })
              }
              className="w-4 h-4 accent-[#14201D]"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-[#F5F1E8] border border-[#14201D]/15 cursor-pointer">
            <span className="font-semibold text-[#14201D]">
              {t.safeAreaToggle} (Default ON)
            </span>
            <input
              type="checkbox"
              checked={settings.showSafeAreasByDefault}
              onChange={(e) =>
                onUpdateSettings({ showSafeAreasByDefault: e.target.checked })
              }
              className="w-4 h-4 accent-[#14201D]"
            />
          </label>
        </div>
      </section>

      {/* 3. Mandatory Gemini 4 Argon Model Architecture */}
      <section className="p-6 bg-[#FAF7F0] border border-[#14201D]/15 space-y-4">
        <h2 className="text-lg font-serif-editorial font-semibold text-[#14201D]">
          {t.aiModelArchitectureSection}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-[#EFEAE0] border border-[#14201D]/15 space-y-1">
            <span className="text-[10px] font-mono-tabular uppercase text-[#5A6561] block">
              {t.coreReasoningModelLabel}
            </span>
            <strong className="font-mono-tabular text-sm text-[#14201D] block">
              gemini-4-argon
            </strong>
            <p className="text-[#5A6561]">
              Strict routing enabled — never silently substituted with another
              text model.
            </p>
          </div>

          <div className="p-4 bg-[#EFEAE0] border border-[#14201D]/15 space-y-1">
            <span className="text-[10px] font-mono-tabular uppercase text-[#5A6561] block">
              {t.visualGenerationModelLabel}
            </span>
            <strong className="font-mono-tabular text-sm text-[#14201D] block">
              gemini-3.1-flash-lite-image
            </strong>
            <p className="text-[#5A6561]">
              Executes the commercial photography prompt planned by Gemini 4
              Argon.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-4">
          <button
            type="button"
            disabled={testingArgon}
            onClick={handleTestArgon}
            className="px-4 py-2 bg-[#14201D] text-[#F5F1E8] text-xs font-medium hover:bg-[#243832] transition-colors inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {testingArgon && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{t.testArgonConnectionBtn}</span>
          </button>

          {argonTestResult && (
            <div
              className={`flex items-center gap-2 text-xs p-2.5 border ${
                argonTestResult.ok
                  ? 'bg-[#16A34A]/10 border-[#16A34A] text-[#14201D]'
                  : 'bg-[#B39464]/20 border-[#8C7044] text-[#14201D]'
              }`}
            >
              {argonTestResult.ok ? (
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#8C7044] shrink-0" />
              )}
              <span>{argonTestResult.message}</span>
            </div>
          )}
        </div>
      </section>

      {/* 4. Local Data & Sample Archive Controls */}
      <section className="p-6 bg-[#FAF7F0] border border-[#14201D]/15 space-y-4">
        <h2 className="text-lg font-serif-editorial font-semibold text-[#14201D]">
          {t.dataManagementSection}
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onRemoveSampleData}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#14201D]/25 text-xs font-medium text-[#14201D] hover:bg-[#EFEAE0] transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.removeSampleDataBtn}</span>
          </button>

          <button
            type="button"
            onClick={onRestoreSampleData}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#14201D]/25 text-xs font-medium text-[#14201D] hover:bg-[#EFEAE0] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.restoreSampleDataBtn}</span>
          </button>

          <button
            type="button"
            onClick={onResetAllData}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#9A3412] text-xs font-medium text-[#9A3412] hover:bg-[#9A3412] hover:text-[#F5F1E8] transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.clearAllLocalDataBtn}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
