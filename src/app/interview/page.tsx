"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function InterviewContent(){
  const params = useSearchParams();
  const router = useRouter();
  const role = params.get("role") || "AI/ML";
  const [q, setQ] = useState(0);
  const [ans, setAns] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(false);

  const questionBank: any = {
    "Frontend": [
      { level: "BEGINNER", q: "What is the difference between let, const, and var? Give an example." },
      { level: "BEGINNER", q: "Explain the CSS box model. How do you perfectly center a div?" },
      { level: "INTERMEDIATE", q: "How does React's Virtual DOM work and why is it faster?" },
      { level: "INTERMEDIATE", q: "What is a closure in JavaScript? Give a real Frontend use-case." },
      { level: "ADVANCED", q: "How would you optimize a React app that takes 5 seconds to load?" },
      { level: "ADVANCED", q: "Tell me about a challenging Frontend project you led and its impact." },
      { level: "PRO", q: "Design a real-time collaborative editor like Figma on the frontend." },
      { level: "MASTER", q: "A critical bug hits 1M users during peak hour. How do you handle it?" },
    ],
    "Backend": [
      { level: "BEGINNER", q: "What is the difference between SQL and NoSQL? When to use which?" },
      { level: "BEGINNER", q: "Explain REST vs GraphQL with pros and cons." },
      { level: "INTERMEDIATE", q: "How do you handle authentication and authorization securely?" },
      { level: "INTERMEDIATE", q: "Explain database indexing. How do you fix a slow query?" },
      { level: "ADVANCED", q: "How would you design a rate limiter for 10M requests/day?" },
      { level: "ADVANCED", q: "Tell me about a challenging Backend scaling issue you solved." },
      { level: "PRO", q: "Design a URL shortener like bit.ly from scratch." },
      { level: "MASTER", q: "Your database goes down at 3 AM. Walk me through incident response." },
    ],
    "AI/ML": [
      { level: "BEGINNER", q: "What is the difference between supervised and unsupervised learning?" },
      { level: "BEGINNER", q: "Explain overfitting and how do you prevent it?" },
      { level: "INTERMEDIATE", q: "How does a transformer model work? Explain attention simply." },
      { level: "INTERMEDIATE", q: "What is the bias-variance tradeoff?" },
      { level: "ADVANCED", q: "How would you build a RAG system for 1M documents?" },
      { level: "ADVANCED", q: "Tell me about a challenging AI/ML project you led and its impact." },
      { level: "PRO", q: "Design an ML system to detect fraud in real-time transactions." },
      { level: "MASTER", q: "Your model accuracy drops 20% in production. How do you debug?" },
    ],
    "Data Science": [
      { level: "BEGINNER", q: "What is the difference between mean, median and mode? When to use which?" },
      { level: "BEGINNER", q: "Explain p-value in simple terms." },
      { level: "INTERMEDIATE", q: "How do you handle missing data and outliers?" },
      { level: "INTERMEDIATE", q: "Explain A/B testing and statistical significance." },
      { level: "ADVANCED", q: "How would you build a recommendation system for an e-commerce site?" },
      { level: "ADVANCED", q: "Tell me about a data project that drove real business impact." },
      { level: "PRO", q: "Design a data pipeline for 100M events per day." },
      { level: "MASTER", q: "Stakeholders disagree with your data findings. How do you handle it?" },
    ],
    "Product Manager": [
      { level: "BEGINNER", q: "What does a PM actually do? Explain your product lifecycle." },
      { level: "BEGINNER", q: "How do you prioritize features? Explain RICE or MoSCoW." },
      { level: "INTERMEDIATE", q: "How do you write a good PRD?" },
      { level: "INTERMEDIATE", q: "Explain how you handled a disagreement with engineering." },
      { level: "ADVANCED", q: "Your key metric drops 20% after a launch. What do you do?" },
      { level: "ADVANCED", q: "Tell me about a product you launched from 0 to 1." },
      { level: "PRO", q: "Design a product to help students find internships." },
      { level: "MASTER", q: "Your CEO wants to build a feature you know will fail. How do you handle it?" },
    ],
    "DevOps": [
      { level: "BEGINNER", q: "What is CI/CD? Explain with an example." },
      { level: "BEGINNER", q: "What is Docker and why do we use it?" },
      { level: "INTERMEDIATE", q: "Explain Kubernetes in simple terms." },
      { level: "INTERMEDIATE", q: "How do you monitor and log a production system?" },
      { level: "ADVANCED", q: "How would you design infrastructure for 10M users?" },
      { level: "ADVANCED", q: "Tell me about a time you reduced infrastructure cost." },
      { level: "PRO", q: "Design a zero-downtime deployment strategy." },
      { level: "MASTER", q: "Production is down and you are on-call. Walk me through your steps." },
    ]
  };

  const questions = questionBank[role] || questionBank["Frontend"];

  const handleNext = async () => {
    if(ans.trim().length < 10){ alert("Craft a proper answer first - at least 2 lines!"); return; }

    if(!showFeedback){
      setLoading(true);
      setShowFeedback(true);
      setFeedback("Analyzing with GPT-4o... please wait");

      try {
        const res = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: questions[q].q, answer: ans, role }),
        });
        const data = await res.json();

        if(data.error) throw new Error(data.error);

        const finalFeedback = `${data.feedback}\n\nStrengths: ${data.strengths?.join(", ")}\nImprovements: ${data.improvements?.join(", ")}`;
        setFeedback(finalFeedback);

        const existing = JSON.parse(localStorage.getItem("interview_results") || "[]");
        existing[q] = {
          question: questions[q].q,
          level: questions[q].level,
          answer: ans,
          score: data.score || 75,
          feedback: finalFeedback
        };
        localStorage.setItem("interview_results", JSON.stringify(existing));
        localStorage.setItem("interview_role", role);

      } catch (e: any) {
        setFeedback(`AI Error: ${e.message}. Check your.env.local and api route. Using fallback.`);
        const existing = JSON.parse(localStorage.getItem("interview_results") || "[]");
        existing[q] = { question: questions[q].q, level: questions[q].level, answer: ans, score: 70, feedback: `AI Error: ${e.message}` };
        localStorage.setItem("interview_results", JSON.stringify(existing));
      }
      setLoading(false);
    } else {
      if(q < questions.length - 1){
        setQ(q+1); setAns(""); setShowFeedback(false); setFeedback("");
      } else {
        router.push("/report");
      }
    }
  };

  const levelColor = questions[q].level === "BEGINNER"? "#E7E0D3" : questions[q].level === "INTERMEDIATE"? "#1A1A1A" : questions[q].level === "ADVANCED"? "#C9A86A" : "#8B0000";
  const progress = ((q+1)/questions.length)*100;

  return (
    <div style={{maxWidth:720, margin:"0 auto"}}>
      <div style={{width:"100%", height:4, background:"#E7E0D3", marginBottom:24}}>
        <div style={{width:`${progress}%`, height:"100%", background:"#1A1A1A", transition:"width 0.5s"}}></div>
      </div>
      <div style={{display:"flex", justifyContent:"space-between", fontSize:11, letterSpacing:2, opacity:0.5, marginBottom:20}}>
        <span>DISCIPLINE: {role} • {questions[q].level}</span>
        <span>Q {q+1} / {questions.length}</span>
      </div>
      <div>
        <div style={{display:"inline-block", background: levelColor, color: questions[q].level==="BEGINNER"?"#1A1A1A":"white", fontSize:10, letterSpacing:3, padding:"5px 12px", marginBottom:16}}>
          {questions[q].level} • LEVEL {q+1}
        </div>
        <h2 style={{fontFamily:"Georgia, serif", fontSize:34, fontWeight:400, lineHeight:1.15, marginBottom:30, color:"#1A1A1A"}}>{questions[q].q}</h2>
      </div>
      <textarea
        value={ans}
        onChange={e=>setAns(e.target.value)}
        placeholder="Craft your answer here... like a master tailor."
        style={{width:"100%", height:220, padding:22, border:"1px solid #E7E0D3", background:"white", fontSize:16, fontFamily:"Georgia, serif", outline:"none", lineHeight:1.6}}
      />
      {showFeedback && (
        <div style={{marginTop:20, background:"#1A1A1A", color:"#E8E0D0", padding:20, fontSize:13, lineHeight:1.6, whiteSpace:"pre-line", borderLeft:"4px solid #C9A86A"}}>
          <div style={{fontSize:11, letterSpacing:3, opacity:0.5, marginBottom:10}}>{loading? "ATELIER AI IS THINKING..." : "ATELIER FEEDBACK - POWERED BY GPT-4o"}</div>
          • {feedback}
        </div>
      )}
      <div style={{display:"flex", gap:10, marginTop:20}}>
        <button onClick={()=>{ if(q>0){ setQ(q-1); setShowFeedback(false); } }} style={{padding:"14px 20px", border:"1px solid #1A1A1A", background:"white", cursor:"pointer", fontSize:12, letterSpacing:1}}>BACK</button>
        <button onClick={handleNext} disabled={loading} style={{flex:1, padding:"14px", background:"#1A1A1A", color:"white", letterSpacing:2, cursor:"pointer", border:"none", fontSize:12, opacity: loading? 0.6 : 1}}>
          {loading? "EVALUATING..." :!showFeedback? "GET AI FEEDBACK →" : (q === questions.length-1? "VIEW FINAL REPORT →" : "NEXT QUESTION →")}
        </button>
      </div>
      <a href="/" style={{display:"inline-block", marginTop:30, fontSize:12, textDecoration:"underline", color:"#1A1A1A", fontFamily:"Georgia, serif"}}>← Back to Atelier</a>
    </div>
  )
}

export default function InterviewPage(){
  return (
    <div style={{minHeight:"100vh", background:"#FDFBF7", padding:40, color:"#1A1A1A"}}>
      <Suspense fallback={<div>Loading atelier...</div>}>
        <InterviewContent/>
      </Suspense>
    </div>
  )
}