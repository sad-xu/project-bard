import { useMemo, useState } from 'react'
import { URLSearchParamsInit, useSearchParams } from 'react-router-dom'

/**
 * 传入一个对象，和键集合，返回对应的对象中的键值对
 * @param obj
 * @param keys
 */
const subset = <O extends { [key in string]: unknown }, K extends keyof O>(
  obj: O,
  keys: K[]
) => {
  const filteredEntries = Object.entries(obj).filter(([key]) =>
    keys.includes(key as K)
  )
  return Object.fromEntries(filteredEntries) as Pick<O, K>
}

//
const cleanObject = (object?: { [key: string]: unknown }) => {
  if (!object) return {}
  const result = { ...object }
  Object.keys(result).forEach((key) => {
    const value = result[key]
    if (value === '' || value === undefined || value === null) {
      delete result[key]
    }
  })
  return result
}

/**
 * 返回页面url中，指定键的参数值
 */
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams] = useSearchParams()
  const setSearchParams = useSetUrlSearchParam()
  const [stateKeys] = useState(keys)
  return [
    useMemo(
      () =>
        subset(Object.fromEntries(searchParams), stateKeys) as {
          [key in K]: string
        },
      [searchParams, stateKeys]
    ),
    (params: Partial<{ [key in K]: unknown }>) => {
      return setSearchParams(params)
    }
  ] as const
}

export const useSetUrlSearchParam = () => {
  const [searchParams, setSearchParam] = useSearchParams()
  return (params: { [key in string]: unknown }) => {
    const o = cleanObject({
      ...Object.fromEntries(searchParams),
      ...params
    }) as URLSearchParamsInit
    return setSearchParam(o)
  }
}
