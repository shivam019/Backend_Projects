function Shopping_cart(a, payment_gateway) {
    
    //if button clicked --- go to payment gateway

    payment_gateway(a);  //6

    // payment done 

}

function payment_gateway(data) {
    console.log(`Payment successful. Amount: ${data}`);  //13
}

 Shopping_cart(500, payment_gateway);

