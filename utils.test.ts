import { describe, it, expect } from "vitest";
import { cn } from "./lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-4")).toBe("px-2 py-4");
  });

  it("handles conditional classes", () => {
    expect(cn("base", true && "active", false && "hidden")).toBe("base active");
  });

  it("resolves tailwind conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles arrays and objects", () => {
    expect(cn(["flex", "gap-2"], { hidden: true })).toBe("flex gap-2 hidden");
  });

  it("returns empty string for no input", () => {
    expect(cn()).toBe("");
  });
});
