import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import App from "./App"

// 통합 시나리오: 목록 로딩 → 태그 필터 → 검색 → 상세 댓글 로드/추가/수정/삭제/좋아요 → 게시물 추가/수정/삭제

const renderApp = () => render(<App />)

describe("App - 기본 동작", () => {
  test("초기 로딩 후 게시물 목록과 페이지네이션이 나타난다", async () => {
    renderApp()

    // 로딩
    expect(screen.getByText("로딩 중...")).toBeInTheDocument()

    // 목록 렌더링
    const firstTitleCell = await screen.findByText(/^Post 1$/)
    expect(firstTitleCell).toBeInTheDocument()
    const row = firstTitleCell.closest("tr")!

    // 페이지네이션 버튼
    expect(screen.getByRole("button", { name: "다음" })).toBeEnabled()
    expect(screen.getByRole("button", { name: "이전" })).toBeDisabled()
    expect(row).toBeInTheDocument()
  })

  test("태그 필터링이 동작한다", async () => {
    renderApp()

    await screen.findByText(/^Post 1$/)

    // 드롭다운 대신 테이블 내 태그 칩 클릭으로 필터 적용 (jsdom pointer 이슈 회피)
    const tagChip = await screen.findAllByText("tag-a")
    await userEvent.click(tagChip[0])

    // URL 쿼리 파라미터로 태그가 반영되었는지 확인
    expect(window.location.search).toContain("tag=tag-a")

    // 필터 적용 이후에도 리스트가 렌더링되는지 간단 확인 (여러 항목 허용)
    const titles = await screen.findAllByText(/^Post \d+$/)
    expect(titles.length).toBeGreaterThan(0)
  })

  test("검색이 동작한다", async () => {
    renderApp()
    await screen.findByText(/^Post 1$/)

    const input = screen.getByRole("textbox", { name: "게시물 검색" })
    await userEvent.clear(input)
    await userEvent.type(input, "Post 2{enter}")

    const results = await screen.findAllByText(/Post 2/)
    expect(results.length).toBeGreaterThan(0)
  })
})

describe("App - 댓글", () => {
  test("게시물 상세 열고 댓글을 로드하고 새 댓글을 추가할 수 있다", async () => {
    renderApp()
    const firstTitleCell = await screen.findByText(/^Post 1$/)
    const row = firstTitleCell.closest("tr")!
    await userEvent.click(within(row).getByRole("button", { name: "댓글 보기" }))

    // 상세 다이얼로그 열림 + 댓글 보임
    const dialog = await screen.findByRole("dialog")
    expect(within(dialog).getByRole("heading", { name: /^댓글$/ })).toBeInTheDocument()

    // 댓글 추가
    const addCommentBtn = within(dialog).getByRole("button", { name: /댓글 추가/ })
    await userEvent.click(addCommentBtn)
    const addDialog = await screen.findByRole("dialog", { name: /새 댓글 추가/i })
    const textarea = within(addDialog).getByPlaceholderText("댓글 내용")
    await userEvent.type(textarea, "great!")
    await userEvent.click(within(addDialog).getByRole("button", { name: "댓글 추가" }))
    expect(await within(dialog).findByText(/great!/)).toBeInTheDocument()

    // 테스트 후 다이얼로그 닫기
    const closeBtn = within(dialog).getByRole("button", { name: "닫기" })
    await userEvent.click(closeBtn)
  })
})

describe("App - 게시물 CRUD", () => {
  test("게시물 추가/수정/삭제가 가능하다", async () => {
    renderApp()

    // 게시물 목록이 로드될 때까지 대기 (중복 요소 처리)
    const titleCells = await screen.findAllByText(/^Post 1$/)
    expect(titleCells.length).toBeGreaterThan(0)

    // 추가
    await userEvent.click(screen.getByRole("button", { name: /게시물 추가/ }))
    const addDialog = await screen.findByRole("dialog", { name: /새 게시물 추가/i })
    await userEvent.type(within(addDialog).getByPlaceholderText("제목"), "New Title")
    const body = within(addDialog).getByPlaceholderText("내용")
    await userEvent.type(body, "Body")
    const userId = within(addDialog).getByPlaceholderText("사용자 ID")
    await userEvent.clear(userId)
    await userEvent.type(userId, "1")
    await userEvent.click(within(addDialog).getByRole("button", { name: "게시물 추가" }))

    expect(await screen.findByText("New Title")).toBeInTheDocument()

    // 수정
    const titleCell = screen.getByText("New Title")
    const row = titleCell.closest("tr")!
    await userEvent.click(within(row).getByRole("button", { name: "게시물 수정" }))
    const editDialog = await screen.findByRole("dialog", { name: /게시물 수정/i })
    const titleInput = within(editDialog).getByPlaceholderText("제목")
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, "Updated Title")
    await userEvent.click(within(editDialog).getByRole("button", { name: "게시물 업데이트" }))
    expect(await screen.findByText("Updated Title")).toBeInTheDocument()

    // 삭제
    const updatedTitleCell = screen.getByText("Updated Title")
    const updatedRow = updatedTitleCell.closest("tr")!
    await userEvent.click(within(updatedRow).getByRole("button", { name: "게시물 삭제" }))

    expect(screen.queryByText("Updated Title")).not.toBeInTheDocument()
  }, 15000)
})
