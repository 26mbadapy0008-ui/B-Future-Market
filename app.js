const products=[
{id:1,name:"Classic Black Jeans",price:799,icon:"👖"},
{id:2,name:"Plain Blue Shirt",price:699,icon:"👕"},
{id:3,name:"Everyday Sneakers",price:999,icon:"👟"},
{id:4,name:"Minimal Backpack",price:899,icon:"🎒"},
{id:5,name:"Cotton Casual T-Shirt",price:499,icon:"👕"},
{id:6,name:"Classic Watch",price:1299,icon:"⌚"}
];
let cart=[];
const grid=document.querySelector("#productsGrid");
function render(list=products){
 grid.innerHTML=list.map(p=>`<article class="card"><div class="pic">${p.icon}</div><div class="info"><h3>${p.name}</h3><div class="price">₹${p.price.toLocaleString("en-IN")}</div><button class="add" onclick="addToCart(${p.id})">Add to Cart</button></div></article>`).join("");
}
function addToCart(id){const p=products.find(x=>x.id===id);const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({...p,qty:1});renderCart();}
function renderCart(){
 document.querySelector("#cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);
 document.querySelector("#cartItems").innerHTML=cart.length?cart.map(x=>`<div class="cart-row"><span>${x.name} × ${x.qty}</span><b>₹${(x.price*x.qty).toLocaleString("en-IN")}</b></div>`).join(""):"<p>Your cart is empty.</p>";
 document.querySelector("#cartTotal").textContent=cart.reduce((a,x)=>a+x.price*x.qty,0).toLocaleString("en-IN");
}
const cartEl=document.querySelector("#cart"), overlay=document.querySelector("#overlay");
document.querySelector("#cartBtn").onclick=()=>{cartEl.classList.add("open");overlay.classList.add("show")};
document.querySelector("#closeCart").onclick=()=>{cartEl.classList.remove("open");overlay.classList.remove("show")};
overlay.onclick=()=>document.querySelector("#closeCart").click();
document.querySelector("#search").oninput=e=>{const q=e.target.value.toLowerCase();render(products.filter(p=>p.name.toLowerCase().includes(q)))};
render();renderCart();
