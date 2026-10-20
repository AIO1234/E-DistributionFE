import { reactive } from "vue";

const purchaseLines = [
  {
    product_id: 9101,
    product_code: "TEA-001",
    product_name: "Ceylon Breakfast Tea",
    category: { category_name: "Tea" },
    product_type: "Beverage",
    product_weight: 0.25,
    product_volume: 0,
    pivot: {
      purchase_type: "individual_units",
      individual_items_quantity: 120,
      item_unit_price: 680,
      individual_wastage: 2,
      total_amount: 81600,
    },
  },
  {
    product_id: 9102,
    product_code: "COF-002",
    product_name: "Roasted Coffee Beans",
    category: { category_name: "Coffee" },
    product_type: "Beverage",
    product_weight: 1,
    product_volume: 0,
    pivot: {
      purchase_type: "individual_units",
      individual_items_quantity: 45,
      item_unit_price: 2450,
      individual_wastage: 0,
      total_amount: 110250,
    },
  },
];

const purchaseOrders = [
  {
    id: 9201,
    purchased_reference_id: "PO-2026-001",
    purchased_date: "2026-09-18",
    purchased_status: "Received",
    receiving_invoice_no: "SUP-INV-4418",
    purchased_order_total: 191850,
    purchase_total: 191850,
    due_amount: 41850,
    order_items: purchaseLines,
  },
  {
    id: 9202,
    purchased_reference_id: "PO-2026-002",
    purchased_date: "2026-10-02",
    purchased_status: "Partially Received",
    receiving_invoice_no: "SUP-INV-4472",
    purchased_order_total: 81600,
    purchase_total: 81600,
    due_amount: 31600,
    order_items: [purchaseLines[0]],
  },
];

export const demoSuppliers = reactive([
  {
    id: 9001,
    suplier_name: "Lanka Beverage Traders",
    email: "orders@lankabeverage.example",
    contact_no: "+94 11 234 5678",
    suplier_address: "18 Market Road, Colombo",
    purchases_count: purchaseOrders.length,
    last_purchase_date: "2026-10-02",
    purchases_total: 273450,
    showroom_distributed_total: 191850,
    total_payments: 200000,
    due_payments: 73450,
    credit_balance: 0,
    suplier_orders: purchaseOrders,
  },
  {
    id: 9002,
    suplier_name: "Green Valley Foods",
    email: "sales@greenvalley.example",
    contact_no: "+94 81 222 9020",
    suplier_address: "42 Hill Street, Kandy",
    purchases_count: 1,
    last_purchase_date: "2026-09-26",
    purchases_total: 126000,
    showroom_distributed_total: 126000,
    total_payments: 126000,
    due_payments: 0,
    credit_balance: 0,
    suplier_orders: [
      {
        id: 9203,
        purchased_reference_id: "PO-2026-003",
        purchased_date: "2026-09-26",
        purchased_status: "Received",
        receiving_invoice_no: "GV-8820",
        purchased_order_total: 126000,
        due_amount: 0,
        order_items: [
          {
            ...purchaseLines[1],
            pivot: { ...purchaseLines[1].pivot, total_amount: 126000 },
          },
        ],
      },
    ],
  },
]);

export const demoCustomerShops = reactive([
  {
    id: 9301,
    shop_name: "Harbour View Stores",
    area_name: "Colombo Fort",
    area_id: 93011,
    area: { area_name: "Colombo Fort" },
    Uptodate_due_amounts: 29000,
    uptodate_paid_amounts: 15900,
    payment_term_days: 30,
  },
  {
    id: 9302,
    shop_name: "Hill Country Market",
    area_name: "Kandy",
    area_id: 93012,
    area: { area_name: "Kandy" },
    Uptodate_due_amounts: 13600,
    uptodate_paid_amounts: 0,
    payment_term_days: 100,
  },
]);

const demoShopOrders = [
  {
    id: 9401,
    shop_id: 9301,
    order_reference_id: "SHOP-2026-1041",
    invoice_no: "INV-1041",
    order_amount: 20400,
    product_id: 9101,
    product_code: "TEA-001",
    product_name: "Ceylon Breakfast Tea",
    unit_price: 680,
    quantity: 30,
    returned_quantity: 2,
  },
  {
    id: 9402,
    shop_id: 9301,
    order_reference_id: "SHOP-2026-1088",
    invoice_no: "INV-1088",
    order_amount: 24500,
    product_id: 9102,
    product_code: "COF-002",
    product_name: "Roasted Coffee Beans",
    unit_price: 2450,
    quantity: 10,
    returned_quantity: 0,
  },
  {
    id: 9403,
    shop_id: 9302,
    order_reference_id: "SHOP-2026-1093",
    invoice_no: "INV-1093",
    order_amount: 13600,
    product_id: 9101,
    product_code: "TEA-001",
    product_name: "Ceylon Breakfast Tea",
    unit_price: 680,
    quantity: 20,
    returned_quantity: 0,
  },
];

export const demoReturns = reactive([
  {
    id: 9501,
    shop_id: 9301,
    shop_name: "Harbour View Stores",
    return_code: "RETURN-SHOP-26001",
    return_date: "2026-10-03",
    order_reference_id: "SHOP-2026-1041",
    invoice_no: "INV-1041",
    order_amount: 20400,
    return_amount: 1360,
    last_updated_by: "Admin",
    return_products: [
      {
        product_code: "TEA-001",
        product_name: "Ceylon Breakfast Tea",
        product_type: "Beverage",
        product_weight: 0.25,
        product_volume: 0,
        pivot: {
          unit_price: 680,
          return_count: 2,
          return_amount: 1360,
          reason_type: "Damage or Expire",
        },
      },
    ],
  },
]);

export const demoIncomingPayments = reactive([
  {
    id: 9600,
    shops_id: 9302,
    shop: demoCustomerShops[1],
    payment_code: "PAY-2026-008",
    payment_date: "2026-07-15",
    payment_amount: 3600,
    payment_method: "Bank Transfer",
    check_no: "N/A",
    status: "Recieved",
    last_updated_by: "Admin",
    payment_invoices: [
      {
        order_reference_id: "SHOP-2026-0880",
        pivot: { status: "Partially Paid" },
      },
    ],
  },
  {
    id: 9602,
    shops_id: 9301,
    shop: demoCustomerShops[0],
    payment_code: "PAY-2026-016",
    payment_date: "2026-10-09",
    payment_amount: 10000,
    payment_method: "Cash",
    check_no: "N/A",
    status: "Recieved",
    last_updated_by: "Admin",
    payment_invoices: [
      {
        order_reference_id: "SHOP-2026-1088",
        pivot: { status: "Partially Paid" },
      },
    ],
  },
  {
    id: 9601,
    shops_id: 9301,
    shop: demoCustomerShops[0],
    payment_code: "PAY-2026-015",
    payment_date: "2026-10-05",
    payment_amount: 5900,
    payment_method: "Bank Transfer",
    check_no: "N/A",
    status: "Recieved",
    last_updated_by: "Admin",
    payment_invoices: [
      {
        order_reference_id: "SHOP-2026-1041",
        pivot: { status: "Partially Paid" },
      },
    ],
  },
]);

export const demoSupplierPayments = reactive([
  {
    id: 9701,
    supplier_id: 9001,
    suplier: demoSuppliers[0],
    payment_reference_id: "SUP-PAY-2026-031",
    payment_date: "2026-10-04",
    total_amount: 150000,
    payment_method: "Bank Transfer",
    payment_status: "Confirmed",
    orders_count: 1,
    supplier_order_payments: [
      {
        id: 9711,
        supplier_order: {
          purchased_reference_id: "PO-2026-001",
          due_amount: 41850,
        },
      },
    ],
  },
  {
    id: 9702,
    supplier_id: 9001,
    suplier: demoSuppliers[0],
    payment_reference_id: "SUP-PAY-2026-032",
    payment_date: "2026-10-08",
    total_amount: 50000,
    payment_method: "Cash",
    payment_status: "Confirmed",
    orders_count: 1,
    supplier_order_payments: [
      {
        id: 9712,
        supplier_order: {
          purchased_reference_id: "PO-2026-002",
          due_amount: 31600,
        },
      },
    ],
  },
  {
    id: 9703,
    supplier_id: 9002,
    suplier: demoSuppliers[1],
    payment_reference_id: "SUP-PAY-2026-033",
    payment_date: "2026-10-06",
    total_amount: 126000,
    payment_method: "Cheque",
    payment_status: "Confirmed",
    orders_count: 1,
    supplier_order_payments: [
      {
        id: 9713,
        supplier_order: {
          purchased_reference_id: "PO-2026-003",
          due_amount: 0,
        },
      },
    ],
  },
]);

export const demoSalesDetailedRows = reactive([
  {
    id: 9799,
    invoice_no: "INV-0910",
    order_reference_id: "SHOP-2026-0910",
    order_date: "2026-08-25",
    order_amount: 20400,
    total_paid_amount: 0,
    total_due_amount: 20400,
    shop: demoCustomerShops[0],
    distributer: { id: 93021, distributer_name: "Colombo Central Showroom" },
    salesrep: { id: 93031, rep_name: "Nimali Perera" },
    courier: { company_name: "City Express" },
    distributer_salesrep_shop_order_items: [
      {
        product_code: "TEA-001",
        product_name: "Ceylon Breakfast Tea",
        product_type: "Solid",
        product_weight: 0.25,
        product_volume: 0,
        pivot: { quantity: 30, unit_price: 680, discounted_price: 680, return_quantity: 0, return_value: 0 },
      },
    ],
    return_count_summation: 0,
    return_amount_summation: 0,
  },
  {
    id: 9798,
    invoice_no: "INV-0880",
    order_reference_id: "SHOP-2026-0880",
    order_date: "2026-06-01",
    order_amount: 13600,
    total_paid_amount: 3600,
    total_due_amount: 10000,
    shop: demoCustomerShops[1],
    distributer: null,
    salesrep: null,
    courier: null,
    distributer_salesrep_shop_order_items: [
      {
        product_code: "TEA-001",
        product_name: "Ceylon Breakfast Tea",
        product_type: "Solid",
        product_weight: 0.25,
        product_volume: 0,
        pivot: { quantity: 20, unit_price: 680, discounted_price: 680, return_quantity: 0, return_value: 0 },
      },
    ],
    return_count_summation: 0,
    return_amount_summation: 0,
  },
  {
    id: 9801,
    invoice_no: "INV-1041",
    order_reference_id: "SHOP-2026-1041",
    order_date: "2026-10-01",
    order_amount: 20400,
    total_paid_amount: 5900,
    total_due_amount: 14500,
    shop: demoCustomerShops[0],
    distributer: { id: 93021, distributer_name: "Colombo Central Showroom" },
    salesrep: { id: 93031, rep_name: "Nimali Perera" },
    courier: { company_name: "City Express" },
    distributer_salesrep_shop_order_items: [
      {
        product_code: "TEA-001",
        product_name: "Ceylon Breakfast Tea",
        product_type: "Solid",
        product_weight: 0.25,
        product_volume: 0,
        pivot: {
          quantity: 30,
          unit_price: 680,
          discounted_price: 680,
          return_quantity: 2,
          return_value: 1360,
        },
      },
    ],
    return_count_summation: 2,
    return_amount_summation: 1360,
  },
  {
    id: 9802,
    invoice_no: "INV-1088",
    order_reference_id: "SHOP-2026-1088",
    order_date: "2026-10-06",
    order_amount: 24500,
    total_paid_amount: 10000,
    total_due_amount: 14500,
    shop: demoCustomerShops[0],
    distributer: { id: 93021, distributer_name: "Colombo Central Showroom" },
    salesrep: { id: 93031, rep_name: "Nimali Perera" },
    courier: { company_name: "City Express" },
    distributer_salesrep_shop_order_items: [
      {
        product_code: "COF-002",
        product_name: "Roasted Coffee Beans",
        product_type: "Solid",
        product_weight: 1,
        product_volume: 0,
        pivot: {
          quantity: 10,
          unit_price: 2450,
          discounted_price: 0,
          return_quantity: 0,
          return_value: 0,
        },
      },
    ],
    return_count_summation: 0,
    return_amount_summation: 0,
  },
  {
    id: 9803,
    invoice_no: "INV-1093",
    order_reference_id: "SHOP-2026-1093",
    order_date: "2026-10-07",
    order_amount: 13600,
    total_paid_amount: 0,
    total_due_amount: 13600,
    shop: demoCustomerShops[1],
    distributer: null,
    salesrep: null,
    courier: null,
    distributer_salesrep_shop_order_items: [
      {
        product_code: "TEA-001",
        product_name: "Ceylon Breakfast Tea",
        product_type: "Solid",
        product_weight: 0.25,
        product_volume: 0,
        pivot: {
          quantity: 20,
          unit_price: 680,
          discounted_price: 680,
          return_quantity: 0,
          return_value: 0,
        },
      },
    ],
    return_count_summation: 0,
    return_amount_summation: 0,
  },
]);

export const demoSalesAreas = [
  { id: 93011, area_name: "Colombo Fort" },
  { id: 93012, area_name: "Kandy" },
];
export const demoDistributors = [
  { id: 93021, distributer_name: "Colombo Central Showroom" },
];
export const demoSalesReps = [{ id: 93031, rep_name: "Nimali Perera" }];

function matchesDate(date, startdate, enddate) {
  return (!startdate || date >= startdate) && (!enddate || date <= enddate);
}

export function getDemoIncomingPayments(filters = {}) {
  const search = String(filters.searchdata || "").toLowerCase();
  return demoIncomingPayments.filter((payment) =>
    (!filters.shop_id || String(payment.shops_id) === String(filters.shop_id)) &&
    (!search || `${payment.payment_code} ${payment.payment_invoices[0]?.order_reference_id}`.toLowerCase().includes(search)) &&
    matchesDate(payment.payment_date, filters.startdate, filters.enddate) &&
    (!filters.payment_status || payment.status === filters.payment_status),
  );
}

export function getDemoSupplierPayments(filters = {}) {
  const search = String(filters.searchdata || "").toLowerCase();
  return demoSupplierPayments.filter((payment) =>
    (!filters.suplier_id || String(payment.supplier_id) === String(filters.suplier_id)) &&
    (!search || payment.payment_reference_id.toLowerCase().includes(search)) &&
    matchesDate(payment.payment_date, filters.startdate, filters.enddate) &&
    (!filters.payment_status || payment.payment_status === filters.payment_status),
  );
}

export function getDemoSalesDetailedRows(filters = {}) {
  const search = String(filters.searchdata || "").toLowerCase();
  return demoSalesDetailedRows.filter((row) =>
    (!filters.shop_id || String(row.shop.id) === String(filters.shop_id)) &&
    (!filters.distributor_id || String(row.distributer?.id) === String(filters.distributor_id)) &&
    (!filters.salesrep_id || String(row.salesrep?.id) === String(filters.salesrep_id)) &&
    (!filters.area_id || String(row.shop.area_id) === String(filters.area_id)) &&
    (!search || `${row.invoice_no} ${row.order_reference_id} ${row.shop.shop_name}`.toLowerCase().includes(search)) &&
    matchesDate(row.order_date, filters.startdate, filters.enddate),
  );
}

export function getDemoSalesSummaryRows(filters = {}) {
  const orders = demoSalesDetailedRows.filter((row) =>
    (!filters.shop_id || String(row.shop.id) === String(filters.shop_id)) &&
    (!filters.distributor_id || String(row.distributer?.id) === String(filters.distributor_id)) &&
    (!filters.salesrep_id || String(row.salesrep?.id) === String(filters.salesrep_id)) &&
    matchesDate(row.order_date, filters.startdate, filters.enddate),
  );
  const products = new Map();

  orders.forEach((order) => {
    (order.distributer_salesrep_shop_order_items || []).forEach((line) => {
      const key = line.product_code;
      if (!products.has(key)) {
        products.set(key, {
          id: key,
          product_code: key,
          product_name: line.product_name,
          product_type: line.product_type,
          product_weight: line.product_weight,
          product_volume: line.product_volume,
          distributer_distributed_products: 0,
          rep_distributed_products: 0,
          quantity: 0,
          sales_amount: 0,
          return_quantity: 0,
          return_amount: 0,
        });
      }

      const summary = products.get(key);
      const quantity = Number(line.pivot?.quantity || 0);
      const unitPrice = Number(
        line.pivot?.discounted_price || line.pivot?.unit_price || 0,
      );
      const returnQuantity = Number(line.pivot?.return_quantity || 0);
      const returnAmount = Number(line.pivot?.return_value || 0);

      summary.quantity += quantity;
      summary.sales_amount += quantity * unitPrice;
      summary.return_quantity += returnQuantity;
      summary.return_amount += returnAmount;
      if (order.distributer) summary.distributer_distributed_products += quantity;
      if (order.salesrep) summary.rep_distributed_products += quantity;
    });
  });

  const search = String(filters.searchdata || "").trim().toLowerCase();
  return [...products.values()].filter((product) =>
    !search || `${product.product_code} ${product.product_name}`.toLowerCase().includes(search),
  );
}

export function getDemoCustomerOutstandingRows(searchdata = "") {
  const customers = new Map();
  const today = new Date();
  const todayDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

  demoSalesDetailedRows.forEach((order) => {
    const paymentTermDays = Number(order.shop.payment_term_days || 30);
    const paidAmount = Number(order.total_paid_amount || 0);
    const outstandingAmount = Math.max(
      Number(order.order_amount || 0) - paidAmount,
      0,
    );
    if (outstandingAmount <= 0) return;

    const dueDate = new Date(`${order.order_date}T00:00:00.000Z`);
    dueDate.setUTCDate(dueDate.getUTCDate() + paymentTermDays);
    const expectedPaymentDate = dueDate.toISOString().slice(0, 10);
    if (dueDate > todayDate) return;
    const key = String(order.shop.id);

    if (!customers.has(key)) {
      customers.set(key, {
        id: order.shop.id,
        shop_code: order.shop.shop_code || `DEMO-${order.shop.id}`,
        shop_name: order.shop.shop_name,
        payment_term_days: paymentTermDays,
        order_count: 0,
        total_outstanding: 0,
        expected_payment_date: expectedPaymentDate,
        orders: [],
      });
    }

    const customer = customers.get(key);
    customer.order_count += 1;
    customer.total_outstanding += outstandingAmount;
    if (expectedPaymentDate < customer.expected_payment_date) {
      customer.expected_payment_date = expectedPaymentDate;
    }
    customer.orders.push({
      id: order.id,
      order_reference_id: order.order_reference_id,
      invoice_no: order.invoice_no,
      order_date: order.order_date,
      order_amount: Number(order.order_amount || 0),
      paid_amount: paidAmount,
      outstanding_amount: outstandingAmount,
      expected_payment_date: expectedPaymentDate,
      products: (order.distributer_salesrep_shop_order_items || []).map((item) => ({
        product_code: item.product_code,
        product_name: item.product_name,
        quantity: Number(item.pivot?.quantity || 0),
        returned_quantity: Number(item.pivot?.return_quantity || 0),
        unit_price: Number(item.pivot?.unit_price || 0),
        return_value: Number(item.pivot?.return_value || 0),
      })),
    });
  });

  const search = String(searchdata || "").trim().toLowerCase();
  return [...customers.values()].filter((customer) =>
    !search || `${customer.shop_code} ${customer.shop_name}`.toLowerCase().includes(search),
  );
}

export function findDemoSupplier(id) {
  return demoSuppliers.find((supplier) => String(supplier.id) === String(id));
}

export function findDemoPurchaseOrder(orderId, supplierId) {
  const supplier = findDemoSupplier(supplierId);
  return supplier?.suplier_orders.find((order) => String(order.id) === String(orderId));
}

export function findDemoReturn(id) {
  return demoReturns.find((returnRow) => String(returnRow.id) === String(id));
}

export function getDemoShopProducts(shopId) {
  const products = new Map();
  demoShopOrders
    .filter((order) => String(order.shop_id) === String(shopId))
    .forEach((order) => {
      if (!products.has(order.product_id)) {
        products.set(order.product_id, {
          product_id: order.product_id,
          product_code: order.product_code,
          product_name: order.product_name,
          model_number: order.product_code,
        });
      }
    });
  return [...products.values()];
}

export function getDemoOrdersForProduct(shopId, productId) {
  return demoShopOrders
    .filter(
      (order) =>
        String(order.shop_id) === String(shopId) &&
        String(order.product_id) === String(productId),
    )
    .map((order) => ({
      ...order,
      discounted_price: null,
      returnable_quantity: Math.max(0, order.quantity - order.returned_quantity),
    }));
}

export function addDemoReturn({ shop, product, returnOrders, returnDate, returnCode }) {
  const rows = returnOrders.map((row) => {
    const order = demoShopOrders.find((item) => item.id === row.shop_order_id);
    if (order) order.returned_quantity += Number(row.quantity || 0);
    return {
      order,
      row,
    };
  });
  const firstOrder = rows[0]?.order;
  const returnProducts = rows.map(({ row }) => ({
    product_code: product.product_code,
    product_name: product.product_name,
    product_type: "Beverage",
    product_weight: 0.25,
    product_volume: 0,
    pivot: {
      unit_price: Number(row.product_price || 0),
      return_count: Number(row.quantity || 0),
      return_amount: Number(row.amount || 0),
      reason_type: row.reason_type,
    },
  }));
  const returnRow = {
    id: `demo-return-${Date.now()}`,
    shop_id: shop.id,
    shop_name: shop.shop_name,
    return_code: returnCode,
    return_date: returnDate,
    order_reference_id: firstOrder?.order_reference_id || "",
    invoice_no: firstOrder?.invoice_no || "",
    order_amount: firstOrder?.order_amount || 0,
    return_amount: returnProducts.reduce(
      (total, item) => total + item.pivot.return_amount,
      0,
    ),
    last_updated_by: "Admin",
    return_products: returnProducts,
  };
  demoReturns.unshift(returnRow);
  return returnRow;
}
