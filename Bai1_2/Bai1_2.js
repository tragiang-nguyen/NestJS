console.time("fibonacci");

function fibonacci(n) {
  if (n === 0) return 0n;
  if (n === 1) return 1n;
  let a = 0n, b = 1n;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}

const result = fibonacci(100);
console.timeEnd("fibonacci");
console.log("Fibonacci(100) =", result.toString());