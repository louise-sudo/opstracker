import { useState } from "react";

const initialProjects = [
  {
    id: 1,
    name: "Enablement",
    category: "Produit & Industrie",
    status: "In Progress",
    priority: "High",
    owner: "",
    summary: "Enablement produit et industrie — structurer les ressources et processus pour accélérer l'adoption interne et la montée en compétences des équipes.",
    tasks: [
      { id: 1, text: "Mapper les besoins enablement par équipe", done: false, assignee: "" },
      { id: 2, text: "Créer le playbook produit", done: false, assignee: "" },
      { id: 3, text: "Organiser les sessions industry deep-dive", done: false, assignee: "" },
      { id: 4, text: "Mettre en place le feedback loop", done: false, assignee: "" },
    ],
    dueDate: "2026-04-30",
    notes: "",
  },
  {
    id: 2,
    name: "Legal / Trust Center",
    category: "Legal & Compliance",
    status: "Not Started",
    priority: "High",
    owner: "",
    summary: "Mise en place du Trust Center, révision des T&Cs, centralisation des assets juridiques pour fluidifier le cycle de vente.",
    tasks: [
      { id: 1, text: "Audit des T&Cs existants", done: false, assignee: "" },
      { id: 2, text: "Benchmark des Trust Centers concurrents", done: false, assignee: "" },
      { id: 3, text: "Sélection et setup de l'outil Trust Center", done: false, assignee: "" },
      { id: 4, text: "Rédaction / mise à jour des documents légaux", done: false, assignee: "" },
      { id: 5, text: "Go-live et communication interne", done: false, assignee: "" },
    ],
    dueDate: "2026-05-31",
    notes: "",
  },
  {
    id: 3,
    name: "Upsells Automation",
    category: "Revenue Operations",
    status: "In Progress",
    priority: "Medium",
    owner: "",
    summary: "Automatiser la visualisation de la data consos/seats/workspaces et créer le deck upsell standardisé pour accélérer l'expansion revenue.",
    tasks: [
      { id: 1, text: "Définir les métriques clés (consos, seats, workspaces)", done: false, assignee: "" },
      { id: 2, text: "Connecter les sources de données", done: false, assignee: "" },
      { id: 3, text: "Créer le dashboard automatisé", done: false, assignee: "" },
      { id: 4, text: "Designer le deck upsell template", done: false, assignee: "" },
      { id: 5, text: "Tester sur 3 comptes pilotes", done: false, assignee: "" },
    ],
    dueDate: "2026-03-31",
    notes: "",
  },
  {
    id: 4,
    name: "Data Vendors Management",
    category: "Procurement & Data",
    status: "Not Started",
    priority: "Medium",
    owner: "",
    summary: "Rationaliser et piloter les relations avec les fournisseurs de données — contrats, coûts, qualité, et roadmap d'intégration.",
    tasks: [
      { id: 1, text: "Inventaire complet des vendors actuels", done: false, assignee: "" },
      { id: 2, text: "Évaluation qualité / coût / overlap", done: false, assignee: "" },
      { id: 3, text: "Négociation / renouvellement contrats", done: false, assignee: "" },
      { id: 4, text: "Définir la gouvernance data vendors", done: false, assignee: "" },
    ],
    dueDate: "2026-06-30",
    notes: "",
  },
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

const categoryIcons = {
  "Produit & Industrie": "📦",
  "Legal & Compliance": "⚖️",
  "Revenue Operations": "📈",
  "Procurement & Data": "🗄️",
};

const sidebarItems = [
  { icon: "📊", label: "Dashboard", active: false },
  { icon: "📋", label: "Chantiers", active: true },
  { icon: "👥", label: "Équipe", active: false },
  { icon: "📈", label: "Analytics", active: false },
  { icon: "⚙️", label: "Settings", active: false },
];

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

  const updateProject = (id, field, value) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    if (selectedProject?.id === id) setSelectedProject((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTask = (projectId, taskId) => {
    const update = (p) => p.id === projectId ? { ...p, tasks: p.tasks.map((t) => t.id === taskId ? { ...t, done: !t.done } : t) } : p;
    setProjects((prev) => prev.map(update));
    if (selectedProject?.id === projectId) setSelectedProject((prev) => update(prev));
  };

  const updateTaskAssignee = (projectId, taskId, assignee) => {
    const update = (p) => p.id === projectId ? { ...p, tasks: p.tasks.map((t) => t.id === taskId ? { ...t, assignee } : t) } : p;
    setProjects((prev) => prev.map(update));
    if (selectedProject?.id === projectId) setSelectedProject((prev) => update(prev));
  };

  const addTask = (projectId) => {
    if (!newTaskText.trim()) return;
    const newTask = { id: Date.now(), text: newTaskText.trim(), done: false, assignee: "" };
    const update = (p) => p.id === projectId ? { ...p, tasks: [...p.tasks, newTask] } : p;
    setProjects((prev) => prev.map(update));
    if (selectedProject?.id === projectId) setSelectedProject((prev) => update(prev));
    setNewTaskText("");
    setShowAddTask(false);
  };

  const deleteTask = (projectId, taskId) => {
    const update = (p) => p.id === projectId ? { ...p, tasks: p.tasks.filter((t) => t.id !== taskId) } : p;
    setProjects((prev) => prev.map(update));
    if (selectedProject?.id === projectId) setSelectedProject((prev) => update(prev));
  };

  const addProject = () => {
    if (!newProject.name.trim()) return;
    const p = { id: Date.now(), name: newProject.name, category: newProject.category || "Général", status: "Not Started", priority: "Medium", owner: "", summary: newProject.summary, tasks: [], dueDate: "", notes: "" };
    setProjects((prev) => [...prev, p]);
    setNewProject({ name: "", category: "", summary: "" });
    setShowAddProject(false);
  };

  const deleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (selectedProject?.id === id) setSelectedProject(null);
  };

  const getProgress = (project) => {
    if (!project.tasks.length) return 0;
    return Math.round((project.tasks.filter((t) => t.done).length / project.tasks.length) * 100);
  };

  const startEdit = (field, value) => { setEditingField(field); setTempValue(value); };
  const saveEdit = (projectId, field) => { updateProject(projectId, field, tempValue); setEditingField(null); };

  const totalTasks = projects.reduce((a, p) => a + p.tasks.length, 0);
  const doneTasks = projects.reduce((a, p) => a + p.tasks.filter((t) => t.done).length, 0);

  let filtered = projects.filter((p) => {
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "All" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (sortField) {
    filtered = [...filtered].sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (sortField === "progress") { va = getProgress(a); vb = getProgress(b); }
      if (typeof va === "string") { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }

  const handleSort = (field) => {
    if (sortField === field) { setSortDir(sortDir === "asc" ? "desc" : "asc"); }
    else { setSortField(field); setSortDir("asc"); }
  };

  const current = selectedProject ? projects.find((p) => p.id === selectedProject.id) || selectedProject : null;

  const SortIcon = ({ field }) => (
    <span style={{ marginLeft: 4, opacity: sortField === field ? 1 : 0.3, fontSize: 10 }}>
      {sortField === field && sortDir === "desc" ? "▼" : "▲"}
    </span>
  );

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", background: "#f8f9fb", color: "#1a1a2e", minHeight: "100vh", display: "flex" }}>

      {/* Sidebar */}
      <div style={{ width: 220, background: "#fff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700 }}>S</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>Strategy & Ops</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>Chantiers transverses</div>
            </div>
          </div>
        </div>
        <nav style={{ padding: "12px 8px", flex: 1 }}>
          {sidebarItems.map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, marginBottom: 2,
              background: item.active ? "#f0f0ff" : "transparent", color: item.active ? "#6366f1" : "#6b7280",
              fontWeight: item.active ? 600 : 400, fontSize: 14, cursor: "pointer", transition: "all 0.15s",
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>
        <div style={{ padding: "16px", borderTop: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 6 }}>Progression globale</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, height: 6, background: "#e5e7eb", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${totalTasks ? Math.round(doneTasks / totalTasks * 100) : 0}%`, background: "linear-gradient(90deg, #6366f1, #8b5cf6)", borderRadius: 3, transition: "width 0.4s" }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{totalTasks ? Math.round(doneTasks / totalTasks * 100) : 0}%</span>
          </div>
          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{doneTasks}/{totalTasks} tâches complétées</div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top bar */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#6b7280" }}>
            <span style={{ fontWeight: 600, color: "#111827" }}>Chantiers</span>
            <span>›</span>
            <span>All ({projects.length})</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#9ca3af" }}>🔍</span>
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..."
                style={{ padding: "7px 12px 7px 32px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, color: "#374151", outline: "none", width: 180, background: "#f9fafb" }} />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: "7px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, color: "#374151", outline: "none", background: "#f9fafb", cursor: "pointer" }}>
              <option value="All">All statuses</option>
              {Object.keys(statusConfig).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={() => setShowAddProject(true)}
              style={{ padding: "7px 16px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16 }}>+</span> Nouveau chantier
            </button>
          </div>
        </div>

        {/* Add project modal */}
        {showAddProject && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowAddProject(false); }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
              <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 600, color: "#111827" }}>Nouveau chantier</h3>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 4 }}>Nom</label>
                <input value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} placeholder="Ex: Enablement produit" autoFocus
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 4 }}>Catégorie</label>
                <input value={newProject.category} onChange={(e) => setNewProject({ ...newProject, category: e.target.value })} placeholder="Ex: Revenue Operations"
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", display: "block", marginBottom: 4 }}>Résumé</label>
                <textarea value={newProject.summary} onChange={(e) => setNewProject({ ...newProject, summary: e.target.value })} rows={3} placeholder="Description du chantier..."
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => setShowAddProject(false)} style={{ padding: "9px 20px", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Annuler</button>
                <button onClick={addProject} style={{ padding: "9px 20px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Créer</button>
              </div>
            </div>
          </div>
        )}

        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Table */}
          <div style={{ flex: 1, overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  <th style={{ padding: "10px 24px", textAlign: "left", fontWeight: 500, fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, cursor: "pointer", userSelect: "none" }} onClick={() => handleSort("name")}>
                    Chantier <SortIcon field="name" />
                  </th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 500, fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, cursor: "pointer", userSelect: "none" }} onClick={() => handleSort("status")}>
                    Status <SortIcon field="status" />
                  </th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 500, fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, cursor: "pointer", userSelect: "none" }} onClick={() => handleSort("category")}>
                    Catégorie <SortIcon field="category" />
                  </th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 500, fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, cursor: "pointer", userSelect: "none" }} onClick={() => handleSort("priority")}>
                    Priorité <SortIcon field="priority" />
                  </th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 500, fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>Owner</th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 500, fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, cursor: "pointer", userSelect: "none" }} onClick={() => handleSort("progress")}>
                    Progress <SortIcon field="progress" />
                  </th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 500, fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>Deadline</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((project) => {
                  const sc = statusConfig[project.status];
                  const pc = priorityConfig[project.priority];
                  const progress = getProgress(project);
                  const isSelected = current?.id === project.id;
                  return (
                    <tr key={project.id} onClick={() => setSelectedProject(isSelected ? null : project)}
                      style={{ borderBottom: "1px solid #f3f4f6", cursor: "pointer", background: isSelected ? "#f8f7ff" : "#fff", transition: "background 0.15s" }}
                      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#fafafa"; }}
                      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "#fff"; }}>
                      <td style={{ padding: "14px 24px", fontWeight: 500, color: "#111827" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 16 }}>{categoryIcons[project.category] || "📁"}</span>
                          {project.name}
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, background: sc.bg, color: sc.text, fontSize: 12, fontWeight: 500 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot }} />
                          {project.status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: 13 }}>{project.category}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ padding: "3px 10px", borderRadius: 6, background: pc.bg, color: pc.text, fontSize: 12, fontWeight: 500 }}>{project.priority}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        {project.owner ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 600 }}>
                              {project.owner.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                            </div>
                            <span style={{ fontSize: 13, color: "#374151" }}>{project.owner}</span>
                          </div>
                        ) : (
                          <span style={{ color: "#d1d5db", fontSize: 13 }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 60, height: 5, background: "#e5e7eb", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${progress}%`, background: progress === 100 ? "#22c55e" : "#6366f1", borderRadius: 3, transition: "width 0.3s" }} />
                          </div>
                          <span style={{ fontSize: 12, color: "#6b7280", minWidth: 30 }}>{progress}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>
                        {project.dueDate ? new Date(project.dueDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: 40, color: "#9ca3af", fontSize: 14 }}>Aucun chantier trouvé</div>
            )}
          </div>

          {/* Detail Panel */}
          {current && (
            <div style={{ width: 400, borderLeft: "1px solid #e5e7eb", background: "#fff", overflow: "auto", flexShrink: 0 }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{current.category}</div>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#111827" }}>{current.name}</h2>
                </div>
                <button onClick={() => setSelectedProject(null)} style={{ background: "#f3f4f6", border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 12, color: "#6b7280" }}>✕</button>
              </div>

              <div style={{ padding: "20px 24px" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                  <select value={current.status} onChange={(e) => updateProject(current.id, "status", e.target.value)}
                    style={{ padding: "5px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, color: statusConfig[current.status].text, background: statusConfig[current.status].bg, cursor: "pointer", outline: "none", fontWeight: 500 }}>
                    {Object.keys(statusConfig).map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select value={current.priority} onChange={(e) => updateProject(current.id, "priority", e.target.value)}
                    style={{ padding: "5px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, color: priorityConfig[current.priority].text, background: priorityConfig[current.priority].bg, cursor: "pointer", outline: "none", fontWeight: 500 }}>
                    {["High", "Medium", "Low"].map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <input type="date" value={current.dueDate} onChange={(e) => updateProject(current.id, "dueDate", e.target.value)}
                    style={{ padding: "5px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, color: "#374151", outline: "none" }} />
                  <button onClick={() => deleteProject(current.id)}
                    style={{ padding: "5px 10px", border: "1px solid #fecaca", borderRadius: 8, fontSize: 12, color: "#dc2626", background: "#fef2f2", cursor: "pointer", marginLeft: "auto" }}>
                    Supprimer
                  </button>
                </div>

                {/* Owner */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Owner</div>
                  {editingField === "owner" ? (
                    <input value={tempValue} onChange={(e) => setTempValue(e.target.value)} onBlur={() => saveEdit(current.id, "owner")} onKeyDown={(e) => e.key === "Enter" && saveEdit(current.id, "owner")} autoFocus
                      style={{ width: "100%", padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                  ) : (
                    <div onClick={() => startEdit("owner", current.owner)}
                      style={{ padding: "8px 12px", border: "1px solid #f3f4f6", borderRadius: 8, fontSize: 13, color: current.owner ? "#111827" : "#d1d5db", cursor: "pointer", transition: "border 0.15s" }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = "#e5e7eb"}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = "#f3f4f6"}>
                      {current.owner || "Cliquer pour assigner..."}
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Résumé</div>
                  {editingField === "summary" ? (
                    <textarea value={tempValue} onChange={(e) => setTempValue(e.target.value)} onBlur={() => saveEdit(current.id, "summary")} rows={3} autoFocus
                      style={{ width: "100%", padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, lineHeight: 1.5, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
                  ) : (
                    <div onClick={() => startEdit("summary", current.summary)}
                      style={{ padding: "8px 12px", border: "1px solid #f3f4f6", borderRadius: 8, fontSize: 13, lineHeight: 1.5, color: current.summary ? "#374151" : "#d1d5db", cursor: "pointer", transition: "border 0.15s" }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = "#e5e7eb"}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = "#f3f4f6"}>
                      {current.summary || "Ajouter un résumé..."}
                    </div>
                  )}
                </div>

                {/* Tasks */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5 }}>
                      Tâches ({current.tasks.filter(t => t.done).length}/{current.tasks.length})
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 50, height: 4, background: "#e5e7eb", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${getProgress(current)}%`, background: "#6366f1", borderRadius: 2, transition: "width 0.3s" }} />
                      </div>
                      <span style={{ fontSize: 11, color: "#9ca3af" }}>{getProgress(current)}%</span>
                    </div>
                  </div>

                  {current.tasks.map((task) => (
                    <div key={task.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", marginBottom: 2, borderRadius: 8, transition: "background 0.15s" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                      <div onClick={() => toggleTask(current.id, task.id)}
                        style={{ width: 18, height: 18, borderRadius: 4, border: task.done ? "none" : "1.5px solid #d1d5db", background: task.done ? "#6366f1" : "#fff", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                        {task.done && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}
                      </div>
                      <span style={{ flex: 1, fontSize: 13, color: task.done ? "#9ca3af" : "#374151", textDecoration: task.done ? "line-through" : "none" }}>{task.text}</span>
                      <input placeholder="Assignee" value={task.assignee} onChange={(e) => updateTaskAssignee(current.id, task.id, e.target.value)} onClick={(e) => e.stopPropagation()}
                        style={{ width: 80, padding: "3px 6px", background: "transparent", border: "1px solid transparent", borderRadius: 4, color: "#9ca3af", fontSize: 11, outline: "none", textAlign: "right" }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#e5e7eb"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "transparent"} />
                      <div onClick={() => deleteTask(current.id, task.id)} style={{ color: "#d1d5db", cursor: "pointer", fontSize: 14, padding: "0 2px" }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#d1d5db"}>×</div>
                    </div>
                  ))}

                  {showAddTask ? (
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <input value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask(current.id)} placeholder="Nouvelle tâche..." autoFocus
                        style={{ flex: 1, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, outline: "none" }} />
                      <button onClick={() => addTask(current.id)} style={{ padding: "8px 14px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>+</button>
                      <button onClick={() => { setShowAddTask(false); setNewTaskText(""); }} style={{ padding: "8px 12px", background: "#f3f4f6", color: "#6b7280", border: "none", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>✕</button>
                    </div>
                  ) : (
                    <div onClick={() => setShowAddTask(true)}
                      style={{ padding: "8px 10px", marginTop: 4, borderRadius: 8, color: "#9ca3af", fontSize: 12, cursor: "pointer" }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "#6366f1"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "#9ca3af"}>
                      + Ajouter une tâche
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Notes</div>
                  {editingField === "notes" ? (
                    <textarea value={tempValue} onChange={(e) => setTempValue(e.target.value)} onBlur={() => saveEdit(current.id, "notes")} rows={4} autoFocus
                      style={{ width: "100%", padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, lineHeight: 1.5, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
                  ) : (
                    <div onClick={() => startEdit("notes", current.notes)}
                      style={{ padding: "8px 12px", border: "1px solid #f3f4f6", borderRadius: 8, fontSize: 13, lineHeight: 1.5, color: current.notes ? "#374151" : "#d1d5db", cursor: "pointer", minHeight: 60, whiteSpace: "pre-wrap", transition: "border 0.15s" }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = "#e5e7eb"}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = "#f3f4f6"}>
                      {current.notes || "Ajouter des notes..."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
