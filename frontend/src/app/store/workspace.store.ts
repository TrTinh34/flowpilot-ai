import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WorkspaceStore {
  /** Currently selected workspace ID */
  activeWorkspaceId: string | null;
  setActiveWorkspaceId: (id: string) => void;
  clearActiveWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set) => ({
      activeWorkspaceId: null,
      setActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),
      clearActiveWorkspace: () => set({ activeWorkspaceId: null }),
    }),
    { name: 'flowpilot-active-workspace' },
  ),
);
