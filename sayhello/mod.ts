import { colors } from "./deps.ts";

/** Returns `Hello World` in bold */
export function getHelloWorld(): string {
  return colors.bgWhite(colors.red("Hello World"));
}
