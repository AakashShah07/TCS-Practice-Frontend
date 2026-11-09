/**
 * Scope guard for the Infosys 2027 "Fair Stalls Logic Set" mock (test ID below).
 *
 * Several components (currently just the question palette) branch on this
 * constant to render test-wide navigation for this one mock. Every other
 * mock test, topic practice test and full mock keeps its existing behavior.
 */

/** All backend test IDs for Infosys SE 2027 mock tests. */
export const INFOSYS_2027_MOCK_TEST_IDS = [
  "6aed76cf8a37b5232a789b6f",
  "6aef07ead39ac88af6fe3f9c",
  "6aef1b05d39ac88af6fe42b4",
  "6aef1d86d39ac88af6fe4342",
] as const;

type InfosysMockTestId = (typeof INFOSYS_2027_MOCK_TEST_IDS)[number];

/** True only for Infosys SE 2027 mock tests — never for any other test. */
export function isInfosys2027MockTest(testId: string | null | undefined): boolean {
  return testId ? INFOSYS_2027_MOCK_TEST_IDS.includes(testId as InfosysMockTestId) : false;
}
