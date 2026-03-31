import type { Employee } from "../types/data.types";
import employeesRaw from "../data/employees.json";

const employees = employeesRaw as Employee[];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const employeeService = {
  async fetchAll(): Promise<Employee[]> {
    await delay(600);
    return employees;
  },
};
