import { Effect, Random } from "effect"
import { MAX, MIN, play } from "./game.js"
import { Terminal } from "./terminal.js"

const program: Effect.Effect<void, never, Terminal> = Effect.gen(function*() {
  const terminal = yield* Terminal
  const secret = yield* Random.nextIntBetween(MIN, MAX, { halfOpen: false })
  yield* terminal.printLine(`J'ai choisi un nombre entre ${MIN} et ${MAX}. À toi de le trouver !`)
  yield* play(secret)
})

Effect.runPromise(program.pipe(Effect.provide(Terminal.layer)))
