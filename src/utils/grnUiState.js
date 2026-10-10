import { reactive } from "vue";

export const grnUiState = reactive({
  selectedOrder: null,
  records: {},
  nextNumber: 1,
});

export function selectOrderForGrn(order) {
  grnUiState.selectedOrder = order ? { ...order } : null;
}

export function getGrnRecord(orderId) {
  return grnUiState.records[String(orderId)] || null;
}

export function saveGrnRecord(orderId, record) {
  const key = String(orderId);
  const existing = grnUiState.records[key];
  const grnNumber =
    existing?.grnNumber || `GRN-${String(grnUiState.nextNumber).padStart(5, "0")}`;

  if (!existing) grnUiState.nextNumber += 1;

  grnUiState.records[key] = {
    ...record,
    orderId: key,
    grnNumber,
  };

  return grnUiState.records[key];
}
