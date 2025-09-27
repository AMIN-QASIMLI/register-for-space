import { create } from "zustand"

interface State {
    missionName: string,
    missionDate: string,
    missionDirection: string,
    missionType: "",
}

export const missionParams = create<State>((set) => {
    missionName: ""
    missionDate: ""
    missionDirection: ""
    missionType: ""
    setMissionName: () => set((i) => ({missionName: statei}))
})
