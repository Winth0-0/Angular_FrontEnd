import { ActivatedRoute, Params } from '@angular/router';

enum ResultTypeName {
  Error,
  Value,
}
export class ResultType<T, Te> {
  constructor(public type: ResultTypeName, private value: T | Te) {}

  private static ok<T, Te>(value: T): ResultType<T, Te> {
    return new ResultType<T, Te>(ResultTypeName.Value, value);
  }

  private static err<T, Te>(error: Te): ResultType<T, Te> {
    return new ResultType<T, Te>(ResultTypeName.Error, error);
  }
  private static invoke<T, Te>(
    onCall: (onResponse: (error: Te | null, value: T | null) => void) => void
  ): Promise<ResultType<T, Te>> {
    return new Promise<ResultType<T, Te>>((resolve) => {
      onCall((error, value) => {
        if (error) {
          resolve(ResultType.err<T, Te>(error));
        } else if (value) {
          resolve(ResultType.ok<T, Te>(value));
        }
      });
    });
  }
  public static getParams(route: ActivatedRoute): Promise<Params> {
    return this.rawInvoke<Params>((onResponse) =>
      route.params.subscribe((params) => onResponse(params))
    );
  }
  public static rawInvoke<T>(
    onCall: (onResponse: (value: T | PromiseLike<T>) => void) => void
  ): Promise<T> {
    return new Promise<T>((resolve) => {
      onCall((value) => {
        resolve(value);
      });
    });
  }
  public static async invokeThrow<T, Te>(
    onCall: (onResponse: (error: Te | null, value: T | null) => void) => void
  ): Promise<T> {
    let result = await ResultType.invoke(onCall);
    if (result.type == ResultTypeName.Error) throw result.value;
    return result.value as T;
  }
}
