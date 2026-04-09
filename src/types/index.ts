export interface CursorKeyframe {
  frame: number;
  x: number;
  y: number;
  click?: boolean;
}

export interface Platform {
  id: string;
  label: string;
  color: string;
  icon: string;
}

export interface LayerProofEditorProps {
  activeTabIndex?: number;
  contentChars?: number;
  postsVisible?: number;
  activePostIndex?: number;
  frame?: number;
  imageGenerating?: boolean;
  imageGenProgress?: number;
}

export interface MockupProps {
  charsToShow: number;
  frame: number;
}

export type TypeTimeline = [number, number, number];
