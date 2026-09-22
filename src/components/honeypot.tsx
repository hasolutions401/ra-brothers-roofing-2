import type { RefObject } from "react";
import { HONEYPOT_FIELD } from "@/lib/submissions";

/**
 * A field that people never see or reach (off-screen, hidden from screen
 * readers, skipped by Tab), so anything typed into it came from a bot.
 */
export function Honeypot({ inputRef }: { inputRef: RefObject<HTMLInputElement | null> }) {
  return (
    <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
      <label>
        Leave this field empty
        <input ref={inputRef} type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
