import { Effect, Layer, Option } from "effect"
import { describe, expect, it } from "vitest"
import { play } from "./game.js"
import { Terminal } from "./terminal.js"

type Run = {
  readonly output: ReadonlyArray<string>
  readonly prompts: ReadonlyArray<string>
}

const run = async (secret: number, lines: ReadonlyArray<string>): Promise<Run> => {
  const output: Array<string> = []
  const prompts: Array<string> = []
  let index = 0

  const layer: Layer.Layer<Terminal> = Layer.succeed(Terminal, {
    readLine: (prompt: string): Effect.Effect<Option.Option<string>> =>
      Effect.sync(() => {
        prompts.push(prompt)
        return Option.fromNullishOr(lines[index++])
      }),
    printLine: (message: string): Effect.Effect<void> =>
      Effect.sync(() => {
        output.push(message)
      })
  })

  await Effect.runPromise(play(secret).pipe(Effect.provide(layer)))
  return { output, prompts }
}

describe("play", () => {
  it("gagne au premier essai", async () => {
    const { output } = await run(42, ["42"])
    expect(output).toEqual(["Gagné en 1 essai(s) !"])
  })

  it("indique plus ou moins avant de gagner", async () => {
    const { output } = await run(42, ["50", "25", "42"])
    expect(output).toEqual(["C'est moins !", "C'est plus !", "Gagné en 3 essai(s) !"])
  })

  it("ne compte pas les saisies invalides", async () => {
    const { output, prompts } = await run(42, ["abc", "0", "101", "42"])
    expect(output).toEqual([
      "Entre un nombre entre 1 et 100.",
      "Entre un nombre entre 1 et 100.",
      "Entre un nombre entre 1 et 100.",
      "Gagné en 1 essai(s) !"
    ])
    expect(prompts).toEqual(["Essai 1 : ", "Essai 1 : ", "Essai 1 : ", "Essai 1 : "])
  })

  it("numérote les invites selon les essais valides", async () => {
    const { prompts } = await run(42, ["50", "abc", "25", "42"])
    expect(prompts).toEqual(["Essai 1 : ", "Essai 2 : ", "Essai 2 : ", "Essai 3 : "])
  })

  it("abandonne en fin d'entrée et révèle le nombre", async () => {
    const { output } = await run(42, ["50"])
    expect(output).toEqual(["C'est moins !", "\nAbandon. C'était 42."])
  })

  it("accepte les bornes 1 et 100", async () => {
    expect((await run(1, ["1"])).output).toEqual(["Gagné en 1 essai(s) !"])
    expect((await run(100, ["100"])).output).toEqual(["Gagné en 1 essai(s) !"])
  })
})
