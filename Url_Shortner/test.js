
function a() {
    c();
    function c() {
        console.log(b);
    }

}

const b = 10;
a();
