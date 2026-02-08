import type { Component } from "./types";

// Import all per-category parts files
import cpusData from "@/data/parts/cpus.json";
import gpusData from "@/data/parts/gpus.json";
import motherboardsData from "@/data/parts/motherboards.json";
import ramData from "@/data/parts/ram.json";
import storageData from "@/data/parts/storage.json";
import psusData from "@/data/parts/psus.json";
import casesData from "@/data/parts/cases.json";
import coolersData from "@/data/parts/coolers.json";
import monitorsData from "@/data/parts/monitors.json";
import keyboardsData from "@/data/parts/keyboards.json";
import miceData from "@/data/parts/mice.json";
import headsetsData from "@/data/parts/headsets.json";

// Merge all parts into a single flat array
const allParts: Component[] = [
  ...(cpusData as unknown as Component[]),
  ...(gpusData as unknown as Component[]),
  ...(motherboardsData as unknown as Component[]),
  ...(ramData as unknown as Component[]),
  ...(storageData as unknown as Component[]),
  ...(psusData as unknown as Component[]),
  ...(casesData as unknown as Component[]),
  ...(coolersData as unknown as Component[]),
  ...(monitorsData as unknown as Component[]),
  ...(keyboardsData as unknown as Component[]),
  ...(miceData as unknown as Component[]),
  ...(headsetsData as unknown as Component[]),
];

export function getAllParts(): Component[] {
  return allParts;
}

export function getPartById(id: string): Component | undefined {
  return allParts.find((p) => p.id === id);
}

export function getPartsByCategory(category: string): Component[] {
  return allParts.filter((p) => p.category === category);
}

export function getPartsByIds(ids: string[]): Component[] {
  return ids
    .map((id) => allParts.find((p) => p.id === id))
    .filter((p): p is Component => p !== undefined);
}

export function searchParts(query: string, category?: string): Component[] {
  const q = query.toLowerCase();
  let parts = category ? getPartsByCategory(category) : allParts;
  return parts.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.model.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
  );
}

// Category metadata
export const categoryMeta: Record<
  string,
  { label: string; icon: string; plural: string }
> = {
  cpu: { label: "CPU", icon: "🔲", plural: "CPUs" },
  gpu: { label: "Graphics Card", icon: "🎮", plural: "Graphics Cards" },
  motherboard: { label: "Motherboard", icon: "📋", plural: "Motherboards" },
  ram: { label: "Memory", icon: "💾", plural: "Memory" },
  storage: { label: "Storage", icon: "💿", plural: "Storage" },
  psu: { label: "Power Supply", icon: "⚡", plural: "Power Supplies" },
  case: { label: "Case", icon: "🖥️", plural: "Cases" },
  cooler: { label: "CPU Cooler", icon: "❄️", plural: "CPU Coolers" },
  monitor: { label: "Monitor", icon: "🖥️", plural: "Monitors" },
  keyboard: { label: "Keyboard", icon: "⌨️", plural: "Keyboards" },
  mouse: { label: "Mouse", icon: "🖱️", plural: "Mice" },
  headset: { label: "Headset", icon: "🎧", plural: "Headsets" },
};

export default allParts;
