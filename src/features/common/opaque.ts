// code took from https://github.com/seancroach/ts-opaque

/**
 * `Symbols` is a namespace holding all the symbols used internally within
 * `ts-opaque`. Exposed for convenience, although should not need be used in
 * most cases.
 */
namespace Symbols {
  /**
   * `base` is a unique symbol to be used as a property key in opaque types where
   * said opaque type's underlying base type is stored.
   *
   * *Note:* At runtime, `base` does not exist. ***Do not use `base` as a runtime
   * value.***
   */
  export declare const base: unique symbol;

  /**
   * `brand` is a unique symbol to be used as a property key in opaque types
   * where said opaque type's brand is stored.
   *
   * *Note:* At runtime, `brand` does not exist. ***Do not use `brand` as a
   * runtime value.***
   */
  export declare const brand: unique symbol;
}

/**
 * `Opaque` is a generic type alias that takes a base type `BaseType` and an
 * optional brand type `BrandType`, that defaults to 'unknown', as its type
 * parameters; `Opaque` represents an opaque type, a type that is assignable to
 * its base type but its base type is not directly assignable to the opaque type.
 *
 * An opaque type is also assignable to any opaque type with assignable base
 * types and brand types; an opaque type is not mututally assignable with
 * another opaque type derived from the same base type given that their brand
 * types are not mutually assignable.
 *
 * It is crucial that brands are handled well. A common practice is to assign
 * `BrandType` to the name of the type; another encouraged practice is to
 * define an opaque type in terms of its surrounding interface, forming a
 * recursive type.
 *
 * The brand type of opaque type can be anything.
 */
export type Opaque<BaseType, BrandType = unknown> = BaseType & {
  readonly [Symbols.base]: BaseType;
  readonly [Symbols.brand]: BrandType;
};

/**
 * `BaseType` is a generic type that takes an opaque type `OpaqueType` as its
 * sole type parameter; `BaseType` obtains the given opaque type's base type.
 *
 * Similarly, to obtain the opaque type's brand's type, use `BrandTypeOf`.
 *
 * @template OpaqueType The opaque type whose base type is to be obtained.
 */
export type BaseType<OpaqueType extends Opaque<unknown>> = OpaqueType[typeof Symbols.base];

/**
 * `BrandType` is a generic type that takes an opaque type `OpaqueType` as
 * its sole type parameter; `BrandType` obtains the opaque type's brand's
 * type.
 *
 * Similarly, to obtain the opaque type's base type, use `BaseTypeOf`.
 *
 * @template OpaqueType The opaque type whose brand's type is to be obtained.
 */
export type BrandType<OpaqueType extends Opaque<unknown>> = OpaqueType[typeof Symbols.brand];
