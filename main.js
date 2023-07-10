import { data } from "./data.js";
const products = document.querySelector(".products");
const cartBlock = document.querySelector(".cart");
const totalPrice = document.querySelector(".total-price")

let getUser = localStorage.getItem("cart");
let cart = getUser ? JSON.parse(getUser) : [];
// let cart = [];

const sum = ()=>{
  totalPrice.textContent= cart.reduce((a,b)=>{
    return a+b.userPrice;
  },0)+" $"
}

const renderProduct = () => {
  products.innerHTML = data.map((item) => {
    const cartFilter = cart.find((el)=>el.id === item.id);
    if (item.count > 0){
      return `
      <div class="item1">
      <div class="item1__img">
        <img src="${item.img}" alt="img">
      </div>
      <div>
        <h2>${item.name}</h2>
        <strong>${item.price} $</strong>
        <div>
          <p>${item.count}</p>
          ${!cartFilter ? `<button data-productid=${item.id} class="addcart">add</button>`
          : `<button data-productid=${item.id} class="removecart">remove</button>`
        }
        </div>
      </div>
    </div>
      `
    }
  }).join("");
};
renderProduct();

const renderCart = ()=>{
  cartBlock.innerHTML = cart.map((item) => {
    if (item.userCount > 0) {
      return `
      <div class="item1">
      <div class="item1__img">
        <img src="${item.img}" alt="img">
      </div>
      <div>
        <h2>${item.name}</h2>
        <strong>${item.userPrice} $</strong>
        <div>
          <button class="add-cart" id="${item.id}">+</button>
          <span>${item.userCount}</span>
          <button class="re-cart" id="${item.id}">-</button>
        </div>
      </div>
    </div>
      `
    }
  }).join("");
};

products.addEventListener("click",(e) => {
  if (e.target.className == "addcart" && e.target.dataset.productid){
    let item = cart?.some((item)=>item.id === Number(e.target.dataset.productid))
    if (!item){
      let product = data?.find((item)=>item.id === Number(e.target.dataset.productid))
      cart.push({...product,userCount: 1,userPrice: product.price})
      product.count -= 1;
    }
  }

  if (e.target.className == "removecart" && e.target.dataset.productid){
    let item = cart?.some((item)=>item.id === Number(e.target.dataset.productid));
    let userItem = cart?.find((item)=>item.id === Number(e.target.dataset.productid));
    if (item){
      let product = data?.find((item)=>item.id === Number(e.target.dataset.productid))
      product.count += userItem.userCount;
      cart = cart?.filter((item)=>item.id !== Number(e.target.dataset.productid))
    }
  }
  localStorage.setItem("cart",JSON.stringify(cart))
  renderCart();
  renderProduct();
  sum();
});

renderCart()

cartBlock.addEventListener("click",(e)=>{
  if (e.target.className === "add-cart"){
    for (let i of data){                                    
      if (e.target.id == i.id && i.count > 0){
        i.count -= 1;
        cart.forEach((el)=>{
          if (el.id == i.id){
            el.userCount += 1;
            el.userPrice = el.price * el.userCount;
          }
        });
      }
    }
  }
  else if (e.target.className === "re-cart"){
    for (let i of cart){                                    
      if (e.target.id == i.id && i.userCount > 0){
        i.userCount -= 1;
        i.userPrice = i.price * i.userCount;
        data.forEach((el)=>{
          if (el.id == i.id){
            el.count += 1;
          }
        })
      }
    }
    cart = cart.filter((el)=>el.userCount > 0);
  }
  renderCart();
  renderProduct();
  sum();
});
