const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartCounter = document.getElementById('cart-count');
const adressInput = document.getElementById('adress');
const adressWarn = document.getElementById('adress-warn');

/* Criando a lista dos produtos aqui pq quero que todos tenham acesso */
let cart = [];

/* Evento para abrir o modal quando clicar no botão "Meu carrinho" */
cartBtn.addEventListener('click', function() {
    updateCartModal();
    cartModal.style.display = 'flex';
})

/* Evento para fechar o modal ao clicar em qualquer parte fora do modal */
cartModal.addEventListener('click', function(event) {
    if(event.target === cartModal) {
        cartModal.style.display = 'none';
    }
})

/* Evento para fechar o modal usando o botão "Fechar" */
closeModalBtn.addEventListener('click', function() {
    cartModal.style.display = 'none';
})

/* Evento para adicionar os produtos no meu carrinho */
menu.addEventListener('click', function(event) {
    let parentButton = event.target.closest('.add-to-card-btn');

    if(parentButton) {
        const name = parentButton.getAttribute('data-name');
        const price = parseFloat(parentButton.getAttribute('data-price'));

        /* Chamada da função criada para devolver os nomes e os preços dos produtos clicados */
        addToCart(name, price);
    }
})

/* Função criada para devolver o nome e o preço dos itens selecionados*/
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if(existingItem) {
        /* Se o item já existe, aumenta a quantidade +1 */
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal();
}

/* Atualizando o carrinho */
function updateCartModal() {
    cartItemsContainer.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex","justify-between","mb-4","flex-col")

        cartItemElement.innerHTML = ` 
        <div class = "flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

            <button class="remove-btn" data-name="${item.name}">remover</button>

        </div>
        `
        total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement)
    })  

    cartTotal.textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    cartCounter.innerHTML = cart.length;
}

/* Função para remover o item do carrinho */
cartItemsContainer.addEventListener('click', function(event) {
    if(event.target.classList.contains('remove-btn')) {
        const name = event.target.getAttribute('data-name')
        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);
    
    if(index != -1) {
        const item = cart[index];
        
        if(item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        /* splice significa se o objeto for menor ou igual a um e vc quiser remover, ele remove */
        cart.splice(index,1);
        updateCartModal();
    }
}

/* Adicionando o input de endereço */
adressInput.addEventListener('input', function(event) {
    let inputValue = event.target.value;

    if(inputValue !== '') {
        adressInput.classList.remove('border-red-500');
        adressWarn.classList.add('hidden');
    }
})

/* Adicionando o finalizar pedido */
checkoutBtn.addEventListener('click', function() {
    const isOpen = checkoutRestaurantOpen();
    if(!isOpen) {
        Toastify({
            text: "O restaurante está fechado!",
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

    if(cart.length === 0) return;
    if(adressInput.value === '') {
        adressWarn.classList.remove('hidden');
        adressInput.classList.add('border-red-500');
        return;
    }

    /* Enviar o pedido pela api do whatsapp */
    const cartItems = cart.map((item)=> {
        return (
            `${item.name} Quantidade: (${item.quantity}),
             Preço: R$(${item.price}) |`
        )
    }).join();
    
    const message = encodeURIComponent(cartItems);
    const phone = ''; /* Adicionar o número do telefone */

    window.open(`https://wa.me/${phone}/?text=${message} Endereço: ${adressInput.value}`, '_blank');

    /* Depois que envia e finaliza o pedido, ele zera o modal e dá um update */
    cart = [];
    updateCartModal();
})

/* Verificar a hora e manipular o card do horário */
function checkoutRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22; // true
}

const spanItem = document.getElementById('date-span');
const isOpen = checkoutRestaurantOpen();

if(isOpen) {
    spanItem.classList.remove('bg-red-500');
    spanItem.classList.add('bg-green-600');
} else {
    spanItem.classList.remove('bg-green-600');
    spanItem.classList.add('bg-red-500');
}
