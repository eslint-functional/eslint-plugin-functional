declare global {
  interface ObjectConstructor {
    hasOwn<ObjectType, Key extends PropertyKey>(
      object: ObjectType,
      key: Key
    ): object is ObjectType & Record<Key, unknown>;
  }

  interface ArrayConstructor {
    isArray(arg: unknown): arg is unknown[] | ReadonlyArray<unknown>;
  }

  interface ReadonlyArray<T> {
    at<U extends number>(index: U): this[U];
    at<R>(this: readonly [...any[], R], index: -1): R;
  }

  interface Array<T> {
    at<U extends number>(index: U): this[U];
    at<R>(this: readonly [...any[], R], index: -1): R;
  }
}

export {};
