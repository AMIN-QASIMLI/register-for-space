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

interface Staff {
  name: string;
  role?: string;
  xp?: number;
}

interface StaffState {
  workers: Staff[];
  setWorkers: (workers: Staff[]) => void;
  addWorker: (worker: Staff) => void;
}

type MissionStaffs = string[];

interface FormManagement {
  rocket: string;
  weight: number;
  missionStaffs: MissionStaffs;
  setRocket: (rocketName: string) => void;
  setWeight: (rocketWeight: number) => void;
  setMissionStaffs: (missionStaffs: MissionStaffs) => void;
}

interface IsMissionStart {
  isStart: boolean;
  setIsStart: () => void;
}

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
      name: "mission-storage",
      storage: createJSONStorage(() => localStorage),
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

export const staffs = create<StaffState>()(
  persist(
    (set) => ({
      workers: [],
      setWorkers: (workers: Staff[]) => set({ workers }),
      addWorker: (worker: Staff) =>
        set((state) => ({ workers: [...state.workers, worker] })),
    }),
    {
      name: "staffs-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const formManagement = create<FormManagement>()(
  persist(
    (set) => ({
      rocket: "",
      weight: 0,
      missionStaffs: [],
      setRocket: (rocketName: string) => set({ rocket: rocketName }),
      setWeight: (rocketWeight: number) => set({ weight: rocketWeight }),
      setMissionStaffs: (missionStaffs: MissionStaffs) =>
        set({ missionStaffs }),
    }),
    {
      name: "formManagement",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const isMissionStart = create<IsMissionStart>()(
  persist(
    (set) => ({
      isStart: false,
      setIsStart: () => set({ isStart: true }),
    }),
    {
      name: "isStart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
