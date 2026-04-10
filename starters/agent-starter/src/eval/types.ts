export interface EvalCase {
  name: string;
  input: string;
  /** Substring or regex the final response must match. */
  expected: string | RegExp;
}

export interface EvalResult {
  name: string;
  pass: boolean;
  turnsUsed: number;
  actual: string;
  error?: string;
}

export interface EvalSuiteResult {
  total: number;
  passed: number;
  failed: number;
  results: EvalResult[];
}
