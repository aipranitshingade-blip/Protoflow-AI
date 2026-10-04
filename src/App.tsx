import React from 'react';
import { PrototypeProvider, usePrototype } from './context/PrototypeContext';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { BuildMode } from './components/build/BuildMode';
import { DesignMode } from './components/design/DesignMode';
import { FlowMode } from './components/flows/FlowMode';
import { PreviewView } from './components/preview/PreviewView';
import { AIAssistantDrawer } from './components/ai/AIAssistantDrawer';

const WorkspaceContent: React.FC = () => {
  const { mode } = usePrototype();

  switch (mode) {
    case 'build':
      return <BuildMode />;
    case 'design':
      return <DesignMode />;
    case 'flow':
      return <FlowMode />;
    case 'preview':
      return <PreviewView />;
    default:
      return <BuildMode />;
  }
};

const AppContent: React.FC = () => {
  const { mode } = usePrototype();
  const showSidebar = mode === 'design' || mode === 'flow';

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden font-sans bg-[#131314] text-neutral-100">
      {/* Fixed Top Bar */}
      <TopBar />

      {/* Body Workspace: Sidebar (in design/flow) + Dynamic Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {showSidebar && <Sidebar />}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <WorkspaceContent />
        </main>
      </div>

      {/* Global AI Assistant Drawer */}
      <AIAssistantDrawer />
    </div>
  );
};

export default function App() {
  return (
    <PrototypeProvider>
      <AppContent />
    </PrototypeProvider>
  );
}
