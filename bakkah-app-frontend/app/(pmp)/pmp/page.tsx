export default function PmpDashboardPage() {
    return (
        <div className="animate-fade-in-up space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold text-[#1F2937] mb-2">Welcome back, User! 👋</h2>
                    <p className="text-gray-500 font-medium">Here is what's happening with your projects today.</p>
                </div>
            </div>

            {/* إحصائيات مبدئية */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <span className="text-[#1E5A7A] text-sm font-bold uppercase tracking-wider">Active Projects</span>
                    <p className="text-4xl font-black text-[#1F2937] mt-2">12</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <span className="text-[#B03052] text-sm font-bold uppercase tracking-wider">Tasks Due Soon</span>
                    <p className="text-4xl font-black text-[#1F2937] mt-2">5</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <span className="text-green-600 text-sm font-bold uppercase tracking-wider">Completed</span>
                    <p className="text-4xl font-black text-[#1F2937] mt-2">28</p>
                </div>
            </div>
        </div>
    );
}