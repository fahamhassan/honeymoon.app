'use client';
import { usePaginated } from '../../../hooks/useApi';
import VendorService from '../../../lib/services/vendor.service';
import { useState } from 'react';
import { SuccessModal } from '@/components/Modals';

const REVIEWS = Array.from({length:8},(_,i)=>({
  id:i+1, name:'Tom Albert', date:'04 October 2024',
  rating:i%3===0?5:i%3===1?4:3,
  text:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio.',
  replied: i%4===0,
  reply: i%4===0?'Thank you for your kind words! We are thrilled to hear you had a great experience.':'',
}));

const counts = {5:120,4:30,3:4,2:1,1:1};

function ReplyModal({review,onClose,onSave}){
  const [reply,setReply]=useState(review.reply||'');
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{background:'rgba(0,0,0,0.6)'}}>
      <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 w-full max-w-[560px] relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm">✕</button>
        <h3 className="font-baskerville text-2xl text-[#b89b6b] mb-5">Reply to Review</h3>
        <div className="bg-[#f9f6ef] rounded-xl p-4 mb-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex">{[1,2,3,4,5].map(s=><span key={s} className={`text-sm ${s<=review.rating?'text-amber-400':'text-gray-200'}`}>★</span>)}</div>
            <span className="text-xs text-gray-400">{review.name} · {review.date}</span>
          </div>
          <p className="text-gray-600 text-sm leading-5 line-clamp-3">{review.text}</p>
        </div>
        <textarea value={reply} onChange={e=>setReply(e.target.value)} rows={4} placeholder="Write your reply..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b89b6b] resize-none bg-[#faf8f4] mb-5"/>
        <div className="flex gap-3">
          <button onClick={()=>onSave(reply)} className="flex-1 bg-[#174a37] text-white py-3 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors">Post Reply</button>
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
}


function Pagination({ items, total, hasMore, nextPage, loading }) {
  if (!total || total <= items.length) return null;
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:24,paddingTop:16,borderTop:'1px solid #f3f4f6'}}>
      <span className="text-sm text-gray-500">Showing {items.length} of {total}</span>
      {hasMore && (
        <button onClick={nextPage} disabled={loading}
          className="px-5 py-2 bg-[#174a37] text-white text-sm font-medium rounded-lg hover:bg-[#1a5c45] transition-colors disabled:opacity-50">
          {loading ? 'Loading...' : 'Load More ↓'}
        </button>
      )}
    </div>
  );
}

export default function VendorReviewsPage(){
  const { items: paginatedReviews, loading, refresh, total, hasMore, nextPage} = usePaginated(VendorService.getReviews, {});
  const [reviews,setReviews]=useState(REVIEWS);
  const [filterRating,setFilterRating]=useState(0);
  const [replyModal,setReplyModal]=useState(null);
  const [success,setSuccess]=useState('');

  const filtered=filterRating===0?reviews:reviews.filter(r=>r.rating===filterRating);
  const avgRating=(reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1);
  const totalReviews=reviews.reduce((s,_,i)=>s+Object.values(counts)[i%5],0)/reviews.length;

  async function saveReply(reply){
    try {
      await VendorService.replyToReview(replyModal.id, reply);
      refresh();
    } catch(e) { /* fallback local */ }
    setReviews(p=>p.map(r=>r.id===replyModal.id?{...r,replied:true,reply}:r));
    setReplyModal(null); setSuccess('Reply posted successfully.');
  }

  return(
    <>
    <div>
      {replyModal&&<ReplyModal review={replyModal} onClose={()=>setReplyModal(null)} onSave={saveReply}/>}
      {success&&<SuccessModal message={success} onOk={()=>setSuccess('')}/>}

      <h1 className="font-baskerville text-3xl text-[#1a1a1a] mb-6">Ratings & Reviews</h1>

      {/* Rating Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)] mb-6">
        <div className="flex items-start gap-10">
          <div className="flex-shrink-0 text-center">
            <p className="font-baskerville text-[56px] text-[#1a1a1a] leading-none">{avgRating}</p>
            <div className="flex gap-0.5 justify-center my-2">
              {[1,2,3,4,5].map(s=><span key={s} className={`text-xl ${s<=Math.round(parseFloat(avgRating))?'text-amber-400':'text-gray-200'}`}>★</span>)}
            </div>
            <p className="text-gray-400 text-sm">({Object.values(counts).reduce((a,b)=>a+b,0)} reviews)</p>
          </div>
          <div className="flex-1">
            {[5,4,3,2,1].map(star=>{
              const count=counts[star];
              const total=Object.values(counts).reduce((a,b)=>a+b,0);
              return(
                <div key={star} className="flex items-center gap-3 mb-2">
                  <button onClick={()=>setFilterRating(filterRating===star?0:star)} className={`flex items-center gap-1 text-sm w-14 flex-shrink-0 ${filterRating===star?'text-[#174a37] font-medium':'text-gray-500'}`}>
                    <span className="text-amber-400">★</span> {star}
                  </button>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#b89b6b] rounded-full transition-all" style={{width:`${(count/total)*100}%`}}/>
                  </div>
                  <span className="text-sm text-gray-400 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        <button onClick={()=>setFilterRating(0)} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${filterRating===0?'bg-[#b89b6b] text-white':'border border-gray-200 text-gray-500 hover:border-[#b89b6b]'}`}>All</button>
        {[5,4,3,2,1].map(s=>(
          <button key={s} onClick={()=>setFilterRating(filterRating===s?0:s)} className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${filterRating===s?'bg-[#b89b6b] text-white':'border border-gray-200 text-gray-500 hover:border-[#b89b6b]'}`}>
            <span className="text-amber-400">★</span> {s}
          </button>
        ))}
      </div>

      {/* Reviews list */}
      <div className="flex flex-col gap-4">
        {filtered.map(r=>(
          <div key={r.id} className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex gap-0.5 mb-1">
                  {[1,2,3,4,5].map(s=><span key={s} className={`text-sm ${s<=r.rating?'text-amber-400':'text-gray-200'}`}>★</span>)}
                </div>
                <p className="font-medium text-gray-800 text-sm">{r.name}</p>
                <p className="text-gray-400 text-xs">{r.date}</p>
              </div>
              {!r.replied&&(
                <button onClick={()=>setReplyModal(r)} className="text-xs text-[#174a37] border border-[rgba(23,74,55,0.3)] px-3 py-1.5 rounded-lg hover:bg-[#f4ebd0] transition-colors">Reply</button>
              )}
            </div>
            <p className="text-gray-600 text-sm leading-6">{r.text}</p>
            {r.replied&&(
              <div className="mt-4 ml-4 pl-4 border-l-2 border-[rgba(184,154,105,0.3)]">
                <p className="text-xs text-[#b89b6b] font-medium mb-1">Your reply:</p>
                <p className="text-gray-500 text-sm">{r.reply}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length > 5 && (
        <div className="text-center mt-6">
          <button className="bg-[#174a37] text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors flex items-center gap-2 mx-auto">
            Load More ↗
          </button>
        </div>
      )}
    </div>
    <Pagination items={paginatedReviews} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </>
  );
}
