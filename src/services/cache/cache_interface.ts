export interface CacheInterface {
  get(key: string): Promise<string | null>
  set(key: string, value: string): Promise<boolean>
  del(key: string): Promise<boolean>
  keys(pattern: string): Promise<string[]>
  flush(): Promise<boolean>
}
