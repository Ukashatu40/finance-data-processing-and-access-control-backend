import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma";

export const getDashboardSummary = async () => {
  const filter: Prisma.FinancialRecordWhereInput = { deletedAt: null };

  const aggregations = await prisma.financialRecord.groupBy({
    by: ["type"],
    where: filter,
    _sum: {
      amount: true,
    },
  });

  const categoryTotals = await prisma.financialRecord.groupBy({
    by: ["category", "type"],
    where: filter,
    _sum: {
      amount: true,
    },
  });

  const recentActivity = await prisma.financialRecord.findMany({
    where: filter,
    orderBy: { date: "desc" },
    take: 5,
    include: {
      user: {
        select: { email: true },
      },
    },
  });

  let totalIncome = 0;
  let totalExpenses = 0;

  aggregations.forEach((agg: any) => {
    if (agg.type === "INCOME") totalIncome += agg._sum.amount || 0;
    if (agg.type === "EXPENSE") totalExpenses += agg._sum.amount || 0;
  });

  const netBalance = totalIncome - totalExpenses;

  return {
    totalIncome,
    totalExpenses,
    netBalance,
    categoryTotals: categoryTotals.map((c: any) => ({
      category: c.category,
      type: c.type,
      total: c._sum.amount || 0,
    })),
    recentActivity,
  };
};
