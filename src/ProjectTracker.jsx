import { useState } from "react";

const defaultCategories = ["Product & Industry", "Legal & Compliance", "Revenue Operations", "Procurement & Data"];
const defaultMembers = [];
const okrTeams = ["Sales", "Marketing", "Product", "Solutions Consulting", "Finance", "Corporate", "HR"];

const initialProjects = [
  { id: 1, name: "Enablement", category: "Product & Industry", status: "In Progress", priority: "High", owner: "", link: "",
    summary: "Product and industry enablement — structure resources and processes to accelerate internal adoption and team upskilling.",
    okrs: [], tasks: [
      { id: 1, text: "Map enablement needs by team", done: false, assignee: "" },
      { id: 2, text: "Create product playbook", done: false, assignee: "" },
      { id: 3, text: "Organize industry deep-dive sessions", done: false, assignee: "" },
      { id: 4, text: "Set up feedback loop", done: false, assignee: "" },
    ], dueDate: "2026-04-30", notes: "" },
  { id: 2, name: "Legal / Trust Center", category: "Legal & Compliance", status: "Not Started", priority: "High", owner: "", link: "",
    summary: "Set up Trust Center, review T&Cs, centralize legal assets to streamline the sales cycle.",
    okrs: [], tasks: [
      { id: 1, text: "Audit existing T&Cs", done: false, assignee: "" },
      { id: 2, text: "Benchmark competitor Trust Centers", done: false, assignee: "" },
      { id: 3, text: "Select and set up Trust Center tool", done: false, assignee: "" },
      { id: 4, text: "Draft / update legal documents", done: false, assignee: "" },
      { id: 5, text: "Go-live and internal communication", done: false, assignee: "" },
    ], dueDate: "2026-05-31", notes: "" },
  { id: 3, name: "Upsells Automation", category: "Revenue Operations", status: "In Progress", priority: "Medium", owner: "", link: "",
    summary: "Automate consumption/seats/workspaces data visualization and create a standardized upsell deck to accelerate expansion revenue.",
    okrs: [], tasks: [
      { id: 1, text: "Define key metrics (consumption, seats, workspaces)", done: false, assignee: "" },
      { id: 2, text: "Connect data sources", done: false, assignee: "" },
      { id: 3, text: "Build automated dashboard", done: false, assignee: "" },
      { id: 4, text: "Design upsell deck template", done: false, assignee: "" },
      { id: 5, text: "Test on 3 pilot accounts", done: false, assignee: "" },
    ], dueDate: "2026-03-31", notes: "" },
  { id: 4, name: "Data Vendors Management", category: "Procurement & Data", status: "Not Started", priority: "Medium", owner: "", link: "",
    summary: "Rationalize and manage data vendor relationships — contracts, costs, quality, and integration roadmap.",
    okrs: [], tasks: [
      { id: 1, text: "Complete inventory of current vendors", done: false, assignee: "" },
      { id: 2, text: "Evaluate quality / cost / overlap", done: false, assignee: "" },
      { id: 3, text: "Negotiate / renew contracts", done: false, assignee: "" },
      { id: 4, text: "Define data vendors governance", done: false, assignee: "" },
    ], dueDate: "2026-06-30", notes: "" },
];

const statusConfig = {
  "Not Started": { bg: "#f3f4f6", text: "#6b7280", dot: "#9ca3af" },
  "In Progress": { bg: "#eff6ff", text: "#2563eb", dot: "#3b82f6" },
  "Blocked": { bg: "#fef2f2", text: "#dc2626", dot: "#ef4444" },
  "Done": { bg: "#f0fdf4", text: "#16a34a", dot: "#22c55e" },
};
const priorityConfig = {
  High: { bg: "#fef2f2", text: "#dc2626" },
  Medium: { bg: "#fffbeb", text: "#d97706" },
  Low: { bg: "#f3f4f6", text: "#6b7280" },
};

export default function ProjectTracker() {
  const [projects, setProjects] = useState(initialProjects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", category: "", summary: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [activePage, setActivePage] = useState("projects");
  const [categories, setCategories] = useState(defaultCategories);
  const [members, setMembers] = useState(defaultMembers);
  const [newCategory, setNewCategory] = useState("");
  const [newMember, setNewMember] = useState("");
  const [editingCategoryIdx, setEditingCategoryIdx] = useState(null);
  const [editingMemberIdx, setEditingMemberIdx] = useState(null);
  const [editCategoryValue, setEditCategoryValue] = useState("");
  const [editMemberValue, setEditMemberValue] = useState("");
  const [newOkr, setNewOkr] = useState("");
  const [showAddOkr, setShowAddOkr] = useState(false);
  const [newOkrTeam, setNewOkrTeam] = useState("");
  const [editingOkrId, setEditingOkrId] = useState(null);
  const [editOkrText, setEditOkrText] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState("");

  const updateProject = (id, field, value) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    if (selectedProject?.id === id) setSelectedProject(prev => ({ ...prev, [field]: value }));
  };
  const toggleTask = (pid, tid) => {
    const up = p => p.id === pid ? { ...p, tasks: p.tasks.map(t => t.id === tid ? { ...t, done: !t.done } : t) } : p;
    setProjects(prev => prev.map(up));
    if (selectedProject?.id === pid) setSelectedProject(prev => up(prev));
  };
  const updateTaskAssignee = (pid, tid, a) => {
    const up = p => p.id === pid ? { ...p, tasks: p.tasks.map(t => t.id === tid ? { ...t, assignee: a } : t) } : p;
    setProjects(prev => prev.map(up));
    if (selectedProject?.id === pid) setSelectedProject(prev => up(prev));
  };
  const addTask = (pid) => {
    if (!newTaskText.trim()) return;
    const nt = { id: Date.now(), text: newTaskText.trim(), done: false, assignee: "" };
    const up = p => p.id === pid ? { ...p, tasks: [...p.tasks, nt] } : p;
    setProjects(prev => prev.map(up));
    if (selectedProject?.id === pid) setSelectedProject(prev => up(prev));
    setNewTaskText(""); setShowAddTask(false);
  };
  const deleteTask = (pid, tid) => {
    const up = p => p.id === pid ? { ...p, tasks: p.tasks.filter(t => t.id !== tid) } : p;
    setProjects(prev => prev.map(up));
    if (selectedProject?.id === pid) setSelectedProject(prev => up(prev));
  };
  const addProject = () => {
    if (!newProject.name.trim()) return;
    const p = { id: Date.now(), name: newProject.name, category: newProject.category || categories[0] || "General", status: "Not Started", priority: "Medium", owner: "", link: "", summary: newProject.summary, okrs: [], tasks: [], dueDate: "", notes: "" };
    setProjects(prev => [...prev, p]);
    setNewProject({ name: "", category: "", summary: "" }); setShowAddProject(false);
  };
  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (selectedProject?.id === id) setSelectedProject(null);
  };
  const addOkr = (pid) => {
    if (!newOkr.trim()) return;
    const o = { id: Date.now(), text: newOkr.trim(), team: newOkrTeam };
    const up = p => p.id === pid ? { ...p, okrs: [...(p.okrs||[]), o] } : p;
    setProjects(prev => prev.map(up));
    if (selectedProject?.id === pid) setSelectedProject(prev => up(prev));
    setNewOkr(""); setNewOkrTeam(""); setShowAddOkr(false);
  };
  const updateOkrText = (pid, oid, text) => {
    const up = p => p.id === pid ? { ...p, okrs: (p.okrs||[]).map(o => o.id === oid ? { ...o, text } : o) } : p;
    setProjects(prev => prev.map(up));
    if (selectedProject?.id === pid) setSelectedProject(prev => up(prev));
  };
  const updateOkrTeam = (pid, oid, team) => {
    const up = p => p.id === pid ? { ...p, okrs: (p.okrs||[]).map(o => o.id === oid ? { ...o, team } : o) } : p;
    setProjects(prev => prev.map(up));
    if (selectedProject?.id === pid) setSelectedProject(prev => up(prev));
  };
  const deleteOkr = (pid, oid) => {
    const up = p => p.id === pid ? { ...p, okrs: (p.okrs||[]).filter(o => o.id !== oid) } : p;
    setProjects(prev => prev.map(up));
    if (selectedProject?.id === pid) setSelectedProject(prev => up(prev));
  };
  const getProgress = (p) => p.tasks.length ? Math.round(p.tasks.filter(t => t.done).length / p.tasks.length * 100) : 0;
  const startEdit = (f, v) => { setEditingField(f); setTempValue(v); };
  const saveEdit = (pid, f) => { updateProject(pid, f, tempValue); setEditingField(null); };
  const totalTasks = projects.reduce((a, p) => a + p.tasks.length, 0);
  const doneTasks = projects.reduce((a, p) => a + p.tasks.filter(t => t.done).length, 0);
  const getInitials = (n) => n ? n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2) : "";

  let filtered = projects.filter(p => {
    const ms = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const mst = filterStatus === "All" || p.status === filterStatus;
    return ms && mst;
  });
  if (sortField) {
    filtered = [...filtered].sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (sortField === "progress") { va = getProgress(a); vb = getProgress(b); }
      if (typeof va === "string") { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      return va < vb ? (sortDir === "asc" ? -1 : 1) : va > vb ? (sortDir === "asc" ? 1 : -1) : 0;
    });
  }
  const handleSort = (f) => { if (sortField === f) setSortDir(sortDir === "asc" ? "desc" : "asc"); else { setSortField(f); setSortDir("asc"); } };
  const current = selectedProject ? projects.find(p => p.id === selectedProject.id) || selectedProject : null;
  const SortIcon = ({ field }) => <span style={{ marginLeft: 4, opacity: sortField === field ? 1 : 0.3, fontSize: 10 }}>{sortField === field && sortDir === "desc" ? "▼" : "▲"}</span>;

  // ─── SETTINGS PAGE ───
  const renderSettings = () => (
    <div style={{ flex: 1, overflow: "auto", padding: "32px 40px" }}>
      <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700, color: "#111827" }}>Settings</h2>
      <p style={{ color: "#9ca3af", fontSize: 14, marginBottom: 32 }}>Manage categories and team members used across projects.</p>
      <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
        {/* Categories card */}
        <div style={{ flex: 1, minWidth: 300 }}>
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>Categories</div><div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>Used for project classification</div></div>
              <span style={{ background: "#f3f4f6", color: "#6b7280", padding: "2px 10px", borderRadius: 20, fontSize: 12 }}>{categories.length}</span>
            </div>
            <div style={{ padding: "8px 12px" }}>
              {categories.map((cat, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8 }}
                  onMouseEnter={e => e.currentTarget.style.background="#f9fafb"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                  {editingCategoryIdx === i ? (
                    <input value={editCategoryValue} onChange={e => setEditCategoryValue(e.target.value)} autoFocus
                      onBlur={() => { if (editCategoryValue.trim()) { const old=categories[i]; setCategories(p=>p.map((c,idx)=>idx===i?editCategoryValue.trim():c)); setProjects(p=>p.map(pr=>pr.category===old?{...pr,category:editCategoryValue.trim()}:pr)); } setEditingCategoryIdx(null); }}
                      onKeyDown={e => { if(e.key==="Enter") e.target.blur(); if(e.key==="Escape") setEditingCategoryIdx(null); }}
                      style={{ flex:1, padding:"4px 8px", border:"1px solid #e5e7eb", borderRadius:6, fontSize:13, outline:"none" }} />
                  ) : (<>
                    <span style={{ flex:1, fontSize:13, color:"#374151" }}>{cat}</span>
                    <span style={{ fontSize:11, color:"#d1d5db", cursor:"pointer", padding:"2px 6px" }} onClick={()=>{setEditingCategoryIdx(i);setEditCategoryValue(cat);}}
                      onMouseEnter={e=>e.currentTarget.style.color="#6366f1"} onMouseLeave={e=>e.currentTarget.style.color="#d1d5db"}>✎</span>
                    <span style={{ fontSize:14, color:"#d1d5db", cursor:"pointer", padding:"2px 6px" }} onClick={()=>setCategories(p=>p.filter((_,idx)=>idx!==i))}
                      onMouseEnter={e=>e.currentTarget.style.color="#ef4444"} onMouseLeave={e=>e.currentTarget.style.color="#d1d5db"}>×</span>
                  </>)}
                </div>
              ))}
              <div style={{ display:"flex", gap:8, padding:"8px 10px" }}>
                <input value={newCategory} onChange={e=>setNewCategory(e.target.value)} placeholder="New category..."
                  onKeyDown={e=>{if(e.key==="Enter"&&newCategory.trim()){setCategories(p=>[...p,newCategory.trim()]);setNewCategory("");}}}
                  style={{ flex:1, padding:"7px 10px", border:"1px solid #e5e7eb", borderRadius:8, fontSize:13, outline:"none" }} />
                <button onClick={()=>{if(newCategory.trim()){setCategories(p=>[...p,newCategory.trim()]);setNewCategory("");}}}
                  style={{ padding:"7px 14px", background:"#6366f1", color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:500, cursor:"pointer" }}>Add</button>
              </div>
            </div>
          </div>
        </div>
        {/* Members card */}
        <div style={{ flex: 1, minWidth: 300 }}>
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>Team Members</div><div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>Available as owners and task assignees</div></div>
              <span style={{ background: "#f3f4f6", color: "#6b7280", padding: "2px 10px", borderRadius: 20, fontSize: 12 }}>{members.length}</span>
            </div>
            <div style={{ padding: "8px 12px" }}>
              {members.map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8 }}
                  onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  {editingMemberIdx === i ? (
                    <input value={editMemberValue} onChange={e=>setEditMemberValue(e.target.value)} autoFocus
                      onBlur={()=>{if(editMemberValue.trim()){const old=members[i];setMembers(p=>p.map((x,idx)=>idx===i?editMemberValue.trim():x));setProjects(p=>p.map(pr=>{let u={...pr};if(pr.owner===old)u.owner=editMemberValue.trim();u.tasks=pr.tasks.map(t=>t.assignee===old?{...t,assignee:editMemberValue.trim()}:t);return u;}));}setEditingMemberIdx(null);}}
                      onKeyDown={e=>{if(e.key==="Enter")e.target.blur();if(e.key==="Escape")setEditingMemberIdx(null);}}
                      style={{ flex:1, padding:"4px 8px", border:"1px solid #e5e7eb", borderRadius:6, fontSize:13, outline:"none" }} />
                  ) : (<>
                    <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:10, fontWeight:600, flexShrink:0 }}>{getInitials(m)}</div>
                    <span style={{ flex:1, fontSize:13, color:"#374151" }}>{m}</span>
                    <span style={{ fontSize:11, color:"#d1d5db", cursor:"pointer", padding:"2px 6px" }} onClick={()=>{setEditingMemberIdx(i);setEditMemberValue(m);}}
                      onMouseEnter={e=>e.currentTarget.style.color="#6366f1"} onMouseLeave={e=>e.currentTarget.style.color="#d1d5db"}>✎</span>
                    <span style={{ fontSize:14, color:"#d1d5db", cursor:"pointer", padding:"2px 6px" }} onClick={()=>setMembers(p=>p.filter((_,idx)=>idx!==i))}
                      onMouseEnter={e=>e.currentTarget.style.color="#ef4444"} onMouseLeave={e=>e.currentTarget.style.color="#d1d5db"}>×</span>
                  </>)}
                </div>
              ))}
              {members.length===0 && <div style={{ padding:"12px 10px", color:"#d1d5db", fontSize:13 }}>No team members yet</div>}
              <div style={{ display:"flex", gap:8, padding:"8px 10px" }}>
                <input value={newMember} onChange={e=>setNewMember(e.target.value)} placeholder="Full name..."
                  onKeyDown={e=>{if(e.key==="Enter"&&newMember.trim()){setMembers(p=>[...p,newMember.trim()]);setNewMember("");}}}
                  style={{ flex:1, padding:"7px 10px", border:"1px solid #e5e7eb", borderRadius:8, fontSize:13, outline:"none" }} />
                <button onClick={()=>{if(newMember.trim()){setMembers(p=>[...p,newMember.trim()]);setNewMember("");}}}
                  style={{ padding:"7px 14px", background:"#6366f1", color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:500, cursor:"pointer" }}>Add</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── PROJECTS PAGE ───
  const renderProjects = () => (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ background:"#fff", borderBottom:"1px solid #e5e7eb", padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:14, color:"#6b7280" }}>
          <span style={{ fontWeight:600, color:"#111827" }}>Projects</span><span>›</span><span>All ({projects.length})</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:14, color:"#9ca3af" }}>🔍</span>
            <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search..."
              style={{ padding:"7px 12px 7px 32px", border:"1px solid #e5e7eb", borderRadius:8, fontSize:13, color:"#374151", outline:"none", width:180, background:"#f9fafb" }} />
          </div>
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
            style={{ padding:"7px 12px", border:"1px solid #e5e7eb", borderRadius:8, fontSize:13, color:"#374151", outline:"none", background:"#f9fafb", cursor:"pointer" }}>
            <option value="All">All statuses</option>
            {Object.keys(statusConfig).map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={()=>setShowAddProject(true)}
            style={{ padding:"7px 16px", background:"#6366f1", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:500, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:16 }}>+</span> New Project
          </button>
        </div>
      </div>

      {showAddProject && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.3)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center" }}
          onClick={e=>{if(e.target===e.currentTarget)setShowAddProject(false);}}>
          <div style={{ background:"#fff", borderRadius:16, padding:28, width:440, boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }}>
            <h3 style={{ margin:"0 0 20px", fontSize:18, fontWeight:600, color:"#111827" }}>New Project</h3>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:500, color:"#6b7280", display:"block", marginBottom:4 }}>Name</label>
              <input value={newProject.name} onChange={e=>setNewProject({...newProject,name:e.target.value})} placeholder="E.g. Product Enablement" autoFocus
                style={{ width:"100%", padding:"10px 14px", border:"1px solid #e5e7eb", borderRadius:8, fontSize:14, outline:"none", boxSizing:"border-box" }} />
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:500, color:"#6b7280", display:"block", marginBottom:4 }}>Category</label>
              <select value={newProject.category} onChange={e=>setNewProject({...newProject,category:e.target.value})}
                style={{ width:"100%", padding:"10px 14px", border:"1px solid #e5e7eb", borderRadius:8, fontSize:14, outline:"none", boxSizing:"border-box", background:"#fff" }}>
                <option value="">Select a category...</option>
                {categories.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:12, fontWeight:500, color:"#6b7280", display:"block", marginBottom:4 }}>Summary</label>
              <textarea value={newProject.summary} onChange={e=>setNewProject({...newProject,summary:e.target.value})} rows={3} placeholder="Project description..."
                style={{ width:"100%", padding:"10px 14px", border:"1px solid #e5e7eb", borderRadius:8, fontSize:14, outline:"none", resize:"vertical", fontFamily:"inherit", boxSizing:"border-box" }} />
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button onClick={()=>setShowAddProject(false)} style={{ padding:"9px 20px", background:"#f3f4f6", color:"#374151", border:"none", borderRadius:8, fontSize:13, cursor:"pointer" }}>Cancel</button>
              <button onClick={addProject} style={{ padding:"9px 20px", background:"#6366f1", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:500, cursor:"pointer" }}>Create</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        <div style={{ flex:1, overflow:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
            <thead>
              <tr style={{ background:"#f9fafb", borderBottom:"1px solid #e5e7eb" }}>
                {[{l:"Project",f:"name"},{l:"Status",f:"status"},{l:"Category",f:"category"},{l:"Priority",f:"priority"},{l:"Owner"},{l:"Progress",f:"progress"},{l:"Link"},{l:"Deadline"}].map((col,i)=>(
                  <th key={i} onClick={col.f?()=>handleSort(col.f):undefined}
                    style={{ padding:i===0?"10px 24px":"10px 16px", textAlign:"left", fontWeight:500, fontSize:12, color:"#6b7280", textTransform:"uppercase", letterSpacing:0.5, cursor:col.f?"pointer":"default", userSelect:"none" }}>
                    {col.l} {col.f && <SortIcon field={col.f} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(project => {
                const sc=statusConfig[project.status], pc=priorityConfig[project.priority], progress=getProgress(project), isSelected=current?.id===project.id;
                return (
                  <tr key={project.id} onClick={()=>setSelectedProject(isSelected?null:project)}
                    style={{ borderBottom:"1px solid #f3f4f6", cursor:"pointer", background:isSelected?"#f8f7ff":"#fff", transition:"background 0.15s" }}
                    onMouseEnter={e=>{if(!isSelected)e.currentTarget.style.background="#fafafa";}} onMouseLeave={e=>{if(!isSelected)e.currentTarget.style.background="#fff";}}>
                    <td style={{ padding:"14px 24px", fontWeight:500, color:"#111827" }}>{project.name}</td>
                    <td style={{ padding:"14px 16px" }}>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 12px", borderRadius:20, background:sc.bg, color:sc.text, fontSize:12, fontWeight:500 }}>
                        <span style={{ width:6, height:6, borderRadius:"50%", background:sc.dot }} />{project.status}
                      </span>
                    </td>
                    <td style={{ padding:"14px 16px", color:"#6b7280", fontSize:13 }}>{project.category}</td>
                    <td style={{ padding:"14px 16px" }}><span style={{ padding:"3px 10px", borderRadius:6, background:pc.bg, color:pc.text, fontSize:12, fontWeight:500 }}>{project.priority}</span></td>
                    <td style={{ padding:"14px 16px" }}>
                      {project.owner ? (
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:26, height:26, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:10, fontWeight:600 }}>{getInitials(project.owner)}</div>
                          <span style={{ fontSize:13, color:"#374151" }}>{project.owner}</span>
                        </div>
                      ) : <span style={{ color:"#d1d5db", fontSize:13 }}>—</span>}
                    </td>
                    <td style={{ padding:"14px 16px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:60, height:5, background:"#e5e7eb", borderRadius:3, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${progress}%`, background:progress===100?"#22c55e":"#6366f1", borderRadius:3, transition:"width 0.3s" }} />
                        </div>
                        <span style={{ fontSize:12, color:"#6b7280", minWidth:30 }}>{progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding:"14px 16px" }} onClick={e=>e.stopPropagation()}>
                      {project.link ? <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ color:"#6366f1", fontSize:12, textDecoration:"none" }}
                        onMouseEnter={e=>e.currentTarget.style.textDecoration="underline"} onMouseLeave={e=>e.currentTarget.style.textDecoration="none"}>🔗 Link</a>
                      : <span style={{ color:"#d1d5db", fontSize:13 }}>—</span>}
                    </td>
                    <td style={{ padding:"14px 16px", fontSize:13, color:"#6b7280" }}>
                      {project.dueDate ? new Date(project.dueDate).toLocaleDateString("en-US",{day:"numeric",month:"short",year:"numeric"}) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length===0 && <div style={{ textAlign:"center", padding:40, color:"#9ca3af", fontSize:14 }}>No projects found</div>}
        </div>

        {/* ─── DETAIL PANEL ─── */}
        {current && (
          <div style={{ width:420, borderLeft:"1px solid #e5e7eb", background:"#fff", overflow:"hidden", flexShrink:0, display:"flex", flexDirection:"column" }}>
            <div style={{ padding:"20px 24px", borderBottom:"1px solid #e5e7eb", display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexShrink:0 }}>
              <div>
                <div style={{ fontSize:11, color:"#9ca3af", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>{current.category}</div>
                {editingName ? (
                  <input value={editNameValue} onChange={e=>setEditNameValue(e.target.value)} autoFocus
                    onBlur={()=>{if(editNameValue.trim())updateProject(current.id,"name",editNameValue.trim());setEditingName(false);}}
                    onKeyDown={e=>{if(e.key==="Enter"){if(editNameValue.trim())updateProject(current.id,"name",editNameValue.trim());setEditingName(false);}if(e.key==="Escape")setEditingName(false);}}
                    style={{ margin:0, fontSize:18, fontWeight:600, color:"#111827", border:"1px solid #e5e7eb", borderRadius:6, padding:"2px 8px", outline:"none", width:"100%", boxSizing:"border-box", fontFamily:"inherit" }} />
                ) : (
                  <h2 onClick={()=>{setEditingName(true);setEditNameValue(current.name);}} style={{ margin:0, fontSize:18, fontWeight:600, color:"#111827", cursor:"pointer", borderRadius:6, padding:"2px 4px", marginLeft:-4, transition:"background 0.15s" }}
                    onMouseEnter={e=>e.currentTarget.style.background="#f3f4f6"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{current.name}</h2>
                )}
              </div>
              <button onClick={()=>setSelectedProject(null)} style={{ background:"#f3f4f6", border:"none", borderRadius:6, padding:"6px 10px", cursor:"pointer", fontSize:12, color:"#6b7280" }}>✕</button>
            </div>
            <div style={{ padding:"20px 24px", overflow:"auto", flex:1 }}>
              {/* Meta row */}
              <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
                <select value={current.status} onChange={e=>updateProject(current.id,"status",e.target.value)}
                  style={{ padding:"5px 10px", border:"1px solid #e5e7eb", borderRadius:8, fontSize:12, color:statusConfig[current.status].text, background:statusConfig[current.status].bg, cursor:"pointer", outline:"none", fontWeight:500 }}>
                  {Object.keys(statusConfig).map(s=><option key={s} value={s}>{s}</option>)}
                </select>
                <select value={current.priority} onChange={e=>updateProject(current.id,"priority",e.target.value)}
                  style={{ padding:"5px 10px", border:"1px solid #e5e7eb", borderRadius:8, fontSize:12, color:priorityConfig[current.priority].text, background:priorityConfig[current.priority].bg, cursor:"pointer", outline:"none", fontWeight:500 }}>
                  {["High","Medium","Low"].map(p=><option key={p} value={p}>{p}</option>)}
                </select>
                <input type="date" value={current.dueDate} onChange={e=>updateProject(current.id,"dueDate",e.target.value)}
                  style={{ padding:"5px 10px", border:"1px solid #e5e7eb", borderRadius:8, fontSize:12, color:"#374151", outline:"none" }} />
                <button onClick={()=>deleteProject(current.id)}
                  style={{ padding:"5px 10px", border:"1px solid #fecaca", borderRadius:8, fontSize:12, color:"#dc2626", background:"#fef2f2", cursor:"pointer", marginLeft:"auto" }}>Delete</button>
              </div>

              {/* Category */}
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:11, fontWeight:500, color:"#9ca3af", textTransform:"uppercase", letterSpacing:0.5, marginBottom:6 }}>Category</div>
                <select value={current.category} onChange={e=>updateProject(current.id,"category",e.target.value)}
                  style={{ width:"100%", padding:"8px 12px", border:"1px solid #e5e7eb", borderRadius:8, fontSize:13, outline:"none", background:"#fff", color:"#374151", cursor:"pointer", boxSizing:"border-box" }}>
                  {categories.map(c=><option key={c} value={c}>{c}</option>)}
                  {!categories.includes(current.category) && <option value={current.category}>{current.category}</option>}
                </select>
              </div>

              {/* Owner */}
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:11, fontWeight:500, color:"#9ca3af", textTransform:"uppercase", letterSpacing:0.5, marginBottom:6 }}>Owner</div>
                {members.length > 0 ? (
                  <select value={current.owner} onChange={e=>updateProject(current.id,"owner",e.target.value)}
                    style={{ width:"100%", padding:"8px 12px", border:"1px solid #e5e7eb", borderRadius:8, fontSize:13, outline:"none", background:"#fff", color:current.owner?"#374151":"#9ca3af", cursor:"pointer", boxSizing:"border-box" }}>
                    <option value="">Unassigned</option>
                    {members.map(m=><option key={m} value={m}>{m}</option>)}
                  </select>
                ) : (
                  <div style={{ padding:"8px 12px", border:"1px solid #f3f4f6", borderRadius:8, fontSize:13, color:"#d1d5db" }}>Add team members in Settings first</div>
                )}
              </div>

              {/* Link */}
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:11, fontWeight:500, color:"#9ca3af", textTransform:"uppercase", letterSpacing:0.5, marginBottom:6 }}>Resource Link</div>
                {editingField==="link" ? (
                  <input value={tempValue} onChange={e=>setTempValue(e.target.value)} onBlur={()=>saveEdit(current.id,"link")} onKeyDown={e=>e.key==="Enter"&&saveEdit(current.id,"link")} autoFocus placeholder="https://..."
                    style={{ width:"100%", padding:"8px 12px", border:"1px solid #e5e7eb", borderRadius:8, fontSize:13, outline:"none", boxSizing:"border-box" }} />
                ) : (
                  <div onClick={()=>startEdit("link",current.link||"")}
                    style={{ padding:"8px 12px", border:"1px solid #f3f4f6", borderRadius:8, fontSize:13, color:current.link?"#6366f1":"#d1d5db", cursor:"pointer", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="#e5e7eb"} onMouseLeave={e=>e.currentTarget.style.borderColor="#f3f4f6"}>
                    {current.link ? <span>🔗 {current.link}</span> : "Add a link..."}
                  </div>
                )}
              </div>

              {/* Summary */}
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:11, fontWeight:500, color:"#9ca3af", textTransform:"uppercase", letterSpacing:0.5, marginBottom:6 }}>Summary</div>
                {editingField==="summary" ? (
                  <textarea value={tempValue} onChange={e=>setTempValue(e.target.value)} onBlur={()=>saveEdit(current.id,"summary")} rows={3} autoFocus
                    style={{ width:"100%", padding:"8px 12px", border:"1px solid #e5e7eb", borderRadius:8, fontSize:13, lineHeight:1.5, outline:"none", resize:"vertical", fontFamily:"inherit", boxSizing:"border-box" }} />
                ) : (
                  <div onClick={()=>startEdit("summary",current.summary)}
                    style={{ padding:"8px 12px", border:"1px solid #f3f4f6", borderRadius:8, fontSize:13, lineHeight:1.5, color:current.summary?"#374151":"#d1d5db", cursor:"pointer" }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="#e5e7eb"} onMouseLeave={e=>e.currentTarget.style.borderColor="#f3f4f6"}>
                    {current.summary || "Add a summary..."}
                  </div>
                )}
              </div>

              {/* Linked OKRs */}
              <div style={{ marginBottom:18 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <div style={{ fontSize:11, fontWeight:500, color:"#9ca3af", textTransform:"uppercase", letterSpacing:0.5 }}>Linked OKRs</div>
                  <span style={{ background:"#f0f0ff", color:"#6366f1", padding:"1px 8px", borderRadius:10, fontSize:11, fontWeight:500 }}>{(current.okrs||[]).length}</span>
                </div>
                {(current.okrs||[]).map(okr=>(
                  <div key={okr.id} style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"8px 10px", marginBottom:4, borderRadius:8 }}
                    onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <span style={{ color:"#6366f1", fontSize:14, marginTop:1, flexShrink:0 }}>◎</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      {editingOkrId===okr.id ? (
                        <input value={editOkrText} onChange={e=>setEditOkrText(e.target.value)} autoFocus
                          onBlur={()=>{if(editOkrText.trim())updateOkrText(current.id,okr.id,editOkrText.trim());setEditingOkrId(null);}}
                          onKeyDown={e=>{if(e.key==="Enter"){if(editOkrText.trim())updateOkrText(current.id,okr.id,editOkrText.trim());setEditingOkrId(null);}if(e.key==="Escape")setEditingOkrId(null);}}
                          style={{ width:"100%", padding:"2px 6px", border:"1px solid #e5e7eb", borderRadius:4, fontSize:13, outline:"none", boxSizing:"border-box" }} />
                      ) : (
                        <span onClick={()=>{setEditingOkrId(okr.id);setEditOkrText(okr.text);}} style={{ fontSize:13, color:"#374151", lineHeight:1.4, cursor:"pointer" }}>{okr.text}</span>
                      )}
                      <div style={{ marginTop:4, display:"flex", alignItems:"center", gap:6 }}>
                        <select value={okr.team||""} onChange={e=>updateOkrTeam(current.id,okr.id,e.target.value)}
                          style={{ padding:"1px 6px", border:"1px solid #e5e7eb", borderRadius:4, fontSize:10, color:okr.team?"#6366f1":"#9ca3af", background:okr.team?"#f0f0ff":"#fff", outline:"none", cursor:"pointer" }}>
                          <option value="">No team</option>
                          {okrTeams.map(t=><option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <span onClick={()=>deleteOkr(current.id,okr.id)} style={{ color:"#d1d5db", cursor:"pointer", fontSize:14, padding:"0 2px", flexShrink:0 }}
                      onMouseEnter={e=>e.currentTarget.style.color="#ef4444"} onMouseLeave={e=>e.currentTarget.style.color="#d1d5db"}>×</span>
                  </div>
                ))}
                {(current.okrs||[]).length===0 && !showAddOkr && <div style={{ padding:"8px 10px", color:"#d1d5db", fontSize:13 }}>No linked OKRs yet</div>}
                {showAddOkr ? (
                  <div style={{ marginTop:6 }}>
                    <div style={{ display:"flex", gap:8 }}>
                      <input value={newOkr} onChange={e=>setNewOkr(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addOkr(current.id)} placeholder="E.g. Increase NRR to 120% by Q2" autoFocus
                        style={{ flex:1, padding:"8px 12px", border:"1px solid #e5e7eb", borderRadius:8, fontSize:13, outline:"none" }} />
                      <button onClick={()=>addOkr(current.id)} style={{ padding:"8px 14px", background:"#6366f1", color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:500, cursor:"pointer" }}>+</button>
                      <button onClick={()=>{setShowAddOkr(false);setNewOkr("");setNewOkrTeam("");}} style={{ padding:"8px 12px", background:"#f3f4f6", color:"#6b7280", border:"none", borderRadius:8, fontSize:12, cursor:"pointer" }}>✕</button>
                    </div>
                    <select value={newOkrTeam} onChange={e=>setNewOkrTeam(e.target.value)}
                      style={{ marginTop:6, padding:"5px 10px", border:"1px solid #e5e7eb", borderRadius:6, fontSize:12, color:newOkrTeam?"#6366f1":"#9ca3af", background:newOkrTeam?"#f0f0ff":"#fff", outline:"none", cursor:"pointer" }}>
                      <option value="">Assign team (optional)</option>
                      {okrTeams.map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                ) : (
                  <div onClick={()=>setShowAddOkr(true)} style={{ padding:"8px 10px", marginTop:4, borderRadius:8, color:"#9ca3af", fontSize:12, cursor:"pointer" }}
                    onMouseEnter={e=>e.currentTarget.style.color="#6366f1"} onMouseLeave={e=>e.currentTarget.style.color="#9ca3af"}>+ Link an OKR</div>
                )}
              </div>

              {/* Tasks */}
              <div style={{ marginBottom:18 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <div style={{ fontSize:11, fontWeight:500, color:"#9ca3af", textTransform:"uppercase", letterSpacing:0.5 }}>Tasks ({current.tasks.filter(t=>t.done).length}/{current.tasks.length})</div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:50, height:4, background:"#e5e7eb", borderRadius:2, overflow:"hidden" }}><div style={{ height:"100%", width:`${getProgress(current)}%`, background:"#6366f1", borderRadius:2, transition:"width 0.3s" }} /></div>
                    <span style={{ fontSize:11, color:"#9ca3af" }}>{getProgress(current)}%</span>
                  </div>
                </div>
                {current.tasks.map(task=>(
                  <div key={task.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", marginBottom:2, borderRadius:8 }}
                    onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div onClick={()=>toggleTask(current.id,task.id)}
                      style={{ width:18, height:18, borderRadius:4, border:task.done?"none":"1.5px solid #d1d5db", background:task.done?"#6366f1":"#fff", cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {task.done && <span style={{ color:"#fff", fontSize:11, fontWeight:700 }}>✓</span>}
                    </div>
                    <span style={{ flex:1, fontSize:13, color:task.done?"#9ca3af":"#374151", textDecoration:task.done?"line-through":"none" }}>{task.text}</span>
                    {members.length > 0 ? (
                      <select value={task.assignee} onChange={e=>{e.stopPropagation();updateTaskAssignee(current.id,task.id,e.target.value);}} onClick={e=>e.stopPropagation()}
                        style={{ width:90, padding:"2px 4px", background:"transparent", border:"1px solid transparent", borderRadius:4, color:task.assignee?"#6b7280":"#d1d5db", fontSize:11, outline:"none", cursor:"pointer" }}
                        onFocus={e=>e.currentTarget.style.borderColor="#e5e7eb"} onBlur={e=>e.currentTarget.style.borderColor="transparent"}>
                        <option value="">—</option>
                        {members.map(m=><option key={m} value={m}>{m}</option>)}
                      </select>
                    ) : (
                      <input placeholder="Assignee" value={task.assignee} onChange={e=>updateTaskAssignee(current.id,task.id,e.target.value)} onClick={e=>e.stopPropagation()}
                        style={{ width:80, padding:"3px 6px", background:"transparent", border:"1px solid transparent", borderRadius:4, color:"#9ca3af", fontSize:11, outline:"none", textAlign:"right" }}
                        onFocus={e=>e.currentTarget.style.borderColor="#e5e7eb"} onBlur={e=>e.currentTarget.style.borderColor="transparent"} />
                    )}
                    <div onClick={()=>deleteTask(current.id,task.id)} style={{ color:"#d1d5db", cursor:"pointer", fontSize:14, padding:"0 2px" }}
                      onMouseEnter={e=>e.currentTarget.style.color="#ef4444"} onMouseLeave={e=>e.currentTarget.style.color="#d1d5db"}>×</div>
                  </div>
                ))}
                {showAddTask ? (
                  <div style={{ display:"flex", gap:8, marginTop:8 }}>
                    <input value={newTaskText} onChange={e=>setNewTaskText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTask(current.id)} placeholder="New task..." autoFocus
                      style={{ flex:1, padding:"8px 12px", border:"1px solid #e5e7eb", borderRadius:8, fontSize:13, outline:"none" }} />
                    <button onClick={()=>addTask(current.id)} style={{ padding:"8px 14px", background:"#6366f1", color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:500, cursor:"pointer" }}>+</button>
                    <button onClick={()=>{setShowAddTask(false);setNewTaskText("");}} style={{ padding:"8px 12px", background:"#f3f4f6", color:"#6b7280", border:"none", borderRadius:8, fontSize:12, cursor:"pointer" }}>✕</button>
                  </div>
                ) : (
                  <div onClick={()=>setShowAddTask(true)} style={{ padding:"8px 10px", marginTop:4, borderRadius:8, color:"#9ca3af", fontSize:12, cursor:"pointer" }}
                    onMouseEnter={e=>e.currentTarget.style.color="#6366f1"} onMouseLeave={e=>e.currentTarget.style.color="#9ca3af"}>+ Add a task</div>
                )}
              </div>

              {/* Notes */}
              <div>
                <div style={{ fontSize:11, fontWeight:500, color:"#9ca3af", textTransform:"uppercase", letterSpacing:0.5, marginBottom:6 }}>Notes</div>
                {editingField==="notes" ? (
                  <textarea value={tempValue} onChange={e=>setTempValue(e.target.value)} onBlur={()=>saveEdit(current.id,"notes")} rows={4} autoFocus
                    style={{ width:"100%", padding:"8px 12px", border:"1px solid #e5e7eb", borderRadius:8, fontSize:13, lineHeight:1.5, outline:"none", resize:"vertical", fontFamily:"inherit", boxSizing:"border-box" }} />
                ) : (
                  <div onClick={()=>startEdit("notes",current.notes)}
                    style={{ padding:"8px 12px", border:"1px solid #f3f4f6", borderRadius:8, fontSize:13, lineHeight:1.5, color:current.notes?"#374151":"#d1d5db", cursor:"pointer", minHeight:60, whiteSpace:"pre-wrap" }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="#e5e7eb"} onMouseLeave={e=>e.currentTarget.style.borderColor="#f3f4f6"}>
                    {current.notes || "Add notes..."}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ─── MAIN LAYOUT ───
  return (
    <div style={{ fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", background:"#f8f9fb", color:"#1a1a2e", height:"100vh", display:"flex", overflow:"hidden" }}>
      {/* Sidebar */}
      <div style={{ width:220, background:"#fff", borderRight:"1px solid #e5e7eb", display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"20px 20px 16px", borderBottom:"1px solid #e5e7eb" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:14, fontWeight:700 }}>S</div>
            <div>
              <div style={{ fontWeight:600, fontSize:14, color:"#111827" }}>Strategy & Ops</div>
              <div style={{ fontSize:11, color:"#9ca3af" }}>Cross-functional projects</div>
            </div>
          </div>
        </div>
        <nav style={{ padding:"12px 8px", flex:1 }}>
          {[{key:"projects",icon:"📋",label:"Projects"},{key:"settings",icon:"⚙️",label:"Settings"}].map(item=>(
            <div key={item.key} onClick={()=>{setActivePage(item.key);setSelectedProject(null);}}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:8, marginBottom:2, background:activePage===item.key?"#f0f0ff":"transparent", color:activePage===item.key?"#6366f1":"#6b7280", fontWeight:activePage===item.key?600:400, fontSize:14, cursor:"pointer" }}>
              <span style={{ fontSize:16 }}>{item.icon}</span> {item.label}
            </div>
          ))}
        </nav>
        <div style={{ padding:16, borderTop:"1px solid #e5e7eb" }}>
          <div style={{ fontSize:11, color:"#9ca3af", marginBottom:6 }}>Overall progress</div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ flex:1, height:6, background:"#e5e7eb", borderRadius:3, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${totalTasks?Math.round(doneTasks/totalTasks*100):0}%`, background:"linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius:3, transition:"width 0.4s" }} />
            </div>
            <span style={{ fontSize:12, fontWeight:600, color:"#374151" }}>{totalTasks?Math.round(doneTasks/totalTasks*100):0}%</span>
          </div>
          <div style={{ fontSize:11, color:"#9ca3af", marginTop:4 }}>{doneTasks}/{totalTasks} tasks completed</div>
        </div>
      </div>
      {activePage==="projects" ? renderProjects() : renderSettings()}
    </div>
  );
}
