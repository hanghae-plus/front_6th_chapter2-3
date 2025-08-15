import { NavigateFunction } from "react-router-dom";

export interface URLParams {
  skip?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  tag?: string;
}

export class URLManager {
  static updateURL(navigate: NavigateFunction, params: URLParams) {
    const urlParams = new URLSearchParams();

    if (params.skip !== undefined)
      urlParams.set("skip", params.skip.toString());
    if (params.limit !== undefined)
      urlParams.set("limit", params.limit.toString());
    if (params.search) urlParams.set("search", params.search);
    if (params.sortBy) urlParams.set("sortBy", params.sortBy);
    if (params.sortOrder) urlParams.set("sortOrder", params.sortOrder);
    if (params.tag) urlParams.set("tag", params.tag);

    navigate(`?${urlParams.toString()}`);
  }

  static parseURLParams(search: string): URLParams {
    const params = new URLSearchParams(search);

    return {
      skip: parseInt(params.get("skip") || "0"),
      limit: parseInt(params.get("limit") || "10"),
      search: params.get("search") || "",
      sortBy: params.get("sortBy") || "",
      sortOrder: params.get("sortOrder") || "asc",
      tag: params.get("tag") || "",
    };
  }
}
