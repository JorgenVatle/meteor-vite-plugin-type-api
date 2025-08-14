export type PartialDeep<T> = { [P in keyof T]?: PartialDeep<T[P]> };

export type RequiredDeep<T> = { [P in keyof T]-?: RequiredDeep<T[P]> };