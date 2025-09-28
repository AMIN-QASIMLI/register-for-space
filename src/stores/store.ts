import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface State {
  missionName: string;
  missionDate: string;
  missionDirection: string;
  missionType: string;
  setMissionName: (name: string) => void;
  setMissionDate: (date: string) => void;
  setMissionDirection: (direction: string) => void;
  setMissionType: (type: string) => void;
}

interface Step {
  i: number;
  increaseIndex: () => void;
}

type StepItem = { title: string; description: string };

export const missionParams = create<State>()(
  persist(
    (set) => ({
      missionName: "",
      missionDate: "",
      missionDirection: "",
      missionType: "",
      setMissionName: (name: string) => set({ missionName: name }),
      setMissionDate: (date: string) => set({ missionDate: date }),
      setMissionDirection: (direction: string) =>
        set({ missionDirection: direction }),
      setMissionType: (type: string) => set({ missionType: type }),
    }),
    {
      name: "mission-storage", // <-- localStorage key adı
      storage: createJSONStorage(() => localStorage), // <-- bunu yazmasan da default localStorage-dur
    }
  )
);

export const stepIndex = create<Step>()(
  persist(
    (set) => ({
      i: 0,
      increaseIndex: () => set((state) => ({ i: state.i + 1 })),
    }),
    {
      name: "step-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const steps: StepItem[] = [
  { title: "First", description: "Mission Parameters" },
  { title: "Second", description: "Staff Choosing" },
  { title: "Third", description: "Staff, Rocket and Management!" },
];
