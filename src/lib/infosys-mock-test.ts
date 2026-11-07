/**
 * Scope guard for the Infosys 2027 "Fair Stalls Logic Set" mock (test ID below).
 *
 * Several components (currently just the question palette) branch on this
 * constant to render test-wide navigation for this one mock. Every other
 * mock test, topic practice test and full mock keeps its existing behavior.
 */

/** Backend test ID for the Infosys 2027 data- Interpretation mock. */
export const INFOSYS_2027_MOCK_TEST_ID = "6aed76cf8a37b5232a789b6f";

/** True only for the targeted Infosys 2027 mock — never for any other test. */
export function isInfosys2027MockTest(testId: string | null | undefined): boolean {
  return testId === INFOSYS_2027_MOCK_TEST_ID;
}
