import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import { toast } from "sonner";
import { CheckCircle, XCircle, Search, RefreshCw, Lock, Image as ImageIcon, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types
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
}

const AdminDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("pending");
    const [search, setSearch] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email === "pmec@2045" && password === "4024") {
            setIsAuthenticated(true);
            fetchRegistrations();
            toast.success("Admin Access Granted");
        } else {
            toast.error("Invalid Credentials");
        }
    };

    const fetchRegistrations = async () => {
        setIsLoading(true);
        try {
            let query = supabase
                .from("registrations")
                .select("*")
                .order("created_at", { ascending: false });

            if (filter !== "all") {
                query = query.eq("status", filter);
            }

            const { data, error } = await query;
            if (error) throw error;
            setRegistrations(data || []);
        } catch (error: any) {
            toast.error("Failed to load: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) fetchRegistrations();
    }, [filter, isAuthenticated]);

    const handleApprove = async (reg: Registration) => {
        if (!confirm(`Approve ${reg.team_name}?`)) return;
        const toastId = toast.loading("Processing approval...");
        try {
            const { error } = await supabase.functions.invoke('register-team', {
                body: {
                    action: 'APPROVE',
                    payload: { id: reg.id, email: reg.email, event: reg.event_id, leaderName: reg.leader_name, teamName: reg.team_name, utr: reg.payment_txn_id }
                }
            });
            if (error) throw error;
            toast.dismiss(toastId);
            toast.success("Approved & Email Sent!");
            fetchRegistrations();
        } catch (error: any) {
            toast.dismiss(toastId);
            toast.error("Error: " + error.message);
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm("Reject this registration?")) return;
        const { error } = await supabase.from('registrations').update({ status: 'rejected' }).eq('id', id);
        if (error) toast.error("Failed");
        else {
            toast.success("Rejected");
            fetchRegistrations();
        }
    };

    const filteredRegs = registrations.filter(r =>
        r.team_name?.toLowerCase().includes(search.toLowerCase()) ||
        r.leader_name?.toLowerCase().includes(search.toLowerCase()) ||
        r.payment_txn_id?.toLowerCase().includes(search.toLowerCase()) ||
        r.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#020c1b] flex items-center justify-center p-4 relative overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#00D9FF]/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#64ffda]/10 rounded-full blur-[100px]" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-[#112240]/80 backdrop-blur-xl p-8 rounded-3xl border border-[#00D9FF]/30 shadow-[0_0_50px_rgba(0,217,255,0.15)] max-w-sm w-full relative z-10"
                >
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-[#00D9FF]/10 rounded-2xl border border-[#00D9FF]/20">
                            <Lock className="w-8 h-8 text-[#00D9FF]" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-slate-100 mb-2">Restricted Access</h2>
                    <p className="text-center text-slate-400 mb-8 text-sm">Authorized Personnel Only</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-3">
                            <div className="relative group">
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder=" "
                                    className="peer w-full px-4 py-3 bg-[#0a192f] border border-slate-700 rounded-xl text-white focus:border-[#00D9FF] outline-none transition-all group-hover:border-slate-600" required />
                                <label className="absolute left-4 top-3 text-slate-500 text-sm transition-all peer-focus:-top-2.5 peer-focus:bg-[#112240] peer-focus:px-1 peer-focus:text-[#00D9FF] peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:bg-[#112240] peer-not-placeholder-shown:px-1 peer-not-placeholder-shown:text-slate-400 pointer-events-none">Email ID</label>
                            </div>
                            <div className="relative group">
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder=" "
                                    className="peer w-full px-4 py-3 bg-[#0a192f] border border-slate-700 rounded-xl text-white focus:border-[#00D9FF] outline-none transition-all group-hover:border-slate-600" required />
                                <label className="absolute left-4 top-3 text-slate-500 text-sm transition-all peer-focus:-top-2.5 peer-focus:bg-[#112240] peer-focus:px-1 peer-focus:text-[#00D9FF] peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:bg-[#112240] peer-not-placeholder-shown:px-1 peer-not-placeholder-shown:text-slate-400 pointer-events-none">Access Code</label>
                            </div>
                        </div>
                        <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-[#00D9FF] to-[#00A3FF] hover:from-[#00c3e6] hover:to-[#0092e6] text-black font-bold rounded-xl shadow-lg shadow-[#00D9FF]/20 transition-all transform active:scale-[0.98]">
                            Authenticate
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020c1b] text-slate-300 font-sans selection:bg-[#00D9FF]/30 overflow-x-hidden relative">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-[#00D9FF]/5 rounded-full blur-[120px]" />
            </div>

            {/* Navbar */}
            <header className="sticky top-0 z-40 bg-[#0a192f]/80 backdrop-blur-lg border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#00D9FF] to-[#0080FF] rounded-lg flex items-center justify-center font-bold text-black text-xl">Ck</div>
                    <h1 className="text-xl font-bold text-white tracking-wide">
                        CODEKRITI <span className="text-[#00D9FF] opacity-80 font-normal">ADMIN</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:block text-xs text-slate-500 bg-[#112240] px-3 py-1 rounded-full border border-white/5">
                        Logged in as <span className="text-white">{email}</span>
                    </div>
                    <button onClick={() => setIsAuthenticated(false)} className="text-sm bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-lg transition-colors border border-red-500/20">
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 relative z-10">
                {/* Image Modal */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                            onClick={() => setSelectedImage(null)}
                        >
                            <motion.img
                                initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
                                src={selectedImage}
                                className="max-w-full max-h-[90vh] rounded-xl border-2 border-[#00D9FF]/50 shadow-[0_0_100px_rgba(0,217,255,0.3)]"
                            />
                            <button className="absolute top-6 right-6 text-white bg-white/10 p-2 rounded-full hover:bg-white/20">
                                <XCircle className="w-8 h-8" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-[#112240]/50 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                    <div className="flex gap-2 p-1 bg-[#0a192f] rounded-xl border border-white/5">
                        {['pending', 'success', 'rejected', 'all'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-[#00D9FF] text-black shadow-[0_0_20px_rgba(0,217,255,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2.5 bg-[#0a192f] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D9FF]/50 placeholder:text-slate-600 transition-all"
                            />
                        </div>
                        <button onClick={fetchRegistrations} className="p-2.5 bg-[#0a192f] border border-white/10 rounded-xl hover:bg-white/5 text-slate-400 hover:text-[#00D9FF] transition-colors">
                            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Grid Layout for Desktop, Cards for Mobile */}
                <div className="grid grid-cols-1 gap-6">
                    {filteredRegs.map((reg, idx) => (
                        <motion.div
                            key={reg.id}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                            className="bg-[#112240]/60 backdrop-blur-sm rounded-2xl border border-white/5 p-6 hover:border-[#00D9FF]/30 transition-all group shadow-xl"
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                {/* Left: Info */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-xl font-bold text-white group-hover:text-[#00D9FF] transition-colors">{reg.team_name}</h3>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${reg.status === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                    reg.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                    }`}>
                                                    {reg.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-400 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]"></span> {reg.event_id}
                                                <span className="text-slate-600">|</span>
                                                Leader: {reg.leader_name}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0a192f]/50 p-4 rounded-xl border border-white/5">
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Contact</p>
                                            <p className="text-sm text-slate-200">{reg.email}</p>
                                            <p className="text-sm text-slate-200">{reg.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Transaction</p>
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="w-3 h-3 text-[#00D9FF]" />
                                                <span className="text-sm font-mono text-[#00D9FF]">{reg.payment_txn_id || 'N/A'}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">{new Date(reg.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Media & Actions */}
                                <div className="flex flex-col items-start md:items-end gap-4 min-w-[200px]">
                                    {/* Action Buttons */}
                                    {reg.status === 'pending' && (
                                        <div className="flex w-full gap-2">
                                            <button
                                                onClick={() => handleApprove(reg)}
                                                className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle className="w-4 h-4" /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(reg.id)}
                                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-2.5 px-4 rounded-xl transition-all"
                                            >
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}

                                    {/* Screenshot Thumbnail */}
                                    <div className="w-full relative group/img overflow-hidden rounded-xl bg-[#0a192f] border border-white/10 aspect-video md:aspect-auto md:h-32 flex items-center justify-center cursor-pointer"
                                        onClick={() => setSelectedImage(reg.payment_screenshot_url || reg.screenshot_url || null)}
                                    >
                                        {(reg.payment_screenshot_url || reg.screenshot_url) ? (
                                            <>
                                                <img
                                                    src={reg.payment_screenshot_url || reg.screenshot_url}
                                                    alt="Proof"
                                                    className="w-full h-full object-cover opacity-80 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all duration-500"
                                                />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                                    <div className="bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/20 text-white">
                                                        <ImageIcon className="w-5 h-5" />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center p-4">
                                                <ImageIcon className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                                                <span className="text-xs text-slate-600 block">No Screenshot</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {filteredRegs.length === 0 && (
                        <div className="text-center py-20">
                            <div className="bg-[#112240] p-6 rounded-full inline-block mb-4">
                                <Search className="w-10 h-10 text-slate-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-400">No registrations found</h3>
                            <p className="text-slate-500">Try adjusting your filters.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
