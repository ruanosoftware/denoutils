import { assertEquals } from "./test_deps.ts";
import { getHelloWorld } from "./mod.ts";

Deno.test(function test_get_hello_world() {
  assertEquals(
    getHelloWorld(),
    "\u001b[47m\u001b[31mHello World\u001b[39m\u001b[49m",
  );
});
