import { create } from "zustand"

type DialogType = "FORBIDDEN" | "CONFIRM" | "DELETE"

interface AlertDialogProps {
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  data: any,
  setData: (data: any) => void
  setType: (type: DialogType) => void
  type: DialogType
}

export const useAlertDialog = create<AlertDialogProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false, data: {} }),
  data: {},
  setData: (data: any) => set({ data }),
  setType: (type: DialogType) => set({ type }),
  type: "FORBIDDEN"
}))