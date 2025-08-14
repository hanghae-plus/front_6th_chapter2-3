import { describe, it, expect, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import { NuqsAdapter } from "nuqs/adapters/react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "@testing-library/jest-dom"
import PostsManager from "../posts-manager/ui/PostsManagerPage"

const renderWithRouter = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <BrowserRouter>
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
      </NuqsAdapter>
    </BrowserRouter>,
  )
}

describe("PostsManagerPage", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/")
  })

  describe("초기 렌더링", () => {
    it("페이지 제목이 올바르게 표시된다", async () => {
      // Given & When
      renderWithRouter(<PostsManager />)

      // Then
      await waitFor(() => {
        expect(screen.getByText("게시물 관리자")).toBeInTheDocument()
      })
    })

    it("API 응답 후 게시물 목록이 표시된다", async () => {
      // Given
      renderWithRouter(<PostsManager />)

      // When & Then
      await waitFor(
        () => {
          expect(screen.getByText("Test Post 1")).toBeInTheDocument()
          expect(screen.getByText("Test Post 2")).toBeInTheDocument()
        },
        { timeout: 3000 },
      )
    })
  })

  describe("게시물 검색", () => {
    it("검색창에 입력한 텍스트가 반영된다", async () => {
      // Given
      const user = userEvent.setup()
      renderWithRouter(<PostsManager />)

      await waitFor(() => {
        expect(screen.getByText("게시물 관리자")).toBeInTheDocument()
      })

      // When
      const searchInput = screen.getByPlaceholderText("게시물 검색...")
      await user.type(searchInput, "테스트 검색어")

      // Then
      expect(searchInput).toHaveValue("테스트 검색어")
    })

    it("엔터키로 검색을 실행할 수 있다", async () => {
      // Given
      const user = userEvent.setup()
      renderWithRouter(<PostsManager />)

      const searchInput = screen.getByPlaceholderText("게시물 검색...")

      // When
      await user.clear(searchInput)
      await user.type(searchInput, "Test{enter}")

      // Then
      expect(searchInput).toHaveValue("Test")
    })
  })

  describe("게시물 추가", () => {
    it("추가 버튼 클릭 시 다이얼로그가 열린다", async () => {
      // Given
      const user = userEvent.setup()
      renderWithRouter(<PostsManager />)

      await waitFor(() => {
        expect(screen.getByText("게시물 관리자")).toBeInTheDocument()
      })

      // When
      const addButton = screen.getByRole("button", { name: /게시물 추가/i })
      await user.click(addButton)

      // Then
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument()
        expect(screen.getByText("새 게시물 추가")).toBeInTheDocument()
      })
    })

    it("다이얼로그에서 제목과 내용을 입력할 수 있다", async () => {
      // Given
      const user = userEvent.setup()
      renderWithRouter(<PostsManager />)

      const addButton = screen.getByRole("button", { name: /게시물 추가/i })
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument()
      })

      // When
      const titleInput = screen.getByPlaceholderText("제목")
      const bodyTextarea = screen.getByPlaceholderText("내용")

      await user.type(titleInput, "새로운 테스트 게시물")
      await user.type(bodyTextarea, "새로운 테스트 게시물의 내용입니다")

      // Then
      expect(titleInput).toHaveValue("새로운 테스트 게시물")
      expect(bodyTextarea).toHaveValue("새로운 테스트 게시물의 내용입니다")
    })
  })

  describe("게시물 관리", () => {
    it("관리 버튼들이 표시된다", async () => {
      // Given
      renderWithRouter(<PostsManager />)

      // When & Then
      await waitFor(() => {
        expect(screen.getByText("게시물 관리자")).toBeInTheDocument()
      })

      // 액션 버튼들 확인 (아이콘 버튼들)
      const buttons = screen.getAllByRole("button")
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe("UI 구성 요소", () => {
    it("필수 UI 요소들이 모두 렌더링된다", async () => {
      // Given
      renderWithRouter(<PostsManager />)

      // When & Then
      await waitFor(() => {
        expect(screen.getByText("게시물 관리자")).toBeInTheDocument()
      })

      // 검색창 확인
      expect(screen.getByPlaceholderText("게시물 검색...")).toBeInTheDocument()

      // 선택 박스들 확인 (combobox role)
      const comboboxes = screen.getAllByRole("combobox")
      expect(comboboxes.length).toBeGreaterThan(0)

      // 페이지네이션 버튼들 확인
      expect(screen.getByRole("button", { name: "이전" })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "다음" })).toBeInTheDocument()
    })
  })

  describe("페이지네이션", () => {
    it("이전/다음 버튼이 올바른 상태로 표시된다", async () => {
      // Given
      renderWithRouter(<PostsManager />)

      await waitFor(() => {
        expect(screen.getByText("게시물 관리자")).toBeInTheDocument()
      })

      // When & Then
      const prevButton = screen.getByRole("button", { name: "이전" })
      const nextButton = screen.getByRole("button", { name: "다음" })

      expect(prevButton).toBeInTheDocument()
      expect(nextButton).toBeInTheDocument()

      // 초기 상태에서 이전 버튼은 비활성화되어야 함
      expect(prevButton).toBeDisabled()
    })
  })

  describe("URL 상태 동기화", () => {
    it("URL 파라미터가 검색창에 반영된다", async () => {
      // Given - URL에 searchQuery 파라미터 설정
      const searchParams = "?searchQuery=test"
      window.history.pushState({}, "", searchParams)

      // When
      renderWithRouter(<PostsManager />)

      // Then - 검색창에 URL 파라미터 값이 반영되어야 함
      await waitFor(
        () => {
          const searchInput = screen.getByPlaceholderText("게시물 검색...")
          expect(searchInput).toHaveValue("test")
        },
        { timeout: 3000 },
      )
    })
  })

  describe("로딩 처리", () => {
    it("로딩 상태 또는 콘텐츠가 적절히 표시된다", async () => {
      // Given & When
      renderWithRouter(<PostsManager />)

      // Then
      await waitFor(() => {
        const hasLoading = screen.queryByText("로딩 중...")
        const hasContent = screen.queryByText("게시물 관리자")

        expect(hasLoading || hasContent).toBeTruthy()
      })
    })
  })
})
