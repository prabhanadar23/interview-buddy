"use client";
import { useEffect, useState } from "react";

export default function ReportPage(){
  const [results, setResults] = useState<any[]>([]);
  const [role, setRole] = useState("");

  useEffect(()=>{
    setResults(JSON.parse(localStorage.getItem("interview_results") || "[]"));
    setRole(localStorage.getItem("interview_role") || "AI/ML");
  },[]);

  const avg = results.length ? Math.round(results.reduce((s,r)=>s+r.score,0)/results.length) : 0;
  const grade = avg >= 85 ? "Master" : avg >= 70 ? "Journeyman" : "Apprentice";

  if(results.length === 0){
    return (
      <div style={{minHeight:"100vh", background:"#FDFBF7", padding:40, textAlign:"center", fontFamily:"Georgia, serif"}}>
        <h1 style={{fontSize:32}}>No Session Found</h1>
        <p style={{opacity:0.6, marginTop:10}}>Complete an interview first</p>
        <a href="/" style={{display:"inline-block", marginTop:20, padding:"12px 24px", background:"#1A1A1A", color:"white", textDecoration:"none", fontSize:12, letterSpacing:2}}>BACK TO ATELIER</a>
      </div>
    )
  }

  return (
    <div style={{minHeight:"100vh", background:"#FDFBF7", padding:40, color:"#1A1A1A", fontFamily:"Georgia, serif"}}>
      <div style={{maxWidth:800, margin:"0 auto"}}>
        <div style={{textAlign:"center", borderBottom:"1px solid #1A1A1A", paddingBottom:30, marginBottom:40}}>
          <div style={{fontSize:11, letterSpacing:4, opacity:0.4}}>THE ATELIER REPORT</div>
          <h1 style={{fontSize:48, fontWeight:400, margin:"10px 0"}}>Session Complete</h1>
          <div style={{fontSize:14, opacity:0.6}}>Discipline: {role} • Grade: {grade}</div>
          <div style={{marginTop:20, fontSize:72, fontWeight:300, fontFamily:"Times New Roman"}}>{avg}<span style={{fontSize:24}}>/100</span></div>
        </div>

        {results.map((r,i)=>(
          <div key={i} style={{background:"white", border:"1px solid #E7E0D3", padding:24, marginBottom:20}}>
            <div style={{display:"flex", justifyContent:"space-between", marginBottom:12}}>
              <span style={{fontSize:11, letterSpacing:2, opacity:0.5}}>Q{i+1} • SCORE: {r.score}/100</span>
              <span style={{fontSize:11, background: r.score >= 80 ? "#1A1A1A" : r.score >= 65 ? "#8B7355" : "#C44536", color:"white", padding:"2px 8px"}}>
                {r.score >= 80? "EXCELLENT" : r.score >= 65? "GOOD" : "NEEDS WORK"}
              </span>
            </div>
            <div style={{fontSize:15, fontWeight:"bold", marginBottom:8}}>{r.question}</div>
            <div style={{fontSize:14, opacity:0.7, background:"#FDFBF7", padding:12, marginBottom:12, fontStyle:"italic"}}>"{r.answer?.slice(0,200)}..."</div>
            <div style={{fontSize:13, lineHeight:1.6, whiteSpace:"pre-line", opacity:0.8}}>
              <div style={{marginBottom:6}}><b>Strengths:</b> {r.strengths?.join(", ")}</div>
              <div style={{marginBottom:6}}><b>Fix:</b> {r.improvements?.join(", ")}</div>
              <div>• {r.feedback}</div>
            </div>
          </div>
        ))}

        <div style={{display:"flex", gap:10, marginTop:30}}>
          <a href="/" style={{flex:1, textAlign:"center", padding:"16px", border:"1px solid #1A1A1A", textDecoration:"none", color:"#1A1A1A", fontSize:12, letterSpacing:2}}>← BACK TO ATELIER</a>
          <button onClick={()=>{
            localStorage.removeItem("interview_results");
            // KEEP role so it doesn't reset - this was your bug
            window.location.href="/";
          }} style={{flex:1, padding:"16px", background:"#1A1A1A", color:"white", border:"none", cursor:"pointer", fontSize:12, letterSpacing:2}}>NEW SESSION</button>
        </div>
      </div>
    </div>
  )
}