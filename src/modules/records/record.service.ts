import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

export const createRecord = async (data: any, createdById: string) => {
  return await prisma.financialRecord.create({
    data: {
      ...data,
      createdById,
    },
  });
};

export const getRecords = async (query: any) => {
  const filter: any = { deletedAt: null };

  if (query.type) filter.type = query.type;
  if (query.category) filter.category = query.category;
  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.gte = new Date(query.startDate);
    if (query.endDate) filter.date.lte = new Date(query.endDate);
  }
  
  if (query.search) {
    filter.OR = [
      { notes: { contains: query.search } },
      { category: { contains: query.search } }
    ];
  }

  const page = query.page ? Number(query.page) : 1;
  const limit = query.limit ? Number(query.limit) : 10;
  const skip = (page - 1) * limit;

  const [total, data] = await Promise.all([
    prisma.financialRecord.count({ where: filter }),
    prisma.financialRecord.findMany({
      where: filter,
      orderBy: { date: "desc" },
      skip,
      take: limit,
    })
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const updateRecord = async (id: string, data: any) => {
  const record = await prisma.financialRecord.findFirst({ where: { id, deletedAt: null } });
  if (!record) {
    throw new AppError("Record not found", 404);
  }

  return await prisma.financialRecord.update({
    where: { id },
    data,
  });
};

export const deleteRecord = async (id: string) => {
  const record = await prisma.financialRecord.findFirst({ where: { id, deletedAt: null } });
  if (!record) {
    throw new AppError("Record not found", 404);
  }

  return await prisma.financialRecord.update({ 
    where: { id },
    data: { deletedAt: new Date() }
  });
};
