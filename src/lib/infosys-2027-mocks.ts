/**
 * Infosys SE 2027 — mock test catalog configuration.
 * Only tests listed here (and present + active in the backend) are rendered.
 * Live counts (questions, duration, free/premium) are always fetched from the API.
 */

export type InfosysMockIcon = "bar-chart-3";

export interface InfosysMockTestConfig {
  /** Backend test id (`/tests/:id`). */
  id: string;
  /** Flagship display title for this catalog. */
  displayTitle: string;
  description: string;
  /** Section/topic tags shown as badges. */
  tags: string[];
  icon: InfosysMockIcon;
}

/**
 * Currently available Infosys SE 2027 mock tests.
 * Future entries (Diagnostic/Practice/Moderate/Advanced/Final Simulation)
 * should be added here once the corresponding backend tests exist.
 */
export const INFOSYS_MOCK_TESTS: InfosysMockTestConfig[] = [
  {
    id: "6aed76cf8a37b5232a789b6f",
    displayTitle: "Data Interpretation — Fair Stalls Logic Set",
    description:
      "Mixed reasoning, verbal and technical sets: DI, data sufficiency, syllogism, conditional logic, critical reasoning, sentence completion, sentence correction, reading comprehension and pseudocode — plus five mixed-topic standalone questions.",
    tags: ["Data Interpretation", "Data Sufficiency", "Syllogism", "Reasoning"],
    icon: "bar-chart-3",
  },
  {
    id: "6aef07ead39ac88af6fe3f9c",
    displayTitle: "Mixed Reasoning & Verbal Set",
    description:
      "A second Infosys mock: QuickKart data interpretation, data sufficiency, syllogism, conditional logic, critical reasoning, sentence completion and correction, reading comprehension, pseudocode and matrix puzzles.",
    tags: ["Data Interpretation", "Syllogism", "Pseudocode", "Reasoning", "Verbal"],
    icon: "bar-chart-3",
  },
  {
    id: "6aef1b05d39ac88af6fe42b4",
    displayTitle: "Advanced Reasoning & Verbal Set (Hard)",
    description:
      "A hard Infosys mock: AutoParts plant data interpretation, hard data sufficiency, syllogism and conditional logic, critical reasoning, advanced sentence completion and correction, reading comprehension, pseudocode and number-matrix puzzles.",
    tags: ["Data Interpretation", "Data Sufficiency", "Pseudocode", "Reasoning", "Verbal"],
    icon: "bar-chart-3",
  },
  {
    id: "6aef1d86d39ac88af6fe4342",
    displayTitle: "Hard Mixed Set",
    description:
      "A hard Infosys mock: BrightHome sales data interpretation, quantitative data sufficiency, hard syllogism and seminar conditional logic, critical reasoning, grammar-heavy sentence completion and correction, reading comprehension, pseudocode and figure-matrix puzzles.",
    tags: ["Data Interpretation", "Data Sufficiency", "Pseudocode", "Reasoning", "Verbal"],
    icon: "bar-chart-3",
  },
];
