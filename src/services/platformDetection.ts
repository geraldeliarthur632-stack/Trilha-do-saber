// Platform and Operating System Detection Service
// Detects Android, iOS (iPhone/iPad), or Desktop/PC/Web dynamically

export type DetectedOS = 'android' | 'ios' | 'desktop';
export type DetectedBrowser = 'chrome' | 'edge' | 'safari' | 'firefox' | 'samsung' | 'opera' | 'other';

export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=br.com.trilhadosaber.app';

export interface PlatformDetails {
  os: DetectedOS;
  osName: string; // 'Android (Google)', 'iOS (Apple)', 'Computador (PC / Mac)'
  deviceLabel: string; // 'Android', 'iPhone / iPad', 'Computador'
  storeName: string; // 'Google Play Store', 'Safari / Tela de Início', 'Windows / Mac / Web App'
  storeBadge: string; // 'Google Play', 'App Apple', 'PC / Web'
  shortButtonText: string; // 'Play Store', 'Instalar no iOS', 'Instalar no PC'
  fullButtonText: string; // 'Baixar na Play Store', 'Instalar no iPhone/iPad', 'Instalar no Computador'
  tooltipTitle: string;
  tooltipDescription: string;
  quickStepTip: string;
  recommendedBrowser: string;
  browser: DetectedBrowser;
  browserLabel: string;
  isAndroid: boolean;
  isIos: boolean;
  isDesktop: boolean;
}

/**
 * Detects the browser name from user agent
 */
export function detectBrowser(): { browser: DetectedBrowser; label: string } {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { browser: 'chrome', label: 'Google Chrome' };
  }

  const ua = navigator.userAgent || '';
  if (/SamsungBrowser/i.test(ua)) return { browser: 'samsung', label: 'Samsung Internet' };
  if (/Edg/i.test(ua)) return { browser: 'edge', label: 'Microsoft Edge' };
  if (/OPR|Opera/i.test(ua)) return { browser: 'opera', label: 'Opera' };
  if (/Firefox|FxiOS/i.test(ua)) return { browser: 'firefox', label: 'Mozilla Firefox' };
  if (/CriOS|Chrome/i.test(ua) && !/Edg/i.test(ua)) return { browser: 'chrome', label: 'Google Chrome' };
  if (/Safari/i.test(ua) && !/Chrome|CriOS/i.test(ua)) return { browser: 'safari', label: 'Apple Safari' };

  return { browser: 'other', label: 'Navegador Web' };
}

/**
 * Detects the user operating system and platform dynamically from browser navigator
 */
export function detectUserPlatform(): PlatformDetails {
  const browserInfo = detectBrowser();

  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return getDesktopPlatformDetails(browserInfo);
  }

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
  const platform = (navigator as any).userAgentData?.platform || navigator.platform || '';

  // Check iOS (iPhone, iPad, iPod, or iPadOS masquerading as MacIntel with touch support)
  const isIos =
    /iPad|iPhone|iPod/i.test(userAgent) ||
    (/MacIntel/i.test(platform) && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1);

  if (isIos) {
    const isIPad = /iPad/i.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const deviceLabel = isIPad ? 'iPad (iOS)' : 'iPhone (iOS)';

    return {
      os: 'ios',
      osName: 'iOS (Apple)',
      deviceLabel,
      storeName: 'Safari / Tela de Início',
      storeBadge: 'iOS / Apple',
      shortButtonText: 'Instalar no iOS',
      fullButtonText: `Instalar no ${isIPad ? 'iPad' : 'iPhone'}`,
      tooltipTitle: `Dispositivo Apple (${deviceLabel}) Detectado`,
      tooltipDescription:
        'Instale o Trilha do Saber na tela de início do seu iPhone ou iPad para abrir em tela cheia como um app nativo.',
      quickStepTip: 'No Safari: toque no botão Compartilhar (⎋) e escolha "Adicionar à Tela de Início (+)".',
      recommendedBrowser: 'Safari',
      browser: browserInfo.browser,
      browserLabel: browserInfo.label,
      isAndroid: false,
      isIos: true,
      isDesktop: false,
    };
  }

  // Check Android
  const isAndroid = /Android/i.test(userAgent) || /Android/i.test(platform);
  if (isAndroid) {
    return {
      os: 'android',
      osName: 'Android (Google)',
      deviceLabel: 'Android',
      storeName: 'Google Play Store',
      storeBadge: 'Google Play',
      shortButtonText: 'Play Store',
      fullButtonText: 'Baixar na Play Store',
      tooltipTitle: 'Dispositivo Android Detectado',
      tooltipDescription:
        'Baixe e instale o aplicativo oficial Trilha do Saber diretamente da Google Play Store no seu Android.',
      quickStepTip: 'Clique para abrir na Google Play Store ou instale direto pelo menu do Chrome.',
      recommendedBrowser: 'Google Chrome',
      browser: browserInfo.browser,
      browserLabel: browserInfo.label,
      isAndroid: true,
      isIos: false,
      isDesktop: false,
    };
  }

  // Default to Desktop / PC / Mac / Linux
  return getDesktopPlatformDetails(browserInfo);
}

function getDesktopPlatformDetails(browserInfo: { browser: DetectedBrowser; label: string }): PlatformDetails {
  return {
    os: 'desktop',
    osName: 'Computador (Desktop / Web)',
    deviceLabel: 'Computador / PC',
    storeName: 'Windows / Mac / Web App',
    storeBadge: 'PC / Web App',
    shortButtonText: 'Instalar no PC',
    fullButtonText: 'Instalar no Computador',
    tooltipTitle: 'Computador / Desktop Detectado',
    tooltipDescription:
      'Instale o Trilha do Saber no seu computador (Windows, macOS ou Linux) para abrir em uma janela independente e estudar offline sem distrações.',
    quickStepTip: 'No Chrome ou Edge: clique no ícone de instalar (💻) na barra de endereços ou no menu ⋮.',
    recommendedBrowser: 'Google Chrome / Microsoft Edge',
    browser: browserInfo.browser,
    browserLabel: browserInfo.label,
    isAndroid: false,
    isIos: false,
    isDesktop: true,
  };
}

