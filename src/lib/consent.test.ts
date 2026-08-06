import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  CONSENT_COOKIE,
  parseConsentCookie,
} from "./consent";

describe("parseConsentCookie", () => {
  it("returns null when cookie missing", () => {
    assert.equal(parseConsentCookie(""), null);
    assert.equal(parseConsentCookie(null), null);
    assert.equal(parseConsentCookie("other=1"), null);
  });

  it("returns accepted or rejected when present", () => {
    assert.equal(
      parseConsentCookie(`${CONSENT_COOKIE}=accepted`),
      "accepted",
    );
    assert.equal(
      parseConsentCookie(`foo=1; ${CONSENT_COOKIE}=rejected; bar=2`),
      "rejected",
    );
  });

  it("returns null for unknown values", () => {
    assert.equal(parseConsentCookie(`${CONSENT_COOKIE}=maybe`), null);
  });
});
