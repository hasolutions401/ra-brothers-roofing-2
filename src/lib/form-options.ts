import options from "../../backend/config/form-options.json";
import { services } from "./services";

/**
 * The choices offered by both forms. The Laravel API validates answers
 * against this same file, so the two can never disagree about what is
 * allowed. Edit choices in backend/config/form-options.json only.
 */
export const formOptions = options;

// Fail the build, not a customer's request, if a service is added to the
// site without being allowed by the API.
const unknown = services.map((s) => s.name).filter((name) => !options.services.includes(name));
if (unknown.length > 0) {
  throw new Error(`Add ${unknown.join(", ")} to "services" in backend/config/form-options.json.`);
}
