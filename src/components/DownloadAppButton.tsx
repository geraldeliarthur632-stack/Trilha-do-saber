import React, { useState, useEffect } from 'react';
import {
  detectUserPlatform,
  DetectedOS,
  PlatformDetails,
  PLAY_STORE_URL,
} from '../services/platformDetection';
import { pwaService } from '../services/pwaService';
import { soundEffects } from '../services/soundEffects';
import { InstallAppModal } from './InstallAppModal';
import { Download, Sparkles, ExternalLink, ArrowRight, Laptop, Smartphone } from 'lucide-react';

// ==========================================
// OFFICIAL STORE & PLATFORM SVG ICONS
// ==========================================

export const GooglePlayStoreIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3.609 1.814L13.792 12 3.61 22.186A2.296 2.296 0 013 20.562V3.438c0-.62.222-1.196.609-1.624z"
      fill="#00C1A6"
    />
    <path
      d="M17.204 8.588L4.697 1.367a2.22 2.22 0 00-1.088-.447L13.792 12l3.412-3.412z"
      fill="#00A0FF"
    />
    <path
      d="M17.204 15.412L13.792 12 3.61 22.08a2.22 2.22 0 001.087-.447l12.507-7.221z"
      fill="#FF3333"
    />
    <path
      d="M21.758 11.215l-4.554-2.627L13.792 12l3.412 3.412 4.554-2.627a1.536 1.536 0 000-2.57z"
      fill="#FFD400"
    />
  </svg>
);

export const AppleStoreIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 170 170" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.3-9.61-11.23-20.73-14.78-33.34-3.55-12.61-5.33-24.3-5.33-35.07 0-14.28 3.55-25.96 10.65-35.06 7.1-9.09 16.02-13.72 26.77-13.88 5.11 0 10.74 1.34 16.9 4.02 6.16 2.68 10.14 4.08 11.95 4.21 2.45-.4 6.78-1.96 12.98-4.68 6.2-2.73 11.89-3.95 17.06-3.68 12.61.67 22.56 5.63 29.83 14.88-11.05 6.69-16.45 15.89-16.19 27.61.34 9.17 3.86 16.89 10.56 23.14 6.7 6.25 14.77 9.8 24.22 10.65-2.22 6.74-4.83 13.52-7.82 20.33zM119.22 31.84c0-7.72 2.76-14.97 8.28-21.75 5.52-6.78 12.28-10.87 20.28-12.27.23 1.08.34 2.16.34 3.24 0 7.6-2.88 15.01-8.63 22.23-5.75 7.22-12.87 11.45-21.36 12.68-.34-1.39-.51-2.77-.51-4.13z" />
  </svg>
);

export const DesktopStoreIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

export const PlatformStoreIcon: React.FC<{ os: DetectedOS; className?: string }> = ({ os, className = 'w-4 h-4' }) => {
  if (os === 'android') return <GooglePlayStoreIcon className={className} />;
  if (os === 'ios') return <AppleStoreIcon className={className} />;
  return <DesktopStoreIcon className={className} />;
};

export interface DownloadAppButtonProps {
  onOpenInstallModal?: () => void;
  variant?: 'header' | 'banner' | 'card' | 'badge-only' | 'settings';
  className?: string;
  showTooltip?: boolean;
}

export const DownloadAppButton: React.FC<DownloadAppButtonProps> = ({
  onOpenInstallModal,
  variant = 'header',
  className = '',
}) => {
  const [platform, setPlatform] = useState<PlatformDetails>(() => detectUserPlatform());
  const [hasNativePrompt, setHasNativePrompt] = useState(() => pwaService.hasNativePrompt());
  const [isSelfModalOpen, setIsSelfModalOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(() => pwaService.isStandalone());

  useEffect(() => {
    setPlatform(detectUserPlatform());
    setIsStandalone(pwaService.isStandalone());

    const unsubscribe = pwaService.subscribe((hasPrompt) => {
      setHasNativePrompt(hasPrompt);
      setIsStandalone(pwaService.isStandalone());
    });
    return unsubscribe;
  }, []);

  const openTutorialModal = () => {
    if (onOpenInstallModal) {
      onOpenInstallModal();
    } else {
      setIsSelfModalOpen(true);
    }
  };

  /**
   * Executa a ação de instalação:
   * 1. Detecta a plataforma.
   * 2. No Android: vai direto para o link da Play Store!
   * 3. Em outras plataformas: pede ao navegador do jeito certo da plataforma (via prompt nativo se disponível).
   * 4. Se não conseguir fazer o navegador exibir a mensagem, abre o tutorial de como instalar manualmente.
   */
  const handleInstallClick = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    soundEffects.playClick();

    // 1. Android: vai para o link da Google Play Store conforme solicitado
    if (platform.os === 'android') {
      try {
        const opened = window.open(PLAY_STORE_URL, '_blank');
        if (!opened) {
          window.location.href = PLAY_STORE_URL;
        }
      } catch {
        window.location.href = PLAY_STORE_URL;
      }
      return;
    }

    // 2. Outras plataformas: tentar pedir ao navegador se o evento nativo estiver pronto
    if (hasNativePrompt) {
      try {
        const outcome = await pwaService.promptNativeInstall();
        if (outcome === 'accepted') {
          soundEffects.playLevelUp();
          return;
        }
        if (outcome === 'dismissed') {
          // Usuário fechou o diálogo nativo do navegador
          return;
        }
      } catch (err) {
        console.warn('Erro ao chamar prompt nativo:', err);
      }
    }

    // 3. Caso não consiga fazer o navegador exibir a mensagem nativa (iOS, navegadores sem prompt, etc.):
    // Abre o tutorial de como instalar manualmente!
    openTutorialModal();
  };

  // Se já estiver em modo standalone e for variante de cabeçalho, podemos exibir um badge sutil ou ocultar
  // Mas mantemos acessível para quem quiser ver o tutorial ou atualizar
  if (isStandalone && variant === 'header') {
    return null;
  }

  // ================= VARIANT 1: HEADER =================
  if (variant === 'header') {
    return (
      <>
        <button
          type="button"
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black shadow-xs transition active:scale-95 group cursor-pointer border ${
            platform.os === 'android'
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-teal-500 text-white border-emerald-400/40 shadow-emerald-600/20'
              : platform.os === 'ios'
              ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:from-slate-800 hover:to-slate-850 text-white border-white/20'
              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-600 hover:from-indigo-500 hover:to-purple-500 text-white border-indigo-400/30'
          } ${className}`}
          title={
            platform.os === 'android'
              ? 'Baixar aplicativo oficial na Google Play Store'
              : `Instalar aplicativo no ${platform.deviceLabel}`
          }
          aria-label="Instalar Aplicativo"
        >
          <PlatformStoreIcon
            os={platform.os}
            className="w-3.5 h-3.5 group-hover:scale-110 transition-transform shrink-0"
          />
          <span className="text-xs font-black tracking-tight">
            {platform.os === 'android' ? 'Play Store' : 'Instalar App'}
          </span>
          <Download className="w-3 h-3 text-white/80 group-hover:translate-y-0.5 transition-transform" />
        </button>

        {!onOpenInstallModal && (
          <InstallAppModal
            isOpen={isSelfModalOpen}
            onClose={() => setIsSelfModalOpen(false)}
            initialTab={platform.os}
          />
        )}
      </>
    );
  }

  // ================= VARIANT 2: BANNER =================
  if (variant === 'banner') {
    return (
      <>
        <div
          className={`relative overflow-hidden rounded-3xl p-4 sm:p-5 border-2 shadow-sm transition ${
            platform.os === 'android'
              ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-emerald-300 text-slate-900'
              : 'bg-gradient-to-r from-indigo-50 via-slate-50 to-purple-50 border-indigo-200 text-slate-900'
          } ${className}`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow-sm shrink-0 flex items-center justify-center border border-slate-200">
                <PlatformStoreIcon os={platform.os} className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {platform.os === 'android' ? 'Google Play Store' : `${platform.deviceLabel}`}
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                    100% Grátis
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  {platform.os === 'android'
                    ? 'Baixe o Trilha do Saber na Play Store'
                    : `Instale o Trilha do Saber no seu ${platform.deviceLabel}`}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-1 font-medium">
                  Abra em tela cheia com 1 toque, estude na Jornada offline e salve seu progresso.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition cursor-pointer"
              >
                <PlatformStoreIcon os={platform.os} className="w-4 h-4" />
                <span>{platform.os === 'android' ? 'Abrir Play Store' : 'Instalar Agora'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={openTutorialModal}
                className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition active:scale-95 cursor-pointer border border-slate-200 shadow-xs"
                title="Ver tutorial passo a passo"
              >
                Tutorial
              </button>
            </div>
          </div>
        </div>

        {!onOpenInstallModal && (
          <InstallAppModal
            isOpen={isSelfModalOpen}
            onClose={() => setIsSelfModalOpen(false)}
            initialTab={platform.os}
          />
        )}
      </>
    );
  }

  // ================= VARIANT 3: SETTINGS =================
  if (variant === 'settings') {
    return (
      <>
        <button
          type="button"
          onClick={handleInstallClick}
          className={`w-full p-3 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition group active:scale-95 flex items-center justify-between shadow-xs cursor-pointer ${className}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-50 text-indigo-600 border border-indigo-200 shrink-0">
              <PlatformStoreIcon os={platform.os} className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 block group-hover:text-indigo-700 transition">
                  {platform.os === 'android'
                    ? 'Baixar na Google Play Store'
                    : `Instalar no ${platform.deviceLabel}`}
                </span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {platform.storeBadge}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                {platform.os === 'android'
                  ? 'Acesso direto ao app oficial na Play Store'
                  : 'Acesse em tela cheia com 1 toque no celular ou PC'}
              </span>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-indigo-600 shrink-0 ml-2" />
        </button>

        {!onOpenInstallModal && (
          <InstallAppModal
            isOpen={isSelfModalOpen}
            onClose={() => setIsSelfModalOpen(false)}
            initialTab={platform.os}
          />
        )}
      </>
    );
  }

  // Default fallback button
  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition active:scale-95 cursor-pointer ${className}`}
      >
        <PlatformStoreIcon os={platform.os} className="w-4 h-4" />
        <span>{platform.fullButtonText}</span>
      </button>

      {!onOpenInstallModal && (
        <InstallAppModal
          isOpen={isSelfModalOpen}
          onClose={() => setIsSelfModalOpen(false)}
          initialTab={platform.os}
        />
      )}
    </>
  );
};
