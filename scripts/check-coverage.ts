#!/usr/bin/env bun

/**
 * Script to check test coverage threshold
 * Exits with code 1 if coverage is below the minimum threshold
 */

import { $ } from 'bun';

const MINIMUM_LINE_COVERAGE = 80;
const MINIMUM_FUNCTION_COVERAGE = 80;

async function runTestsAndCheckCoverage(): Promise<void> {
  const result = await $`bun test --coverage --env-file=.env.test 2>&1`.nothrow();

  const output = result.text();

  if (result.exitCode !== 0) {
    console.error('\n❌ Tests failed!');
    process.exit(result.exitCode);
  }

  // Parse coverage from output - look for "All files" line
  const lines = output.split('\n');
  let allFilesCoverage: { funcs: number; lines: number } | null = null;

  for (const line of lines) {
    if (line.includes('All files')) {
      // Format: " All files                           |   92.89 |   89.02 |"
      const parts = line.split('|').map(p => p.trim());
      if (parts.length >= 3) {
        const funcs = Number.parseFloat(parts[1]);
        const linesVal = Number.parseFloat(parts[2]);
        if (!Number.isNaN(funcs) && !Number.isNaN(linesVal)) {
          allFilesCoverage = { funcs, lines: linesVal };
        }
      }
      break;
    }
  }

  if (!allFilesCoverage) {
    console.error('\n❌ Could not parse coverage information from test output');
    console.error('Push rejected: coverage verification failed.');
    process.exit(1);
  }

  console.log('\n📊 Coverage Summary:');
  console.log(`   Function coverage: ${allFilesCoverage.funcs.toFixed(2)}% (minimum: ${MINIMUM_FUNCTION_COVERAGE}%)`);
  console.log(`   Line coverage: ${allFilesCoverage.lines.toFixed(2)}% (minimum: ${MINIMUM_LINE_COVERAGE}%)`);

  let passed = true;

  if (allFilesCoverage.funcs < MINIMUM_FUNCTION_COVERAGE) {
    console.error(
      `\n❌ Function coverage ${allFilesCoverage.funcs.toFixed(2)}% is below minimum threshold of ${MINIMUM_FUNCTION_COVERAGE}%`,
    );
    passed = false;
  }

  if (allFilesCoverage.lines < MINIMUM_LINE_COVERAGE) {
    console.error(
      `\n❌ Line coverage ${allFilesCoverage.lines.toFixed(2)}% is below minimum threshold of ${MINIMUM_LINE_COVERAGE}%`,
    );
    passed = false;
  }

  if (passed) {
    console.log('\n✅ Coverage thresholds met!');
    process.exit(0);
  } else {
    console.error('\n❌ Coverage thresholds not met. Push rejected.');
    process.exit(1);
  }
}

runTestsAndCheckCoverage();
