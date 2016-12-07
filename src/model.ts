export interface OptionsSchema {
  overlay: Overlay;
  content: Content;
  container: string;
}

interface Overlay extends Speed, Callback {
  color: string;
  opacity: number;
  close: boolean;
  escKey: boolean;
  active: boolean;
}

interface Content extends Speed, Callback {
  target: string;
  animateFrom: string;
  animateTo: string;
  positionX: string;
  positionY: string;
  width: string;
  effect: string;
  fullscreen: boolean;
}

interface Speed {
  speedIn: number;
  speedOut: number;
}

interface Callback {
  onOpen: Function;
  onComplete: Function;
  onClose: Function;
}