import { httpClient } from "@/shared/api/http"
import { Tag } from "../model"

export const getTags = async (): Promise<Tag[]> => httpClient.get<Tag[]>("/posts/tags")
