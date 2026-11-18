import { Effect, Option } from "effect"
import { Terminal } from "./terminal.js"

export const MIN: number = 1
export const MAX: number = 100

export const askNumber = (prompt: string): Effect.Effect<Option.Option<number>, never, Terminal> =>
  Effect.gen(function*() {
    const terminal = yield* Terminal

    while (true) {
      const input = yield* terminal.readLine(prompt)
      if (Option.isNone(input)) {
        return Option.none()
      }

      const guess = Number.parseInt(input.value, 10)
      if (!Number.isNaN(guess) && guess >= MIN && guess <= MAX) {
        return Option.some(guess)
      }

      yield* terminal.printLine(`Entre un nombre entre ${MIN} et ${MAX}.`)
    }
  })

export const play = (secret: number): Effect.Effect<void, never, Terminal> =>
  Effect.gen(function*() {
    const terminal = yield* Terminal
    let attempt = 1

    while (true) {
      const guess = yield* askNumber(`Essai ${attempt} : `)
      if (Option.isNone(guess)) {
        return yield* terminal.printLine(`\nAbandon. C'était ${secret}.`)
      }

      if (guess.value === secret) {
        return yield* terminal.printLine(`Gagné en ${attempt} essai(s) !`)
      }

      yield* terminal.printLine(guess.value < secret ? "C'est plus !" : "C'est moins !")
      attempt++
    }
  })
