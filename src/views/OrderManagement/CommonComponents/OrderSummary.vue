<template>
  <div class="order_management">
    <!-- back button -->
    <v-btn
      class="back_button"
      variant="none"
      @click="$router.back()"
      elevation="6"
    >
      <v-icon icon="tabler-chevron-left" class="text"></v-icon>
      <span class="text pl-2">Back</span></v-btn
    >
    <v-skeleton-loader
      :loading="loading"
      style="background-color: transparent"
      type="image, list-item-two-line"
    >
      <v-responsive>
        <!-- factory order summary -->
        <div
          class="order_summary"
          v-if="$route.params.summary_type === 'factoryorder'"
        >
          <v-row class="pt-5">
            <v-col lg="4" class="pt-5">
              <h2 class="order_id_title">
                {{ summary.main_order_details.order_reference_id }} - Factory
                Order
              </h2>
            </v-col>
            <v-col lg="8" cols="12" class="text-right"> </v-col>
          </v-row>

          <!-- content -->
          <div class="pt-16">
            <span class="sub_title">Summary</span>

            <div class="pt-4">
              <div class="hrclass_one"></div>
            </div>

            <!-- summary order details -->

            <div class="pt-10">
              <v-row>
                <v-col lg="6" cols="12">
                  <v-row>
                    <v-col lg="5">
                      <span class="item_header"></span>Order Created Date
                    </v-col>
                    <v-col lg="7">
                      <span class="item_text">{{
                        summary.main_order_details.date
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col lg="6" cols="12">
                  <v-row>
                    <v-col lg="5">
                      <span class="item_header"></span>Full Order Value
                    </v-col>
                    <v-col lg="7">
                      <span class="item_text">{{
                        getPrice(summary.main_order_details.amount)
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col lg="6" v>
                  <v-row>
                    <v-col lg="5">
                      <span class="item_header"></span>Number of products
                    </v-col>
                    <v-col lg="7">
                      <span class="item_text">{{
                        summary.main_order_details.order_product_count
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col lg="6" cols="12">
                  <v-row>
                    <v-col lg="5">
                      <span class="item_header"></span>Number of Distributors
                    </v-col>
                    <v-col lg="7">
                      <span class="item_text">{{
                        summary.main_order_details.distributor_count
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col lg="6" cols="12">
                  <v-row>
                    <v-col lg="5">
                      <span class="item_header"></span>Number of Sales Reps
                    </v-col>
                    <v-col lg="7">
                      <span class="item_text">{{
                        summary.main_order_details.salesrep_count
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col lg="6" cols="12">
                  <v-row>
                    <v-col lg="5">
                      <span class="item_header"></span>Number Of Shops
                    </v-col>
                    <v-col lg="7">
                      <span class="item_text">{{
                        summary.main_order_details.shop_count
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col lg="6" cols="12">
                  <v-row>
                    <v-col lg="5">
                      <span class="item_header"></span>Total Distributor
                      Commission
                    </v-col>
                    <v-col lg="7">
                      <span class="item_text">{{
                        getPrice(
                          summary.main_order_details.distributer_commision
                        )
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col lg="6" cols="12">
                  <v-row>
                    <v-col lg="5">
                      <span class="item_header"></span>Total Sales Rep
                      Commission
                    </v-col>
                    <v-col lg="7">
                      <span class="item_text">{{
                        getPrice(summary.main_order_details.salesrep_commision)
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col lg="6" cols="12">
                  <v-row>
                    <v-col lg="5">
                      <span class="item_header"></span>Total Shop Order Amount
                    </v-col>
                    <v-col lg="7">
                      <span class="item_text">{{
                        getPrice(summary.shop_order_amount)
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col lg="6" cols="12">
                  <v-row>
                    <v-col lg="5">
                      <span class="item_header"></span>Profit
                    </v-col>
                    <v-col lg="7">
                      <span class="item_text">{{
                        getPrice(
                          summary.shop_order_amount -
                            summary.main_order_details.distributer_commision -
                            summary.main_order_details.salesrep_commision
                        )
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </div>

            <!-- full order details -->

            <div class="pt-16"></div>

            <span class="sub_title_two">Full Order</span>

            <div class="pt-4"></div>
            <div class="hrclass_two"></div>

            <div class="pt-8"></div>
            <!-- full order table -->
            <v-table min-height="300px">
              <thead>
                <tr>
                  <th class="thclass">Product Code</th>
                  <th class="thclass">Product Name</th>
                  <th class="thclass">Unit Size</th>
                  <th class="thclass">Qty</th>
                  <th class="thclass">Remain Qty</th>
                  <th class="thclass">Unit Price(Rs)</th>
                  <th class="thclass">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="product in summary.main_order_details.order_products"
                  :key="product"
                >
                  <td class="tdclass">{{ product.product_code }}</td>
                  <td class="tdclass">{{ product.product_name }}</td>
                  <td class="tdclass" v-if="product.product_type === 'Liquid'">
                    {{ getVolume(product.product_volume) }}
                  </td>
                  <td
                    class="tdclass"
                    v-else-if="product.product_type === 'Solid'"
                  >
                    {{ getWeight(product.product_weight) }}
                  </td>
                  <td class="tdclass">{{ product.pivot.quantity }}</td>
                  <td class="tdclass">{{ product.pivot.uptodate_quantity }}</td>
                  <td class="tdclass">
                    {{ getPrice(product.pivot.unit_price) }}
                  </td>
                  <td class="tdclass">{{ getPrice(product.pivot.price) }}</td>
                </tr>
              </tbody>
            </v-table>

            <div class="pt-8"></div>

            <!-- content card -->
            <div
              v-for="distributerorder in summary.distributer_chain"
              :key="distributerorder"
            >
              <v-card class="content_card" style="min-height: 323px">
                <div class="distributer_inner_view">
                  <v-row>
                    <v-col class="heading" lg="6" cols="12">
                      <span
                        >{{ distributerorder.distributer.distributer_name }} -
                        Distributer ({{
                          distributerorder.distributer.position
                        }})</span
                      >
                    </v-col>

                    <v-col lg="2" class="pt-5 text-center" cols="12">
                      <span class="sub_heading"
                        >Total Order Commision -
                        {{
                          getPrice(distributerorder.distributer_commision)
                        }}</span
                      >
                    </v-col>

                    <v-col lg="1" class="pt-5" cols="12">
                      <v-btn
                        color="transparent"
                        variant="none"
                        @click="
                          show = true;
                          modeltype = 'Distributer_Commision';
                          selectedOrderNo = distributerorder.order_reference_id;
                          (selectedOrderid = distributerorder.id),
                            (selectedCommisionvalue =
                              distributerorder.distributer_commision);
                        "
                      >
                        <img
                          src="@/assets/images/edit.png"
                          style="width: 70%"
                        />
                      </v-btn>
                    </v-col>

                    <v-col lg="3" class="pt-5 right_align_class" cols="12">
                      <v-btn
                        color="primary"
                        @click="
                          $router.push(
                            `/distributeorderinvoice/${distributerorder.id}`
                          )
                        "
                        ><span>View Invoice</span>
                      </v-btn>
                    </v-col>
                  </v-row>

                  <div class="pt-3"></div>
                  <div class="hrclass"></div>

                  <!-- distributer product table -->

                  <v-table min-height="300px">
                    <thead>
                      <tr>
                        <th class="thclass">Product Code</th>
                        <th class="thclass">Product Name</th>
                        <th class="thclass">Unit Size</th>
                        <th class="thclass">Qty</th>
                        <th class="thclass">Remain Qty</th>
                        <th class="thclass">Unit Price(Rs)</th>
                        <th class="thclass">Value(Rs)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="distributerproduct in distributerorder.distributer_order_items"
                        :key="distributerproduct"
                      >
                        <td class="tdclass">
                          {{ distributerproduct.product_code }}
                        </td>
                        <td class="tdclass">
                          {{ distributerproduct.product_name }}
                        </td>
                        <td
                          class="tdclass"
                          v-if="distributerproduct.product_type === 'Liquid'"
                        >
                          {{ getVolume(distributerproduct.product_volume) }}
                        </td>
                        <td
                          class="tdclass"
                          v-else-if="
                            distributerproduct.product_type === 'Solid'
                          "
                        >
                          {{ getWeight(distributerproduct.product_weight) }}
                        </td>

                        <td class="tdclass">
                          {{ distributerproduct.pivot.quantity }}
                        </td>

                        <td class="tdclass">
                          {{ distributerproduct.pivot.uptodate_quantity }}
                        </td>

                        <td class="tdclass">
                          {{ getPrice(distributerproduct.pivot.unit_price) }}
                        </td>
                        <td class="tdclass">
                          {{ getPrice(distributerproduct.pivot.price) }}
                        </td>
                      </tr>
                    </tbody>
                  </v-table>

                  <!-- sales rep card -->
                  <div
                    class="sales_rep_view"
                    style="min-height: 234px"
                    v-for="salesreporder in distributerorder.distributer_salesrep_orders"
                    :key="salesreporder"
                  >
                    <v-card class="content_card" style="min-height: 250px">
                      <div class="distributer_inner_view">
                        <v-row>
                          <v-col class="heading" lg="5" cols="12">
                            <span
                              >{{ salesreporder.salesrep.rep_name }} -
                              SalesRep({{
                                salesreporder.salesrep.position
                              }})</span
                            >
                          </v-col>

                          <v-col lg="3" class="pt-5 text-center" cols="12">
                            <span class="sub_heading"
                              >Total Order Commission -
                              {{
                                getPrice(salesreporder.salesrep_commision)
                              }}</span
                            >
                          </v-col>

                          <v-col lg="1" class="pt-5" cols="12">
                            <v-btn
                              color="transparent"
                              variant="none"
                              @click="
                                show = true;
                                modeltype = 'SalesRep_Commision';
                                selectedOrderNo =
                                  salesreporder.order_reference_id;
                                (selectedOrderid = salesreporder.id),
                                  (selectedCommisionvalue =
                                    salesreporder.salesrep_commision);
                              "
                            >
                              <img
                                src="@/assets/images/edit.png"
                                style="width: 70%"
                              />
                            </v-btn>
                          </v-col>

                          <v-col
                            lg="3"
                            class="pt-5 right_align_class"
                            cols="12"
                          >
                            <v-btn
                              color="primary"
                              @click="
                                $router.push(
                                  `/salesreporderinvoice/${salesreporder.id}`
                                )
                              "
                              ><span>View Invoice</span>
                            </v-btn>
                          </v-col>
                        </v-row>

                        <div class="pt-3"></div>
                        <div class="hrclass"></div>

                        <v-table
                          min-height="300px"
                          style="background-color: #eeeeee"
                        >
                          <thead>
                            <tr>
                              <th class="thclass">Product Code</th>
                              <th class="thclass">Product Name</th>
                              <th class="thclass">Unit Size</th>
                              <th class="thclass">Qty</th>
                              <th class="thclass">Remain Qty</th>
                              <th class="thclass">Unit Price(Rs)</th>
                              <th class="thclass">Value(Rs)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="salesreporderitem in salesreporder.distributer_salesrep_order_items"
                              :key="salesreporderitem"
                            >
                              <td class="tdclass">
                                {{ salesreporderitem.product_code }}
                              </td>
                              <td class="tdclass">
                                {{ salesreporderitem.product_name }}
                              </td>
                              <td
                                class="tdclass"
                                v-if="
                                  salesreporderitem.product_type === 'Liquid'
                                "
                              >
                                {{
                                  getVolume(salesreporderitem.product_volume)
                                }}
                              </td>
                              <td
                                class="tdclass"
                                v-else-if="
                                  salesreporderitem.product_type === 'Solid'
                                "
                              >
                                {{
                                  getWeight(salesreporderitem.product_weight)
                                }}
                              </td>
                              <td class="tdclass">
                                {{ salesreporderitem.pivot.quantity }}
                              </td>

                              <td class="tdclass">
                                {{ salesreporderitem.pivot.uptodate_quantity }}
                              </td>

                              <td class="tdclass">
                                {{
                                  getPrice(salesreporderitem.pivot.unit_price)
                                }}
                              </td>
                              <td class="tdclass">
                                {{ getPrice(salesreporderitem.pivot.price) }}
                              </td>
                            </tr>
                          </tbody>
                        </v-table>

                        <div class="pt-4"></div>

                        <!-- shop view -->
                        <div
                          class="shop_view"
                          style="min-height: 274px"
                          v-for="shoporder in salesreporder.distributer_salesrep_shop_orders"
                          :key="shoporder"
                        >
                          <v-row>
                            <v-col class="heading" lg="3" cols="12">
                              <span>{{ shoporder.shop.shop_name }} - Shop</span>
                            </v-col>

                            <v-col
                              lg="3"
                              class="pt-5 right_align_class"
                              cols="12"
                            >
                              <span class="sub_heading"
                                >Order Amount -
                                {{ getPrice(shoporder.order_amount) }}</span
                              >
                            </v-col>
                            <v-col
                              lg="3"
                              class="pt-5 right_align_class"
                              cols="12"
                            >
                              <v-btn
                                color="primary"
                                @click="
                                  $router.push(
                                    `/shoporderinvoice/${shoporder.id}`
                                  )
                                "
                                ><span>View Invoice</span>
                              </v-btn>
                            </v-col>

                            <v-col
                              lg="3"
                              class="pt-5 right_align_class"
                              cols="12"
                            >
                              <v-btn
                                color="primary"
                                style="width: 100%"
                                @click="
                                  $router.push(
                                    `/shoporderdeliverynote/${shoporder.id}`
                                  )
                                "
                                ><span>View Delivery Note</span>
                              </v-btn>
                            </v-col>
                          </v-row>

                          <div class="pt-3"></div>
                          <div class="hrclass"></div>

                          <v-table min-height="300px">
                            <thead>
                              <tr>
                                <th class="thclass">Product Code</th>
                                <th class="thclass">Product Name</th>
                                <th class="thclass">Unit Size</th>
                                <th class="thclass">Qty</th>
                                <th class="thclass">Unit Price(Rs)</th>
                                <th class="thclass">Discount Value</th>
                                <th class="thclass">Discounted Value</th>
                                <th class="thclass">Value(Rs)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="shoporderitem in shoporder.distributer_salesrep_shop_order_items"
                                :key="shoporderitem"
                              >
                                <td class="tdclass">
                                  {{ shoporderitem.product_code }}
                                </td>
                                <td class="tdclass">
                                  {{ shoporderitem.product_name }}
                                </td>
                                <td
                                  class="tdclass"
                                  v-if="shoporderitem.product_type === 'Liquid'"
                                >
                                  {{ getVolume(shoporderitem.product_volume) }}
                                </td>
                                <td
                                  class="tdclass"
                                  v-else-if="
                                    shoporderitem.product_type === 'Solid'
                                  "
                                >
                                  {{ getWeight(shoporderitem.product_weight) }}
                                </td>
                                <td class="tdclass">
                                  {{
                                    shoporderitem.pivot.quantity -
                                    shoporderitem.pivot.return_quantity
                                  }}
                                </td>

                                <td class="tdclass">
                                  {{ getPrice(shoporderitem.pivot.unit_price) }}
                                </td>

                                <td class="tdclass">
                                  <span
                                    v-if="
                                      shoporderitem.pivot.discount_value !==
                                      null
                                    "
                                  >
                                    {{
                                      getPrice(
                                        shoporderitem.pivot.discount_value
                                      )
                                    }}
                                  </span>
                                  <span v-else> N/A</span>
                                </td>

                                <td class="tdclass">
                                  <span
                                    v-if="
                                      shoporderitem.pivot.discounted_price !==
                                      null
                                    "
                                  >
                                    {{
                                      getPrice(
                                        shoporderitem.pivot.discounted_price
                                      )
                                    }}
                                  </span>
                                  <span v-else> N/A</span>
                                </td>

                                <td class="tdclass">
                                  {{
                                    getPrice(
                                      shoporderitem.pivot.price -
                                        shoporderitem.pivot.return_value
                                    )
                                  }}
                                </td>
                              </tr>
                            </tbody>
                          </v-table>
                        </div>
                        <div class="pt-5"></div>
                      </div>
                    </v-card>
                    <div class="pt-5"></div>
                  </div>

                  <!-- content card sub distributer-->
                  <div
                    v-if="
                      distributerorder.distributer_subdistributer_orders
                        .length !== 0
                    "
                  >
                    <div
                      v-for="subdistributer in distributerorder.distributer_subdistributer_orders"
                      :key="subdistributer"
                    >
                      <v-card class="content_card" style="min-height: 250px">
                        <div class="distributer_inner_view">
                          <!-- sales rep card -->

                          <div class="sales_rep_view" style="min-height: 234px">
                            <v-row>
                              <v-col class="heading" lg="4" cols="12">
                                <span
                                  >{{
                                    subdistributer.subdistributer
                                      .subdistributer_name
                                  }}
                                  - Sub Distributer</span
                                >
                              </v-col>

                              <v-col
                                lg="4"
                                class="pt-5 right_align_class"
                                cols="12"
                              >
                                <span class="sub_heading"
                                  >Total Order Amount -
                                  {{
                                    getPrice(subdistributer.order_amount)
                                  }}</span
                                >
                              </v-col>

                              <v-col
                                lg="4"
                                class="pt-5 right_align_class"
                                cols="12"
                              >
                                <v-btn
                                  color="primary"
                                  @click="
                                    $router.push(
                                      `/subdistributerorderinvoice/${subdistributer.id}`
                                    )
                                  "
                                  ><span>View Invoice</span>
                                </v-btn>
                              </v-col>
                            </v-row>

                            <div class="pt-3"></div>
                            <div class="hrclass"></div>

                            <v-table
                              min-height="300px"
                              style="background-color: #eeeeee"
                            >
                              <thead>
                                <tr>
                                  <th class="thclass">Product Code</th>
                                  <th class="thclass">Product Name</th>
                                  <th class="thclass">Unit Size</th>
                                  <th class="thclass">Qty</th>
                                  <th class="thclass">Unit Price(Rs)</th>
                                  <th class="thclass">Discount Value</th>
                                  <th class="thclass">Discounted Value</th>
                                  <th class="thclass">Value(Rs)</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                  v-for="subdistributerorderitem in subdistributer.subdistributer_order_items"
                                  :key="subdistributerorderitem"
                                >
                                  <td class="tdclass">
                                    {{ subdistributerorderitem.product_code }}
                                  </td>
                                  <td class="tdclass">
                                    {{ subdistributerorderitem.product_name }}
                                  </td>
                                  <td
                                    class="tdclass"
                                    v-if="
                                      subdistributerorderitem.product_type ===
                                      'Liquid'
                                    "
                                  >
                                    {{
                                      getVolume(
                                        subdistributerorderitem.product_volume
                                      )
                                    }}
                                  </td>
                                  <td
                                    class="tdclass"
                                    v-else-if="
                                      subdistributerorderitem.product_type ===
                                      'Solid'
                                    "
                                  >
                                    {{
                                      getWeight(
                                        subdistributerorderitem.product_weight
                                      )
                                    }}
                                  </td>
                                  <td class="tdclass">
                                    {{ subdistributerorderitem.pivot.quantity }}
                                  </td>
                                  <td class="tdclass">
                                    {{
                                      getPrice(
                                        subdistributerorderitem.pivot.unit_price
                                      )
                                    }}
                                  </td>

                                  <td class="tdclass">
                                    <span
                                      v-if="
                                        subdistributerorderitem.pivot
                                          .discount_value !== null
                                      "
                                    >
                                      {{
                                        getPrice(
                                          subdistributerorderitem.pivot
                                            .discount_value
                                        )
                                      }}
                                    </span>
                                    <span v-else> N/A</span>
                                  </td>

                                  <td class="tdclass">
                                    <span
                                      v-if="
                                        subdistributerorderitem.pivot
                                          .discounted_price !== null
                                      "
                                    >
                                      {{
                                        getPrice(
                                          subdistributerorderitem.pivot
                                            .discounted_price
                                        )
                                      }}
                                    </span>
                                    <span v-else> N/A</span>
                                  </td>

                                  <td class="tdclass">
                                    {{
                                      getPrice(
                                        subdistributerorderitem.pivot.price
                                      )
                                    }}
                                  </td>
                                </tr>
                              </tbody>
                            </v-table>
                            <div class="pt-5"></div>
                          </div>
                        </div>
                        <div class="pt-5"></div>
                      </v-card>
                      <div class="pt-5"></div>
                    </div>
                  </div>
                </div>
              </v-card>
              <div class="pt-5"></div>
            </div>
          </div>
        </div>

        <!-- distributer Order Summary -->
        <div
          class="order_summary"
          v-if="$route.params.summary_type === 'distributerorder'"
        >
          <v-row class="pt-5">
            <v-col lg="4" class="pt-5">
              <h2 class="order_id_title">
                {{ summary.main_order_details.order_reference_id }} -
                Distributer Order
              </h2>
            </v-col>
            <v-col lg="8" cols="12" class="text-right"> </v-col>
          </v-row>

          <!-- content -->
          <div class="pt-16">
            <span class="sub_title">Summary</span>

            <div class="pt-4">
              <div class="hrclass_one"></div>
            </div>

            <!-- summary order details -->

            <div class="pt-10">
              <v-row>
                <v-col lg="6" cols="12">
                  <v-row>
                    <v-col lg="5">
                      <span class="item_header"></span>Order Created Date
                    </v-col>
                    <v-col lg="7">
                      <span class="item_text">{{
                        summary.main_order_details.order_date
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col lg="6" cols="12">
                  <v-row>
                    <v-col lg="5">
                      <span class="item_header"></span>Full Order Value
                    </v-col>
                    <v-col lg="7">
                      <span class="item_text">{{
                        getPrice(summary.main_order_details.order_amount)
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col lg="6" v>
                  <v-row>
                    <v-col lg="5">
                      <span class="item_header"></span>Number of products
                    </v-col>
                    <v-col lg="7">
                      <span class="item_text">{{
                        summary.main_order_details
                          .distributer_order_product_count
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col
                  lg="6"
                  cols="12"
                  v-if="summary.main_order_details.subdistributer_count !== 0"
                >
                  <v-row>
                    <v-col lg="5">
                      <span class="item_header"></span>Number of Sub
                      Distributers
                    </v-col>
                    <v-col lg="7">
                      <span class="item_text">{{
                        summary.main_order_details.subdistributer_count
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col lg="6" cols="12">
                  <v-row>
                    <v-col lg="5">
                      <span class="item_header"></span>Number of Sales Reps
                    </v-col>
                    <v-col lg="7">
                      <span class="item_text">{{
                        summary.main_order_details.salesrep_count
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col lg="6" cols="12">
                  <v-row>
                    <v-col lg="5">
                      <span class="item_header"></span>Number Of Shops
                    </v-col>
                    <v-col lg="7">
                      <span class="item_text">{{
                        summary.main_order_details.shop_count
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col lg="6" cols="12">
                  <v-row>
                    <v-col lg="5">
                      <span class="item_header"></span>Total Distributor
                      Commission
                    </v-col>
                    <v-col lg="7">
                      <span class="item_text">{{
                        getPrice(
                          summary.main_order_details.distributer_commision
                        )
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>

                <!-- <v-col lg="6" cols="12">
                  <v-row>
                    <v-col lg="5">
                      <span class="item_header"></span>Total Sales Rep
                      Commission
                    </v-col>
                    <v-col lg="7">
                      <span class="item_text">{{
                        getPrice(summary.salesrep_full_commsion)
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col> -->

                <v-col lg="6" cols="12">
                  <v-row>
                    <v-col lg="5">
                      <span class="item_header"></span>Total Shop Order Amount
                    </v-col>
                    <v-col lg="7">
                      <span class="item_text">{{
                        getPrice(summary.shop_order_amount)
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col
                  lg="6"
                  cols="12"
                  v-if="
                    summary.main_order_details.distributer_commision !== null
                  "
                >
                  <v-btn
                    @click="
                      show = true;
                      modeltype = 'Distributer_Commision';
                      selectedOrderNo =
                        summary.main_order_details.order_reference_id;
                      (selectedOrderid = summary.main_order_details.id),
                        (selectedCommisionvalue =
                          summary.main_order_details.distributer_commision);
                    "
                  >
                    Edit Order Commision
                  </v-btn>
                </v-col>
              </v-row>
            </div>

            <!-- full order details -->

            <div class="pt-16"></div>

            <span class="sub_title_two">Full Received Order</span>

            <div class="pt-4"></div>
            <div class="hrclass_two"></div>

            <div class="pt-8"></div>

            <v-table min-height="300px">
              <thead>
                <tr>
                  <th class="thclass">Product Code</th>
                  <th class="thclass">Product Name</th>
                  <th class="thclass">Unit Size</th>
                  <th class="thclass">Qty</th>
                  <th class="thclass">Remaining Qty</th>
                  <th class="thclass">Unit Price(Rs)</th>
                  <th class="thclass">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="product in summary.main_order_details
                    .distributer_order_items"
                  :key="product"
                >
                  <td class="tdclass">{{ product.product_code }}</td>
                  <td class="tdclass">{{ product.product_name }}</td>
                  <td class="tdclass" v-if="product.product_type === 'Liquid'">
                    {{ getVolume(product.product_volume) }}
                  </td>
                  <td
                    class="tdclass"
                    v-else-if="product.product_type === 'Solid'"
                  >
                    {{ getWeight(product.product_weight) }}
                  </td>
                  <td class="tdclass">{{ product.pivot.quantity }}</td>
                  <td class="tdclass">{{ product.pivot.uptodate_quantity }}</td>
                  <td class="tdclass">
                    {{ getPrice(product.pivot.unit_price) }}
                  </td>
                  <td class="tdclass">{{ getPrice(product.pivot.price) }}</td>
                </tr>
              </tbody>
            </v-table>

            <div class="pt-8"></div>

            <!-- content card  sales rep-->
            <div
              v-for="salesreporder in summary.sales_rep_chain"
              :key="salesreporder"
            >
              <v-card class="content_card" style="min-height: 250px">
                <div class="distributer_inner_view">
                  <!-- sales rep card -->

                  <div class="sales_rep_view" style="min-height: 234px">
                    <v-row>
                      <v-col class="heading" lg="5" cols="12">
                        <span
                          >{{ salesreporder.salesrep.rep_name }} - SalesRep({{
                            salesreporder.salesrep.position
                          }})</span
                        >
                      </v-col>

                      <v-col lg="3" class="pt-5 text-center" cols="12">
                        <!-- <span class="sub_heading"
                          >Total Order Commission -
                          {{ getPrice(salesreporder.salesrep_commision) }}</span
                        > -->
                      </v-col>

                      <v-col lg="4" class="pt-5 right_align_class" cols="12">
                        <v-btn
                          color="primary"
                          @click="
                            $router.push(
                              `/salesreporderinvoice/${salesreporder.id}`
                            )
                          "
                          ><span>View Invoice</span>
                        </v-btn>
                      </v-col>
                    </v-row>

                    <div class="pt-3"></div>
                    <div class="hrclass"></div>

                    <v-table
                      min-height="300px"
                      style="background-color: #eeeeee"
                    >
                      <thead>
                        <tr>
                          <th class="thclass">Product Code</th>
                          <th class="thclass">Product Name</th>
                          <th class="thclass">Unit Size</th>
                          <th class="thclass">Qty</th>
                          <th class="thclass">Remaining Qty</th>
                          <th class="thclass">Unit Price(Rs)</th>
                          <th class="thclass">Value(Rs)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="salesreporderitem in salesreporder.distributer_salesrep_order_items"
                          :key="salesreporderitem"
                        >
                          <td class="tdclass">
                            {{ salesreporderitem.product_code }}
                          </td>
                          <td class="tdclass">
                            {{ salesreporderitem.product_name }}
                          </td>
                          <td
                            class="tdclass"
                            v-if="salesreporderitem.product_type === 'Liquid'"
                          >
                            {{ getVolume(salesreporderitem.product_volume) }}
                          </td>
                          <td
                            class="tdclass"
                            v-else-if="
                              salesreporderitem.product_type === 'Solid'
                            "
                          >
                            {{ getWeight(salesreporderitem.product_weight) }}
                          </td>
                          <td class="tdclass">
                            {{ salesreporderitem.pivot.quantity }}
                          </td>

                          <td class="tdclass">
                            {{ salesreporderitem.pivot.uptodate_quantity }}
                          </td>

                          <td class="tdclass">
                            {{ getPrice(salesreporderitem.pivot.unit_price) }}
                          </td>
                          <td class="tdclass">
                            {{ getPrice(salesreporderitem.pivot.price) }}
                          </td>
                        </tr>
                      </tbody>
                    </v-table>

                    <div class="pt-4"></div>

                    <!-- shop view -->
                    <div
                      class="shop_view"
                      style="min-height: 274px"
                      v-for="shoporder in salesreporder.distributer_salesrep_shop_orders"
                      :key="shoporder"
                    >
                      <v-row>
                        <v-col class="heading" lg="3" cols="12">
                          <span>{{ shoporder.shop.shop_name }} - Shop</span>
                        </v-col>

                        <v-col lg="3" class="pt-5 right_align_class" cols="12">
                          <span class="sub_heading"
                            >Order Amount -
                            {{ getPrice(shoporder.order_amount) }}</span
                          >
                        </v-col>
                        <v-col lg="3" class="pt-5 right_align_class" cols="12">
                          <v-btn
                            color="primary"
                            @click="
                              $router.push(`/shoporderinvoice/${shoporder.id}`)
                            "
                            ><span>View Invoice</span>
                          </v-btn>
                        </v-col>

                        <v-col lg="3" class="pt-5 right_align_class" cols="12">
                          <v-btn
                            color="primary"
                            style="width: 100%"
                            @click="
                              $router.push(
                                `/shoporderdeliverynote/${shoporder.id}`
                              )
                            "
                            ><span>View Delivery Note</span>
                          </v-btn>
                        </v-col>
                      </v-row>

                      <div class="pt-3"></div>
                      <div class="hrclass"></div>

                      <v-table min-height="300px">
                        <thead>
                          <tr>
                            <th class="thclass">Product Code</th>
                            <th class="thclass">Product Name</th>
                            <th class="thclass">Unit Size</th>
                            <th class="thclass">Qty</th>
                            <th class="thclass">Unit Price(Rs)</th>
                            <th class="thclass">Discount Value</th>
                            <th class="thclass">Discounted Value</th>
                            <th class="thclass">Value(Rs)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="shoporderitem in shoporder.distributer_salesrep_shop_order_items"
                            :key="shoporderitem"
                          >
                            <td class="tdclass">
                              {{ shoporderitem.product_code }}
                            </td>
                            <td class="tdclass">
                              {{ shoporderitem.product_name }}
                            </td>
                            <td
                              class="tdclass"
                              v-if="shoporderitem.product_type === 'Liquid'"
                            >
                              {{ getVolume(shoporderitem.product_volume) }}
                            </td>
                            <td
                              class="tdclass"
                              v-else-if="shoporderitem.product_type === 'Solid'"
                            >
                              {{ getWeight(shoporderitem.product_weight) }}
                            </td>
                            <td class="tdclass">
                              {{
                                shoporderitem.pivot.quantity -
                                shoporderitem.pivot.return_quantity
                              }}
                            </td>
                            <td class="tdclass">
                              {{ getPrice(shoporderitem.pivot.unit_price) }}
                            </td>

                            <td class="tdclass">
                              <span
                                v-if="
                                  shoporderitem.pivot.discount_value !== null
                                "
                              >
                                {{
                                  getPrice(shoporderitem.pivot.discount_value)
                                }}
                              </span>
                              <span v-else> N/A</span>
                            </td>

                            <td class="tdclass">
                              <span
                                v-if="
                                  shoporderitem.pivot.discounted_price !== null
                                "
                              >
                                {{
                                  getPrice(shoporderitem.pivot.discounted_price)
                                }}
                              </span>
                              <span v-else> N/A</span>
                            </td>

                            <td class="tdclass">
                              {{
                                getPrice(
                                  shoporderitem.pivot.price -
                                    shoporderitem.pivot.return_value
                                )
                              }}
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                    </div>
                    <div class="pt-5"></div>
                  </div>
                </div>
                <div class="pt-5"></div>
              </v-card>
              <div class="pt-5"></div>
            </div>

            <!-- content card sub distributer-->
            <div v-if="summary.subdistributer_chain.length !== 0">
              <div
                v-for="subdistributer in summary.subdistributer_chain"
                :key="subdistributer"
              >
                <v-card class="content_card" style="min-height: 250px">
                  <div class="distributer_inner_view">
                    <!-- sales rep card -->

                    <div class="sales_rep_view" style="min-height: 234px">
                      <v-row>
                        <v-col class="heading" lg="4" cols="12">
                          <span
                            >{{
                              subdistributer.subdistributer.subdistributer_name
                            }}
                            - Sub Distributer</span
                          >
                        </v-col>

                        <v-col lg="4" class="pt-5 right_align_class" cols="12">
                          <span class="sub_heading"
                            >Total Order Amount -
                            {{ getPrice(subdistributer.order_amount) }}</span
                          >
                        </v-col>

                        <v-col lg="4" class="pt-5 right_align_class" cols="12">
                          <v-btn
                            color="primary"
                            @click="
                              $router.push(
                                `/subdistributerorderinvoice/${subdistributer.id}`
                              )
                            "
                            ><span>View Invoice</span>
                          </v-btn>
                        </v-col>
                      </v-row>

                      <div class="pt-3"></div>
                      <div class="hrclass"></div>

                      <v-table
                        min-height="300px"
                        style="background-color: #eeeeee"
                      >
                        <thead>
                          <tr>
                            <th class="thclass">Product Code</th>
                            <th class="thclass">Product Name</th>
                            <th class="thclass">Unit Size</th>
                            <th class="thclass">Qty</th>
                            <th class="thclass">Unit Price(Rs)</th>
                            <th class="thclass">Discount Value</th>
                            <th class="thclass">Discounted Value</th>
                            <th class="thclass">Value(Rs)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="subdistributerorderitem in subdistributer.subdistributer_order_items"
                            :key="subdistributerorderitem"
                          >
                            <td class="tdclass">
                              {{ subdistributerorderitem.product_code }}
                            </td>
                            <td class="tdclass">
                              {{ subdistributerorderitem.product_name }}
                            </td>
                            <td
                              class="tdclass"
                              v-if="
                                subdistributerorderitem.product_type ===
                                'Liquid'
                              "
                            >
                              {{
                                getVolume(
                                  subdistributerorderitem.product_volume
                                )
                              }}
                            </td>
                            <td
                              class="tdclass"
                              v-else-if="
                                subdistributerorderitem.product_type === 'Solid'
                              "
                            >
                              {{
                                getWeight(
                                  subdistributerorderitem.product_weight
                                )
                              }}
                            </td>
                            <td class="tdclass">
                              {{ subdistributerorderitem.pivot.quantity }}
                            </td>
                            <td class="tdclass">
                              {{
                                getPrice(
                                  subdistributerorderitem.pivot.unit_price
                                )
                              }}
                            </td>

                            <td class="tdclass">
                              <span
                                v-if="
                                  subdistributerorderitem.pivot
                                    .discount_value !== null
                                "
                              >
                                {{
                                  getPrice(
                                    subdistributerorderitem.pivot.discount_value
                                  )
                                }}
                              </span>
                              <span v-else> N/A</span>
                            </td>

                            <td class="tdclass">
                              <span
                                v-if="
                                  subdistributerorderitem.pivot
                                    .discounted_price !== null
                                "
                              >
                                {{
                                  getPrice(
                                    subdistributerorderitem.pivot
                                      .discounted_price
                                  )
                                }}
                              </span>
                              <span v-else> N/A</span>
                            </td>

                            <td class="tdclass">
                              {{
                                getPrice(subdistributerorderitem.pivot.price)
                              }}
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                      <div class="pt-5"></div>
                    </div>
                  </div>
                  <div class="pt-5"></div>
                </v-card>
                <div class="pt-5"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- sales rep  Order Summary -->
        <div
          class="order_summary"
          v-if="$route.params.summary_type === 'salesreporder'"
        >
          <v-row class="pt-5">
            <v-col lg="4" class="pt-5">
              <h2 class="order_id_title">
                {{ summary.main_order_details.order_reference_id }} - Sales Rep
                Order
              </h2>
            </v-col>
            <v-col lg="8" cols="12" class="text-right"> </v-col>
          </v-row>

          <!-- content -->
          <div class="pt-16">
            <span class="sub_title">Summary</span>

            <div class="pt-4">
              <div class="hrclass_one"></div>
            </div>

            <!-- summary order details -->

            <div class="pt-10">
              <v-row>
                <v-col lg="6" cols="12">
                  <v-row>
                    <v-col lg="5">
                      <span class="item_header"></span>Order Created Date
                    </v-col>
                    <v-col lg="7">
                      <span class="item_text">{{
                        summary.main_order_details.order_date
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col lg="6" cols="12">
                  <v-row>
                    <v-col lg="5">
                      <span class="item_header"></span>Full Order Value
                    </v-col>
                    <v-col lg="7">
                      <span class="item_text">{{
                        getPrice(summary.main_order_details.order_amount)
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col lg="6">
                  <v-row>
                    <v-col lg="5">
                      <span class="item_header"></span>Number of products
                    </v-col>
                    <v-col lg="7">
                      <span class="item_text">{{
                        summary.main_order_details.product_count
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col lg="6" cols="12">
                  <v-row>
                    <v-col lg="5">
                      <span class="item_header"></span>Number Of Shops
                    </v-col>
                    <v-col lg="7">
                      <span class="item_text">{{
                        summary.main_order_details.shop_count
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col lg="6" cols="12">
                  <v-row>
                    <v-col lg="5">
                      <span class="item_header"></span>Total Sales Rep
                      Commission
                    </v-col>
                    <v-col lg="7">
                      <span class="item_text">{{
                        getPrice(summary.main_order_details.salesrep_commision)
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col lg="6" cols="12">
                  <v-row>
                    <v-col lg="5">
                      <span class="item_header"></span>Total Shop Order Amount
                    </v-col>
                    <v-col lg="7">
                      <span class="item_text">{{
                        getPrice(summary.shop_order_amount)
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col
                  lg="6"
                  cols="12"
                  v-if="summary.main_order_details.salesrep_commision !== null"
                >
                  <v-btn
                    @click="
                      show = true;
                      modeltype = 'SalesRep_Commision';
                      selectedOrderNo =
                        summary.main_order_details.order_reference_id;
                      (selectedOrderid = summary.main_order_details.id),
                        (selectedCommisionvalue =
                          summary.main_order_details.salesrep_commision);
                    "
                  >
                    Edit Order Commision
                  </v-btn>
                </v-col>
              </v-row>
            </div>

            <!-- full order details -->

            <div class="pt-16"></div>

            <span class="sub_title_two">Full Order</span>

            <div class="pt-4"></div>
            <div class="hrclass_two"></div>

            <div class="pt-8"></div>

            <v-table min-height="300px">
              <thead>
                <tr>
                  <th class="thclass">Product Code</th>
                  <th class="thclass">Product Name</th>
                  <th class="thclass">Unit Size</th>
                  <th class="thclass">Qty</th>
                  <th class="thclass">Remaining Qty</th>
                  <th class="thclass">Unit Price(Rs)</th>
                  <th class="thclass">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="product in summary.main_order_details
                    .distributer_salesrep_order_items"
                  :key="product"
                >
                  <td class="tdclass">{{ product.product_code }}</td>
                  <td class="tdclass">{{ product.product_name }}</td>
                  <td class="tdclass" v-if="product.product_type === 'Liquid'">
                    {{ getVolume(product.product_volume) }}
                  </td>
                  <td
                    class="tdclass"
                    v-else-if="product.product_type === 'Solid'"
                  >
                    {{ getWeight(product.product_weight) }}
                  </td>
                  <td class="tdclass">{{ product.pivot.quantity }}</td>

                  <td class="tdclass">{{ product.pivot.uptodate_quantity }}</td>
                  <td class="tdclass">
                    {{ getPrice(product.pivot.unit_price) }}
                  </td>
                  <td class="tdclass">{{ getPrice(product.pivot.price) }}</td>
                </tr>
              </tbody>
            </v-table>

            <div class="pt-8"></div>

            <!-- content card -->

            <v-card class="content_card" style="min-height: 340px">
              <div class="distributer_inner_view">
                <!-- sales rep card -->
                <div class="sales_rep_view" style="min-height: 320px">
                  <!-- shop view -->
                  <div
                    class="shop_view"
                    style="min-height: 274px"
                    v-for="shoporder in summary.distributer_chain"
                    :key="shoporder"
                  >
                    <v-row>
                      <v-col class="heading" lg="3" cols="12">
                        <span>{{ shoporder.shop.shop_name }} - Shop</span>
                      </v-col>

                      <v-col lg="3" class="pt-5 right_align_class" cols="12">
                        <span class="sub_heading"
                          >Order Amount -
                          {{ getPrice(shoporder.order_amount) }}</span
                        >
                      </v-col>
                      <v-col lg="3" class="pt-5 right_align_class" cols="12">
                        <v-btn
                          color="primary"
                          @click="
                            $router.push(`/shoporderinvoice/${shoporder.id}`)
                          "
                          ><span>View Invoice</span>
                        </v-btn>
                      </v-col>

                      <v-col lg="3" class="pt-5 right_align_class" cols="12">
                        <v-btn
                          color="primary"
                          style="width: 100%"
                          @click="
                            $router.push(
                              `/shoporderdeliverynote/${shoporder.id}`
                            )
                          "
                          ><span>View Delivery Note</span>
                        </v-btn>
                      </v-col>
                    </v-row>

                    <div class="pt-3"></div>
                    <div class="hrclass"></div>

                    <v-table min-height="300px">
                      <thead>
                        <tr>
                          <th class="thclass">Product Code</th>
                          <th class="thclass">Product Name</th>
                          <th class="thclass">Unit Size</th>
                          <th class="thclass">Qty</th>
                          <th class="thclass">Unit Price(Rs)</th>
                          <th class="thclass">Discount Value</th>
                          <th class="thclass">Discounted Value</th>
                          <th class="thclass">Value(Rs)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="shoporderitem in shoporder.distributer_salesrep_shop_order_items"
                          :key="shoporderitem"
                        >
                          <td class="tdclass">
                            {{ shoporderitem.product_code }}
                          </td>
                          <td class="tdclass">
                            {{ shoporderitem.product_name }}
                          </td>
                          <td
                            class="tdclass"
                            v-if="shoporderitem.product_type === 'Liquid'"
                          >
                            {{ getVolume(shoporderitem.product_volume) }}
                          </td>
                          <td
                            class="tdclass"
                            v-else-if="shoporderitem.product_type === 'Solid'"
                          >
                            {{ getWeight(shoporderitem.product_weight) }}
                          </td>
                          <td class="tdclass">
                            {{
                              shoporderitem.pivot.quantity -
                              shoporderitem.pivot.return_quantity
                            }}
                          </td>
                          <td class="tdclass">
                            {{ getPrice(shoporderitem.pivot.unit_price) }}
                          </td>

                          <td class="tdclass">
                            <span
                              v-if="shoporderitem.pivot.discount_value !== null"
                            >
                              {{ getPrice(shoporderitem.pivot.discount_value) }}
                            </span>
                            <span v-else> N/A</span>
                          </td>

                          <td class="tdclass">
                            <span
                              v-if="
                                shoporderitem.pivot.discounted_price !== null
                              "
                            >
                              {{
                                getPrice(shoporderitem.pivot.discounted_price)
                              }}
                            </span>
                            <span v-else> N/A</span>
                          </td>

                          <td class="tdclass">
                            {{
                              getPrice(
                                shoporderitem.pivot.price -
                                  shoporderitem.pivot.return_value
                              )
                            }}
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </div>
                </div>
              </div>
            </v-card>
          </div>
        </div>
      </v-responsive>
    </v-skeleton-loader>

    <!-- diallog box  -->

    <v-dialog
      v-model="show"
      max-width="758.3px"
      min-height="216.97px"
      persistent=""
    >
      <v-card>
        <!-- close button -->
        <div class="text-right">
          <v-btn color="transparent" variant="none" @click="show = false">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="icon icon-tabler icons-tabler-filled icon-tabler-square-x"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M19 2h-14a3 3 0 0 0 -3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3 -3v-14a3 3 0 0 0 -3 -3zm-9.387 6.21l.094 .083l2.293 2.292l2.293 -2.292a1 1 0 0 1 1.497 1.32l-.083 .094l-2.292 2.293l2.292 2.293a1 1 0 0 1 -1.32 1.497l-.094 -.083l-2.293 -2.292l-2.293 2.292a1 1 0 0 1 -1.497 -1.32l.083 -.094l2.292 -2.293l-2.292 -2.293a1 1 0 0 1 1.32 -1.497z"
              />
            </svg>
          </v-btn>
        </div>

        <!-- card title -->
        <v-card-title>
          <span v-if="modeltype === 'Distributer_Commision'">{{
            `Edit Distributer Commision For ` + selectedOrderNo
          }}</span>

          <span v-else>{{
            `Edit SalesRep Commision For ` + selectedOrderNo
          }}</span>
        </v-card-title>

        <v-card-text>
          <div>
            <v-text-field
              :placeholder="
                modeltype === 'Distributer_Commision'
                  ? 'Distributer Commision'
                  : 'SalesRep Commision'
              "
              class="product_input"
              v-model="selectedCommisionvalue"
            >
            </v-text-field>

            <div class="pt-5"></div>

            <v-btn
              color="primary"
              block
              @click="changeCommision()"
              :loading="buttonLoader"
              >Change</v-btn
            >
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import OrderApi from "@/Api/Modules/master_order";
import DistributerOrderApi from "@/Api/Modules/distributer";
import SalesRepOrderApi from "@/Api/Modules/salesrep";
export default {
  data() {
    return {
      buttonLoader: false,
      selectedOrderNo: "",
      selectedOrderid: "",
      selectedCommisionvalue: "",
      modeltype: "",
      show: false,
      loading: false,
      summary: {
        main_order_details: {},
        shop_order_amount: "",
        salesrep_full_commsion: "",
        distributer_chain: [],
        sales_rep_chain: [],
        subdistributer_chain: [],
      },
    };
  },

  async created() {
    await this.orderSummary();
  },
  methods: {
    // order summary
    async orderSummary() {
      this.loading = true;

      // if route comming from factory order
      if (this.$route.params.summary_type === "factoryorder") {
        const payload = {
          order_id: this.$route.params.order_id,
        };
        const res = await OrderApi.FactoryOrderSummary(payload);

        this.summary.main_order_details = res.data.data.mainordersummary;

        this.summary.shop_order_amount = res.data.data.shoporderamount;

        this.summary.distributer_chain = res.data.data.distributingchain;
      }
      // if route comming from distributer order
      else if (this.$route.params.summary_type === "distributerorder") {
        const payload = {
          distributer_order_id: this.$route.params.order_id,
        };
        const res = await DistributerOrderApi.DistributerOrderSummary(payload);

        this.summary.main_order_details = res.data.data.distributerordersummary;

        this.summary.salesrep_full_commsion =
          res.data.data.salesrepfullcommision;

        this.summary.shop_order_amount = res.data.data.shoporderamount;

        this.summary.sales_rep_chain = res.data.data.salesreporderchain;

        this.summary.subdistributer_chain = res.data.data.subdistributingchain;
      }
      // if route comming from salesrep order
      else if (this.$route.params.summary_type === "salesreporder") {
        const payload = {
          salesrep_order_id: this.$route.params.order_id,
        };
        const res = await SalesRepOrderApi.SaleRepOrderSummary(payload);

        this.summary.main_order_details = res.data.data.salesrepordersummary;

        this.summary.shop_order_amount = res.data.data.shoporderamount;

        this.summary.distributer_chain = res.data.data.salesreporderchain;
      }
      this.loading = false;
    },

    // change order commision
    async changeCommision() {
      // check weather model type selected as distributer commision
      if (this.modeltype === "Distributer_Commision") {
        this.buttonLoader = true;

        const payload = {
          dis_order_id: this.selectedOrderid,
          new_commision: this.selectedCommisionvalue,
        };

        // call distributer edit commision api
        await DistributerOrderApi.EditDistributerOrderCommision(payload)
          .then(() => {
            this.buttonLoader = false;
            this.show = false;
            this.orderSummary();
          })
          .catch(() => {
            this.buttonLoader = false;
          });
      }

      // check weather model type selected as salesrep commision
      else {
        this.buttonLoader = true;

        const payload = {
          rep_order_id: this.selectedOrderid,
          new_commision: this.selectedCommisionvalue,
        };

        // call salesrep  edit commision api
        await SalesRepOrderApi.EditSalesRepOrderCommision(payload)
          .then(() => {
            this.buttonLoader = false;
            this.show = false;
            this.orderSummary();
          })
          .catch(() => {
            this.buttonLoader = false;
          });
      }
    },
  },
};
</script>
