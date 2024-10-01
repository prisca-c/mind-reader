export class ResponseService {
  handle<TStatus, TPayload>(
    status: TStatus,
    payload: TPayload
  ): { status: TStatus; payload: TPayload } {
    return {
      status,
      payload,
    }
  }
}
