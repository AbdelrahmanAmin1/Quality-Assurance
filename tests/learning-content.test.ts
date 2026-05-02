import assert from "node:assert/strict";
import test from "node:test";
import { extractMaterialMetadata } from "../lib/learning-services";
import { serializeTags } from "../lib/notes-utils";

test("learning-content: material extraction creates metadata from uploaded filename", () => {
  const result = extractMaterialMetadata("Hash_Table_Notes.pdf", "pdf");
  assert.equal(result.status, "processed");
  assert.equal(result.title, "Hash Table Notes");
  assert.match(result.summary, /Hash Table Notes/);
});

test("learning-content: material extraction handles empty names safely", () => {
  const result = extractMaterialMetadata(".pdf", "pdf");
  assert.equal(result.title, "Untitled material");
});

test("learning-content: note tags are trimmed, deduplicated, and serialized", () => {
  assert.equal(serializeTags([" concept ", "concept", "", "exam"]), JSON.stringify(["concept", "exam"]));
});

test("learning-content: invalid tag and metadata inputs do not crash", () => {
  const result = extractMaterialMetadata(42, { unsupported: true });
  assert.equal(result.title, "Untitled material");
  assert.equal(serializeTags(["valid", 42, null, "", " valid "] as unknown[]), JSON.stringify(["valid"]));
  assert.equal(serializeTags(null as unknown as unknown[]), JSON.stringify([]));
});
