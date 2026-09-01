// Shared between scripts/generate-test-data.mjs (build-time snapshot) and
// server/index.mjs (live run results) — both need the same Playwright JSON
// report flattened into a simple {describe, title, file, status, duration}[].

/**
 * @typedef {{ describe: string, title: string, file: string, status: string, duration: number, error?: string, skipReason?: string }} FlatTest
 * @typedef {{ generatedAt: string, durationMs: number, total: number, passed: number, failed: number, skipped: number }} FlatMeta
 */

function stripAnsi(text) {
  // eslint-disable-next-line no-control-regex
  return text.replace(/\x1b\[[0-9;]*m/g, '')
}

/** @returns {FlatTest[]} */
export function flattenReport(report) {
  const tests = []

  function walk(suite, fileTitle, describeTitle) {
    for (const spec of suite.specs ?? []) {
      const test = spec.tests?.[0]
      const result = test?.results?.[0]

      const skipAnnotation = test?.annotations?.find((a) => a.type === 'skip' || a.type === 'fixme')
      const rawError = result?.error?.message ?? result?.errors?.[0]?.message

      tests.push({
        describe: describeTitle,
        title: spec.title,
        file: fileTitle,
        status: result?.status ?? 'unknown',
        duration: Math.round(result?.duration ?? 0),
        ...(rawError ? { error: stripAnsi(rawError).split('\n').slice(0, 3).join('\n').trim() } : {}),
        ...(skipAnnotation?.description ? { skipReason: skipAnnotation.description } : {}),
      })
    }
    for (const child of suite.suites ?? []) {
      walk(child, fileTitle, child.title)
    }
  }

  for (const fileSuite of report.suites ?? []) {
    walk(fileSuite, fileSuite.file, fileSuite.title)
  }

  return tests
}

/** @param {FlatTest[]} tests @returns {FlatMeta} */
export function summarize(report, tests) {
  return {
    generatedAt: report.stats.startTime,
    durationMs: Math.round(report.stats.duration),
    total: tests.length,
    passed: tests.filter((t) => t.status === 'passed').length,
    failed: tests.filter((t) => t.status === 'failed' || t.status === 'timedOut').length,
    skipped: tests.filter((t) => t.status === 'skipped').length,
  }
}
