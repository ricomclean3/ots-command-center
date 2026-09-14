import React, {useEffect, useMemo, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  LayoutDashboard, CalendarDays, ClipboardCheck, FolderOpen, ChartNoAxesColumnIncreasing,
  Route, NotebookPen, Settings, Menu, X, Plus, ChevronRight, CircleAlert, Check,
  Clock3, Pencil, Trash2, Download, Upload, RotateCcw, Search, FileText, GraduationCap,
  BriefcaseBusiness, ShieldCheck, Target, ExternalLink, Save, CircleHelp, CalendarClock
} from 'lucide-react';
import './styles.css';

const PHASES = [
  {id:'initial', name:'Initial package build', short:'Package build', start:'2026-08-24', end:'2026-09-18', color:'#2f9e66'},
  {id:'development', name:'Development + AFOQT prep', short:'Develop + study', start:'2026-09-21', end:'2026-10-30', color:'#2878bd'},
  {id:'draft', name:'First complete package draft', short:'Complete draft', start:'2026-11-02', end:'2026-11-20', color:'#7f56d9'},
  {id:'testing', name:'AFOQT + refinement', short:'AFOQT', start:'2026-11-23', end:'2026-12-18', color:'#c47b14'},
  {id:'finalize', name:'Post-holiday finalization', short:'Finalize', start:'2026-12-21', end:'2027-01-15', color:'#586b84'},
  {id:'routing', name:'Leadership routing', short:'Route', start:'2027-01-18', end:'2027-02-05', color:'#0d6c8b'},
  {id:'review', name:'Final internal review', short:'Internal review', start:'2027-02-08', end:'2027-02-26', color:'#765f39'},
  {id:'submit', name:'AFCEP + submission', short:'Submit', start:'2027-03-01', end:'2027-04-02', color:'#0b694b'},
  {id:'wait', name:'Board + results', short:'Board + results', start:'2027-04-03', end:'2027-07-07', color:'#53657a'}
];

const seedTasks = [
  ['Request commissioning website access','initial','2026-09-14','high','in_progress'],
  ['Obtain official FY27 board schedule / program announcement','initial','2026-09-16','high','todo'],
  ['Create master checklist and package folder structure','initial','2026-09-15','high','todo'],
  ['Confirm BBA graduation date and degree eligibility','initial','2026-09-16','high','todo'],
  ['Contact education office for earliest AFOQT date','initial','2026-09-16','high','todo'],
  ['Identify an MSC officer and request FY27 MSC guidance','initial','2026-09-17','high','todo'],
  ['Schedule commander career-development conversation','initial','2026-09-18','high','todo'],
  ['Gather EPBs/EPRs, decorations, awards and training records','initial','2026-09-18','medium','todo'],
  ['Request official transcripts and outside documentation','initial','2026-09-18','medium','todo'],
  ['Conduct first package status review','initial','2026-09-18','medium','todo'],
  ['Establish AFOQT study plan','development','2026-09-25','high','todo'],
  ['Begin application forms and applicant statements','development','2026-10-02','high','todo'],
  ['Build quantified accomplishment inventory','development','2026-10-09','high','todo'],
  ['Complete first drafts of applicant-controlled forms','development','2026-10-16','high','todo'],
  ['Determine GRE/GMAT and MSC board requirements','development','2026-10-16','high','todo'],
  ['Update all applicable documents after SSgt sew-on','development','2026-10-23','medium','todo'],
  ['Draft required memorandums and recommendation inputs','development','2026-10-30','high','todo'],
  ['Resolve personnel-record discrepancies','development','2026-10-30','medium','todo'],
  ['Complete every applicant-controlled document','draft','2026-11-13','high','todo'],
  ['Verify transcripts, records and eligibility evidence','draft','2026-11-13','high','todo'],
  ['Complete first full working package','draft','2026-11-20','high','todo'],
  ['Conduct page-by-page package review','draft','2026-11-20','high','todo'],
  ['Complete mock interview','draft','2026-11-20','medium','todo'],
  ['Confirm AFOQT appointment, location and identification','testing','2026-12-04','high','todo'],
  ['Complete final focused AFOQT preparation','testing','2026-12-11','high','todo'],
  ['Take AFOQT','testing','2026-12-15','high','todo'],
  ['Retain test documentation and monitor scores','testing','2026-12-18','medium','todo'],
  ['Prepare AFCEP memorandum','testing','2026-12-18','high','todo'],
  ['Verify and add AFOQT scores to package','finalize','2027-01-08','high','todo'],
  ['Finalize AFCEP memorandum','finalize','2027-01-08','high','todo'],
  ['Complete pre-routing quality-control review','finalize','2027-01-15','high','todo'],
  ['Submit AFCEP memorandum to squadron leadership','routing','2027-01-18','high','todo'],
  ['Track two-week leadership routing and respond to changes','routing','2027-01-29','high','todo'],
  ['Incorporate signed memorandum','routing','2027-02-05','high','todo'],
  ['Submit complete package for internal review','review','2027-02-08','high','todo'],
  ['Resolve signatures, dates and administrative discrepancies','review','2027-02-19','high','todo'],
  ['Obtain remaining signatures','review','2027-02-26','high','todo'],
  ['Reach substantially complete package','review','2027-02-26','high','todo'],
  ['Submit AFCEP request as soon as window opens','submit','2027-03-01','high','todo'],
  ['Reach 100% submission-ready package','submit','2027-03-08','high','todo'],
  ['Complete final attachment and signature verification','submit','2027-03-12','high','todo'],
  ['Lock routine package changes','submit','2027-03-15','medium','todo'],
  ['Confirm AFCEP request before window closes','submit','2027-03-19','high','todo'],
  ['Use contingency week only for returned corrections','submit','2027-03-26','medium','todo'],
  ['Submit final application and verify receipt','submit','2027-03-30','high','todo'],
  ['Official claimed cutoff — do not wait for this date','submit','2027-04-02','high','todo'],
  ['Continue duty performance and officer preparation','wait','2027-05-03','medium','todo'],
  ['Record board result and next action','wait','2027-07-07','high','todo']
].map((t,i)=>({id:`preset-${i+1}`,title:t[0],phase:t[1],due:t[2],priority:t[3],status:t[4],preset:true}));

const seedDocuments = [
  ['Official FY27 program announcement','Official guidance','missing'],
  ['AF Form 56 / current application form','Application','missing'],
  ['Official college transcripts','Education','requested'],
  ['AFOQT score report','Testing','blocked'],
  ['EPBs / EPRs','Military records','missing'],
  ['Decorations and awards','Military records','missing'],
  ['Commander recommendation','Leadership','blocked'],
  ['AFCEP memorandum','Submission','missing'],
  ['Degree plan / graduation verification','Education','missing'],
  ['MSC FY27 accession guide','MSC lane','missing']
].map((d,i)=>({id:`doc-${i}`,name:d[0],category:d[1],status:d[2]}));

const NAV = [
  ['overview','Overview',LayoutDashboard], ['timeline','Timeline',CalendarDays], ['package','Package',ClipboardCheck],
  ['documents','Documents',FolderOpen], ['testing','Testing',ChartNoAxesColumnIncreasing], ['careers','Career paths',Route],
  ['notes','Notes',NotebookPen], ['settings','Settings',Settings]
];

const fmt = (date, options={month:'short',day:'numeric',year:'numeric'}) => new Date(`${date}T12:00:00`).toLocaleDateString('en-US',options);
const statusLabel = {todo:'Not started',in_progress:'In progress',done:'Complete',missing:'Missing',requested:'Requested',blocked:'Blocked',ready:'Ready'};
const statusClass = s => `status status-${s}`;

function usePersistedState(key, initial){
  const [state,setState]=useState(()=>{try{return JSON.parse(localStorage.getItem(key)) ?? initial}catch{return initial}});
  useEffect(()=>localStorage.setItem(key,JSON.stringify(state)),[key,state]);
  return [state,setState];
}

function App(){
  const [view,setView]=useState('overview');
  const [mobileOpen,setMobileOpen]=useState(false);
  const [tasks,setTasks]=usePersistedState('otscc.tasks',seedTasks);
  const [documents,setDocuments]=usePersistedState('otscc.documents',seedDocuments);
  const [notes,setNotes]=usePersistedState('otscc.notes',[]);
  const [verification,setVerification]=usePersistedState('otscc.verification',{board:false,msc:false,afoqt:false,afcep:false});
  const [modal,setModal]=useState(null);
  const [query,setQuery]=useState('');
  const today = new Date();
  const currentPhase = PHASES.find(p=>today>=new Date(`${p.start}T00:00:00`)&&today<=new Date(`${p.end}T23:59:59`)) || PHASES[0];
  const complete=tasks.filter(t=>t.status==='done').length;
  const progress=tasks.length?Math.round(complete/tasks.length*100):0;
  const nextTask=[...tasks].filter(t=>t.status!=='done').sort((a,b)=>a.due.localeCompare(b.due))[0];
  const daysToDraft=Math.max(0,Math.ceil((new Date('2026-11-20T23:59:59')-today)/86400000));
  const filtered=useMemo(()=>tasks.filter(t=>t.title.toLowerCase().includes(query.toLowerCase())),[tasks,query]);
  const setStatus=(id,status)=>setTasks(ts=>ts.map(t=>t.id===id?{...t,status}:t));
  const saveTask=(task)=>{setTasks(ts=>task.id?ts.map(t=>t.id===task.id?task:t):[...ts,{...task,id:crypto.randomUUID(),preset:false}]);setModal(null)};
  const deleteTask=id=>{if(confirm('Delete this task?'))setTasks(ts=>ts.filter(t=>t.id!==id));};
  const go=v=>{setView(v);setMobileOpen(false);window.scrollTo(0,0)};
  const reset=()=>{if(confirm('Reset all tracker data to the original plan? Your edits will be removed.')){setTasks(seedTasks);setDocuments(seedDocuments);setNotes([]);setVerification({board:false,msc:false,afoqt:false,afcep:false})}};

  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen?'open':''}`}>
      <div className="brand"><div className="brand-mark">O</div><div><strong>OTS</strong><span>Command Center</span></div><button className="mobile-close" onClick={()=>setMobileOpen(false)}><X/></button></div>
      <nav>{NAV.map(([id,label,Icon])=><button key={id} className={view===id?'active':''} onClick={()=>go(id)}><Icon size={19}/><span>{label}</span></button>)}</nav>
      <div className="sidebar-foot"><p>Discipline<br/>Preparation<br/><em>Opportunity</em></p><div className="rule"/><strong>Applicant workspace</strong><span>SSgt-select · 4B0X1</span><span>27OTS02</span></div>
    </aside>
    <div className="main-wrap">
      <header className="topbar">
        <button className="menu" onClick={()=>setMobileOpen(true)}><Menu/></button>
        <div className="page-brand"><strong>OTS Command Center</strong><span className="provisional">27OTS02 · Provisional</span></div>
        <label className="search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tasks…"/></label>
        <div className="avatar">27</div>
      </header>
      <main>
        {view==='overview'&&<Overview {...{tasks,progress,complete,currentPhase,nextTask,daysToDraft,setStatus,setModal,verification,setVerification,notes,go}}/>}
        {view==='timeline'&&<Timeline tasks={filtered} setStatus={setStatus} setModal={setModal} deleteTask={deleteTask}/>} 
        {view==='package'&&<Package tasks={filtered} setStatus={setStatus} setModal={setModal}/>} 
        {view==='documents'&&<Documents documents={documents} setDocuments={setDocuments}/>} 
        {view==='testing'&&<Testing/>}
        {view==='careers'&&<Careers/>}
        {view==='notes'&&<Notes notes={notes} setNotes={setNotes}/>} 
        {view==='settings'&&<SettingsView tasks={tasks} documents={documents} notes={notes} setTasks={setTasks} setDocuments={setDocuments} setNotes={setNotes} reset={reset}/>} 
      </main>
    </div>
    {modal&&<TaskModal task={modal==='new'?null:modal} onClose={()=>setModal(null)} onSave={saveTask} onDelete={deleteTask}/>} 
  </div>
}

function PageTitle({title,sub,action}){return <div className="page-title"><div><h1>{title}</h1><p>{sub}</p></div>{action}</div>}

function Overview({tasks,progress,complete,currentPhase,nextTask,daysToDraft,setStatus,setModal,verification,setVerification,notes,go}){
  const phaseTasks=tasks.filter(t=>t.phase===currentPhase.id);
  return <>
    <PageTitle title="27OTS02 Application Timeline" sub="Sep 2026 – Jul 2027 · Build early. Verify everything. Submit before the cutoff." action={<button className="btn secondary" onClick={()=>go('timeline')}>Edit timeline</button>}/>
    <section className="summary-grid">
      <div className="panel progress-panel"><h2>Overall package progress</h2><div className="progress-body"><div className="ring" style={{'--p':`${progress*3.6}deg`}}><strong>{progress}%</strong><span>complete</span></div><div className="progress-key"><strong>{complete} of {tasks.length}</strong><span>tasks complete</span><div><i className="dot done"/>Complete <b>{complete}</b></div><div><i className="dot started"/>In progress <b>{tasks.filter(t=>t.status==='in_progress').length}</b></div><div><i className="dot todo"/>Not started <b>{tasks.filter(t=>t.status==='todo').length}</b></div></div></div></div>
      <div className="panel next-panel"><div className="panel-label"><h2>Next action</h2><span className="priority">Priority</span></div>{nextTask&&<><h3>{nextTask.title}</h3><p>Due {fmt(nextTask.due)} · {PHASES.find(p=>p.id===nextTask.phase)?.name}</p><button className="btn primary" onClick={()=>setStatus(nextTask.id,nextTask.status==='in_progress'?'done':'in_progress')}>{nextTask.status==='in_progress'?'Mark complete':'Start task'} <ChevronRight size={17}/></button></>}</div>
      <div className="panel deadline-panel"><h2>First complete draft</h2><div className="days"><CalendarClock/><strong>{daysToDraft}</strong><span>days</span></div><p>November 20, 2026</p><small>Internal deadline</small></div>
    </section>
    <TimelineRail/>
    <section className="lower-grid">
      <div className="panel task-panel"><div className="panel-head"><div><h2>Current phase tasks</h2><p><strong>{currentPhase.name}</strong> · {fmt(currentPhase.start,{month:'short',day:'numeric'})}–{fmt(currentPhase.end,{month:'short',day:'numeric'})}</p></div><button className="btn primary small" onClick={()=>setModal('new')}><Plus size={17}/> Add task</button></div><TaskRows tasks={phaseTasks} setStatus={setStatus} onEdit={setModal}/></div>
      <div className="side-stack">
        <Verification verification={verification} setVerification={setVerification}/>
        <div className="panel notes-peek"><div className="panel-head"><h2>Latest note</h2><button className="text-btn" onClick={()=>go('notes')}>View all</button></div>{notes.length?<><small>{fmt(notes[0].date)}</small><p>{notes[0].text}</p></>:<p className="empty">No notes yet. Capture guidance, decisions, and package feedback here.</p>}</div>
      </div>
    </section>
  </>
}

function TimelineRail(){
  const marks=[['2026-09-18','Requirements mapped'],['2026-11-20','Complete draft'],['2026-12-15','AFOQT'],['2027-01-18','Leadership routing'],['2027-03-01','AFCEP opens'],['2027-03-30','Target submission'],['2027-05-03','Board'],['2027-07-07','Results']];
  return <section className="panel timeline-rail"><div className="panel-head"><div><h2>Mission timeline</h2><p>Working dates · official schedule still requires verification</p></div><span className="warning-inline"><CircleAlert size={15}/> Provisional</span></div><div className="rail-scroll"><div className="rail-line">{marks.map((m,i)=><div className="rail-mark" key={m[0]}><span className={i===0?'current':''}>{i===0?<Check size={13}/>:i+1}</span><small>{fmt(m[0],{month:'short',year:'2-digit'})}</small><strong>{m[1]}</strong><em>{fmt(m[0],{month:'short',day:'numeric'})}</em></div>)}</div></div></section>
}

function Verification({verification,setVerification}){const rows=[['board','Official board schedule'],['msc','MSC deadline'],['afoqt','AFOQT appointment'],['afcep','AFCEP window']];return <div className="panel verify"><h2>Risk & verification</h2><div className="callout"><CircleAlert/><p><strong>Official guidance not yet verified</strong><span>Planning dates must be replaced with the current official announcement.</span></p></div>{rows.map(([k,label])=><button key={k} className="verify-row" onClick={()=>setVerification(v=>({...v,[k]:!v[k]}))}><span>{label}</span><b className={verification[k]?'verified':'unverified'}>{verification[k]?'Verified':'Unverified'}</b></button>)}</div>}

function TaskRows({tasks,setStatus,onEdit,showPhase=false}){if(!tasks.length)return <div className="empty-state">No tasks here yet.</div>;return <div className="task-rows">{tasks.map(t=><div className="task-row" key={t.id}><button className={`check ${t.status==='done'?'checked':''}`} aria-label="Toggle complete" onClick={()=>setStatus(t.id,t.status==='done'?'todo':'done')}>{t.status==='done'&&<Check size={15}/>}</button><div className="task-copy"><strong className={t.status==='done'?'struck':''}>{t.title}</strong>{showPhase&&<span>{PHASES.find(p=>p.id===t.phase)?.name}</span>}</div><span className={`priority-text ${t.priority}`}>{t.priority}</span><time>{fmt(t.due,{month:'short',day:'numeric'})}</time><button className="icon-btn" onClick={()=>onEdit(t)} aria-label="Edit task"><Pencil size={16}/></button></div>)}</div>}

function Timeline({tasks,setStatus,setModal,deleteTask}){return <><PageTitle title="Application timeline" sub="Every preset milestone can be edited. Your completion data stays on this device." action={<button className="btn primary" onClick={()=>setModal('new')}><Plus size={17}/> Add task</button>}/><div className="phase-list">{PHASES.map((p,i)=>{const pts=tasks.filter(t=>t.phase===p.id);const done=pts.filter(t=>t.status==='done').length;return <section className="phase-block" key={p.id}><div className="phase-spine"><span style={{background:p.color}}>{i+1}</span></div><div className="panel phase-content"><div className="phase-header"><div><small>Phase {i+1}</small><h2>{p.name}</h2><p>{fmt(p.start)} – {fmt(p.end)}</p></div><div className="phase-score"><strong>{done}/{pts.length}</strong><span>complete</span></div></div><TaskRows tasks={pts} setStatus={setStatus} onEdit={setModal}/></div></section>})}</div></>}

function Package({tasks,setStatus,setModal}){const groups=PHASES.map(p=>({...p,tasks:tasks.filter(t=>t.phase===p.id)}));return <><PageTitle title="Package readiness" sub="Work the package by phase and stop missing dependencies."/><div className="package-bars">{groups.map(g=>{const pct=g.tasks.length?Math.round(g.tasks.filter(t=>t.status==='done').length/g.tasks.length*100):0;return <div key={g.id}><span>{g.short}</span><div><i style={{width:`${pct}%`,background:g.color}}/></div><strong>{pct}%</strong></div>})}</div><section className="panel"><div className="panel-head"><div><h2>All requirements</h2><p>{tasks.filter(t=>t.status!=='done').length} actions remain</p></div><button className="btn primary small" onClick={()=>setModal('new')}><Plus size={17}/> Add requirement</button></div><TaskRows tasks={tasks} setStatus={setStatus} onEdit={setModal} showPhase/></section></>}

function Documents({documents,setDocuments}){const cycle=(s)=>({missing:'requested',requested:'ready',ready:'missing',blocked:'ready'}[s]||'missing');return <><PageTitle title="Documents" sub="Track availability here; store sensitive personnel records only in approved systems." action={<button className="btn secondary"><Plus size={17}/> Add document</button>}/><div className="privacy-note"><ShieldCheck/><div><strong>Privacy boundary</strong><span>This app records document status only. Do not upload PII, medical records, SSNs, or protected package files.</span></div></div><section className="panel document-table"><div className="table-head"><span>Document</span><span>Category</span><span>Status</span></div>{documents.map(d=><button className="document-row" key={d.id} onClick={()=>setDocuments(ds=>ds.map(x=>x.id===d.id?{...x,status:cycle(x.status)}:x))}><span><FileText size={17}/>{d.name}</span><span>{d.category}</span><b className={statusClass(d.status)}>{statusLabel[d.status]}</b></button>)}</section></>}

function Testing(){return <><PageTitle title="Testing plan" sub="AFOQT is the Line Officer lane. GRE/GMAT applicability belongs to the separate MSC lane."/><div className="two-col"><section className="panel test-card"><div className="big-icon"><GraduationCap/></div><h2>AFOQT</h2><p>Target: mid-December 2026</p><dl><div><dt>Appointment</dt><dd>Not verified</dd></div><div><dt>Final prep</dt><dd>7–11 Dec</dd></div><div><dt>Working test date</dt><dd>15 Dec · provisional</dd></div><div><dt>Score upload</dt><dd>Early Jan 2027</dd></div></dl><button className="btn primary">Build study plan</button></section><section className="panel test-card"><div className="big-icon brass"><BriefcaseBusiness/></div><h2>MSC testing</h2><p>41A requirements must be verified independently.</p><dl><div><dt>GRE / GMAT</dt><dd>Unverified for FY27</dd></div><div><dt>MSC guide</dt><dd>Not obtained</dd></div><div><dt>Board deadline</dt><dd>Unknown</dd></div><div><dt>Mentor</dt><dd>Not assigned</dd></div></dl><button className="btn secondary">Mark guidance obtained</button></section></div></>}

function Careers(){const paths=[['41A','Medical Service Corps','Primary specialized path','Best intersection of medical experience, BBA, healthcare leadership, organization, and future psychology/business goals.'],['38F','Force Support','Primary Line Officer preference','Strongest fit for people development, HR, manpower, organizational systems, and organizational psychology.'],['63A','Acquisition Manager','Second Line Officer preference','Best business + technology fit for program management, AI-assisted products, innovation, and entrepreneurship.'],['64P','Contracting Officer','Third Line Officer preference','Strong transferable value in procurement, negotiations, vendors, contracts, and business ownership.'],['65F','Financial Management','Fourth Line Officer preference','Relevant budgeting, financial analysis, and resource allocation experience.']];return <><PageTitle title="Career paths" sub="One coherent story: people + healthcare + business + technology + organizational leadership."/><div className="narrative"><Target/><div><strong>Commissioning narrative</strong><p>I am an enlisted medical-readiness professional and emerging business leader who organizes complex systems, develops people, and applies emerging technology to improve mission execution.</p></div></div><div className="career-list">{paths.map((p,i)=><section className="career-row" key={p[0]}><div className="rank">{i+1}</div><strong className="afsc">{p[0]}</strong><div><h2>{p[1]}</h2><span>{p[2]}</span></div><p>{p[3]}</p></section>)}</div><div className="privacy-note"><CircleHelp/><div><strong>Long-term psychology path</strong><span>Commissioning does not qualify you as a psychologist. A clinical path still requires the appropriate doctorate, internship, licensure, and a later service decision.</span></div></div></>}

function Notes({notes,setNotes}){const [text,setText]=useState('');const add=()=>{if(text.trim()){setNotes(n=>[{id:crypto.randomUUID(),date:new Date().toISOString().slice(0,10),text:text.trim()},...n]);setText('')}};return <><PageTitle title="Notes & decisions" sub="Capture guidance, feedback, contacts, and decisions without storing sensitive package content."/><section className="panel note-entry"><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="What did leadership, your mentor, recruiter, or education office tell you?"/><button className="btn primary" onClick={add}><Save size={17}/> Save note</button></section><div className="notes-list">{notes.length?notes.map(n=><article className="panel note" key={n.id}><time>{fmt(n.date)}</time><p>{n.text}</p><button className="icon-btn" onClick={()=>setNotes(ns=>ns.filter(x=>x.id!==n.id))}><Trash2 size={16}/></button></article>):<div className="empty-state large">No notes yet. Your first useful note should be the source and date of the official FY27 guidance.</div>}</div></>}

function SettingsView({tasks,documents,notes,setTasks,setDocuments,setNotes,reset}){const input=useRef();const exportData=()=>{const blob=new Blob([JSON.stringify({version:1,exportedAt:new Date().toISOString(),tasks,documents,notes},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='ots-command-center-backup.json';a.click();URL.revokeObjectURL(a.href)};const importData=e=>{const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const d=JSON.parse(reader.result);if(d.tasks)setTasks(d.tasks);if(d.documents)setDocuments(d.documents);if(d.notes)setNotes(d.notes);alert('Backup imported successfully.')}catch{alert('That backup file could not be read.')}};reader.readAsText(file)};return <><PageTitle title="Settings & data" sub="Your tracker saves automatically in this browser. Export a backup before changing devices or clearing browser data."/><div className="settings-list"><section className="panel setting"><div><Download/><span><strong>Export backup</strong><small>Download tasks, document statuses, and notes as JSON.</small></span></div><button className="btn primary" onClick={exportData}>Export data</button></section><section className="panel setting"><div><Upload/><span><strong>Import backup</strong><small>Restore a previously exported OTS Command Center file.</small></span></div><input ref={input} type="file" accept="application/json" hidden onChange={importData}/><button className="btn secondary" onClick={()=>input.current?.click()}>Choose file</button></section><section className="panel setting danger"><div><RotateCcw/><span><strong>Reset plan</strong><small>Restore original preset tasks and remove your edits.</small></span></div><button className="btn danger-btn" onClick={reset}>Reset app</button></section></div><div className="privacy-note"><ShieldCheck/><div><strong>Storage model</strong><span>Version 1 stores data locally on this device. Account sync is not active yet. Use Export before moving to another device.</span></div></div></>}

function TaskModal({task,onClose,onSave,onDelete}){const [form,setForm]=useState(task||{title:'',phase:'initial',due:new Date().toISOString().slice(0,10),priority:'medium',status:'todo',preset:false});const update=(k,v)=>setForm(f=>({...f,[k]:v}));return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><form className="modal" onSubmit={e=>{e.preventDefault();if(form.title.trim())onSave({...form,title:form.title.trim()})}}><div className="modal-head"><div><h2>{task?'Edit task':'Add task'}</h2><p>{task?.preset?'This preset item is fully editable.':'Add a requirement to your plan.'}</p></div><button type="button" className="icon-btn" onClick={onClose}><X/></button></div><label>Task name<input autoFocus value={form.title} onChange={e=>update('title',e.target.value)} required/></label><div className="form-grid"><label>Phase<select value={form.phase} onChange={e=>update('phase',e.target.value)}>{PHASES.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select></label><label>Due date<input type="date" value={form.due} onChange={e=>update('due',e.target.value)}/></label><label>Priority<select value={form.priority} onChange={e=>update('priority',e.target.value)}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label><label>Status<select value={form.status} onChange={e=>update('status',e.target.value)}><option value="todo">Not started</option><option value="in_progress">In progress</option><option value="done">Complete</option></select></label></div><div className="modal-actions">{task&&<button type="button" className="btn delete" onClick={()=>{onDelete(task.id);onClose()}}><Trash2 size={17}/> Delete</button>}<span/><button type="button" className="btn secondary" onClick={onClose}>Cancel</button><button className="btn primary" type="submit"><Save size={17}/> Save task</button></div></form></div>}

if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(()=>{}));
createRoot(document.getElementById('root')).render(<App/>);
