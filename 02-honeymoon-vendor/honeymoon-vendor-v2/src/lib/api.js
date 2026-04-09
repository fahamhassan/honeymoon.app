'use client';
const BASE=process.env.NEXT_PUBLIC_API_URL||'http://localhost:5000/api/v1';
const T={
  get access(){return typeof window!=='undefined'?localStorage.getItem('vendor_access_token'):null;},
  get refresh(){return typeof window!=='undefined'?localStorage.getItem('vendor_refresh_token'):null;},
  set(a,r){localStorage.setItem('vendor_access_token',a);localStorage.setItem('vendor_refresh_token',r);},
  clear(){['vendor_access_token','vendor_refresh_token','vendor_user'].forEach(k=>localStorage.removeItem(k));}
};
let _r=false,_q=[];
async function doRefresh(){const res=await fetch(`${BASE}/auth/refresh-token`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({refreshToken:T.refresh})});const d=await res.json();if(!d.success)throw new Error();T.set(d.accessToken,d.refreshToken);}
async function req(method,path,body,retry=false){
  const h={'Content-Type':'application/json'};if(T.access)h['Authorization']=`Bearer ${T.access}`;
  const cfg={method,headers:h};if(body)cfg.body=JSON.stringify(body);
  const url=path.startsWith('http')?path:`${BASE}${path}`;
  let r;try{r=await fetch(url,cfg);}catch{throw{message:'Network error',code:'NETWORK_ERROR'};}
  if(r.status===401&&!retry){if(_r)return new Promise((res,rej)=>_q.push({res,rej,method,path,body}));_r=true;try{await doRefresh();_q.forEach(q=>req(q.method,q.path,q.body,true).then(q.res).catch(q.rej));_q=[];return req(method,path,body,true);}catch{T.clear();if(typeof window!=='undefined')window.location.href='/login';throw{message:'Session expired'};}finally{_r=false;}}
  const d=await r.json().catch(()=>({success:false,message:'Invalid response'}));
  if(!r.ok)throw{message:d.message||`Error ${r.status}`,status:r.status,errors:d.errors};
  return d;
}
export const api={get:p=>req('GET',p),post:(p,b)=>req('POST',p,b),put:(p,b)=>req('PUT',p,b),patch:(p,b)=>req('PATCH',p,b),del:p=>req('DELETE',p),getQ:(p,params)=>{const qs=Object.entries(params||{}).filter(([,v])=>v!==undefined&&v!==null&&v!=='').map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join('&');return req('GET',qs?`${p}?${qs}`:p);}};
export const tokenStore=T;
export default api;
