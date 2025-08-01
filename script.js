const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("chackout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCaunter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")


let cart = [];


// ABRIR O MODAL DO CARRINHO
cartBtn.addEventListener("click", function() {
    cartModal.style.display = "flex"
    updateCartModal()
})

// FECHAR O MODAL QUANDO CLICAR FORA
cartModal.addEventListener("click", function(event){
    if(event.target == cartModal){
        cartModal.style.display = "none"
    }
})

// FECHAR QUANDO CLICA NO BOTÃO "FECHAR"
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

// ACIDIONAR O ITEM AO CARRINHO
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
    }
})

// FUNÇÃO PARA ADICIONAR NO CARRINHO
function addToCart(name, price){
    const existingItem = cart.find(item => item.name == name)

    if(existingItem){
        existingItem.quantity += 1;
    }else{
            cart.push({
        name,
        price,
        quantity:1,
    })
    }
    updateCartModal()
}

// ATUALIZA O CARRNHO
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemsElement = document.createElement("div");
        cartItemsElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemsElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

                <button class="remove-from-cart-btn" data-name="${item.name}">
                remover
                </button>

        </div>
        `

        total += item.price * item.quantity

        cartItemsContainer.appendChild(cartItemsElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    });

    cartCaunter.innerHTML = cart.length;
}
// FIM ATUALIZA O CARRNHO

// FUNÇÃO PARA REMOVER DO ITEM DO CARRINHO
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name)
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name == name)

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}
// FIM FUNÇÃO PARA REMOVER DO ITEM DO CARRINHO

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

// AVISO QUANDO O ITEM FOR ADICIONADO AO CARRINHO
menu.addEventListener("click", function(event){
    let apertoubotao = event.target.closest(".add-to-cart-btn")

    if(apertoubotao){
                Toastify ({
                text: "ITEM ADICIONADO AO CARRINHO",
    duration: 2700,
    close: false,
  gravity: "top", // `top` or `bottom`
  position: "right", // `left`, `center` or `right`
  stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
    background: "#008000",
    },
        }).showToast();
        return;
    }







})



// FINALIZAR PEDIDO
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){

        Toastify ({
                text: "RESTAURANTE FECHADO NO MOMENTO",
    duration: 3000,
    close: true,
  gravity: "top", // `top` or `bottom`
  position: "right", // `left`, `center` or `right`
  stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
    background: "#ef4444",
    },
        }).showToast();




        return;
    }

    if(cart.length ==0 ) return;
    if(addressInput.value == ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }


    // ENVIAR PEDIDO PARA API DO WHATS
    const cartItems = cart.map((item)=> {
        return(
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "8598773679"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart.length = 0;
    updateCartModal();

})

// VERIFICAR A HORA E MANIPULAR O CARD HORÁRIO
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22; // TRUE = RESTAURANTE ABERTO
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.add("bg-red-500");
    spanItem.classList.remove("bg-green-600");
}