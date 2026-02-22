import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabaseClient";
import { toast } from "sonner";
import {
    CheckCircle, XCircle, Search, RefreshCw, Lock, Eye, EyeOff,
    Image as ImageIcon, CreditCard, ChevronDown, ChevronUp, BookOpen,
    Copy, Check, ExternalLink, Download, Users, TrendingUp,
    Clock, BarChart2, Activity, LogOut, X, LayoutDashboard,
    ClipboardList, Filter, ArrowUpDown, ChevronLeft, ChevronRight,
    AlertTriangle, Inbox
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Registration {
    id: string;
    created_at: string;
    team_name: string;
    leader_name: string;
    email: string;
    phone: string;
    event_id: string;
    status: string;
    payment_txn_id: string;
    payment_screenshot_url: string;
    screenshot_url?: string;
    amount: number;
    problem_statement?: string;
    solution?: string;
    members?: {
        name: string;
        email: string;
        phone: string;
        college: string;
        branch: string;
        year: string;
    }[];
}

type SortKey = "date" | "name" | "amount";
type AdminView = "dashboard" | "registrations";

// ─── Utility ─────────────────────────────────────────────────────────────────
const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });

const exportCSV = (rows: Registration[]) => {
    const header = ["ID", "Date", "Team", "Leader", "Email", "Phone", "Event", "Status", "UTR", "Amount", "Members"];
    const lines = rows.map(r => [
        r.id, formatDate(r.created_at), r.team_name, r.leader_name,
        r.email, r.phone, r.event_id, r.status, r.payment_txn_id,
        r.amount, r.members?.length ?? 0
    ].map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","));
    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `codekriti_registrations_${Date.now()}.csv`;
    a.click(); URL.revokeObjectURL(url);
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Copy-to-clipboard pill */
const CopyField = ({ value, label }: { value: string; label?: string }) => {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };
    return (
        <span className="group inline-flex items-center gap-1.5 cursor-pointer select-none" onClick={copy}>
            <span className="text-sm text-slate-200 font-mono break-all">{label ?? value}</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                {copied
                    ? <Check className="w-3.5 h-3.5 text-green-400" />
                    : <Copy className="w-3.5 h-3.5 text-slate-500 hover:text-[#00D9FF]" />}
            </span>
        </span>
    );
};

/** Status badge */
const StatusBadge = ({ status }: { status: string }) => {
    const cfg: Record<string, string> = {
        success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
        pending: "bg-amber-500/10 text-amber-400 border-amber-500/25",
        rejected: "bg-red-500/10 text-red-400 border-red-500/25",
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${cfg[status] ?? "bg-slate-500/10 text-slate-400 border-slate-500/25"}`}>
            {status}
        </span>
    );
};

/** Confirm modal */
const ConfirmModal = ({
    open, title, message, confirmLabel, confirmClass, onConfirm, onCancel
}: {
    open: boolean; title: string; message: string; confirmLabel: string;
    confirmClass?: string; onConfirm: () => void; onCancel: () => void;
}) => (
    <AnimatePresence>
        {open && (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                onClick={onCancel}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-[#112240] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white">{title}</h3>
                    </div>
                    <p className="text-slate-400 text-sm mb-6">{message}</p>
                    <div className="flex gap-3">
                        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                            Cancel
                        </button>
                        <button onClick={onConfirm} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${confirmClass ?? "bg-[#00D9FF] text-black hover:bg-[#00c0e6]"}`}>
                            {confirmLabel}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

/** Mini bar chart for event distribution */
const EventBarChart = ({ data }: { data: { event: string; count: number }[] }) => {
    const max = Math.max(...data.map(d => d.count), 1);
    return (
        <div className="space-y-2.5">
            {data.map(({ event, count }) => (
                <div key={event} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-28 truncate shrink-0">{event || "Unknown"}</span>
                    <div className="flex-1 h-5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(count / max) * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-[#00D9FF] to-[#0066FF] rounded-full"
                        />
                    </div>
                    <span className="text-xs font-bold text-slate-200 w-6 text-right">{count}</span>
                </div>
            ))}
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
    // ── Auth state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);

    // ── View & data
    const [view, setView] = useState<AdminView>("dashboard");
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // ── Filters / search / sort / pagination
    const [statusFilter, setStatusFilter] = useState("all");
    const [eventFilter, setEventFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("date");
    const [sortAsc, setSortAsc] = useState(false);
    const [page, setPage] = useState(1);
    const PER_PAGE = 10;

    // ── Expanded rows
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // ── Selection / bulk
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [bulkModal, setBulkModal] = useState<{ action: "approve" | "reject" } | null>(null);

    // ── Single-action confirm modals
    const [confirmModal, setConfirmModal] = useState<{
        id: string; name: string; action: "approve" | "reject"; reg?: Registration;
    } | null>(null);

    // ── Image modal
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // ─── Fetch ─────────────────────────────────────────────────────────────────
    const fetchRegistrations = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("registrations")
                .select("*")
                .order("created_at", { ascending: false });
            if (error) throw error;
            setRegistrations(data || []);
        } catch (err: any) {
            toast.error("Failed to load: " + err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) fetchRegistrations();
    }, [isAuthenticated, fetchRegistrations]);

    // ─── Real-time subscription ────────────────────────────────────────────────
    useEffect(() => {
        if (!isAuthenticated) return;

        const channel = supabase
            .channel("admin_registrations_rt")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "registrations" },
                (payload) => {
                    const r = payload.new as Registration;
                    setRegistrations(prev => [r, ...prev]);
                    toast.success(`New registration: ${r.team_name} (${r.event_id})`, {
                        description: `By ${r.leader_name}`,
                        duration: 5000,
                    });
                }
            )
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "registrations" },
                (payload) => {
                    const r = payload.new as Registration;
                    setRegistrations(prev => prev.map(x => x.id === r.id ? r : x));
                }
            )
            .on(
                "postgres_changes",
                { event: "DELETE", schema: "public", table: "registrations" },
                (payload) => {
                    const id = payload.old?.id;
                    if (id) setRegistrations(prev => prev.filter(x => x.id !== id));
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [isAuthenticated]);

    // ─── Actions ───────────────────────────────────────────────────────────────
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginLoading(true);
        await new Promise(r => setTimeout(r, 500));
        if (loginEmail === "pmec@2045" && loginPassword === "4024") {
            setIsAuthenticated(true);
            toast.success("Access Granted");
        } else {
            toast.error("Invalid credentials");
        }
        setLoginLoading(false);
    };

    const doApprove = async (reg: Registration) => {
        const tid = toast.loading(`Approving ${reg.team_name}…`);
        try {
            const { error } = await supabase.functions.invoke("register-team", {
                body: {
                    action: "APPROVE",
                    payload: { id: reg.id, email: reg.email, event: reg.event_id, leaderName: reg.leader_name, teamName: reg.team_name, utr: reg.payment_txn_id }
                }
            });
            if (error) throw error;
            toast.dismiss(tid);
            toast.success("Approved & confirmation email sent!");
            setRegistrations(prev => prev.map(r => r.id === reg.id ? { ...r, status: "success" } : r));
        } catch (err: any) {
            toast.dismiss(tid);
            toast.error("Approve failed: " + err.message);
        }
    };

    const doReject = async (id: string) => {
        const tid = toast.loading("Rejecting…");
        try {
            const { error } = await supabase.functions.invoke("register-team", {
                body: { action: "REJECT", payload: { id } }
            });
            if (error) throw error;
            toast.dismiss(tid);
            toast.success("Registration rejected");
            setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: "rejected" } : r));
        } catch (err: any) {
            toast.dismiss(tid);
            toast.error("Reject failed: " + err.message);
        }
    };

    const handleBulkAction = async () => {
        if (!bulkModal) return;
        setBulkModal(null);
        const ids = [...selected];
        const action = bulkModal.action;
        toast.loading(`Processing ${ids.length} registrations…`, { id: "bulk" });
        for (const id of ids) {
            const reg = registrations.find(r => r.id === id);
            if (!reg) continue;
            if (action === "approve") await doApprove(reg);
            else await doReject(id);
        }
        toast.dismiss("bulk");
        toast.success(`Bulk ${action} done`);
        setSelected(new Set());
    };

    // ─── Derived data ──────────────────────────────────────────────────────────
    const allEvents = ["all", ...Array.from(new Set(registrations.map(r => r.event_id).filter(Boolean)))];

    const stats = {
        total: registrations.length,
        pending: registrations.filter(r => r.status === "pending").length,
        approved: registrations.filter(r => r.status === "success").length,
        rejected: registrations.filter(r => r.status === "rejected").length,
        revenue: registrations.filter(r => r.status === "success").reduce((s, r) => s + (r.amount || 0), 0),
    };

    const eventCounts = Object.entries(
        registrations.reduce((acc, r) => {
            acc[r.event_id ?? "Unknown"] = (acc[r.event_id ?? "Unknown"] ?? 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    ).map(([event, count]) => ({ event, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

    // Filtered + sorted list for registrations view
    const filtered = registrations
        .filter(r => statusFilter === "all" || r.status === statusFilter)
        .filter(r => eventFilter === "all" || r.event_id === eventFilter)
        .filter(r => {
            if (!search) return true;
            const q = search.toLowerCase();
            return (
                r.team_name?.toLowerCase().includes(q) ||
                r.leader_name?.toLowerCase().includes(q) ||
                r.email?.toLowerCase().includes(q) ||
                r.payment_txn_id?.toLowerCase().includes(q) ||
                r.phone?.toLowerCase().includes(q)
            );
        })
        .sort((a, b) => {
            let cmp = 0;
            if (sortKey === "date") cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            else if (sortKey === "name") cmp = (a.team_name ?? "").localeCompare(b.team_name ?? "");
            else if (sortKey === "amount") cmp = (a.amount ?? 0) - (b.amount ?? 0);
            return sortAsc ? cmp : -cmp;
        });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const statusCounts: Record<string, number> = {
        all: registrations.length,
        pending: stats.pending,
        success: stats.approved,
        rejected: stats.rejected,
    };

    const pageSelected = paginated.every(r => selected.has(r.id)) && paginated.length > 0;
    const togglePageSelect = () => {
        if (pageSelected) {
            setSelected(prev => { const s = new Set(prev); paginated.forEach(r => s.delete(r.id)); return s; });
        } else {
            setSelected(prev => { const s = new Set(prev); paginated.forEach(r => s.add(r.id)); return s; });
        }
    };

    // ─── LOGIN SCREEN ──────────────────────────────────────────────────────────
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#020c1b] flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#00D9FF]/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#64ffda]/10 rounded-full blur-[120px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0d1f3c]/90 backdrop-blur-xl p-8 rounded-3xl border border-[#00D9FF]/20 shadow-[0_0_60px_rgba(0,217,255,0.12)] max-w-sm w-full relative z-10"
                >
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-[#00D9FF]/10 rounded-2xl border border-[#00D9FF]/20 shadow-[0_0_20px_rgba(0,217,255,0.15)]">
                            <Lock className="w-8 h-8 text-[#00D9FF]" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-white mb-1">Restricted Access</h2>
                    <p className="text-center text-slate-500 mb-8 text-sm">Authorized Personnel Only</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Email */}
                        <div className="relative">
                            <input
                                type="text" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                                placeholder="Admin ID"
                                className="w-full px-4 py-3.5 bg-[#0a192f] border border-slate-700/80 rounded-xl text-white text-sm placeholder:text-slate-600 focus:border-[#00D9FF]/60 focus:ring-2 focus:ring-[#00D9FF]/10 outline-none transition-all"
                                required autoComplete="username"
                            />
                        </div>
                        {/* Password with show/hide */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"} value={loginPassword}
                                onChange={e => setLoginPassword(e.target.value)}
                                placeholder="Access Code"
                                className="w-full px-4 py-3.5 pr-12 bg-[#0a192f] border border-slate-700/80 rounded-xl text-white text-sm placeholder:text-slate-600 focus:border-[#00D9FF]/60 focus:ring-2 focus:ring-[#00D9FF]/10 outline-none transition-all"
                                required autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#00D9FF] transition-colors p-0.5"
                            >
                                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                            </button>
                        </div>

                        <button
                            type="submit" disabled={loginLoading}
                            className="w-full py-3.5 bg-gradient-to-r from-[#00D9FF] to-[#0077FF] hover:from-[#00c0e6] hover:to-[#0069e6] text-black font-bold rounded-xl shadow-lg shadow-[#00D9FF]/20 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loginLoading ? (
                                <><RefreshCw className="w-4 h-4 animate-spin" /> Authenticating…</>
                            ) : "Authenticate"}
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    // ─── MAIN DASHBOARD ────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#020c1b] text-slate-300 font-sans selection:bg-[#00D9FF]/20 overflow-x-hidden relative">
            {/* Ambient glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#00D9FF]/4 rounded-full blur-[140px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#0050ff]/4 rounded-full blur-[140px]" />
            </div>

            {/* ── Topbar ─────────────────────────────────────────────────────── */}
            <header className="sticky top-0 z-40 bg-[#08172e]/90 backdrop-blur-lg border-b border-white/5 px-4 md:px-8 py-0 flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-[#00D9FF] to-[#0055FF] rounded-lg flex items-center justify-center font-extrabold text-black text-sm shadow-lg shadow-[#00D9FF]/20">
                        Ck
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="text-base font-bold text-white leading-none tracking-wide">CODEKRITI</h1>
                        <p className="text-[10px] text-[#00D9FF]/70 font-medium tracking-widest uppercase">Admin Panel</p>
                    </div>
                </div>

                {/* Nav tabs */}
                <nav className="flex items-center bg-white/5 border border-white/8 rounded-xl p-1 gap-1">
                    {([
                        { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
                        { id: "registrations", icon: ClipboardList, label: "Registrations" },
                    ] as { id: AdminView; icon: any; label: string }[]).map(({ id, icon: Icon, label }) => (
                        <button
                            key={id} onClick={() => setView(id)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${view === id ? "bg-[#00D9FF] text-black shadow-md" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{label}</span>
                        </button>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <span className="hidden lg:block text-xs text-slate-500 bg-white/5 border border-white/8 px-3 py-1.5 rounded-lg">
                        {loginEmail}
                    </span>
                    <button
                        onClick={() => { setIsAuthenticated(false); setRegistrations([]); }}
                        className="flex items-center gap-1.5 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-2 rounded-lg transition-colors border border-red-500/20"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>

            {/* ── Image Modal ────────────────────────────────────────────────── */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
                            className="relative max-w-3xl w-full"
                            onClick={e => e.stopPropagation()}
                        >
                            <img src={selectedImage} alt="Payment proof"
                                className="w-full max-h-[85vh] object-contain rounded-2xl border border-[#00D9FF]/30 shadow-[0_0_80px_rgba(0,217,255,0.2)]"
                            />
                            <div className="absolute top-3 right-3 flex gap-2">
                                <a href={selectedImage} target="_blank" rel="noreferrer"
                                    className="p-2 bg-black/60 hover:bg-black/80 border border-white/20 rounded-full text-white transition-colors"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                                <button onClick={() => setSelectedImage(null)}
                                    className="p-2 bg-black/60 hover:bg-black/80 border border-white/20 rounded-full text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Confirm modal (single action) ──────────────────────────────── */}
            <ConfirmModal
                open={!!confirmModal}
                title={confirmModal?.action === "approve" ? "Approve Registration?" : "Reject Registration?"}
                message={`${confirmModal?.action === "approve" ? "Approve" : "Reject"} registration for "${confirmModal?.name}"? A confirmation email will be sent.`}
                confirmLabel={confirmModal?.action === "approve" ? "Yes, Approve" : "Yes, Reject"}
                confirmClass={confirmModal?.action === "approve"
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"}
                onCancel={() => setConfirmModal(null)}
                onConfirm={() => {
                    if (!confirmModal) return;
                    if (confirmModal.action === "approve" && confirmModal.reg) doApprove(confirmModal.reg);
                    else doReject(confirmModal.id);
                    setConfirmModal(null);
                }}
            />

            {/* ── Confirm modal (bulk) ───────────────────────────────────────── */}
            <ConfirmModal
                open={!!bulkModal}
                title={`Bulk ${bulkModal?.action === "approve" ? "Approve" : "Reject"} ${selected.size} Registrations?`}
                message={`This will ${bulkModal?.action} all ${selected.size} selected registrations. Confirmation emails will be sent for approvals.`}
                confirmLabel={`${bulkModal?.action === "approve" ? "Approve" : "Reject"} All`}
                confirmClass={bulkModal?.action === "approve"
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"}
                onCancel={() => setBulkModal(null)}
                onConfirm={handleBulkAction}
            />

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 relative z-10">

                {/* ════════════════════════════════════════════════════════════
                    DASHBOARD VIEW
                ════════════════════════════════════════════════════════════ */}
                <AnimatePresence mode="wait">
                    {view === "dashboard" && (
                        <motion.div key="dashboard" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-8">

                            {/* Stats grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                                {[
                                    { label: "Total", value: stats.total, icon: Users, color: "#00D9FF", glow: "rgba(0,217,255,0.15)" },
                                    { label: "Pending", value: stats.pending, icon: Clock, color: "#f59e0b", glow: "rgba(245,158,11,0.15)" },
                                    { label: "Approved", value: stats.approved, icon: CheckCircle, color: "#10b981", glow: "rgba(16,185,129,0.15)" },
                                    { label: "Rejected", value: stats.rejected, icon: XCircle, color: "#ef4444", glow: "rgba(239,68,68,0.15)" },
                                    { label: "Revenue", value: `₹${stats.revenue.toLocaleString("en-IN")}`, icon: TrendingUp, color: "#a855f7", glow: "rgba(168,85,247,0.15)", span: true },
                                ].map(({ label, value, icon: Icon, color, glow, span }) => (
                                    <motion.div
                                        key={label}
                                        whileHover={{ scale: 1.02 }}
                                        className={`bg-[#0d1f3c]/80 border border-white/8 rounded-2xl p-5 flex items-center gap-4 ${span ? "col-span-2 lg:col-span-1" : ""}`}
                                        style={{ boxShadow: `0 0 30px ${glow}` }}
                                    >
                                        <div className="p-3 rounded-xl shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                                            <Icon className="w-5 h-5" style={{ color }} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">{label}</p>
                                            <p className="text-2xl font-black text-white">{value}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Status breakdown + Event chart */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Status breakdown bars */}
                                <div className="bg-[#0d1f3c]/80 border border-white/8 rounded-2xl p-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Activity className="w-4 h-4 text-[#00D9FF]" />
                                        <h3 className="text-sm font-bold text-white">Status Breakdown</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { label: "Approved", val: stats.approved, color: "#10b981" },
                                            { label: "Pending", val: stats.pending, color: "#f59e0b" },
                                            { label: "Rejected", val: stats.rejected, color: "#ef4444" },
                                        ].map(({ label, val, color }) => (
                                            <div key={label}>
                                                <div className="flex justify-between text-xs mb-1.5">
                                                    <span className="text-slate-400">{label}</span>
                                                    <span className="font-bold text-slate-200">{val} <span className="text-slate-600 font-normal">({stats.total ? Math.round((val / stats.total) * 100) : 0}%)</span></span>
                                                </div>
                                                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${stats.total ? (val / stats.total) * 100 : 0}%` }}
                                                        transition={{ duration: 0.9, ease: "easeOut" }}
                                                        className="h-full rounded-full"
                                                        style={{ background: color }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Registrations by event */}
                                <div className="bg-[#0d1f3c]/80 border border-white/8 rounded-2xl p-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <BarChart2 className="w-4 h-4 text-[#00D9FF]" />
                                        <h3 className="text-sm font-bold text-white">Registrations by Event</h3>
                                    </div>
                                    {eventCounts.length > 0
                                        ? <EventBarChart data={eventCounts} />
                                        : <p className="text-slate-600 text-sm text-center py-4">No data yet</p>
                                    }
                                </div>
                            </div>

                            {/* CTA Banner */}
                            {stats.pending > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center justify-between bg-amber-500/10 border border-amber-500/25 rounded-2xl px-6 py-5"
                                >
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                                        <div>
                                            <p className="text-sm font-bold text-amber-300">{stats.pending} registration{stats.pending > 1 ? "s" : ""} awaiting review</p>
                                            <p className="text-xs text-slate-500">Review and approve or reject pending submissions</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setView("registrations"); setStatusFilter("pending"); }}
                                        className="shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl transition-colors"
                                    >
                                        Review Now
                                    </button>
                                </motion.div>
                            )}

                            {/* Latest 5 registrations */}
                            <div className="bg-[#0d1f3c]/80 border border-white/8 rounded-2xl overflow-hidden">
                                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                        <Inbox className="w-4 h-4 text-[#00D9FF]" /> Latest Registrations
                                    </h3>
                                    <button onClick={() => setView("registrations")} className="text-xs text-[#00D9FF] hover:underline font-medium">
                                        View all →
                                    </button>
                                </div>
                                <div className="divide-y divide-white/5">
                                    {registrations.slice(0, 5).map((reg) => (
                                        <div key={reg.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00D9FF]/20 to-[#0055FF]/20 border border-[#00D9FF]/20 flex items-center justify-center shrink-0">
                                                    <span className="text-xs font-bold text-[#00D9FF]">{(reg.team_name ?? "?")[0].toUpperCase()}</span>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-white truncate">{reg.team_name}</p>
                                                    <p className="text-xs text-slate-500 truncate">{reg.event_id} · {reg.leader_name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0 ml-4">
                                                <StatusBadge status={reg.status} />
                                                <span className="text-xs text-slate-600 hidden md:block">{formatDate(reg.created_at)}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {registrations.length === 0 && (
                                        <div className="py-10 text-center text-slate-600 text-sm">No registrations yet</div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ════════════════════════════════════════════════════════════
                        REGISTRATIONS VIEW
                    ════════════════════════════════════════════════════════════ */}
                    {view === "registrations" && (
                        <motion.div key="registrations" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-6">

                            {/* Controls bar */}
                            <div className="bg-[#0d1f3c]/80 border border-white/8 rounded-2xl p-4 space-y-4">
                                {/* Status tabs */}
                                <div className="flex flex-wrap gap-1.5">
                                    {["all", "pending", "success", "rejected"].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => { setStatusFilter(s); setPage(1); }}
                                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${statusFilter === s ? "bg-[#00D9FF] text-black" : "bg-white/5 text-slate-400 hover:text-white border border-white/8"}`}
                                        >
                                            {s.charAt(0).toUpperCase() + s.slice(1)}
                                            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${statusFilter === s ? "bg-black/20 text-black/80" : "bg-white/10 text-slate-400"}`}>
                                                {statusCounts[s] ?? 0}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                {/* Search + filters row */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                                            placeholder="Search team, leader, email, UTR, phone…"
                                            className="w-full pl-10 pr-4 py-2.5 bg-[#0a192f] border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00D9FF]/50 transition-all"
                                        />
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        {/* Event filter */}
                                        <div className="relative">
                                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                                            <select
                                                value={eventFilter} onChange={e => { setEventFilter(e.target.value); setPage(1); }}
                                                className="pl-9 pr-8 py-2.5 bg-[#0a192f] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D9FF]/50 transition-all appearance-none cursor-pointer"
                                            >
                                                {allEvents.map(ev => <option key={ev} value={ev}>{ev === "all" ? "All Events" : ev}</option>)}
                                            </select>
                                        </div>
                                        {/* Sort */}
                                        <div className="relative">
                                            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                                            <select
                                                value={sortKey} onChange={e => { setSortKey(e.target.value as SortKey); setPage(1); }}
                                                className="pl-9 pr-8 py-2.5 bg-[#0a192f] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D9FF]/50 transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="date">Date</option>
                                                <option value="name">Name</option>
                                                <option value="amount">Amount</option>
                                            </select>
                                        </div>
                                        <button
                                            onClick={() => setSortAsc(p => !p)}
                                            title={sortAsc ? "Ascending" : "Descending"}
                                            className="p-2.5 bg-[#0a192f] border border-white/10 rounded-xl text-slate-400 hover:text-[#00D9FF] hover:border-[#00D9FF]/30 transition-all"
                                        >
                                            {sortAsc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>
                                        {/* Refresh */}
                                        <button onClick={fetchRegistrations} className="p-2.5 bg-[#0a192f] border border-white/10 rounded-xl text-slate-400 hover:text-[#00D9FF] hover:border-[#00D9FF]/30 transition-all">
                                            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Bulk action bar */}
                            <AnimatePresence>
                                {selected.size > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                        className="flex flex-wrap items-center justify-between gap-3 bg-[#00D9FF]/10 border border-[#00D9FF]/25 rounded-xl px-5 py-3"
                                    >
                                        <span className="text-sm text-[#00D9FF] font-semibold">{selected.size} selected</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setBulkModal({ action: "approve" })}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 rounded-xl text-xs font-bold transition-colors"
                                            >
                                                <CheckCircle className="w-3.5 h-3.5" /> Bulk Approve
                                            </button>
                                            <button
                                                onClick={() => setBulkModal({ action: "reject" })}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 rounded-xl text-xs font-bold transition-colors"
                                            >
                                                <XCircle className="w-3.5 h-3.5" /> Bulk Reject
                                            </button>
                                            <button onClick={() => setSelected(new Set())} className="px-3 py-2 bg-white/5 border border-white/10 text-slate-400 hover:text-white rounded-xl text-xs transition-colors">
                                                Clear
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Export + result count */}
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-slate-500">
                                    {filtered.length === 0 ? "No results" : `${filtered.length} result${filtered.length > 1 ? "s" : ""}`}
                                    {search && <span className="text-slate-600"> for "<span className="text-slate-400">{search}</span>"</span>}
                                </p>
                                <button
                                    onClick={() => exportCSV(filtered)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-[#0a192f] border border-white/10 hover:border-[#00D9FF]/30 text-slate-300 hover:text-[#00D9FF] rounded-xl text-xs font-semibold transition-all"
                                >
                                    <Download className="w-3.5 h-3.5" /> Export CSV
                                </button>
                            </div>

                            {/* ── Registration cards ─────────────────────────── */}
                            <div className="space-y-4">
                                {/* Select-all row */}
                                {paginated.length > 0 && (
                                    <div className="flex items-center gap-3 px-1">
                                        <input
                                            type="checkbox" checked={pageSelected} onChange={togglePageSelect}
                                            className="w-4 h-4 accent-[#00D9FF] cursor-pointer rounded"
                                        />
                                        <span className="text-xs text-slate-500">Select page ({paginated.length})</span>
                                    </div>
                                )}

                                {paginated.map((reg, idx) => (
                                    <motion.div
                                        key={reg.id}
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className={`bg-[#0d1f3c]/70 backdrop-blur-sm rounded-2xl border transition-all shadow-xl group ${selected.has(reg.id) ? "border-[#00D9FF]/40" : "border-white/8 hover:border-[#00D9FF]/20"}`}
                                    >
                                        <div className="p-5 md:p-6">
                                            <div className="flex flex-col lg:flex-row gap-6">
                                                {/* Checkbox + Info */}
                                                <div className="flex gap-4 flex-1 min-w-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={selected.has(reg.id)}
                                                        onChange={() => setSelected(prev => {
                                                            const s = new Set(prev);
                                                            s.has(reg.id) ? s.delete(reg.id) : s.add(reg.id);
                                                            return s;
                                                        })}
                                                        className="mt-1 w-4 h-4 accent-[#00D9FF] cursor-pointer rounded shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0 space-y-4">
                                                        {/* Header */}
                                                        <div className="flex flex-wrap items-start gap-2">
                                                            <h3 className="text-base font-bold text-white group-hover:text-[#00D9FF] transition-colors">{reg.team_name}</h3>
                                                            <StatusBadge status={reg.status} />
                                                        </div>
                                                        <p className="text-xs text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1">
                                                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] inline-block" />{reg.event_id}</span>
                                                            <span className="text-slate-700">·</span>
                                                            <span>Leader: <span className="text-slate-400">{reg.leader_name}</span></span>
                                                            <span className="text-slate-700">·</span>
                                                            <span>{formatDate(reg.created_at)}</span>
                                                        </p>

                                                        {/* Contact + Transaction grid */}
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#08172e]/60 p-4 rounded-xl border border-white/5">
                                                            <div>
                                                                <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-2 font-semibold">Contact</p>
                                                                <CopyField value={reg.email} />
                                                                <CopyField value={reg.phone} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-2 font-semibold">Payment</p>
                                                                <div className="flex items-center gap-1.5 mb-1">
                                                                    <CreditCard className="w-3 h-3 text-[#00D9FF] shrink-0" />
                                                                    <CopyField value={reg.payment_txn_id || "N/A"} label={reg.payment_txn_id || "N/A"} />
                                                                </div>
                                                                {reg.amount > 0 && (
                                                                    <p className="text-xs text-emerald-400 font-semibold">₹{reg.amount.toLocaleString("en-IN")}</p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Proposal (DevXtreme) */}
                                                        {(reg.problem_statement || reg.solution) && (
                                                            <div className="bg-[#08172e]/60 p-4 rounded-xl border border-orange-500/20">
                                                                <p className="text-[10px] text-orange-400/80 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
                                                                    <BookOpen className="w-3 h-3" /> Project Proposal
                                                                </p>
                                                                {reg.problem_statement && (
                                                                    <div className="mb-2">
                                                                        <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">Problem</p>
                                                                        <p className="text-xs text-slate-300 bg-[#0a192f] p-3 rounded-lg border border-white/5">{reg.problem_statement}</p>
                                                                    </div>
                                                                )}
                                                                {reg.solution && (
                                                                    <div>
                                                                        <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">Solution</p>
                                                                        <p className="text-xs text-slate-300 bg-[#0a192f] p-3 rounded-lg border border-white/5">{reg.solution}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Team members toggle */}
                                                        {reg.members && reg.members.length > 0 && (
                                                            <div>
                                                                <button
                                                                    onClick={() => setExpandedId(expandedId === reg.id ? null : reg.id)}
                                                                    className="flex items-center gap-1.5 text-[11px] font-bold text-[#00D9FF] hover:text-[#00c0e6] transition-colors uppercase tracking-wider"
                                                                >
                                                                    {expandedId === reg.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                                                    {expandedId === reg.id ? "Hide" : `View Team (${reg.members.length} members)`}
                                                                </button>
                                                                <AnimatePresence>
                                                                    {expandedId === reg.id && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                                                            className="overflow-hidden mt-3"
                                                                        >
                                                                            <div className="rounded-xl border border-white/8 overflow-hidden">
                                                                                <div className="overflow-x-auto">
                                                                                    <table className="w-full text-left text-xs text-slate-400 min-w-[480px]">
                                                                                        <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-500">
                                                                                            <tr>
                                                                                                {["Name", "Email", "Phone", "College", "Branch", "Year"].map(h => (
                                                                                                    <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                                                                                                ))}
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody className="divide-y divide-white/5">
                                                                                            {reg.members.map((m, i) => (
                                                                                                <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                                                                                                    <td className="px-4 py-3 font-semibold text-slate-200">{m.name}</td>
                                                                                                    <td className="px-4 py-3"><CopyField value={m.email} /></td>
                                                                                                    <td className="px-4 py-3 font-mono">{m.phone}</td>
                                                                                                    <td className="px-4 py-3">{m.college}</td>
                                                                                                    <td className="px-4 py-3">{m.branch}</td>
                                                                                                    <td className="px-4 py-3">{m.year}</td>
                                                                                                </tr>
                                                                                            ))}
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Right: screenshot + actions */}
                                                <div className="flex flex-row lg:flex-col items-start gap-3 lg:w-44 shrink-0">
                                                    {/* Approve / Reject */}
                                                    {reg.status === "pending" && (
                                                        <div className="flex lg:flex-col gap-2 w-full">
                                                            <button
                                                                onClick={() => setConfirmModal({ id: reg.id, name: reg.team_name, action: "approve", reg })}
                                                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold transition-all"
                                                            >
                                                                <CheckCircle className="w-3.5 h-3.5" /> Approve
                                                            </button>
                                                            <button
                                                                onClick={() => setConfirmModal({ id: reg.id, name: reg.team_name, action: "reject" })}
                                                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition-all"
                                                            >
                                                                <XCircle className="w-3.5 h-3.5" /> Reject
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Screenshot */}
                                                    <div
                                                        className="w-full lg:flex-1 relative group/img overflow-hidden rounded-xl bg-[#08172e] border border-white/8 aspect-video lg:aspect-auto lg:min-h-[90px] flex items-center justify-center cursor-pointer hover:border-[#00D9FF]/30 transition-all"
                                                        onClick={() => {
                                                            const url = reg.payment_screenshot_url || reg.screenshot_url;
                                                            if (url) setSelectedImage(url);
                                                        }}
                                                    >
                                                        {(reg.payment_screenshot_url || reg.screenshot_url) ? (
                                                            <>
                                                                <img
                                                                    src={reg.payment_screenshot_url || reg.screenshot_url}
                                                                    alt="Payment proof"
                                                                    className="w-full h-full object-cover opacity-75 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all duration-500"
                                                                />
                                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                                                    <div className="bg-black/60 backdrop-blur-md p-2 rounded-full border border-white/20">
                                                                        <ImageIcon className="w-4 h-4 text-white" />
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="text-center p-3">
                                                                <ImageIcon className="w-6 h-6 text-slate-700 mx-auto mb-1" />
                                                                <span className="text-[10px] text-slate-700 block">No Screenshot</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Empty state */}
                                {paginated.length === 0 && (
                                    <div className="text-center py-20">
                                        <div className="bg-[#0d1f3c] p-5 rounded-full inline-block mb-4 border border-white/8">
                                            <Search className="w-10 h-10 text-slate-700" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-400">No registrations found</h3>
                                        <p className="text-sm text-slate-600 mt-1">Try adjusting your filters or search query</p>
                                    </div>
                                )}
                            </div>

                            {/* ── Pagination ─────────────────────────────────── */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between pt-2">
                                    <p className="text-xs text-slate-500">
                                        Page {page} of {totalPages} · {filtered.length} total
                                    </p>
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 disabled:opacity-30 hover:text-white hover:border-[#00D9FF]/30 transition-all"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                                            const n = start + i;
                                            return (
                                                <button key={n} onClick={() => setPage(n)}
                                                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${n === page ? "bg-[#00D9FF] text-black" : "bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-[#00D9FF]/30"}`}
                                                >
                                                    {n}
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 disabled:opacity-30 hover:text-white hover:border-[#00D9FF]/30 transition-all"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AdminDashboard;
