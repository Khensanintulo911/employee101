import { z } from 'zod';
import { 
  insertEmployeeSchema, 
  insertLeaveRequestSchema, 
  insertDisciplinaryRecordSchema, 
  insertTrainingRecordSchema,
  employees,
  leaveRequests,
  disciplinaryRecords,
  trainingRecords
} from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  employees: {
    list: {
      method: 'GET' as const,
      path: '/api/employees',
      responses: {
        200: z.array(z.custom<typeof employees.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/employees/:id',
      responses: {
        200: z.custom<typeof employees.$inferSelect>(), // Should ideally return EmployeeWithDetails
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/employees',
      input: insertEmployeeSchema,
      responses: {
        201: z.custom<typeof employees.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/employees/:id',
      input: insertEmployeeSchema.partial(),
      responses: {
        200: z.custom<typeof employees.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  leave: {
    list: {
      method: 'GET' as const,
      path: '/api/leave-requests',
      responses: {
        200: z.array(z.custom<typeof leaveRequests.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/leave-requests',
      input: insertLeaveRequestSchema,
      responses: {
        201: z.custom<typeof leaveRequests.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/leave-requests/:id/status',
      input: z.object({ status: z.enum(['Pending', 'Approved', 'Rejected']) }),
      responses: {
        200: z.custom<typeof leaveRequests.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },
  discipline: {
    list: {
      method: 'GET' as const,
      path: '/api/disciplinary-records',
      responses: {
        200: z.array(z.custom<typeof disciplinaryRecords.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/disciplinary-records',
      input: insertDisciplinaryRecordSchema,
      responses: {
        201: z.custom<typeof disciplinaryRecords.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  training: {
    list: {
      method: 'GET' as const,
      path: '/api/training-records',
      responses: {
        200: z.array(z.custom<typeof trainingRecords.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/training-records',
      input: insertTrainingRecordSchema,
      responses: {
        201: z.custom<typeof trainingRecords.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  }
};

// ============================================
// URL HELPER
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
