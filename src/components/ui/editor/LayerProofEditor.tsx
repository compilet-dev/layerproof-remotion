import React from 'react';
import { useTheme } from '../../../lib/theme';
import type { LayerProofEditorProps } from '../../../types';
import { TopBar } from './TopBar';
import { EditorSidebar } from './EditorSidebar';
import { EditorPreview } from './EditorPreview';
import { ContentEditor } from './ContentEditor';

export const LayerProofEditor: React.FC<LayerProofEditorProps> = ({
  activeTabIndex = 0,
  contentChars,
  postsVisible = 4,
  activePostIndex = 0,
  frame = 0,
  imageGenerating = false,
  imageGenProgress = 0,
}) => {
  const theme = useTheme();
  return (
  <div style={{ width: '100%', height: '100%', background: '#FFFFFF', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: theme.font.family }}>
    <TopBar />
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      <EditorSidebar postsVisible={postsVisible} activePostIndex={activePostIndex} />
      <EditorPreview
        activeTabIndex={activeTabIndex}
        frame={frame}
        contentChars={contentChars}
        activePostIndex={activePostIndex}
        imageGenerating={imageGenerating}
        imageGenProgress={imageGenProgress}
      />
      <ContentEditor contentChars={contentChars} frame={frame} />
    </div>
  </div>
  );
};
