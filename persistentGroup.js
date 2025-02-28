class PGroup {
  #array = [];
  constructor(values = null) {
    if (values != null) {
      for (let value of values) {
        this.#array.push(value);
      }
    }
  }
  static empty = new PGroup();
  add(...values) {
    return new PGroup(this.#array.concat(values));
  }
  delete(...values) {
    return new PGroup(
      (this.#array = this.#array.filter((el) => !values.includes(el)))
    );
  }
  has(value) {
    return this.#array.indexOf(value) !== -1;
  }
  print() {
    console.log(this.#array);
  }
}

//tests

let a = PGroup.empty.add("a");
let ab = a.add("b");
let b = ab.delete("a");

console.log(b.has("b"));
// → true
console.log(a.has("b"));
// → false
console.log(b.has("a"));
// → false
