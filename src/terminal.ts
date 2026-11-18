import { Context, Effect, Layer, Option } from "effect"
import * as readline from "node:readline"

export class Terminal extends Context.Service<Terminal, {
  readonly readLine: (prompt: string) => Effect.Effect<Option.Option<string>>
  readonly printLine: (message: string) => Effect.Effect<void>
}>()("app/Terminal") {
  static readonly layer: Layer.Layer<Terminal> = Layer.effect(
    Terminal,
    Effect.gen(function*() {
      const rl = yield* Effect.acquireRelease(
        Effect.sync(() => readline.createInterface({ input: process.stdin })),
        (rl: readline.Interface): Effect.Effect<void> => Effect.sync(() => rl.close())
      )
      const lines = rl[Symbol.asyncIterator]()

      return {
        readLine: (prompt: string): Effect.Effect<Option.Option<string>> =>
          Effect.gen(function*() {
            process.stdout.write(prompt)
            const next = yield* Effect.promise(() => lines.next())
            return next.done ? Option.none() : Option.some(next.value)
          }),
        printLine: (message: string): Effect.Effect<void> =>
          Effect.sync(() => console.log(message))
      }
    })
  )
}
