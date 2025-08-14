export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

export type DeepRequired<T> = { [P in keyof T]-?: DeepRequired<T[P]> };