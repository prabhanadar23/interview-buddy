"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const [role, setRole] = useState("AI/ML");
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const roles = ["AI/ML", "Frontend", "Backend", "Data Science", "Product Manager", "DevOps"];

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login");
      else setUser(data.user);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div style={{minHeight:"100vh", background:"#FDFBF7", color:"#1A1A1A", fontFamily:"Georgia, serif"}}>
      {/* Header - NOT STICKY for report screenshot */}
      <div style={{borderBottom:"1px solid #E7E0D3", background:"#FDFBF7"}}>
        <div style={{maxWidth:1200, margin:"0 auto", padding:"18px 24px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div style={{display:"flex", alignItems:"center", gap:10}}>
            <div style={{width:32, height:32, background:"#1A1A1A", color:"#FDFBF7", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:"bold"}}>I</div>
            <span style={{fontWeight:"bold", letterSpacing:2, fontSize:14}}>INTERVIEW BUDDY</span>
          </div>
          <div style={{display:"flex", alignItems:"center", gap:16}}>
            <span style={{fontSize:11, letterSpacing:3, opacity:0.5}}>EST. 2026 • {user?.email || "PRIVATE BETA"}</span>
            <button onClick={handleLogout} style={{background:"#1A1A1A", color:"#FDFBF7", padding:"8px 14px", fontSize:10, letterSpacing:2, border:"none", cursor:"pointer"}}>LOGOUT</button>
          </div>
        </div>
      </div>

      {/* Main - MOVED UP from 60px to 30px */}
      <div style={{maxWidth:1200, margin:"0 auto", padding:"30px 24px 60px 24px", display:"grid", gridTemplateColumns:"1.2fr 0.8fr", gap:60}}>
        <div>
          <div style={{fontSize:11, letterSpacing:4, opacity:0.4, marginBottom:20}}>THE CLASSIC EDITION — VOL. I</div>
          <h1 style={{fontSize:64, lineHeight:"0.9", fontWeight:400, margin:0}}>
            The art of<br/><i style={{fontFamily:"Times New Roman", fontWeight:300}}>perfect</i><br/>answers.
          </h1>
          <p style={{marginTop:24, fontSize:18, lineHeight:1.6, opacity:0.7, maxWidth:450}}>
            A private atelier for serious candidates. No gimmicks, no noise. Just rigorous practice, curated by experts.
          </p>

          <div style={{marginTop:40, background:"white", border:"1px solid #E7E0D3", padding:24, boxShadow:"0 10px 30px rgba(0,0,0,0.04)"}}>
            <div style={{display:"flex", justifyContent:"space-between", marginBottom:20}}>
              <span style={{fontSize:11, letterSpacing:2, opacity:0.5}}>SELECT DISCIPLINE</span>
              <span style={{fontSize:11}}>{role}</span>
            </div>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24}}>
              {roles.map(r=>(
                <button key={r} onClick={()=>setRole(r)} style={{padding:"14px", border:"1px solid", borderColor: role===r ? "#1A1A1A" : "#E7E0D3", background: role===r ? "#1A1A1A" : "white", color: role===r ? "white" : "#1A1A1A", fontSize:12, letterSpacing:1, cursor:"pointer", textAlign:"left"}}>
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
            <Link href={`/interview?role=${role}`} style={{display:"block", textAlign:"center", background:"#1A1A1A", color:"#FDFBF7", padding:"18px", textDecoration:"none", fontSize:12, letterSpacing:3}}>BEGIN SESSION →</Link>
            <div style={{marginTop:12, textAlign:"center", fontSize:10, letterSpacing:1, opacity:0.4}}>45 MIN • 3 ROUNDS • INSTANT REPORT</div>
          </div>
        </div>

        <div>
          <div style={{background:"#1A1A1A", color:"#E7E0D3", padding:32, minHeight:500, position:"relative"}}>
            <div style={{fontSize:11, letterSpacing:3, opacity:0.5, marginBottom:30}}>ATELIER MANIFESTO</div>
            <div style={{display:"flex", flexDirection:"column", gap:28}}>
              {[
                {n:"01", t:"No generic questions", d:"Every question is hand-picked for your role."},
                {n:"02", t:"No copy-paste feedback", d:"Line-by-line critique, like a master tailor."},
                {n:"03", t:"No distractions", d:"Just you, the question, and the craft."}
              ].map(i=>(
                <div key={i.n} style={{display:"flex", gap:16}}>
                  <span style={{fontSize:11, opacity:0.3}}>{i.n}</span>
                  <div>
                    <div style={{fontSize:14, letterSpacing:1, marginBottom:6}}>{i.t.toUpperCase()}</div>
                    <div style={{fontSize:13, opacity:0.6, lineHeight:1.5}}>{i.d}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{position:"absolute", bottom:32, left:32, right:32, borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:20, display:"flex", justifyContent:"space-between", fontSize:10, letterSpacing:2, opacity:0.4}}>
              <span>CLIENTS: 2,400+</span><span>SUCCESS: 94%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}