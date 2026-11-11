// Dependency-free smoke check: valid JSON and expected example shape.
import fs from 'node:fs'
import assert from 'node:assert/strict'
const form = JSON.parse(fs.readFileSync(new URL('../examples/science-activity.form.schema.json', import.meta.url), 'utf8'))
const ui = JSON.parse(fs.readFileSync(new URL('../examples/science-activity.ui.schema.json', import.meta.url), 'utf8'))
const rules = JSON.parse(fs.readFileSync(new URL('../examples/consolidation-rule.json', import.meta.url), 'utf8'))
assert.equal(form.type, 'object')
assert.equal(ui.type, 'VerticalLayout')
assert.ok(rules.metrics.length > 0)
for (const r of rules.metrics) assert.ok(form.properties[r.sourcePointer.slice(1)], `missing form property ${r.sourcePointer}`)
console.log('Example JSON files: OK')
