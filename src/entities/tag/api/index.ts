import { Tag } from "@/entities/tag/model"
import { HttpClient } from "@/shared/api/http"

export const getTags = async (): Promise<Tag[]> => HttpClient.get<Tag[]>("/posts/tags")
