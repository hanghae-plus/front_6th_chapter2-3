import { queryOptions } from "@tanstack/react-query"

export const createEntityQueries = <TEntity extends string>(entity: TEntity) => {
  const all = [entity] as const

  function build<TParams, TResult>(name: string, fn: (params: TParams) => Promise<TResult>) {
    const getKey = (params: TParams) => [...all, name, params] as const
    const getOptions = (params: TParams) =>
      queryOptions<TResult>({ queryKey: getKey(params), queryFn: () => fn(params) })
    return { getKey, getOptions }
  }

  const buildParamless = <TResult>(name: string, fn: () => Promise<TResult>) => {
    const getKey = () => [...all, name] as const
    const getOptions = () => queryOptions({ queryKey: getKey(), queryFn: () => fn() })

    return { getKey, getOptions }
  }

  return { all, build, buildParamless }
}


