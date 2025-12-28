import React, { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';

const files = {
  'package.json': `{
  "name": "expense-tracker",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "recharts": "^2.10.0",
    "lucide-react": "^0.263.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`,

  'public/index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Track your expenses with smart insights" />
    <title>Expense Tracker</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`,

  'src/index.js': `import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);`,

  'src/index.css': `@import url('https://cdn.jsdelivr.net/npm/tailwindcss@3.3.0/dist/tailwind.min.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`,

  'src/App.js': `import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Trash2, Edit2, Filter, DollarSign, TrendingDown, Calendar } from 'lucide-react';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Other'];
const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280'];

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ description: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0] });
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState({ category: 'All', month: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('expenses');
    if (saved) setExpenses(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleSubmit = () => {
    if (!form.description || !form.amount) return;

    if (editId) {
      setExpenses(expenses.map(exp => exp.id === editId ? { ...form, amount: parseFloat(form.amount), id: editId } : exp));
      setEditId(null);
    } else {
      setExpenses([...expenses, { ...form, amount: parseFloat(form.amount), id: Date.now() }]);
    }
    setForm({ description: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0] });
  };

  const handleEdit = (expense) => {
    setForm({ description: expense.description, amount: expense.amount.toString(), category: expense.category, date: expense.date });
    setEditId(expense.id);
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const filteredExpenses = expenses.filter(exp => {
    const categoryMatch = filter.category === 'All' || exp.category === filter.category;
    const monthMatch = !filter.month || exp.date.startsWith(filter.month);
    return categoryMatch && monthMatch;
  });

  const totalExpense = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryData = CATEGORIES.map(cat => ({
    name: cat,
    value: filteredExpenses.filter(exp => exp.category === cat).reduce((sum, exp) => sum + exp.amount, 0)
  })).filter(item => item.value > 0);

  const monthlyData = {};
  filteredExpenses.forEach(exp => {
    const month = exp.date.substring(0, 7);
    monthlyData[month] = (monthlyData[month] || 0) + exp.amount;
  });
  const barData = Object.entries(monthlyData).map(([month, amount]) => ({ month, amount })).sort((a, b) => a.month.localeCompare(b.month));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative">
      <div className="max-w-7xl mx-auto pb-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <DollarSign className="w-10 h-10" />
            Expense Tracker
          </h1>
          <p className="text-purple-200">Track your spending with smart insights</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-200 text-sm">Total Expenses</span>
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-3xl font-bold text-white">\${totalExpense.toFixed(2)}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-200 text-sm">Transactions</span>
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">{filteredExpenses.length}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-200 text-sm">Average</span>
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white">\${filteredExpenses.length ? (totalExpense / filteredExpenses.length).toFixed(2) : '0.00'}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Category Distribution</h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => \`\${name} \${(percent * 100).toFixed(0)}%\`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-purple-200 text-center py-16">No expenses yet</p>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Monthly Trends</h2>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="month" stroke="#e9d5ff" />
                  <YAxis stroke="#e9d5ff" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e1b4b', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="amount" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-purple-200 text-center py-16">No data to display</p>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">{editId ? 'Edit' : 'Add'} Expense</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <input type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <button onClick={handleSubmit} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" /> {editId ? 'Update' : 'Add'} Expense
              </button>
              {editId && (
                <button onClick={() => { setEditId(null); setForm({ description: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0] }); }} className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition">
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Expense History</h2>
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition">
                <Filter className="w-4 h-4" /> Filters
              </button>
            </div>

            {showFilters && (
              <div className="mb-4 p-4 bg-white/5 rounded-lg grid sm:grid-cols-2 gap-4">
                <select value={filter.category} onChange={e => setFilter({ ...filter, category: e.target.value })} className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <input type="month" value={filter.month} onChange={e => setFilter({ ...filter, month: e.target.value })} className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            )}

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredExpenses.length === 0 ? (
                <p className="text-purple-200 text-center py-8">No expenses found</p>
              ) : (
                filteredExpenses.sort((a, b) => b.date.localeCompare(a.date)).map(expense => (
                  <div key={expense.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white">{expense.description}</span>
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-600/30 text-purple-200">{expense.category}</span>
                      </div>
                      <p className="text-sm text-purple-300">{new Date(expense.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold text-white">\${expense.amount.toFixed(2)}</span>
                      <button onClick={() => handleEdit(expense)} className="p-2 hover:bg-white/10 rounded-lg transition">
                        <Edit2 className="w-4 h-4 text-blue-400" />
                      </button>
                      <button onClick={() => handleDelete(expense.id)} className="p-2 hover:bg-white/10 rounded-lg transition">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Watermark */}
      <div className="fixed bottom-4 right-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
        <p className="text-white/70 text-sm">© All Rights Reserved</p>
        <p className="text-purple-300 text-xs">ayushd172005@gmail.com</p>
      </div>
    </div>
  );
}`,

  'README.md': `# Expense Tracker

A modern, feature-rich expense tracking application built with React.

![Expense Tracker](https://img.shields.io/badge/React-18.2.0-blue)
![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red)

## Features

- 📊 **Data Visualization**: Interactive pie charts and bar graphs
- 💰 **Expense Management**: Full CRUD operations for expenses
- 🔍 **Advanced Filters**: Filter by category and month
- 📈 **Monthly Summary**: View total expenses, transaction count, and averages
- 💾 **Data Persistence**: Automatic saving to local storage
- 🎨 **Modern UI**: Beautiful gradient design with glassmorphism effects

## Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm start
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Usage

1. **Add Expense**: Fill in the description, amount, category, and date, then click "Add Expense"
2. **Edit Expense**: Click the edit icon on any expense to modify it
3. **Delete Expense**: Click the trash icon to remove an expense
4. **Filter**: Use the filters to view expenses by category or month
5. **View Charts**: Check the pie chart for category distribution and bar chart for monthly trends

## Technologies Used

- React 18.2.0
- Recharts (Data Visualization)
- Lucide React (Icons)
- Tailwind CSS (Styling)
- Local Storage (Data Persistence)

## Project Structure

\`\`\`
expense-tracker/
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
\`\`\`

## License

© All Rights Reserved - ayushd172005@gmail.com

This project is proprietary and confidential. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited.

## Author

**Ayush**
- Email: ayushd172005@gmail.com

## Screenshots

### Dashboard
![Dashboard with charts and summaries]

### Expense Management
![Add and manage expenses with ease]

---

Made with ❤️ by Ayush`,

  '.gitignore': `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*`,

  'LICENSE': `Copyright (c) 2024 Ayush (ayushd172005@gmail.com)

All Rights Reserved

This software and associated documentation files (the "Software") are the 
exclusive property of Ayush (ayushd172005@gmail.com).

The Software is provided for viewing purposes only. No permission is granted 
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
copies of the Software without explicit written permission from the copyright 
holder.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

For licensing inquiries, please contact: ayushd172005@gmail.com`
};

export default function FileGenerator() {
  const [copied, setCopied] = useState({});

  const copyToClipboard = (fileName, content) => {
    navigator.clipboard.writeText(content);
    setCopied({ ...copied, [fileName]: true });
    setTimeout(() => setCopied({ ...copied, [fileName]: false }), 2000);
  };

  const downloadAll = () => {
    Object.entries(files).forEach(([fileName, content]) => {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Expense Tracker - GitHub Files</h1>
          <p className="text-blue-200 mb-4">Copy each file and create them in your project directory</p>
          <button
            onClick={downloadAll}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto transition"
          >
            <Download className="w-5 h-5" />
            Download All Files
          </button>
        </div>

        <div className="space-y-6">
          {Object.entries(files).map(([fileName, content]) => (
            <div key={fileName} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white font-mono">{fileName}</h2>
                <button
                  onClick={() => copyToClipboard(fileName, content)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  {copied[fileName] ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-gray-900/50 p-4 rounded-lg overflow-x-auto text-sm text-gray-200 max-h-96 overflow-y-auto">
                <code>{content}</code>
              </pre>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">📦 Setup Instructions</h2>
          <ol className="text-blue-200 space-y-2 list-decimal list-inside">
            <li>Create a new folder called <code className="bg-gray-900/50 px-2 py-1 rounded">expense-tracker</code></li>
            <li>Copy each file above into the appropriate location in your project</li>
            <li>Create folders as needed (public/, src/)</li>
            <li>Run <code className="bg-gray-900/50 px-2 py-1 rounded">npm install</code> to install dependencies</li>
            <li>Run <code className="bg-gray-900/50 px-2 py-1 rounded">npm start</code> to start the development server</li>
            <li>Initialize git: <code className="bg-gray-900/50 px-2 py-1 rounded">git init</code></li>
            <li>Add files: <code className="bg-gray-900/50 px-2 py-1 rounded">git add .</code></li>
            <li>Commit: <code className="bg-gray-900/50 px-2 py-1 rounded">git commit -m "Initial commit"</code></li>
            <li>Push to GitHub following GitHub's instructions for new repositories</li>
          </ol>
        </div>

        <div className="mt-6 text-center bg-black/50 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/10">
          <p className="text-white/90 text-sm mb-1">© All Rights Reserved</p>
          <p className="text-blue-300 font-semibold">ayushd172005@gmail.com</p>
        </div>
      </div>
    </div>
  );
}