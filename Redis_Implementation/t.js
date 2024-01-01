function root(x, y, z) {
    let a = x;
    let b = y;
    let c = z;

    
    const Root1 = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    const Root2 = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);

    console.log(Root1, Root2);
}

root(800, 10, 10);
