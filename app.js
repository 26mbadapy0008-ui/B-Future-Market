const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
let cart=[],activeProducts=[...BFM_PRODUCTS];

// BHAVISHMART Supabase connection (publishable key is safe for browser use when RLS is configured).
const SUPABASE_URL="https://uijghkxiofripwggvztr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY="sb_publishable_o4vNm35q9RuCaCnEAR9Qiw_xWe0Ha8d";
const supabaseClient=window.supabase?.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
let authMode="signin",authType="customer";

function money(n){return n.toLocaleString("en-IN")}
function productCard(p){
return `<article class="product-card">
<span class="discount">${p.discount}% OFF</span><button class="wishlist" data-wish="${p.id}">♡</button>
<div class="product-image">${p.icon}</div><div class="product-info"><small>${p.category} · ${p.tag}</small><h3>${p.name}</h3>
<div class="rating">★ ${p.rating} <span>(${p.reviews})</span></div><div class="price">₹${money(p.price)} <span class="mrp">₹${money(p.mrp)}</span></div>
<button class="add-cart" data-add="${p.id}">Add to Cart</button></div></article>`}

function render(list=activeProducts){activeProducts=list;$("#productGrid").innerHTML=list.map(productCard).join("")}
function renderDeals(){$("#dealProducts").innerHTML=BFM_PRODUCTS.filter(p=>p.deal).map(productCard).join("")}
function addToCart(id){const p=BFM_PRODUCTS.find(x=>x.id===id);const old=cart.find(x=>x.id===id);old?old.qty++:cart.push({...p,qty:1});renderCart();openCart();toast("Added to cart")}
function renderCart(){
$("#cartCount").textContent=cart.reduce((n,x)=>n+x.qty,0);
$("#cartItems").innerHTML=cart.length?cart.map(x=>`<div class="cart-line"><span>${x.name}<br><small>Qty: ${x.qty}</small></span><b>₹${money(x.price*x.qty)}</b></div>`).join(""):"<p>Your cart is empty.</p>";
$("#cartTotal").textContent=money(cart.reduce((n,x)=>n+x.price*x.qty,0));
}
function openCart(){$("#cartDrawer").classList.add("open");$("#overlay").classList.add("show")}
function closePanels(){$("#cartDrawer").classList.remove("open");$$(".modal").forEach(x=>x.classList.remove("show"));$("#overlay").classList.remove("show")}
function openLogin(type="customer"){closePanels();$("#loginModal").classList.add("show");$("#overlay").classList.add("show");setLogin(type)}
function setLogin(type){
  authType=type; const seller=type==="seller";
  $("#loginTitle").textContent=seller?"Seller Login":(authMode==="signup"?"Create Customer Account":"Customer Login");
  $("#loginDescription").textContent=seller?"Manage products, stock, orders and seller tools.":"Sign in to manage orders, wishlist and account details.";
  $("#customerLoginTab").classList.toggle("active",!seller);$("#sellerLoginTab").classList.toggle("active",seller);
  $("#customerAuthBox").style.display=seller?"none":"block";$("#sellerAuthBox").style.display=seller?"block":"none";
  if(!seller) setAuthMode(authMode);
}
function setAuthMode(mode){
  authMode=mode; const signup=mode==="signup";
  $("#signInMode").classList.toggle("active",!signup);$("#signUpMode").classList.toggle("active",signup);
  $("#authName").style.display=signup?"block":"none";$("#authPhone").style.display=signup?"block":"none";
  $("#loginContinue").textContent=signup?"Create account":"Sign in";
  $("#authPassword").autocomplete=signup?"new-password":"current-password";
  $("#loginTitle").textContent=signup?"Create Customer Account":"Customer Login";
  $("#authStatus").textContent="Your account is secured by Supabase Authentication.";
}
function search(q,cat="All"){q=q.toLowerCase();render(BFM_PRODUCTS.filter(p=>(cat==="All"||p.category===cat)&&(p.name+" "+p.category+" "+p.tag).toLowerCase().includes(q)))}
function filterCategory(cat){$("#categorySelect").value=BFM_PRODUCTS.some(p=>p.category===cat)?cat:"All";search("",cat);location.hash="shop"}
function toast(msg){const t=$("#toast");t.textContent=msg;t.style.display="block";setTimeout(()=>t.style.display="none",2200)}

async function handleCustomerAuth(){
  if(!supabaseClient){toast("Supabase could not load. Check your internet connection.");return}
  const email=$("#authEmail").value.trim(),password=$("#authPassword").value;
  if(!email||!password){toast("Enter your email and password.");return}
  const btn=$("#loginContinue");btn.disabled=true;
  try{
    if(authMode==="signup"){
      const fullName=$("#authName").value.trim(),phone=$("#authPhone").value.trim();
      if(!fullName){toast("Enter your full name.");return}
      const {data,error}=await supabaseClient.auth.signUp({email,password,options:{data:{full_name:fullName,phone:phone||null}}});
      if(error) throw error;
      if(data.user && !data.session){
        $("#authStatus").textContent="Account created. Check your email to confirm your account, then sign in.";
        toast("Account created — check your email.");
      }else{
        $("#authStatus").textContent="Account created and signed in.";
        toast("Account created successfully.");
        closePanels();
      }
    }else{
      const {error}=await supabaseClient.auth.signInWithPassword({email,password});
      if(error) throw error;
      toast("Welcome to BHAVISHMART!");closePanels();await refreshAuthUI();
    }
  }catch(err){toast(err.message||"Authentication failed.")}
  finally{btn.disabled=false}
}
async function refreshAuthUI(){
  if(!supabaseClient)return;
  const {data:{session}}=await supabaseClient.auth.getSession();
  const accountBtn=$(".account-btn");
  if(session?.user){
    const name=session.user.user_metadata?.full_name;
    accountBtn.innerHTML=`<span>♙</span><small>Hello, ${name?name.split(" ")[0]:"customer"}</small><strong>Account</strong>`;
    $("#authLogout").style.display="block";
  }else{
    accountBtn.innerHTML=`<span>♙</span><small>Hello, sign in</small><strong>Account</strong>`;
    $("#authLogout").style.display="none";
  }
}
async function logout(){if(!supabaseClient)return;const {error}=await supabaseClient.auth.signOut();if(error){toast(error.message);return}toast("You are logged out.");closePanels();await refreshAuthUI()}

// UI events
document.addEventListener("click",e=>{
  const add=e.target.closest("[data-add]");if(add){addToCart(Number(add.dataset.add));return}
  const cat=e.target.closest("[data-category]");if(cat){filterCategory(cat.dataset.category);return}
  const login=e.target.closest("[data-login]");if(login){openLogin(login.dataset.login);return}
  if(e.target.closest('[data-action="cart"]')){openCart();return}
  if(e.target.closest('[data-action="wishlist"]')){toast("Sign in to save your wishlist.");return}
  if(e.target.matches("[data-close]")||e.target===$("#overlay"))closePanels();
  if(e.target.closest("#customerLoginTab")){authMode="signin";setLogin("customer");}
  if(e.target.closest("#sellerLoginTab"))setLogin("seller");
  if(e.target.closest("#signInMode")){setAuthMode("signin");}
  if(e.target.closest("#signUpMode")){setAuthMode("signup");}
  if(e.target.closest("[data-wish]"))toast("Sign in to save your wishlist.");
});

$("#searchForm").addEventListener("submit",e=>{e.preventDefault();search($("#searchInput").value,$("#categorySelect").value);location.hash="shop"});
$("#searchInput").addEventListener("input",e=>search(e.target.value,$("#categorySelect").value));
$("#categorySelect").addEventListener("change",e=>search($("#searchInput").value,e.target.value));
$("#checkoutBtn").onclick=()=>{if(!cart.length){toast("Your cart is empty.");return}closePanels();$("#paymentModal").classList.add("show");$("#overlay").classList.add("show")};
$("#loginContinue").onclick=handleCustomerAuth;
$("#authLogout").onclick=logout;
$("#sellerContinue").onclick=()=>toast("Seller authentication will be added after customer authentication is tested.");
$$(".payment-grid button").forEach(b=>b.onclick=()=>{toast(b.textContent+" selected.");closePanels()});
$("#mobileMenuBtn").onclick=()=>$(".nav-bar").classList.toggle("open");
$("#allCategoriesBtn").onclick=()=>location.hash="categories";

let seconds=8*3600+34*60+56;setInterval(()=>{seconds=Math.max(0,seconds-1);const h=String(Math.floor(seconds/3600)).padStart(2,"0"),m=String(Math.floor(seconds%3600/60)).padStart(2,"0"),s=String(seconds%60).padStart(2,"0");$("#timer").textContent=`${h} : ${m} : ${s}`},1000);
render();renderDeals();renderCart();
if(supabaseClient){supabaseClient.auth.onAuthStateChange(()=>refreshAuthUI());refreshAuthUI();}
