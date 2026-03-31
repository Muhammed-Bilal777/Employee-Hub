import type { TableConfig } from "../types/filter.types";
import type { Employee } from "../types/data.types";
import { formatCurrency, formatDate } from "../utils/formatUtils";

export const employeeConfig: TableConfig<Employee> = {
  id: "employees",

  // ─── Filter Field Definitions 
  fields: [
    { key: "name", label: "Name", type: "text", placeholder: "Search name…" },
    {
      key: "email",
      label: "Email",
      type: "text",
      placeholder: "Search email…",
    },
    {
      key: "department",
      label: "Department",
      type: "single-select",
      options: [
        { label: "Engineering", value: "Engineering" },
        { label: "Marketing", value: "Marketing" },
        { label: "Sales", value: "Sales" },
        { label: "HR", value: "HR" },
        { label: "Finance", value: "Finance" },
        { label: "Design", value: "Design" },
        { label: "Operations", value: "Operations" },
        { label: "Legal", value: "Legal" },
      ],
    },
    { key: "role", label: "Role", type: "text", placeholder: "Search role…" },
    {
      key: "salary",
      label: "Salary",
      type: "amount",
      defaultOperator: "amount_between",
    },
    {
      key: "joinDate",
      label: "Join Date",
      type: "date",
      defaultOperator: "date_between",
    },
    {
      key: "lastReview",
      label: "Last Review",
      type: "date",
      defaultOperator: "date_between",
    },
    {
      key: "isActive",
      label: "Active Status",
      type: "boolean",
      defaultOperator: "bool_is",
    },
    {
      key: "projects",
      label: "Projects",
      type: "number",
      defaultOperator: "num_gte",
    },
    {
      key: "performanceRating",
      label: "Performance",
      type: "number",
      defaultOperator: "num_gte",
    },
    {
      key: "skills",
      label: "Skills",
      type: "multi-select",
      defaultOperator: "multi_in",
      options: [
        { label: "React", value: "React" },
        { label: "TypeScript", value: "TypeScript" },
        { label: "Node.js", value: "Node.js" },
        { label: "Python", value: "Python" },
        { label: "GraphQL", value: "GraphQL" },
        { label: "AWS", value: "AWS" },
        { label: "Docker", value: "Docker" },
        { label: "Kubernetes", value: "Kubernetes" },
        { label: "Vue", value: "Vue" },
        { label: "Angular", value: "Angular" },
        { label: "SQL", value: "SQL" },
        { label: "MongoDB", value: "MongoDB" },
        { label: "Figma", value: "Figma" },
        { label: "Java", value: "Java" },
        { label: "Go", value: "Go" },
      ],
    },
    {
      key: "address.city",
      label: "City",
      type: "text",
      placeholder: "Search city…",
    },
    {
      key: "address.state",
      label: "State",
      type: "single-select",
      options: [
        { label: "CA", value: "CA" },
        { label: "NY", value: "NY" },
        { label: "TX", value: "TX" },
        { label: "WA", value: "WA" },
        { label: "IL", value: "IL" },
        { label: "FL", value: "FL" },
        { label: "CO", value: "CO" },
        { label: "GA", value: "GA" },
      ],
    },
    {
      key: "paymentMethod",
      label: "Payment Method",
      type: "single-select",
      options: [
        { label: "Bank Transfer", value: "Bank Transfer" },
        { label: "Check", value: "Check" },
        { label: "Direct Deposit", value: "Direct Deposit" },
      ],
    },
    {
      key: "isRefunded",
      label: "Refunded",
      type: "boolean",
      defaultOperator: "bool_is",
    },
  ],

  // ─── Column Definitions 
  columns: [
    { key: "name", label: "Name", sortable: true, width: 180 },
    { key: "department", label: "Department", sortable: true, width: 130 },
    { key: "role", label: "Role", sortable: true, width: 180 },
    {
      key: "salary",
      label: "Salary",
      sortable: true,
      width: 110,
      align: "right",
      renderCell: (v) => formatCurrency(v as number),
    },
    { key: "isActive", label: "Status", sortable: true, width: 90 },
    {
      key: "performanceRating",
      label: "Rating",
      sortable: true,
      width: 80,
      align: "center",
    },
    {
      key: "projects",
      label: "Projects",
      sortable: true,
      width: 80,
      align: "center",
    },
    {
      key: "joinDate",
      label: "Joined",
      sortable: true,
      width: 110,
      renderCell: (v) => formatDate(v as string),
    },
    { key: "skills", label: "Skills", sortable: false, width: 200 },
    { key: "address.city", label: "City", sortable: true, width: 120 },
  ],

  // ─── Default Active Filters (pre-selected as required)  
  defaultFilters: [
    {
      id: "default-active",
      fieldKey: "isActive",
      operatorKey: "bool_is",
      value: true,
    },
  ],
};
