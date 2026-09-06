const products=[
{id:1,name:"Classic Black Jeans",category:"Fashion",price:799,icon:"👖",tag:"Best value"},
{id:2,name:"Premium Blue Shirt",category:"Fashion",price:899,icon:"👕",tag:"B Pick"},
{id:3,name:"Everyday Sneakers",category:"Fashion",price:1299,icon:"👟",tag:"Popular"},
{id:4,name:"Minimal Backpack",category:"Accessories",price:999,icon:"🎒",tag:"Smart buy"},
{id:5,name:"Wireless Earbuds",category:"Electronics",price:1499,icon:"🎧",tag:"Trending"},
{id:6,name:"Desk Organizer",category:"Home",price:399,icon:"🗂️",tag:"Value"},
{id:7,name:"Classic Watch",category:"Accessories",price:1599,icon:"⌚",tag:"B Pick"},
{id:8,name:"Premium Cotton T-Shirt",category:"Fashion",price:599,icon:"👕",tag:"Quality"}
];
let cart=[],current=products.slice();
const grid=document.getElementById("productGrid");
function render(list=current){grid.innerHTML=list.length?list.map(p=>`<article class="product"><div class="product-img">${p.icon}</div><div class="product-info"><div class="meta">${p.category} · ${p.tag}</div><h3>${p.name}</h3><div class="price">₹${p.price.toLocaleString("en-IN")}</div><button class="add" onclick="addToCart(${p.id})">Add to cart</button></div></article>`).join(""):"<p>No products found.</p>"}
function addToCart(id){let p=products.find(x=>x.id===id),old=cart.find(x=>x.id===id);old?old.qty++:cart.push({...p,qty:1});renderCart();openCart();toast("Added to cart")}
function renderCart(){document.getElementById("cartCount").textContent=cart.reduce((n,x)=>n+x.qty,0);document.getElementById("cartItems").innerHTML=cart.length?cart.map(x=>`<div class="cart-item"><span>${x.name}<br><small>Qty: ${x.qty}</small></span><b>₹${(x.price*x.qty).toLocaleString("en-IN")}</b></div>`).join(""):"<p>Your cart is empty.</p>";document.getElementById("total").textContent=cart.reduce((n,x)=>n+x.price*x.qty,0).toLocaleString("en-IN")}
function openCart(){closeAll();document.getElementById("cart").classList.add("cart-open");document.getElementById("overlay").classList.add("show")}
function closeCart(){document.getElementById("cart").classList.remove("cart-open")}
function openSearch(){closeAll();document.getElementById("searchPanel").classList.add("show");document.getElementById("overlay").classList.add("show")}
function closeSearch(){document.getElementById("searchPanel").classList.remove("show")}
function openWishlist(){toast("Wishlist will be connected to customer accounts")}
function showLogin(type){closeAll();let s=type==="seller";document.getElementById("loginTitle").textContent=s?"Seller Login":"Customer Login";document.getElementById("loginSub").textContent=s?"Manage products, stock, orders and seller tools.":"Sign in to manage your orders and wishlist.";document.getElementById("customerTab").classList.toggle("active",!s);document.getElementById("sellerTab").classList.toggle("active",s);document.getElementById("loginModal").classList.add("show");document.getElementById("overlay").classList.add("show")}
function demoLogin(){toast("Login UI ready — secure authentication will be connected in the backend.");closeAll()}
function openCheckout(){if(!cart.length){toast("Your cart is empty");return}closeAll();document.getElementById("checkoutModal").classList.add("show");document.getElementById("overlay").classList.add("show")}
function paymentDemo(name){toast(name+" selected — live gateway connection comes after backend setup.");closeAll()}
function closeAll(){closeSearch();closeCart();document.querySelectorAll(".modal").forEach(x=>x.classList.remove("show"));document.getElementById("overlay").classList.remove("show")}
function filterCategory(c){current=products.filter(p=>p.category===c);document.getElementById("shop").scrollIntoView();render(current)}
function searchProducts(q){q=q.toLowerCase();current=products.filter(p=>(p.name+" "+p.category+" "+p.tag).toLowerCase().includes(q));render(current)}
function sortProducts(v){current=current.slice().sort((a,b)=>v==="low"?a.price-b.price:v==="high"?b.price-a.price: a.id-b.id);render(current)}
function toast(t){let e=document.getElementById("toast");e.textContent=t;e.style.display="block";setTimeout(()=>e.style.display="none",2200)}
render();renderCart();
