// Network and Offline Detection Service for Trilha do Saber

type NetworkStatusListener = (isOnline: boolean) => void;

class NetworkService {
  private online: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private listeners: Set<NetworkStatusListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
      // Double-check with navigator.onLine
      this.online = navigator.onLine;
    }
  }

  private handleOnline = () => {
    this.online = true;
    this.notify();
  };

  private handleOffline = () => {
    this.online = false;
    this.notify();
  };

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.online);
      } catch (err) {
        console.error('Error in network listener:', err);
      }
    });
  }

  public isOnline(): boolean {
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return this.online;
  }

  public subscribe(listener: NetworkStatusListener): () => void {
    this.listeners.add(listener);
    // Emit initial status immediately
    listener(this.isOnline());
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Modos que exigem conexão com a internet (IA Gemini, APIs externas, tradução online, servidores)
   */
  public isOnlineOnlyMode(mode: string): boolean {
    const onlineOnly = [
      'translator',
      'explainer',
      'researcher',
      'photo_exam',
      'multiplayer',
      'duel',
    ];
    return onlineOnly.includes(mode);
  }

  /**
   * Retorna os detalhes amigáveis do modo para mensagem explicativa
   */
  public getModeFriendlyName(mode: string): { title: string; description: string; icon: string } {
    switch (mode) {
      case 'translator':
        return {
          title: 'Tradutor (Texto & Foto)',
          description: 'A tradução de idiomas e reconhecimento de texto por foto dependem dos servidores online.',
          icon: '🌐',
        };
      case 'explainer':
        return {
          title: 'Explicador Inteligente (IA)',
          description: 'A análise de fotos e explicações automáticas de dúvidas requerem conexão com a internet.',
          icon: '📸',
        };
      case 'researcher':
        return {
          title: 'Pesquisador de Trabalhos (IA)',
          description: 'A geração de pesquisas detalhadas de trabalhos escolares exige acesso à internet.',
          icon: '🔍',
        };
      case 'photo_exam':
        return {
          title: 'Criar Prova por Foto (IA)',
          description: 'O escaneamento e formulação de perguntas a partir de fotos precisam de conexão.',
          icon: '📄',
        };
      case 'multiplayer':
        return {
          title: 'Salas Multiplayer Online',
          description: 'Jogar com amigos em tempo real através de salas e códigos exige conexão com a internet.',
          icon: '🎮',
        };
      case 'duel':
        return {
          title: 'Duelo 1v1 Online',
          description: 'Desafiar outros jogadores pela rede precisa de internet ativa.',
          icon: '⚔️',
        };
      default:
        return {
          title: 'Recurso Online',
          description: 'Este recurso precisa de conexão com a internet.',
          icon: '📡',
        };
    }
  }
}

export const networkService = new NetworkService();
