import React from 'react';
import { networkService } from '../services/networkService';
import { soundEffects } from '../services/soundEffects';
import {
  WifiOff,
  Compass,
  Gamepad2,
  BookOpen,
  CheckCircle2,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface OfflineNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockedMode?: string;
  onGoToJourney: () => void;
  onGoToExplore?: () => void;
}

export const OfflineNoticeModal: React.FC<OfflineNoticeModalProps> = ({
  isOpen,
  onClose,
  blockedMode,
  onGoToJourney,
  onGoToExplore,
}) => {
  if (!isOpen) return null;

  const modeInfo = blockedMode
    ? networkService.getModeFriendlyName(blockedMode)
    : {
        title: 'Recurso Online',
        description: 'Este recurso precisa de conexão com a internet para funcionar.',
        icon: '📡',
      };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundEffects.playClick();
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="offline-modal-title"
    >
      <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
        {/* Header com aviso offline */}
        <div className="relative p-5 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 text-white shrink-0">
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
            title="Fechar"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-inner border border-white/30">
              <WifiOff className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/25 text-amber-100 text-[10px] font-black uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
                <span>Sem Conexão à Internet</span>
              </div>
              <h2 id="offline-modal-title" className="text-lg font-black text-white mt-1 leading-tight">
                Modo Offline Detectado
              </h2>
            </div>
          </div>
        </div>

        {/* Corpo informativo */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Caixa de bloqueio do modo tentado */}
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
            <span className="text-2xl shrink-0 mt-0.5">{modeInfo.icon}</span>
            <div>
              <h3 className="text-sm font-black text-rose-900">
                {modeInfo.title} não pode ser usado offline
              </h3>
              <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                {modeInfo.description} Por favor, conecte-se ao Wi-Fi ou dados móveis para usá-lo.
              </p>
            </div>
          </div>

          {/* O que funciona offline */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-black uppercase text-emerald-950 tracking-wide">
                A Jornada e os Modos Offline estão 100% disponíveis:
              </h4>
            </div>

            <p className="text-xs text-emerald-800 leading-relaxed font-medium">
              Você não precisa parar de aprender! Todo o conteúdo da <strong>Trilha de Aprendizado (Jornada)</strong>, perguntas e jogos offline continuam funcionando sem internet.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-700 font-semibold">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Jornada de Fases</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Tabuada Divertida</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Caderno de Notas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Academia de Xadrez</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Jogo da Memória</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Dominó & Quebra-Cabeça</span>
              </div>
            </div>
          </div>

          {/* Botões de Ação para continuar aprendendo */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                onGoToJourney();
                onClose();
              }}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Continuar na Jornada (Offline)</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            {onGoToExplore && (
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  onGoToExplore();
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4 text-slate-600" />
                <span>Ver Jogos Offline Disponíveis</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <span>Seu progresso da Jornada é salvo localmente.</span>
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
