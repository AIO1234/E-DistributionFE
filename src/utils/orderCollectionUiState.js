import { reactive } from "vue";

// In-memory UI state for the sample Order Collection rows.
export const approvedOrderCollectionIds = reactive(new Set());
export const createdOrderCollectionRows = reactive([]);
export const sampleOrderCollectionRows = [
  {
    id: "collection-1",
    shopOrderId: 1,
    customer: "Customer 1",
    date: "2024-12-05",
    amount: 80000,
    invoice_no: "INV-2024-001",
    order_reference_id: "ORD-001",
    status: "Pending Approval",
    last_updated_by: "Admin",
    order_products: [
      {
        product_code: "PRD-001",
        product_name: "Sample Plantation Product",
        pivot: {
          quantity: 10,
          uptodate_quantity: 10,
          unit_price: 8000,
          price: 80000,
        },
      },
    ],
    isCollectionItem: true,
  },
  {
    id: "collection-2",
    shopOrderId: 2,
    customer: "Customer 2",
    date: "2024-12-05",
    amount: 80000,
    invoice_no: "INV-2024-002",
    order_reference_id: "ORD-002",
    status: "Pending Approval",
    last_updated_by: "Admin",
    order_products: [
      {
        product_code: "PRD-002",
        product_name: "Sample Garden Product",
        pivot: {
          quantity: 6,
          uptodate_quantity: 6,
          unit_price: 80000 / 6,
          price: 80000,
        },
      },
    ],
    isCollectionItem: true,
  },
];

export function approveOrderCollection(orderId) {
  if (orderId != null && orderId !== "") {
    approvedOrderCollectionIds.add(String(orderId));
  }
}

export function addCreatedOrderCollectionRows(rows = []) {
  createdOrderCollectionRows.unshift(...rows);
}
