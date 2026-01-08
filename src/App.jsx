import React, { useState, useEffect } from "react";
import {
  Plus,
  Home,
  Receipt,
  X,
  DollarSign,
  Hammer,
  Building,
  Calendar,
  Edit2,
  Trash2,
  Download,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

function App() {
  // Load expenses from localStorage on initial load
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem("constructionExpenses");
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [budget, setBudget] = useState(() => {
    const savedBudget = localStorage.getItem("constructionBudget");
    return savedBudget ? parseFloat(savedBudget) : 500000;
  });
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState("");

  const categories = [
    { id: "materials", name: "Materials", icon: "🧱", color: "bg-orange-500" },
    { id: "labor", name: "Labor", icon: "👷", color: "bg-blue-500" },
    { id: "cement", name: "Cement Work", icon: "🏗️", color: "bg-gray-500" },
    { id: "steel", name: "Steel & RCC", icon: "🔩", color: "bg-yellow-500" },
    { id: "brick", name: "Brick Work", icon: "🧱", color: "bg-red-500" },
    { id: "plumbing", name: "Plumbing", icon: "🚰", color: "bg-cyan-500" },
    {
      id: "electrical",
      name: "Electrical",
      icon: "⚡",
      color: "bg-yellow-400",
    },
    { id: "painting", name: "Painting", icon: "🎨", color: "bg-purple-500" },
    { id: "flooring", name: "Flooring", icon: "🏠", color: "bg-brown-500" },
    { id: "other", name: "Other", icon: "📦", color: "bg-green-500" },
  ];

  // Load sample data only if localStorage is empty
  useEffect(() => {
    const savedExpenses = localStorage.getItem("constructionExpenses");
    if (!savedExpenses || JSON.parse(savedExpenses).length === 0) {
      const sampleExpenses = [
        {
          id: 1,
          description: "Cement 100 bags",
          amount: 45000,
          category: "materials",
          date: "2024-01-15",
        },
        {
          id: 2,
          description: "Steel rods 2 tons",
          amount: 180000,
          category: "steel",
          date: "2024-01-14",
        },
        {
          id: 3,
          description: "Masonry work - Week 1",
          amount: 35000,
          category: "labor",
          date: "2024-01-13",
        },
        {
          id: 4,
          description: "Electrical wiring",
          amount: 28000,
          category: "electrical",
          date: "2024-01-12",
        },
        {
          id: 5,
          description: "Bricks 5000 pieces",
          amount: 75000,
          category: "brick",
          date: "2024-01-11",
        },
        {
          id: 6,
          description: "Plumbing pipes & fittings",
          amount: 42000,
          category: "plumbing",
          date: "2024-01-10",
        },
      ];
      setExpenses(sampleExpenses);
      localStorage.setItem(
        "constructionExpenses",
        JSON.stringify(sampleExpenses)
      );
    }

    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("constructionExpenses", JSON.stringify(expenses));
  }, [expenses]);

  // Save budget to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("constructionBudget", budget.toString());
  }, [budget]);

  const totalExpense = expenses.reduce(
    (sum, exp) => sum + parseFloat(exp.amount || 0),
    0
  );
  const remainingBudget = budget - totalExpense;
  const budgetPercentage = budget > 0 ? (totalExpense / budget) * 100 : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !category) return;

    const expenseData = {
      id: editingId || Date.now(),
      description,
      amount: parseFloat(amount),
      category,
      date: date || new Date().toISOString().split("T")[0],
    };

    let updatedExpenses;
    if (editingId) {
      updatedExpenses = expenses.map((exp) =>
        exp.id === editingId ? expenseData : exp
      );
    } else {
      updatedExpenses = [expenseData, ...expenses];
    }

    setExpenses(updatedExpenses);
    setEditingId(null);
    resetForm();
    setShowAddModal(false);
  };

  const handleEdit = (expense) => {
    setDescription(expense.description);
    setAmount(expense.amount);
    setCategory(expense.category);
    setDate(expense.date);
    setEditingId(expense.id);
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this expense?")) {
      const updatedExpenses = expenses.filter((exp) => exp.id !== id);
      setExpenses(updatedExpenses);
    }
  };

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setCategory("");
    setDate(new Date().toISOString().split("T")[0]);
    setEditingId(null);
  };

  const getCategory = (id) =>
    categories.find((cat) => cat.id === id) ||
    categories[categories.length - 1];

  const filteredExpenses =
    selectedCategory === "all"
      ? expenses
      : expenses.filter((exp) => exp.category === selectedCategory);

  const categoryTotals = categories
    .map((cat) => ({
      ...cat,
      total: expenses
        .filter((exp) => exp.category === cat.id)
        .reduce((sum, exp) => sum + parseFloat(exp.amount), 0),
    }))
    .filter((cat) => cat.total > 0);

  const handleBudgetEdit = () => {
    if (isEditingBudget) {
      const newBudget = parseFloat(tempBudget);
      if (!isNaN(newBudget) && newBudget >= 0) {
        setBudget(newBudget);
      }
    } else {
      setTempBudget(budget.toString());
    }
    setIsEditingBudget(!isEditingBudget);
  };

  const handleBudgetChange = (e) => {
    setTempBudget(e.target.value);
  };

  const handleBudgetKeyPress = (e) => {
    if (e.key === "Enter") {
      handleBudgetEdit();
    }
  };

  // Export data as JSON file
  const handleExportData = () => {
    const data = {
      expenses,
      budget,
      totalExpense,
      remainingBudget,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `construction-expenses-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import data from JSON file
  const handleImportData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);

          if (data.expenses && Array.isArray(data.expenses)) {
            if (
              window.confirm(
                "This will replace all your current data. Continue?"
              )
            ) {
              setExpenses(data.expenses);
              if (data.budget) setBudget(data.budget);
              alert("Data imported successfully!");
            }
          } else {
            alert("Invalid data format. Please select a valid export file.");
          }
        } catch (error) {
          alert("Error reading file. Please make sure it's a valid JSON file.");
        }
      };
      reader.readAsText(file);
    };

    input.click();
  };

  // Clear all data
  const handleClearData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear ALL data? This cannot be undone."
      )
    ) {
      setExpenses([]);
      setBudget(500000);
      localStorage.removeItem("constructionExpenses");
      localStorage.removeItem("constructionBudget");
      alert("All data has been cleared.");
    }
  };

  // Dashboard Screen
  const DashboardScreen = () => (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Shareef's House
            </h1>
            <p className="text-gray-500 text-sm">
              Construction Expense Tracker
            </p>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-12 h-12 rounded-full flex items-center justify-center">
            <Building className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Budget Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-white mb-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm opacity-90">Total Budget</p>
            <div className="flex items-center mt-1">
              {isEditingBudget ? (
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">₹</span>
                  <input
                    type="number"
                    value={tempBudget}
                    onChange={handleBudgetChange}
                    onKeyPress={handleBudgetKeyPress}
                    className="text-2xl font-bold bg-transparent border-b border-white/50 focus:outline-none focus:border-white w-32"
                    autoFocus
                  />
                </div>
              ) : (
                <p className="text-2xl font-bold">₹{budget.toLocaleString()}</p>
              )}
              <button
                onClick={handleBudgetEdit}
                className="ml-2 p-1 hover:bg-white/20 rounded-full"
              >
                {isEditingBudget ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Edit2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Spent: ₹{totalExpense.toLocaleString()}</span>
            <span>{budgetPercentage.toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-white bg-opacity-30 rounded-full overflow-hidden">
            <div
              className={`h-full ${
                budgetPercentage > 80
                  ? "bg-red-400"
                  : budgetPercentage > 60
                  ? "bg-yellow-400"
                  : "bg-green-400"
              } rounded-full`}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <span className="opacity-90">Remaining</span>
          <span className="font-bold">₹{remainingBudget.toLocaleString()}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-xl font-bold text-gray-800">
                ₹{totalExpense.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <Receipt className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Items</p>
              <p className="text-xl font-bold text-gray-800">
                {expenses.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Data Management</h2>
        {/* <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExportData}
            className="flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
          >
            <Download className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Export Data</span>
          </button>
          <button
            onClick={handleImportData}
            className="flex items-center justify-center p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Import Data</span>
          </button>
        </div> */}
        <button
          onClick={handleClearData}
          className="w-full mt-2 p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium text-sm"
        >
          Clear All Data
        </button>
      </div>

      {/* Top Categories */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">
          Spending by Category
        </h2>
        <div className="space-y-4">
          {categoryTotals.slice(0, 3).map((cat) => (
            <div key={cat.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full ${cat.color} flex items-center justify-center mr-3`}
                >
                  <span className="text-lg">{cat.icon}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{cat.name}</p>
                  <p className="text-xs text-gray-500">
                    {totalExpense > 0
                      ? ((cat.total / totalExpense) * 100).toFixed(1)
                      : 0}
                    % of total
                  </p>
                </div>
              </div>
              <span className="font-bold text-gray-800">
                ₹{cat.total.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-800">Recent Expenses</h2>
          <button
            onClick={() => setActiveTab("expenses")}
            className="text-orange-600 text-sm font-medium"
          >
            View All
          </button>
        </div>

        <div className="space-y-3">
          {expenses.slice(0, 3).map((expense) => {
            const category = getCategory(expense.category);
            return (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
              >
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center mr-3`}
                  >
                    <span className="text-lg">{category.icon}</span>
                  </div>
                  <div className="max-w-[180px]">
                    <p className="font-medium text-gray-800 truncate">
                      {expense.description}
                    </p>
                    <p className="text-xs text-gray-500">{expense.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-800 block">
                    ₹{expense.amount.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500">{category.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Expenses Screen
  const ExpensesScreen = () => (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Expenses</h1>
          <p className="text-gray-500 text-sm">
            {filteredExpenses.length} construction items
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleExportData}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            title="Export Data"
          >
            <Download className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            selectedCategory === "all"
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center ${
              selectedCategory === cat.id
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <span className="mr-1">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Expenses List */}
      <div className="space-y-3">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Hammer className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No expenses found</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 text-orange-600 font-medium"
            >
              Add first construction expense
            </button>
          </div>
        ) : (
          filteredExpenses.map((expense) => {
            const category = getCategory(expense.category);
            return (
              <div
                key={expense.id}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div
                      className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mr-3`}
                    >
                      <span className="text-xl">{category.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 mb-1">
                        {expense.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                          {category.name}
                        </span>
                        <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">
                          {expense.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-800 block">
                      ₹{expense.amount.toLocaleString()}
                    </span>
                    <div className="flex space-x-1 mt-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="p-1 text-gray-400 hover:text-orange-500"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  // Reports Screen
  const ReportsScreen = () => {
    const sortedCategories = [...categoryTotals].sort(
      (a, b) => b.total - a.total
    );

    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Construction Reports
        </h1>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">
            Financial Summary
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Budget</span>
              <div className="flex items-center">
                <span className="font-bold text-gray-800 mr-2">
                  ₹{budget.toLocaleString()}
                </span>
                <button
                  onClick={handleBudgetEdit}
                  className="p-1 text-gray-400 hover:text-orange-500"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount Spent</span>
              <span className="font-bold text-gray-800">
                ₹{totalExpense.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Remaining Balance</span>
              <span
                className={`font-bold ${
                  remainingBudget > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ₹{remainingBudget.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Budget Utilization</span>
              <span className="font-bold text-gray-800">
                {budgetPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">
            Detailed Category Breakdown
          </h2>
          <div className="space-y-4">
            {sortedCategories.map((cat) => {
              const percentage =
                totalExpense > 0 ? (cat.total / totalExpense) * 100 : 0;
              const budgetPerc = budget > 0 ? (cat.total / budget) * 100 : 0;
              return (
                <div key={cat.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full ${cat.color} flex items-center justify-center mr-3`}
                      >
                        <span className="text-sm">{cat.icon}</span>
                      </div>
                      <span className="font-medium text-gray-700">
                        {cat.name}
                      </span>
                    </div>
                    <span className="font-bold text-gray-800">
                      ₹{cat.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <span>{percentage.toFixed(1)}% of expenses</span>
                    <span>{budgetPerc.toFixed(1)}% of budget</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cat.color} rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Avg. Expense/Day</p>
            <p className="text-xl font-bold text-gray-800 mt-1">
              ₹
              {expenses.length > 0 ? (totalExpense / 30).toLocaleString() : "0"}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Categories Used</p>
            <p className="text-xl font-bold text-gray-800 mt-1">
              {categoryTotals.length}
            </p>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Data Management</h2>
          <div className="space-y-3">
            <button
              onClick={handleExportData}
              className="w-full flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
            >
              <Download className="w-4 h-4 mr-2" />
              <span className="font-medium">Export All Data as JSON</span>
            </button>
            <button
              onClick={handleImportData}
              className="w-full flex items-center justify-center p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              <span className="font-medium">Import Data from JSON</span>
            </button>
            <button
              onClick={handleClearData}
              className="w-full flex items-center justify-center p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              <span className="font-medium">Clear All Data</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Add Expense Modal
  const AddExpenseModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50">
      <div className="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button
            onClick={() => {
              setShowAddModal(false);
              resetForm();
            }}
            className="p-2"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          <h2 className="font-semibold text-gray-800">
            {editingId ? "Edit Expense" : "Add Construction Expense"}
          </h2>
          <div className="w-10" />
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., 50 bags of cement, Steel rods, Labor charges..."
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows="2"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount in rupees"
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Construction Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-center p-2 rounded-xl ${
                      category === cat.id
                        ? "bg-orange-50 border-2 border-orange-500"
                        : "bg-gray-100 border-2 border-transparent"
                    }`}
                  >
                    <span className="text-xl mb-1">{cat.icon}</span>
                    <span className="text-xs font-medium text-gray-700 text-center">
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition"
            >
              {editingId ? "Update Expense" : "Save Construction Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative overflow-hidden">
      {/* App Container */}
      <div className="pb-20">
        {activeTab === "dashboard" && <DashboardScreen />}
        {activeTab === "expenses" && <ExpensesScreen />}
        {activeTab === "reports" && <ReportsScreen />}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto shadow-lg">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center p-2 ${
              activeTab === "dashboard" ? "text-orange-500" : "text-gray-500"
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("expenses")}
            className={`flex flex-col items-center p-2 ${
              activeTab === "expenses" ? "text-orange-500" : "text-gray-500"
            }`}
          >
            <Receipt className="w-6 h-6" />
            <span className="text-xs mt-1">Expenses</span>
          </button>

          {/* Add Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="absolute bottom-6 -translate-x-1/2 left-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-lg transform hover:scale-105 transition"
          >
            <Plus className="w-6 h-6" />
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`flex flex-col items-center p-2 ${
              activeTab === "reports" ? "text-orange-500" : "text-gray-500"
            }`}
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs mt-1">Reports</span>
          </button>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && <AddExpenseModal />}
    </div>
  );
}

export default App;
