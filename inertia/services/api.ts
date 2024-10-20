export class Api {
  readonly #xsrf: string

  public constructor() {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
    this.#xsrf = match ? match[1] : ''
  }

  public async get<T>(url: string): Promise<T> {
    return fetch(url).then((res) => res.json())
  }

  public async put<T, B = unknown>(url: string, body?: B): Promise<T> {
    return fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': this.#xsrf,
      },
      body: body ? JSON.stringify(body) : undefined,
    }).then((res) => res.json())
  }

  public async delete<T, B = unknown>(url: string, body?: B): Promise<T> {
    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': this.#xsrf,
      },
      body: body ? JSON.stringify(body) : undefined,
    }).then((res) => res.json())
  }

  public async post<T, B = unknown>(url: string, body?: B): Promise<T> {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': this.#xsrf,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    return await res.json()
  }
}
