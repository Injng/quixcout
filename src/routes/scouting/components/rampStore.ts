import { writable } from "svelte/store";

export type RampSlot = "N" | "G" | "P";

export const rampSlots = writable<RampSlot[]>(Array(9).fill("N"));


