import React, { useState, useEffect } from 'react';
import {
  detectUserPlatform,
  DetectedOS,
  PLAY_STORE_URL,
} from '../services/platformDetection';
import { pwaService } from '../services/pwaService';
import { soundEffects } from '../services/soundEffects';
import {
  GooglePlayStoreIcon,
  AppleStoreIcon,
  DesktopStoreIcon,
} from './DownloadAppButton';
import {
  X,
  Smartphone,
  Laptop,
  CheckCircle2,
  Share2,
  PlusSquare,
  Sparkles,
  Download,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  Bell,
  ArrowRight,
  Monitor,
  Flame,
  Info,
} from 'lucide-react';

export interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: DetectedOS;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  initialTab,
}) => {
  const [platform, setPlatform] = useState(() => detectUserPlatform());
  const [activeTab, setActiveTab] = useState<DetectedOS>(() => initialTab || detectUserPlatform().os);
  const [hasNativePrompt, setHasNativePrompt] = useState(() => pwaService.hasNativePrompt());
  const [installStatus, setInstallStatus] = useState<'idle' | 'installing' | 'success' | 'dismissed'>('idle');

  useEffect(() => {
    const detected = detectUserPlatform();
    setPlatform(detected);
    if (!initialTab) {
      setActiveTab(detected.os);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    const unsubscribe = pwaService.subscribe((hasPrompt) => {
      setHasNativePrompt(hasPrompt);
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const handleOpenPlayStore = () => {
    soundEffects.playClick();
    try {
      window.open(PLAY_STORE_URL, '_blank');
    } catch {
      window.location.href = PLAY_STORE_URL;
    }
  };

  const handlePromptBrowserInstall = async () => {
    soundEffects.playClick();
    setInstallStatus('installing');
    const outcome = await pwaService.promptNativeInstall();
    if (outcome === 'accepted') {
      soundEffects.playLevelUp();
      setInstallStatus('success');
      setTimeout(() => {
        onClose();
      }, 2000);
    } else if (outcome === 'dismissed') {
      setInstallStatus('dismissed');
    } else {
      setInstallStatus('idle');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundEffects.playClick();
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-modal-title"
    >
      {/* Modal Container 100% Modo Claro */}
      <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        {/* Modal Header - Modo Claro */}
        <div className="relative px-5 pt-5 pb-4 bg-gradient-to-r from-emerald-50 via-teal-50/70 to-indigo-50 border-b border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-90 text-slate-600 hover:text-slate-900 flex items-center justify-center transition cursor-pointer border border-slate-200"
            title="Fechar"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-sm shrink-0 flex items-center justify-center border border-slate-200">
              <img
                src="/app-logo.png"
                alt="Trilha do Saber"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="min-w-0 pr-8">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {platform.os === 'android'
                    ? '🤖 Android Detectado'
                    : platform.os === 'ios'
                    ? '🍎 Apple iOS Detectado'
                    : '💻 Computador Detectado'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  100% Grátis
                </span>
              </div>
              <h2 id="install-modal-title" className="text-lg sm:text-xl font-black tracking-tight text-slate-900 mt-1">
                Instalar Trilha do Saber
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed">
            Tenha o aplicativo na tela inicial do seu aparelho para estudar com tela cheia, sem distrações e com funcionamento offline completo!
          </p>

          {/* OS Switcher Tabs - Modo Claro */}
          <div className="grid grid-cols-3 gap-1.5 mt-3.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setActiveTab('android');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeTab === 'android'
                  ? 'bg-white text-emerald-800 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <GooglePlayStoreIcon className="w-3.5 h-3.5" />
              <span>Android</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setActiveTab('ios');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeTab === 'ios'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <AppleStoreIcon className="w-3.5 h-3.5" />
              <span>iPhone/iPad</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setActiveTab('desktop');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeTab === 'desktop'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <DesktopStoreIcon className="w-3.5 h-3.5" />
              <span>Computador</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body - 100% Modo Claro */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-white text-slate-900">
          {/* ================= TAB 1: ANDROID (TUTORIAL PELA PLAY STORE) ================= */}
          {activeTab === 'android' && (
            <div className="space-y-4">
              {/* Botão de Destaque da Google Play Store */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-2 border-emerald-300 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-emerald-200 flex items-center justify-center p-2 shrink-0">
                      <GooglePlayStoreIcon className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                          Oficial & Recomendado
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">Google Play</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                        Baixar na Google Play Store
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2 font-medium">
                  Baixe direto pela loja oficial do Google para receber atualizações automáticas, menor consumo de bateria e segurança verificada pelo Play Protect.
                </p>

                <button
                  type="button"
                  onClick={handleOpenPlayStore}
                  className="mt-3.5 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-md active:scale-98 transition group cursor-pointer border border-emerald-500"
                >
                  <GooglePlayStoreIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Abrir na Google Play Store</span>
                  <ExternalLink className="w-4 h-4 ml-1 opacity-90" />
                </button>
              </div>

              {/* Tutorial Passo a Passo: Como Instalar pela Play Store */}
              <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <GooglePlayStoreIcon className="w-4 h-4" />
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                    Passo a Passo: Como Instalar pela Play Store
                  </h4>
                </div>

                <ol className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <p className="font-extrabold text-slate-900">Toque no botão "Abrir na Google Play Store"</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        Você será direcionado diretamente para a página oficial do <strong>Trilha do Saber</strong> no aplicativo da Play Store no seu smartphone.
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5 italic">
                        (Ou abra o app <strong>Play Store</strong> manualmente e pesquise por "Trilha do Saber").
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <p className="font-extrabold text-slate-900">Toque no botão verde "Instalar"</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        Na página do aplicativo, toque no botão verde escrito <strong>"Instalar"</strong>. O download começará automaticamente.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <p className="font-extrabold text-slate-900">Aguarde o download e abra o App</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        Assim que a instalação terminar, o ícone do <strong>Trilha do Saber</strong> aparecerá na sua tela inicial e nos seus aplicativos. Toque em <strong>"Abrir"</strong> para começar a estudar!
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      4
                    </span>
                    <div>
                      <p className="font-extrabold text-slate-900">Estude com Modo Offline Completo</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        Pelo app oficial, você pode continuar avançando na <strong>Jornada de Aprendizado</strong> e jogos offline mesmo quando estiver sem internet ou com sinal fraco!
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              {/* Opção alternativa: Instalação rápida pelo navegador caso queira */}
              {hasNativePrompt && (
                <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-black text-indigo-950">
                      ⚡ Alternativa: Instalação Rápida pelo Navegador
                    </h4>
                    <p className="text-[11px] text-indigo-700 font-medium">
                      Instalar como aplicativo web direto no Chrome sem ir à loja.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handlePromptBrowserInstall}
                    className="shrink-0 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs shadow-xs transition cursor-pointer"
                  >
                    Instalar no Chrome
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: iOS (iPhone/iPad) ================= */}
          {activeTab === 'ios' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                <p className="text-xs text-amber-900 font-bold leading-relaxed">
                  💡 No iPhone e iPad (Apple), a instalação é feita pelo navegador <strong>Safari</strong> em menos de 10 segundos:
                </p>
              </div>

              {/* Step-by-Step for iOS */}
              <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50 space-y-3.5">
                <ol className="space-y-3.5 text-xs text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <p className="font-extrabold text-slate-900">Certifique-se de estar no Safari</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        A Apple permite adicionar aplicativos à tela inicial exclusivamente pelo navegador <strong>Safari</strong>.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-extrabold text-slate-900">Toque no botão Compartilhar</p>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-black">
                          <Share2 className="w-3 h-3" /> Ícone (⎋)
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        Fica na barra inferior do iPhone ou no topo do iPad (um quadrado azul com uma setinha apontando para cima).
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-extrabold text-slate-900">Toque em "Adicionar à Tela de Início"</p>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-800 text-[10px] font-black">
                          <PlusSquare className="w-3 h-3" /> [+]
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        Role a lista de opções para cima até encontrar o ícone de quadradinho com sinal de mais (+).
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      4
                    </span>
                    <div>
                      <p className="font-extrabold text-slate-900">Toque em "Adicionar"</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        No canto superior direito da tela, confirme em <strong>Adicionar</strong>. O app abrirá em tela cheia como se tivesse sido baixado da App Store!
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* ================= TAB 3: DESKTOP (PC/MAC) ================= */}
          {activeTab === 'desktop' && (
            <div className="space-y-4">
              {/* Native Prompt on Desktop */}
              {hasNativePrompt ? (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-indigo-950">
                        Instalação com 1 Clique Disponível
                      </h4>
                      <p className="text-xs text-indigo-700 font-medium">
                        Seu navegador suporta instalação direta para abrir como programa no Windows ou Mac.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handlePromptBrowserInstall}
                    className="mt-3 w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Instalar no Computador Agora</span>
                  </button>
                </div>
              ) : null}

              {/* Step-by-Step for Desktop */}
              <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Laptop className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                    Como Instalar no PC ou Mac:
                  </h4>
                </div>

                <div className="space-y-3 text-xs text-slate-700">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
                      No Google Chrome:
                    </p>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      Olhe para a <strong>barra de endereços</strong> (onde digita o link do site, no lado direito perto da estrelinha): clique no ícone de <strong>Instalar Trilha do Saber (⬇️ ou 💻)</strong>. Ou clique nos <strong>3 pontinhos (⋮)</strong> no topo direito &gt; <em>Salvar e compartilhar</em> &gt; <em>Instalar aplicativo</em>.
                    </p>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
                      No Microsoft Edge:
                    </p>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      Clique no ícone de aplicativo disponível na barra de endereços ou clique no menu <strong>(...)</strong> &gt; <em>Aplicativos</em> &gt; <em>Instalar este site como um aplicativo</em>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vantagens do Aplicativo */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Vantagens do Aplicativo Instalado:</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Abre com 1 toque na tela</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Sem barras do navegador</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Estudo offline na Jornada</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Lembretes de ofensiva diária</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer - Modo Claro */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <span className="text-[11px] text-slate-500 font-medium">
            Mesmo login e mesmo XP no app e no site
          </span>
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 active:scale-95 text-slate-800 text-xs font-bold transition cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
