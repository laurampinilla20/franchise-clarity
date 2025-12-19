import { createContext, useContext, useState, ReactNode } from 'react';

interface SignInModalContextType {
  isOpen: boolean;
  openModal: (sectionId?: string) => void;
  closeModal: () => void;
  pendingSectionId: string | null;
  clearPendingSection: () => void;
}

const SignInModalContext = createContext<SignInModalContextType | undefined>(undefined);

export function SignInModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingSectionId, setPendingSectionId] = useState<string | null>(null);

  const openModal = (sectionId?: string) => {
    if (sectionId) {
      setPendingSectionId(sectionId);
      // Store in sessionStorage as backup
      sessionStorage.setItem('pendingSignInSection', sectionId);
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const clearPendingSection = () => {
    setPendingSectionId(null);
    sessionStorage.removeItem('pendingSignInSection');
  };

  return (
    <SignInModalContext.Provider
      value={{
        isOpen,
        openModal,
        closeModal,
        pendingSectionId,
        clearPendingSection,
      }}
    >
      {children}
    </SignInModalContext.Provider>
  );
}

export function useSignInModal() {
  const context = useContext(SignInModalContext);
  if (context === undefined) {
    throw new Error('useSignInModal must be used within a SignInModalProvider');
  }
  return context;
}

