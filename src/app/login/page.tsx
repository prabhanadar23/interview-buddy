"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) alert(error.message)
    else router.push("/")
  }

  return (
    <div style={{minHeight:"100vh", background:"#FDFBF7", color:"#1A1A1A", fontFamily:"Georgia, serif", display:"flex", flexDirection:"column"}}>
      {/* Header - Same as home */}
      <div style={{borderBottom:"1px solid #E7E0D3", padding:"18px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", maxWidth:1200, width:"100%", margin:"0 auto"}}>
        <div style={{display:"flex", alignItems:"center", gap:10}}>
          <div style={{width:32, height:32, background:"#1A1A1A", color:"#FDFBF7", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:"bold"}}>I</div>
          <span style={{fontWeight:"bold", letterSpacing:2, fontSize:14}}>INTERVIEW BUDDY</span>
        </div>
        <span style={{fontSize:11, letterSpacing:3, opacity:0.5}}>EST. 2026</span>
      </div>

      {/* Center Form */}
      <div style={{flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:24}}>
        <div style={{display:"grid", gridTemplateColumns:"0.9fr 1.1fr", maxWidth:900, width:"100%", background:"white", border:"1px solid #E7E0D3", boxShadow:"0 20px 60px rgba(0,0,0,0.06)"}}>
          
          {/* Left - Manifesto Style */}
          <div style={{background:"#1A1A1A", color:"#E7E0D3", padding:40, display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:11, letterSpacing:4, opacity:0.4, marginBottom:24}}>ATELIER ACCESS</div>
              <h2 style={{fontSize:36, lineHeight:1.1, fontWeight:400, margin:0}}>Welcome<br/><i style={{fontFamily:"Times New Roman", fontWeight:300}}>back</i><br/>to the atelier.</h2>
              <p style={{marginTop:20, fontSize:14, opacity:0.6, lineHeight:1.6}}>Private sessions. Bespoke questions. No noise.</p>
            </div>
            <div style={{marginTop:40, borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:20, fontSize:10, letterSpacing:2, opacity:0.4, display:"flex", justifyContent:"space-between"}}>
              <span>VOL. I</span><span>PRIVATE BETA</span>
            </div>
          </div>

          {/* Right - Form */}
          <form onSubmit={handleLogin} style={{padding:40, display:"flex", flexDirection:"column", justifyContent:"center"}}>
            <div style={{fontSize:11, letterSpacing:2, opacity:0.5, marginBottom:24}}>LOGIN TO CONTINUE</div>
            
            <label style={{fontSize:11, letterSpacing:1, opacity:0.6, marginBottom:8}}>EMAIL ADDRESS</label>
            <input 
              type="email" required
              value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="you@atelier.com"
              style={{width:"100%", border:"1px solid #E7E0D3", padding:"14px 16px", marginBottom:20, fontFamily:"Georgia, serif", fontSize:14, outline:"none", background:"#FDFBF7"}}
            />

            <label style={{fontSize:11, letterSpacing:1, opacity:0.6, marginBottom:8}}>PASSWORD</label>
            <input 
              type="password" required
              value={password} onChange={e=>setPassword(e.target.value)}
              placeholder="••••••••"
              style={{width:"100%", border:"1px solid #E7E0D3", padding:"14px 16px", marginBottom:28, fontFamily:"Georgia, serif", fontSize:14, outline:"none", background:"#FDFBF7"}}
            />

            <button type="submit" disabled={loading} style={{width:"100%", background:"#1A1A1A", color:"#FDFBF7", padding:"16px", border:"none", fontSize:11, letterSpacing:3, cursor:"pointer"}}>
              {loading ? "AUTHENTICATING..." : "ENTER ATELIER →"}
            </button>

            <div style={{marginTop:20, textAlign:"center", fontSize:12, opacity:0.6}}>
              New to the atelier? <Link href="/signup" style={{color:"#1A1A1A", textDecoration:"underline"}}>Request Access</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}