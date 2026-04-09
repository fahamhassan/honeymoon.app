"use client";
import { useState, useEffect, useCallback, useRef } from "react";

export function useApi(apiFn, params, opts={}) {
  const { immediate=true, fallback=null } = opts;
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const mounted = useRef(true);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;}},[]);
  const run = useCallback(async (overrideParams) => {
    setLoading(true); setError(null);
    try {
      const p = overrideParams !== undefined ? overrideParams : params;
      const r = await (p !== undefined ? apiFn(p) : apiFn());
      if(mounted.current) setData(r);
      return r;
    } catch(e) {
      if(mounted.current) setError(e?.message||"Something went wrong");
      throw e;
    } finally { if(mounted.current) setLoading(false); }
  }, [apiFn]); // eslint-disable-line
  useEffect(()=>{ if(immediate) run(); },[immediate]); // eslint-disable-line
  return { data, loading, error, refresh: run };
}

export function usePaginated(apiFn, baseParams={}, opts={}) {
  const limit = opts.limit||10;
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const load = useCallback(async (p=1, reset=false) => {
    setLoading(true); setError(null);
    try {
      const r = await apiFn({...baseParams, page:p, limit});
      setItems(prev => (reset||p===1) ? (r.data||[]) : [...prev,...(r.data||[])]);
      setTotal(r.total||0); setPage(p);
    } catch(e) { setError(e?.message||"Error"); }
    finally { setLoading(false); }
  }, [apiFn, limit]); // eslint-disable-line
  useEffect(()=>{ load(1,true); },[JSON.stringify(baseParams)]); // eslint-disable-line
  return { items, total, loading, error, page,
    hasMore: items.length < total,
    nextPage: ()=>{ if(!loading) load(page+1); },
    refresh: ()=>load(1,true) };
}

export default useApi;
