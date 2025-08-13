import { handlers } from "./msw/handlers"

import { setupServer } from "msw/node"
import { afterAll, afterEach, beforeAll } from "vitest"

export const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())


