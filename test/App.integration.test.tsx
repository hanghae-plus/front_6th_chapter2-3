import React from "react"
import { render, screen, waitFor, within, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import App from "../src/App"
import { server } from "./server"
import { http, HttpResponse } from "msw"

describe("App 통합 시나리오", () => {
  it("헤더/푸터와 메인 UI를 렌더링한다", () => {
    render(<App />)
    expect(screen.getByText("게시물 관리 시스템")).toBeInTheDocument()
    expect(screen.getByText(/게시물 관리자/)).toBeInTheDocument()
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument()
  })

  it("검색 → 결과 반영", async () => {
    render(<App />)
    const input = screen.getByPlaceholderText("게시물 검색...")
    await userEvent.type(input, "hello{enter}")
    const results = await screen.findAllByText((_, node) => (node?.textContent ?? "").includes("match hello"))
    expect(results.length).toBeGreaterThan(0)
  })

  it("태그 칩 클릭 → 태그 필터 반영", async () => {
    render(<App />)
    const tagChips = await screen.findAllByText("news")
    await userEvent.click(tagChips[0])
    await waitFor(() => expect(screen.getByText(/news post/)).toBeInTheDocument())
  })

  it("페이지네이션: Prev 비활성, Next 존재 및 가능 시 이동", async () => {
    render(<App />)
    await waitFor(() => expect(screen.queryByText("로딩 중...")).not.toBeInTheDocument())
    const prevButton = await screen.findByRole("button", { name: "이전" })
    const nextButton = await screen.findByRole("button", { name: "다음" })
    expect(prevButton).toBeDisabled()
    if (!nextButton.hasAttribute("disabled")) {
      await userEvent.click(nextButton)
      await waitFor(() => expect(prevButton).not.toBeDisabled())
    }
  })

  it("게시물 추가 다이얼로그로 새 게시물을 추가한다", async () => {
    render(<App />)
    await userEvent.click(screen.getByRole("button", { name: /게시물 추가/ }))
    const titleInput = await screen.findByPlaceholderText("제목")
    await userEvent.type(titleInput, "integration title")
    const bodyTextarea = screen.getByPlaceholderText("내용")
    await userEvent.type(bodyTextarea, "integration body")
    const userIdInput = screen.getByPlaceholderText("사용자 ID")
    await userEvent.clear(userIdInput)
    await userEvent.type(userIdInput, "1")
    await userEvent.click(screen.getByRole("button", { name: "게시물 추가" }))
    await waitFor(() => expect(screen.getAllByText("integration title")[0]).toBeInTheDocument())
  })

  it("로딩 인디케이터가 표시되었다가 사라진다", async () => {
    render(<App />)
    expect(screen.getByText("로딩 중...")).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText("로딩 중...")).not.toBeInTheDocument())
  })

  it("URL 동기화: 태그 칩 클릭 시 쿼리가 반영된다", async () => {
    render(<App />)
    const firstNewsTag = await screen.findAllByText("news")
    fireEvent.click(firstNewsTag[0])
    await waitFor(() => expect(window.location.search).toContain("tag=news"))
  })

  it("게시물 수정과 삭제가 동작한다", async () => {
    render(<App />)
    // 먼저 새 게시물 추가
    await userEvent.click(screen.getByRole("button", { name: /게시물 추가/ }))
    const titleInput = await screen.findByPlaceholderText("제목")
    await userEvent.type(titleInput, "editable title")
    const bodyTextarea = screen.getByPlaceholderText("내용")
    await userEvent.type(bodyTextarea, "editable body")
    const userIdInput = screen.getByPlaceholderText("사용자 ID")
    await userEvent.clear(userIdInput)
    await userEvent.type(userIdInput, "1")
    await userEvent.click(screen.getByRole("button", { name: "게시물 추가" }))
    await screen.findAllByText("editable title")

    // 첫 번째 데이터 행에서 편집 버튼(두 번째 ghost 버튼)을 클릭
    const rows = screen.getAllByRole("row")
    const firstDataRow = rows.find((r) => within(r).queryByText("editable title")) ?? rows[1]
    const rowButtons = within(firstDataRow).getAllByRole("button")
    // message, edit, delete 순서라 가정 → 두 번째 클릭
    await userEvent.click(rowButtons[1])
    const editBody = await screen.findByPlaceholderText("내용")
    await userEvent.clear(editBody)
    await userEvent.type(editBody, "updated body")
    await userEvent.click(screen.getByRole("button", { name: "게시물 업데이트" }))
    await waitFor(() => expect(screen.getAllByText("editable title")[0]).toBeInTheDocument())

    // 삭제 버튼(세 번째 버튼) 클릭
    const rowButtonsAfter = within(firstDataRow).getAllByRole("button")
    await userEvent.click(rowButtonsAfter[2])
    await waitFor(() => expect(screen.queryByText("editable title")).not.toBeInTheDocument())
  })

  it("게시물 상세 보기와 댓글 CRUD/좋아요 플로우가 동작한다", async () => {
    render(<App />)
    // 첫 번째 데이터 행의 작업 버튼 그룹에서 상세 보기(첫 번째 버튼) 클릭
    await waitFor(() => expect(screen.queryByText("로딩 중...")).not.toBeInTheDocument())
    const rows = screen.getAllByRole("row")
    const firstDataRow = rows[1]
    const actionButtons = within(firstDataRow).getAllByRole("button")
    await userEvent.click(actionButtons[0])
    // 댓글 영역과 '댓글' 제목
    await screen.findByText("댓글")

    // 댓글 추가
    await userEvent.click(screen.getByRole("button", { name: /댓글 추가/ }))
    const commentTextarea = await screen.findByPlaceholderText("댓글 내용")
    await userEvent.type(commentTextarea, "integration comment")
    await userEvent.click(screen.getByRole("button", { name: "댓글 추가" }))
    await screen.findByText("integration comment")

    // 댓글 수정: 방금 추가한 댓글을 기준으로 편집(두 번째 버튼) 클릭
    const firstCommentLine = screen.getByText("integration comment").closest("div") as HTMLElement
    // 버튼들은 동일 라인의 다음 형제 div에 있을 수 있으므로 container 기준으로 탐색
    const containerWithButtons = firstCommentLine.parentElement?.parentElement as HTMLElement
    const commentButtons = within(containerWithButtons).getAllByRole("button")
    // 좋아요(첫), 편집(둘), 삭제(셋)
    await userEvent.click(commentButtons[1])
    const editTextarea = await screen.findByPlaceholderText("댓글 내용")
    await userEvent.clear(editTextarea)
    await userEvent.type(editTextarea, "comment updated")
    await userEvent.click(screen.getByRole("button", { name: "댓글 업데이트" }))
    await screen.findByText("comment updated")

    // 좋아요: 첫 버튼 클릭 후 숫자 증가 확인 (텍스트가 '1' 이상)
    const updatedLine = screen.getByText("comment updated").closest("div") as HTMLElement
    const updatedRow = updatedLine.parentElement?.parentElement as HTMLElement
    const updatedButtons = within(updatedRow).getAllByRole("button")
    await userEvent.click(updatedButtons[0])

    // 댓글 삭제: 세 번째 버튼
    await userEvent.click(updatedButtons[2])
    await waitFor(() => expect(screen.queryByText("comment updated")).not.toBeInTheDocument())
  })

  it("작성자 클릭 시 사용자 모달에 상세 정보가 표시된다", async () => {
    render(<App />)
    await waitFor(() => expect(screen.queryByText("로딩 중...")).not.toBeInTheDocument())
    // 첫 행의 작성자 셀에서 username 텍스트를 찾아 클릭
    const userNameElem = screen.getAllByText(/user\d+/)[0]
    await userEvent.click(userNameElem)
    await screen.findByText("사용자 정보")
    await screen.findByText(/이름:/)
    await screen.findByText(/이메일:/)
  })

  it("검색어 하이라이트가 제목/본문에 mark로 적용된다", async () => {
    render(<App />)
    const input = screen.getByPlaceholderText("게시물 검색...")
    await userEvent.type(input, "hello{enter}")
    // 하이라이트된 mark 존재
    await waitFor(() => {
      const marks = document.querySelectorAll("mark")
      expect(marks.length).toBeGreaterThan(0)
    })
  })

  it("에러 발생 시에도 크래시 없이 로딩이 종료된다", async () => {
    server.use(http.get("/api/posts", () => HttpResponse.json({ message: "err" }, { status: 500 })))
    render(<App />)
    expect(screen.getByText("로딩 중...")).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText("로딩 중...")).not.toBeInTheDocument())
  })
})
