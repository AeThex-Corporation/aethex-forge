import { useState } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  CreditCard,
  FileText,
  Calendar,
  CheckCircle,
  AlertCircle,
  Plus,
} from "lucide-react";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  status: "Pending" | "Approved" | "Reimbursed" | "Rejected";
  receipt: boolean;
}

interface Budget {
  category: string;
  allocated: number;
  spent: number;
  percentage: number;
}

const expenses: Expense[] = [
  {
    id: "1",
    description: "Conference Registration - GDC 2025",
    amount: 1200,
    category: "Training",
    date: "March 10, 2025",
    status: "Approved",
    receipt: true,
  },
  {
    id: "2",
    description: "Laptop Stand and Keyboard",
    amount: 180,
    category: "Equipment",
    date: "March 5, 2025",
    status: "Reimbursed",
    receipt: true,
  },
  {
    id: "3",
    description: "Client Dinner Meeting",
    amount: 85.5,
    category: "Entertainment",
    date: "February 28, 2025",
    status: "Reimbursed",
    receipt: true,
  },
  {
    id: "4",
    description: "Cloud Services - AWS",
    amount: 450,
    category: "Software",
    date: "February 20, 2025",
    status: "Pending",
    receipt: true,
  },
  {
    id: "5",
    description: "Travel to NYC Office",
    amount: 320,
    category: "Travel",
    date: "February 15, 2025",
    status: "Rejected",
    receipt: true,
  },
];

const budgets: Budget[] = [
  {
    category: "Training & Development",
    allocated: 5000,
    spent: 2100,
    percentage: 42,
  },
  {
    category: "Equipment & Hardware",
    allocated: 2500,
    spent: 1850,
    percentage: 74,
  },
  {
    category: "Travel",
    allocated: 3000,
    spent: 2200,
    percentage: 73,
  },
  {
    category: "Software & Tools",
    allocated: 1500,
    spent: 1200,
    percentage: 80,
  },
  {
    category: "Entertainment & Client Meals",
    allocated: 1000,
    spent: 320,
    percentage: 32,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Reimbursed":
      return "bg-green-500/20 text-green-300 border-green-500/30";
    case "Approved":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "Pending":
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    case "Rejected":
      return "bg-red-500/20 text-red-300 border-red-500/30";
    default:
      return "bg-slate-500/20 text-slate-300";
  }
};

const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return "bg-red-500";
  if (percentage >= 60) return "bg-amber-500";
  return "bg-green-500";
};

export default function StaffExpenseReports() {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filtered = filterStatus
    ? expenses.filter((e) => e.status === filterStatus)
    : expenses;

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalApproved = expenses
    .filter((e) => e.status === "Approved" || e.status === "Reimbursed")
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <Layout>
      <SEO
        title="Expense Reports"
        description="Reimbursement requests and budget tracking"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-green-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="container mx-auto max-w-6xl px-4 py-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-green-100">
                  Expense Reports
                </h1>
                <p className="text-green-200/70">
                  Reimbursement requests and budget tracking
                </p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              <Card className="bg-green-950/30 border-green-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-200/70">
                        Total Submitted
                      </p>
                      <p className="text-3xl font-bold text-green-100">
                        ${totalSpent.toFixed(2)}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-green-950/30 border-green-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-200/70">Approved</p>
                      <p className="text-3xl font-bold text-green-100">
                        ${totalApproved.toFixed(2)}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-green-950/30 border-green-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-200/70">Pending</p>
                      <p className="text-3xl font-bold text-green-100">
                        $
                        {expenses
                          .filter((e) => e.status === "Pending")
                          .reduce((sum, e) => sum + e.amount, 0)
                          .toFixed(2)}
                      </p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Budget Overview */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-green-100 mb-6">
                Budget Overview
              </h2>
              <div className="space-y-4">
                {budgets.map((budget) => (
                  <Card
                    key={budget.category}
                    className="bg-slate-800/50 border-slate-700/50"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-green-100">
                            {budget.category}
                          </p>
                          <p className="text-sm text-slate-400">
                            ${budget.spent.toFixed(2)} of ${budget.allocated}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-green-300">
                          {budget.percentage}%
                        </p>
                      </div>
                      <Progress value={budget.percentage} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Expense List */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-green-100">
                  Expense Reports
                </h2>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Expense
                </Button>
              </div>

              {/* Status Filter */}
              <div className="flex gap-2 mb-6 flex-wrap">
                <Button
                  variant={filterStatus === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(null)}
                  className={
                    filterStatus === null
                      ? "bg-green-600 hover:bg-green-700"
                      : "border-green-500/30 text-green-300 hover:bg-green-500/10"
                  }
                >
                  All
                </Button>
                {["Pending", "Approved", "Reimbursed", "Rejected"].map(
                  (status) => (
                    <Button
                      key={status}
                      variant={filterStatus === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus(status)}
                      className={
                        filterStatus === status
                          ? "bg-green-600 hover:bg-green-700"
                          : "border-green-500/30 text-green-300 hover:bg-green-500/10"
                      }
                    >
                      {status}
                    </Button>
                  ),
                )}
              </div>

              {/* Expenses */}
              <div className="space-y-4">
                {filtered.map((expense) => (
                  <Card
                    key={expense.id}
                    className="bg-slate-800/50 border-slate-700/50 hover:border-green-500/50 transition-all"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-green-100">
                            {expense.description}
                          </p>
                          <div className="flex gap-4 text-sm text-slate-400 mt-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {expense.date}
                            </span>
                            <Badge className="bg-slate-700 text-slate-300">
                              {expense.category}
                            </Badge>
                            {expense.receipt && (
                              <span className="text-green-400">✓ Receipt</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-100">
                            ${expense.amount.toFixed(2)}
                          </p>
                          <Badge
                            className={`border ${getStatusColor(expense.status)} mt-2`}
                          >
                            {expense.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
