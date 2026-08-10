const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const plist = require("plist");

const root = path.join(__dirname, "..");
const grammar = JSON.parse(fs.readFileSync(path.join(root, "syntaxes/Aleo.tmLanguage.json"), "utf8"));
const plistGrammar = plist.parse(fs.readFileSync(path.join(root, "syntaxes/Aleo.tmLanguage"), "utf8"));

function matches(rule, value) {
  return new RegExp(`^(?:${grammar.repository[rule].match})$`).test(value);
}

function finds(rule, value) {
  return new RegExp(grammar.repository[rule].match).test(value);
}

test("the JSON and plist grammars contain the same data", () => {
  assert.deepEqual(plistGrammar, grammar);
});

test("the grammar includes all current instructions", () => {
  const instructions = [
    "abs", "abs.w", "add", "add.w", "and", "assert.eq", "assert.neq", "async", "await", "branch.eq", "branch.neq",
    "call", "call.dynamic", "cast", "cast.lossy", "commit.bhp256", "commit.bhp256.raw", "commit.bhp512",
    "commit.bhp512.raw", "commit.bhp768", "commit.bhp768.raw", "commit.bhp1024", "commit.bhp1024.raw",
    "commit.ped64", "commit.ped64.raw", "commit.ped128", "commit.ped128.raw", "contains", "contains.dynamic",
    "deserialize.bits", "deserialize.bits.raw", "div", "div.w", "double", "ecdsa.verify.digest",
    "ecdsa.verify.digest.eth", "ecdsa.verify.keccak256", "ecdsa.verify.keccak256.eth",
    "ecdsa.verify.keccak256.raw", "ecdsa.verify.keccak384", "ecdsa.verify.keccak384.eth",
    "ecdsa.verify.keccak384.raw", "ecdsa.verify.keccak512", "ecdsa.verify.keccak512.eth",
    "ecdsa.verify.keccak512.raw", "ecdsa.verify.sha3_256", "ecdsa.verify.sha3_256.eth",
    "ecdsa.verify.sha3_256.raw", "ecdsa.verify.sha3_384", "ecdsa.verify.sha3_384.eth",
    "ecdsa.verify.sha3_384.raw", "ecdsa.verify.sha3_512", "ecdsa.verify.sha3_512.eth",
    "ecdsa.verify.sha3_512.raw", "get", "get.dynamic", "get.or_use", "get.or_use.dynamic",
    "get.record.dynamic", "gt", "gte", "hash.bhp256", "hash.bhp256.raw", "hash.bhp512", "hash.bhp512.raw",
    "hash.bhp768", "hash.bhp768.raw", "hash.bhp1024", "hash.bhp1024.raw", "hash.keccak256",
    "hash.keccak256.raw", "hash.keccak256.native", "hash.keccak256.native.raw", "hash.keccak384",
    "hash.keccak384.raw", "hash.keccak384.native", "hash.keccak384.native.raw", "hash.keccak512",
    "hash.keccak512.raw", "hash.keccak512.native", "hash.keccak512.native.raw", "hash.ped64", "hash.ped64.raw",
    "hash.ped128", "hash.ped128.raw", "hash.psd2", "hash.psd2.raw", "hash.psd4", "hash.psd4.raw",
    "hash.psd8", "hash.psd8.raw", "hash.sha3_256", "hash.sha3_256.raw", "hash.sha3_256.native",
    "hash.sha3_256.native.raw", "hash.sha3_384", "hash.sha3_384.raw", "hash.sha3_384.native",
    "hash.sha3_384.native.raw", "hash.sha3_512", "hash.sha3_512.raw", "hash.sha3_512.native",
    "hash.sha3_512.native.raw", "hash_many.psd2", "hash_many.psd4", "hash_many.psd8", "inv", "is.eq",
    "is.neq", "lt", "lte", "mod", "mul", "mul.w", "nand", "neg", "nor", "not", "or", "position", "pow",
    "pow.w", "rand.chacha", "rem", "rem.w", "remove", "serialize.bits", "serialize.bits.raw", "set", "shl",
    "shl.w", "shr", "shr.w", "sign.verify", "snark.verify", "snark.verify.batch", "sqrt", "square", "sub",
    "sub.w", "ternary", "xor"
  ];

  assert.equal(instructions.length, 142);
  assert.equal(new Set(instructions).size, 142);
  for (const instruction of instructions) {
    assert.equal(matches("instructions", instruction), true, `missing instruction: ${instruction}`);
  }
});

test("the grammar includes current declarations, types, and operands", () => {
  for (const keyword of ["constructor", "to", "view", "with"]) {
    assert.equal(matches("keywords", keyword), true, `missing keyword: ${keyword}`);
  }

  for (const type of ["identifier", "string"]) {
    assert.equal(matches("literal_type", type), true, `missing literal type: ${type}`);
  }

  for (const type of ["dynamic.future", "dynamic.record"]) {
    assert.equal(matches("register_type", type), true, `missing register type: ${type}`);
  }

  for (const operand of [
    "aleo::GENERATOR", "aleo::GENERATOR_POWERS", "aleo::GENERATOR_POWERS[5u32]", "block.height",
    "block.timestamp", "checksum", "edition", "group::GEN", "network.id", "program_owner", "self.caller",
    "self.signer", "token.aleo/checksum", "transfer/checksum", "token.aleo/transfer/checksum",
    "token.aleo/edition", "token.aleo/program_owner"
  ]) {
    assert.equal(matches("special_operands", operand), true, `missing operand: ${operand}`);
  }

  assert.equal(matches("identifier_literal", "'hello_world_42'"), true);
  assert.equal(matches("keywords", "by"), false);
  assert.equal(matches("keywords", "interface"), false);
});

test("the grammar rejects instruction prefixes and invalid literals", () => {
  assert.equal(finds("instructions", "call.dynamic.extra"), false);
  assert.equal(finds("instructions", "get.or_use.dynamic.extra"), false);
  assert.equal(finds("instructions", "hash.keccak256.native.raw.extra"), false);
  assert.equal(finds("special_operands", "self.caller.extra"), false);
  assert.equal(matches("numeric_literal", "-12i64"), true);
  assert.equal(matches("numeric_literal", "-12u64"), false);
  assert.equal(matches("numeric_literal", "42u8"), true);
  assert.equal(matches("numeric_literal", "42"), false);
  assert.equal(matches("address", "aleo1qqqq_qqqq"), true);
  assert.equal(matches("address", "aleo1bbbb"), false);
});

test("special operands take precedence over bare keywords", () => {
  const includes = grammar.patterns.map((pattern) => pattern.include);
  assert.ok(includes.indexOf("#special_operands") < includes.indexOf("#keywords"));
});
