interface OverlayConfig {
  overlay: boolean;
  overlaySpeed: number;
  overlayColor: string;
  overlayOpacity: number;
  overlayClose: boolean;
}

interface ContentConfig {
  speed: number;
  effect: string;
  width: string;
  fullscreen: boolean;
  animation: {
    from: string;
    to: string;
  };
  position: {
    x: string;
    y: string;
  };
  open: Function;
  complete: Function;
  close: Function;
}

interface ContainerConfig {
  container: string;
}

export interface Options extends OverlayConfig, ContentConfig, ContainerConfig {
  target: string;
}