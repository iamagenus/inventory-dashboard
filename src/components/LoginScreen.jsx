import { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginScreen = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate a network request delay (makes it feel real)
    setTimeout(() => {
      // 🔐 HARDCODED PASSWORD (Change this to whatever you want!)
      if (password === 'admin123') {
        onLogin(true);
        toast.success("Welcome back, Admin!");
      } else {
        toast.error("Incorrect password");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Inventory System</h1>
          <p className="text-slate-500 mt-2">Please enter your admin credentials.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="••••••••"
              autoFocus
            />
          </div>

          <button 
            type="button" // Change to submit if you want enter key to work
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-wait' : ''}`}
          >
            {loading ? 'Verifying...' : 'Access Dashboard'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Hint: The password is <strong>admin123</strong>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;