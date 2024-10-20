<!-- markdownlint-disable -->
<!-- begin auto-generated rule header -->

# Disallow inheritance in classes (`functional/no-class-inheritance`)

💼 This rule is enabled in the following configs: ☑️ `lite`, `noOtherParadigms`, ✅ `recommended`, 🔒 `strict`.

<!-- end auto-generated rule header -->
<!-- markdownlint-restore -->
<!-- markdownlint-restore -->

Disallow use of inheritance for classes.

## Rule Details

### ❌ Incorrect

<!-- eslint-skip -->

```js
/* eslint functional/no-class-inheritance: "error" */

abstract class Animal  {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

class Dog extends Animal {
  constructor(name, age) {
    super(name, age);
  }

  get ageInDogYears() {
    return 7 * this.age;
  }
}

const dogA = new Dog("Jasper", 2);

console.log(`${dogA.name} is ${dogA.ageInDogYears} in dog years.`);
```

### ✅ Correct

```js
/* eslint functional/no-class-inheritance: "error" */

class Animal {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

class Dog {
  constructor(name, age) {
    this.animal = new Animal(name, age);
  }

  get ageInDogYears() {
    return 7 * this.animal.age;
  }
}

console.log(`${dogA.name} is ${getAgeInDogYears(dogA.age)} in dog years.`);
```

## Options

This rule accepts an options object of the following type:

```ts
type Options = {
  ignoreIdentifierPattern?: string[] | string;
  ignoreCodePattern?: string[] | string;
};
```

### Default Options

```ts
const defaults = {};
```

### `ignoreIdentifierPattern`

This option takes a RegExp string or an array of RegExp strings.
It allows for the ability to ignore violations based on the class's name.

### `ignoreCodePattern`

This option takes a RegExp string or an array of RegExp strings.
It allows for the ability to ignore violations based on the code itself.
