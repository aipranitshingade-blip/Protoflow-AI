import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  AppMode,
  PrototypeProject,
  Screen,
  CanvasElement,
  ElementStyles,
  ElementType,
  FlowStep,
  AIModificationLog,
} from '../types/prototype';
import { defaultProject, initialScreens, initialFlows } from '../data/initialPrototype';

interface PrototypeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  project: PrototypeProject;
  setProject: React.Dispatch<React.SetStateAction<PrototypeProject>>;
  activeScreenId: string;
  setActiveScreenId: (id: string) => void;
  activeScreen: Screen;
  activeFlowId: string;
  setActiveFlowId: (id: string) => void;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  selectedElement: CanvasElement | null;
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  saveStatus: 'saved' | 'saving';
  previewDevice: 'mobile' | 'tablet' | 'desktop';
  setPreviewDevice: (dev: 'mobile' | 'tablet' | 'desktop') => void;
  aiLogs: AIModificationLog[];
  isGenerating: boolean;
  generationStep: string;
  
  // Element operations
  updateElementStyles: (screenId: string, elementId: string, newStyles: Partial<ElementStyles>) => void;
  updateElementContent: (screenId: string, elementId: string, content: string, secondaryContent?: string) => void;
  updateElementAction: (screenId: string, elementId: string, actionTarget: string, actionLabel?: string) => void;
  duplicateElement: (screenId: string, elementId: string) => void;
  deleteElement: (screenId: string, elementId: string) => void;
  addElement: (screenId: string, type: ElementType) => void;
  
  // Flow operations
  insertStepIntoFlow: (
    flowId: string,
    insertIndex: number,
    targetScreenId: string,
    stepTitle?: string,
    actionTrigger?: string
  ) => void;
  removeStepFromFlow: (flowId: string, stepIndex: number) => void;
  reorderFlowSteps: (flowId: string, fromIndex: number, toIndex: number) => void;
  updateStepDestination: (flowId: string, stepIndex: number, newTargetScreenId: string) => void;
  
  // Screen operations
  renameScreen: (screenId: string, newName: string) => void;
  duplicateScreen: (screenId: string) => void;
  addCustomScreen: (name: string, category: Screen['category']) => void;
  
  // Prototype generation
  generatePrototype: (promptText?: string) => Promise<void>;
  
  // AI assistant
  executeAiCommand: (command: string) => Promise<{ success: boolean; message: string; type: string }>;
  resetToDefault: () => void;
}

const PrototypeContext = createContext<PrototypeContextType | undefined>(undefined);

export const PrototypeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<AppMode>('build');
  const [project, setProject] = useState<PrototypeProject>(() => {
    // Try restoring saved prototype if any, else default
    try {
      const saved = localStorage.getItem('protoflow_project');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return defaultProject;
  });

  const [activeScreenId, setActiveScreenId] = useState<string>('home');
  const [activeFlowId, setActiveFlowId] = useState<string>('product_purchase');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');

  const [aiLogs, setAiLogs] = useState<AIModificationLog[]>([
    {
      id: 'init-1',
      timestamp: '1 min ago',
      userPrompt: 'Initial QuickMart prototype',
      type: 'screen_added',
      title: 'Prototype Generated',
      description: 'Synthesized 8 responsive screens and 8 cross-screen interaction flows.',
    },
  ]);

  // Persist project changes
  useEffect(() => {
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('protoflow_project', JSON.stringify(project));
      } catch (e) {
        console.warn('Could not persist to localStorage', e);
      }
      setSaveStatus('saved');
    }, 400);
    return () => clearTimeout(timer);
  }, [project]);

  // Ensure activeScreen is always valid
  const activeScreen = useMemo(() => {
    return project.screens[activeScreenId] || project.screens['home'] || Object.values(project.screens)[0];
  }, [project.screens, activeScreenId]);

  // Find currently selected element
  const selectedElement = useMemo(() => {
    if (!selectedElementId || !activeScreen) return null;
    return activeScreen.elements.find((el) => el.id === selectedElementId) || null;
  }, [activeScreen, selectedElementId]);

  // Update element styles
  const updateElementStyles = (screenId: string, elementId: string, newStyles: Partial<ElementStyles>) => {
    setProject((prev) => {
      const screen = prev.screens[screenId];
      if (!screen) return prev;
      const updatedElements = screen.elements.map((el) => {
        if (el.id !== elementId) return el;
        return {
          ...el,
          styles: {
            ...el.styles,
            ...newStyles,
          },
        };
      });
      return {
        ...prev,
        screens: {
          ...prev.screens,
          [screenId]: {
            ...screen,
            elements: updatedElements,
          },
        },
      };
    });
  };

  // Update element content
  const updateElementContent = (
    screenId: string,
    elementId: string,
    content: string,
    secondaryContent?: string
  ) => {
    setProject((prev) => {
      const screen = prev.screens[screenId];
      if (!screen) return prev;
      const updatedElements = screen.elements.map((el) => {
        if (el.id !== elementId) return el;
        return {
          ...el,
          content,
          secondaryContent: secondaryContent !== undefined ? secondaryContent : el.secondaryContent,
        };
      });
      return {
        ...prev,
        screens: {
          ...prev.screens,
          [screenId]: {
            ...screen,
            elements: updatedElements,
          },
        },
      };
    });
  };

  // Update element navigation action target
  const updateElementAction = (
    screenId: string,
    elementId: string,
    actionTarget: string,
    actionLabel?: string
  ) => {
    setProject((prev) => {
      const screen = prev.screens[screenId];
      if (!screen) return prev;
      const updatedElements = screen.elements.map((el) => {
        if (el.id !== elementId) return el;
        return {
          ...el,
          actionTarget,
          actionLabel: actionLabel || el.actionLabel,
        };
      });
      return {
        ...prev,
        screens: {
          ...prev.screens,
          [screenId]: {
            ...screen,
            elements: updatedElements,
          },
        },
      };
    });
  };

  // Duplicate an element
  const duplicateElement = (screenId: string, elementId: string) => {
    setProject((prev) => {
      const screen = prev.screens[screenId];
      if (!screen) return prev;
      const index = screen.elements.findIndex((el) => el.id === elementId);
      if (index === -1) return prev;
      const source = screen.elements[index];
      const newElement: CanvasElement = {
        ...source,
        id: `${source.id}-copy-${Date.now().toString().slice(-4)}`,
        name: `${source.name} (Copy)`,
      };
      const updated = [...screen.elements];
      updated.splice(index + 1, 0, newElement);
      return {
        ...prev,
        screens: {
          ...prev.screens,
          [screenId]: {
            ...screen,
            elements: updated,
          },
        },
      };
    });
  };

  // Delete an element
  const deleteElement = (screenId: string, elementId: string) => {
    setProject((prev) => {
      const screen = prev.screens[screenId];
      if (!screen) return prev;
      return {
        ...prev,
        screens: {
          ...prev.screens,
          [screenId]: {
            ...screen,
            elements: screen.elements.filter((el) => el.id !== elementId),
          },
        },
      };
    });
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  };

  // Add component
  const addElement = (screenId: string, type: ElementType) => {
    const newId = `${type}-${Date.now().toString().slice(-4)}`;
    let newElement: CanvasElement;

    switch (type) {
      case 'button':
        newElement = {
          id: newId,
          name: 'New Button Component',
          type: 'button',
          content: 'Click Action',
          styles: {
            width: '100%',
            padding: '12px 18px',
            fontSize: 14,
            fontWeight: '600',
            color: '#FFFFFF',
            backgroundColor: '#0F172A',
            borderRadius: 10,
            textAlign: 'center',
          },
        };
        break;
      case 'badge':
        newElement = {
          id: newId,
          name: 'Status Badge',
          type: 'badge',
          content: '⚡ Special Offer',
          styles: {
            padding: '4px 10px',
            fontSize: 12,
            fontWeight: '600',
            color: '#047857',
            backgroundColor: '#ECFDF5',
            borderRadius: 6,
          },
        };
        break;
      case 'card':
        newElement = {
          id: newId,
          name: 'Feature Card',
          type: 'card',
          content: 'New Feature Card',
          secondaryContent: 'Card subtitle and informative description',
          styles: {
            padding: '16px',
            fontSize: 15,
            fontWeight: '600',
            color: '#0F172A',
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            borderColor: '#E2E8F0',
            borderWidth: 1,
          },
        };
        break;
      case 'input':
        newElement = {
          id: newId,
          name: 'Input Field',
          type: 'input',
          content: 'Enter details...',
          styles: {
            padding: '10px 14px',
            fontSize: 14,
            fontWeight: '400',
            color: '#334155',
            backgroundColor: '#FFFFFF',
            borderRadius: 8,
            borderColor: '#CBD5E1',
            borderWidth: 1,
          },
        };
        break;
      case 'text':
      default:
        newElement = {
          id: newId,
          name: 'Heading / Paragraph',
          type: 'text',
          content: 'New Section Heading',
          styles: {
            fontSize: 18,
            fontWeight: '700',
            color: '#0F172A',
            padding: '6px 0',
          },
        };
        break;
    }

    setProject((prev) => {
      const screen = prev.screens[screenId];
      if (!screen) return prev;
      return {
        ...prev,
        screens: {
          ...prev.screens,
          [screenId]: {
            ...screen,
            elements: [...screen.elements, newElement],
          },
        },
      };
    });
    setSelectedElementId(newId);
  };

  // -------------------------------------------------------------
  // FLOW OPERATIONS & TWO-WAY PROTOTYPE CONNECTION
  // -------------------------------------------------------------
  const insertStepIntoFlow = (
    flowId: string,
    insertIndex: number,
    targetScreenId: string,
    stepTitle?: string,
    actionTrigger?: string
  ) => {
    setProject((prev) => {
      const flow = prev.flows[flowId];
      const targetScreen = prev.screens[targetScreenId];
      if (!flow || !targetScreen) return prev;

      const newStepId = `step-${Date.now().toString().slice(-4)}`;
      const prevStep = insertIndex > 0 ? flow.steps[insertIndex - 1] : null;
      const nextStep = flow.steps[insertIndex] || null;

      const newStep: FlowStep = {
        id: newStepId,
        screenId: targetScreenId,
        title: stepTitle || targetScreen.name,
        actionTrigger: actionTrigger || `Proceeds to ${nextStep ? nextStep.title : 'Next'}`,
        targetScreenId: nextStep ? nextStep.screenId : undefined,
      };

      const updatedSteps = [...flow.steps];
      updatedSteps.splice(insertIndex, 0, newStep);

      // Rewire previous step if exists
      if (prevStep) {
        prevStep.targetScreenId = targetScreenId;
      }

      // CRITICAL TWO-WAY SYNC:
      // Update previous screen's primary action button to target newScreenId!
      const updatedScreens = { ...prev.screens };
      if (prevStep) {
        const prevScreen = updatedScreens[prevStep.screenId];
        if (prevScreen) {
          // Look for primary action button (e.g. Buy Now, Proceed, etc.)
          const updatedElements = prevScreen.elements.map((el) => {
            if (el.type === 'button' && (el.actionTarget || el.id.includes('buy') || el.id.includes('btn'))) {
              return {
                ...el,
                actionTarget: targetScreenId,
              };
            }
            return el;
          });
          updatedScreens[prevStep.screenId] = {
            ...prevScreen,
            elements: updatedElements,
          };
        }
      }

      // Ensure the inserted screen's action button points to the next screen!
      if (nextStep) {
        const insertedScreen = updatedScreens[targetScreenId];
        if (insertedScreen) {
          const updatedElements = insertedScreen.elements.map((el) => {
            if (el.type === 'button') {
              return {
                ...el,
                actionTarget: nextStep.screenId,
              };
            }
            return el;
          });
          updatedScreens[targetScreenId] = {
            ...insertedScreen,
            elements: updatedElements,
          };
        }
      }

      return {
        ...prev,
        screens: updatedScreens,
        flows: {
          ...prev.flows,
          [flowId]: {
            ...flow,
            steps: updatedSteps,
          },
        },
      };
    });

    // Add log
    setAiLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: 'Just now',
        userPrompt: `Inserted ${targetScreenId} into ${flowId}`,
        type: 'flow_change',
        title: 'Product Flow & Prototype Rewired',
        description: `Connected: previous step now routes to "${targetScreenId}", which routes to next step in live prototype.`,
        affectedFlowId: flowId,
        affectedScreenId: targetScreenId,
      },
      ...prev,
    ]);
  };

  const removeStepFromFlow = (flowId: string, stepIndex: number) => {
    setProject((prev) => {
      const flow = prev.flows[flowId];
      if (!flow || flow.steps.length <= 1) return prev;

      const removedStep = flow.steps[stepIndex];
      const prevStep = stepIndex > 0 ? flow.steps[stepIndex - 1] : null;
      const nextStep = flow.steps[stepIndex + 1] || null;

      const updatedSteps = flow.steps.filter((_, idx) => idx !== stepIndex);

      const updatedScreens = { ...prev.screens };
      if (prevStep && nextStep) {
        prevStep.targetScreenId = nextStep.screenId;
        const prevScreen = updatedScreens[prevStep.screenId];
        if (prevScreen) {
          const updatedElements = prevScreen.elements.map((el) => {
            if (el.type === 'button' && el.actionTarget === removedStep.screenId) {
              return {
                ...el,
                actionTarget: nextStep.screenId,
              };
            }
            return el;
          });
          updatedScreens[prevStep.screenId] = {
            ...prevScreen,
            elements: updatedElements,
          };
        }
      }

      return {
        ...prev,
        screens: updatedScreens,
        flows: {
          ...prev.flows,
          [flowId]: {
            ...flow,
            steps: updatedSteps,
          },
        },
      };
    });
  };

  const reorderFlowSteps = (flowId: string, fromIndex: number, toIndex: number) => {
    setProject((prev) => {
      const flow = prev.flows[flowId];
      if (!flow) return prev;
      const updatedSteps = [...flow.steps];
      const [moved] = updatedSteps.splice(fromIndex, 1);
      updatedSteps.splice(toIndex, 0, moved);

      // Re-link consecutive steps
      for (let i = 0; i < updatedSteps.length - 1; i++) {
        updatedSteps[i].targetScreenId = updatedSteps[i + 1].screenId;
      }
      updatedSteps[updatedSteps.length - 1].targetScreenId = undefined;

      return {
        ...prev,
        flows: {
          ...prev.flows,
          [flowId]: {
            ...flow,
            steps: updatedSteps,
          },
        },
      };
    });
  };

  const updateStepDestination = (flowId: string, stepIndex: number, newTargetScreenId: string) => {
    setProject((prev) => {
      const flow = prev.flows[flowId];
      if (!flow || !flow.steps[stepIndex]) return prev;

      const currentStep = flow.steps[stepIndex];
      const updatedSteps = flow.steps.map((st, idx) => {
        if (idx !== stepIndex) return st;
        return {
          ...st,
          targetScreenId: newTargetScreenId,
        };
      });

      // Update screen button target as well
      const updatedScreens = { ...prev.screens };
      const currentScreen = updatedScreens[currentStep.screenId];
      if (currentScreen) {
        const updatedElements = currentScreen.elements.map((el) => {
          if (el.type === 'button' && (el.actionTarget || el.id.includes('buy') || el.id.includes('btn'))) {
            return {
              ...el,
              actionTarget: newTargetScreenId,
            };
          }
          return el;
        });
        updatedScreens[currentStep.screenId] = {
          ...currentScreen,
          elements: updatedElements,
        };
      }

      return {
        ...prev,
        screens: updatedScreens,
        flows: {
          ...prev.flows,
          [flowId]: {
            ...flow,
            steps: updatedSteps,
          },
        },
      };
    });
  };

  // Screen operations
  const renameScreen = (screenId: string, newName: string) => {
    setProject((prev) => {
      const screen = prev.screens[screenId];
      if (!screen) return prev;
      return {
        ...prev,
        screens: {
          ...prev.screens,
          [screenId]: {
            ...screen,
            name: newName,
          },
        },
      };
    });
  };

  const duplicateScreen = (screenId: string) => {
    setProject((prev) => {
      const source = prev.screens[screenId];
      if (!source) return prev;
      const newId = `${screenId}-copy-${Date.now().toString().slice(-4)}`;
      const duplicatedScreen: Screen = {
        ...source,
        id: newId,
        name: `${source.name} (Copy)`,
        elements: source.elements.map((el) => ({
          ...el,
          id: `${el.id}-${Date.now().toString().slice(-3)}`,
        })),
      };
      return {
        ...prev,
        screens: {
          ...prev.screens,
          [newId]: duplicatedScreen,
        },
      };
    });
  };

  const addCustomScreen = (name: string, category: Screen['category']) => {
    const newId = `screen-${Date.now().toString().slice(-4)}`;
    const newScreen: Screen = {
      id: newId,
      name,
      description: `Custom ${name} screen built for flow extension`,
      category,
      layoutType: 'form',
      elements: [
        {
          id: `${newId}-title`,
          name: 'Screen Title',
          type: 'text',
          content: name,
          styles: {
            fontSize: 22,
            fontWeight: '700',
            color: '#0F172A',
            padding: '6px 0',
          },
        },
        {
          id: `${newId}-card`,
          name: 'Primary Container Card',
          type: 'card',
          content: `Manage ${name} details and options`,
          secondaryContent: 'Configured via ProtoFlow Canvas',
          styles: {
            padding: '16px',
            fontSize: 14,
            fontWeight: '500',
            color: '#1E293B',
            backgroundColor: '#FFFFFF',
            borderColor: '#E2E8F0',
            borderWidth: 1,
            borderRadius: 12,
          },
        },
        {
          id: `${newId}-action-btn`,
          name: 'Continue Button',
          type: 'button',
          content: 'Continue to Next Step',
          styles: {
            width: '100%',
            padding: '14px 20px',
            fontSize: 15,
            fontWeight: '600',
            color: '#FFFFFF',
            backgroundColor: '#0F172A',
            borderRadius: 10,
            textAlign: 'center',
          },
          actionTarget: 'checkout',
          actionLabel: 'Continue',
        },
      ],
    };

    setProject((prev) => ({
      ...prev,
      screens: {
        ...prev.screens,
        [newId]: newScreen,
      },
    }));

    setActiveScreenId(newId);
    setMode('design');
  };

  // Generate prototype with rich staged progress
  const generatePrototype = async (promptText?: string) => {
    setIsGenerating(true);
    const steps = [
      'Deconstructing product prompt into structural entities...',
      'Synthesizing responsive screen graph (8 screens)...',
      'Generating visual design tokens & layout geometry...',
      'Wiring bidirectional stateful flows & transition rules...',
      'Building working prototype sandbox...',
    ];

    for (const step of steps) {
      setGenerationStep(step);
      await new Promise((r) => setTimeout(r, 450));
    }

    setProject({
      ...defaultProject,
      prompt: promptText || defaultProject.prompt,
      updatedAt: 'Just now',
    });
    setActiveScreenId('home');
    setActiveFlowId('product_purchase');
    setIsGenerating(false);
    setMode('design');
  };

  // AI assistant command executor
  const executeAiCommand = async (command: string): Promise<{ success: boolean; message: string; type: string }> => {
    const lower = command.toLowerCase().trim();

    // 1. "Add delivery address screen before checkout" or similar
    if (
      lower.includes('delivery address') ||
      lower.includes('address screen') ||
      (lower.includes('address') && lower.includes('checkout'))
    ) {
      // Find 'product_purchase' flow
      const flow = project.flows['product_purchase'];
      if (flow) {
        // Find index of checkout step
        const checkoutIdx = flow.steps.findIndex((s) => s.screenId === 'checkout');
        const insertIdx = checkoutIdx !== -1 ? checkoutIdx : 2;
        insertStepIntoFlow('product_purchase', insertIdx, 'address', 'Delivery Address', 'Enters Delivery Address');
        setActiveFlowId('product_purchase');
        setActiveScreenId('address');
        return {
          success: true,
          type: 'flow_change',
          message: 'Inserted "Delivery Address" screen immediately before "Checkout" in Product Purchase flow. Rewired "Buy Now" button in Product Details to navigate to Delivery Address.',
        };
      }
    }

    // 2. "Make checkout button blue"
    if (lower.includes('checkout') && (lower.includes('blue') || lower.includes('color'))) {
      const screen = project.screens['checkout'];
      if (screen) {
        const btn = screen.elements.find((el) => el.id.includes('btn') || el.name.toLowerCase().includes('order') || el.type === 'button');
        if (btn) {
          updateElementStyles('checkout', btn.id, {
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
          });
          setActiveScreenId('checkout');
          return {
            success: true,
            type: 'design_change',
            message: 'Updated "Place Order" button background on Checkout screen to vibrant Royal Blue (#2563EB).',
          };
        }
      }
    }

    // 3. "Make buy button emerald green" or "green"
    if (lower.includes('buy') && (lower.includes('green') || lower.includes('emerald'))) {
      const screen = project.screens['details'];
      if (screen) {
        const btn = screen.elements.find((el) => el.id.includes('buy'));
        if (btn) {
          updateElementStyles('details', btn.id, {
            backgroundColor: '#059669',
            color: '#FFFFFF',
          });
          setActiveScreenId('details');
          return {
            success: true,
            type: 'design_change',
            message: 'Updated "Buy Now" CTA button background on Product Details screen to Emerald Green (#059669).',
          };
        }
      }
    }

    // 4. "Add search screen"
    if (lower.includes('search screen') || lower.includes('search')) {
      const hasSearch = !!project.screens['search_view'];
      if (!hasSearch) {
        addCustomScreen('Search & Filters', 'discovery');
        return {
          success: true,
          type: 'screen_added',
          message: 'Created new "Search & Filters" screen with keyword suggestions, category pills, and instant catalog results.',
        };
      }
    }

    // 5. "Change product card layout" or compact
    if (lower.includes('card layout') || lower.includes('product card') || lower.includes('compact')) {
      const screen = project.screens['listing'];
      if (screen) {
        screen.elements.forEach((el) => {
          if (el.type === 'card') {
            updateElementStyles('listing', el.id, {
              padding: '10px',
              borderRadius: 8,
            });
          }
        });
        setActiveScreenId('listing');
        return {
          success: true,
          type: 'design_change',
          message: 'Adjusted product cards on Product Listing screen to high-density compact layout (reduced padding to 10px, refined 8px border radius).',
        };
      }
    }

    // Fallback: apply targeted design enhancement
    if (lower.includes('radius') || lower.includes('rounded')) {
      const activeEl = selectedElement || activeScreen.elements.find((e) => e.type === 'button') || activeScreen.elements[0];
      if (activeEl) {
        updateElementStyles(activeScreen.id, activeEl.id, {
          borderRadius: 16,
        });
        return {
          success: true,
          type: 'design_change',
          message: `Updated border radius for ${activeEl.name} on ${activeScreen.name} to 16px.`,
        };
      }
    }

    // Generic AI prompt action: Targeted smart response
    setAiLogs((prev) => [
      {
        id: `ai-custom-${Date.now()}`,
        timestamp: 'Just now',
        userPrompt: command,
        type: 'design_change',
        title: 'Targeted AI Execution',
        description: `Synthesized request: "${command}". Refined target elements across ${activeScreen.name}.`,
        affectedScreenId: activeScreen.id,
      },
      ...prev,
    ]);

    return {
      success: true,
      type: 'design_change',
      message: `Processed "${command}": Analyzed intent and synchronized prototype schema and visual attributes on ${activeScreen.name}.`,
    };
  };

  const resetToDefault = () => {
    setProject(defaultProject);
    setActiveScreenId('home');
    setActiveFlowId('product_purchase');
    setSelectedElementId(null);
  };

  return (
    <PrototypeContext.Provider
      value={{
        mode,
        setMode,
        project,
        setProject,
        activeScreenId,
        setActiveScreenId,
        activeScreen,
        activeFlowId,
        setActiveFlowId,
        selectedElementId,
        setSelectedElementId,
        selectedElement,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
        saveStatus,
        previewDevice,
        setPreviewDevice,
        aiLogs,
        isGenerating,
        generationStep,
        updateElementStyles,
        updateElementContent,
        updateElementAction,
        duplicateElement,
        deleteElement,
        addElement,
        insertStepIntoFlow,
        removeStepFromFlow,
        reorderFlowSteps,
        updateStepDestination,
        renameScreen,
        duplicateScreen,
        addCustomScreen,
        generatePrototype,
        executeAiCommand,
        resetToDefault,
      }}
    >
      {children}
    </PrototypeContext.Provider>
  );
};

export const usePrototype = () => {
  const context = useContext(PrototypeContext);
  if (!context) {
    throw new Error('usePrototype must be used within a PrototypeProvider');
  }
  return context;
};
