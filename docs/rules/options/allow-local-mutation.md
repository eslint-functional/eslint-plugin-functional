# Using the `allowLocalMutation` option

If this option is set to true, local state is allowed to be mutated. Local state is simply any code inside of a function.

Note: That using this option can lead to more imperative code in functions so use with care!

## Details

> If a tree falls in the woods, does it make a sound?
> If a pure function mutates some local data in order to produce an immutable return value, is that ok?

The quote above is from the [Clojure docs](https://clojure.org/reference/transients).
In general, it is more important to enforce immutability for state that is passed in and out of functions than for local state used for internal calculations within a function.
For example in Redux, the state going in and out of reducers needs to be immutable while the reducer may be allowed to mutate local state in its calculations in order to achieve higher performance.
This is what the `allowLocalMutation` option enables. With this option enabled immutability will be enforced everywhere but in local state.
Function parameters and return types are not considered local state so they will still be checked.
