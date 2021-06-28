<template>
	<div class="productMgmt">
		<div v-if="!addEditShowing">
			<h1>Product Management</h1>
			<div class="utilityBar">
				<app-button
					classes="btn btn-orange"
					@click.native="addProduct"
					text="Add Product"
				/>
			</div>
            <transition
                v-if="!storeIsLoading"
                name="fadeInOut"
                appear
            >
			<div class="resultsTable">
				<vue-good-table
					:columns="tableColumns"
					:rows="allProducts"
					styleClass="vgt-table"
					:pagination-options="{
                        enabled: true,
                        mode: 'records'
                    }"
					:sort-options="{
                        enabled: true,
                        initialSortBy: { field: 'name', type: 'asc' }
                    }"
					:search-options="{
                        enabled: true,
                        skipDiacritics: true,
                    }"
				>
					<!-- Dynamic table rows -->
					<template
						slot="table-row"
						slot-scope="props"
					>
						<!-- "Duplicate" -->
						<span v-if="props.column.field == 'duplicate'">
							<img
								class="tableIcon tableIcon--duplicate"
								src="@/assets/images/duplicate_icon.png"
								@click="duplicateProduct(props.row.id)"
								alt
							/>
						</span>
						<!-- "Edit" -->
						<span v-if="props.column.field == 'edit'">
							<img
								class="tableIcon tableIcon--edit"
								src="@/assets/images/edit_icon.png"
								@click="editProduct(props.row.id)"
								alt
							/>
						</span>
						<!-- Status -->
						<span v-else-if="props.column.field === 'isActive'">
							<span
								class="status"
								:class="parseOrderStatus(props.row.isActive == 1 ? 'Active' : 'Inactive')"
							>{{ props.row.isActive == 1 ? 'Active' : 'Inactive' }}
							</span>
						</span>

						<span v-else>{{ props.formattedRow[props.column.field] }}</span>
					</template>
				</vue-good-table>
			</div>
        </transition>
        <loading-dots
            v-else
            loading-text="Loading products"
        />
		</div>
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import VueGoodTable from "@/components/Shared/Table/Table";

export default {
	name: "product-management",
	components: {
		"vue-good-table": VueGoodTable,
		"app-button": () => import("@/components/Shared/AppButton"),
    "loading-dots": () => import("@/components/Shared/LoadingDots"),
	},
	data() {
		return {
			selectedCategory: "",
			addEditShowing: false,
			selectedProduct: {},
			action: "",
			tableColumns: [
				{
					label: "Duplicate",
					field: "duplicate",
					thClass: "vgt-center-align",
					tdClass: "vgt-center-align",
					width: "100px",
					sortable: false,
				},
				{
					label: "Edit",
					field: "edit",
					thClass: "vgt-center-align",
					tdClass: "vgt-center-align",
					width: "200px",
					sortable: false,
				},
				{
					label: "Product Name",
					field: "name",
				},
				{
					label: "Category",
					field: "category.name",
				},
				{
					label: "Primary Assignee",
					field: "assignTo.fullName",
				},
				{
					label: "Status",
					field: "isActive",
					thClass: "vgt-center-align",
					tdClass: "vgt-center-align",
					sortable: false,
				},
			],
      storeIsLoading: true,
		};
	},
	computed: {
		...mapState(["products"]),
		...mapGetters(["productById", "allProducts"]),
	},
	methods: {
		...mapMutations(["CREATE_PRODUCT", "EDIT_PRODUCT"]),
		...mapActions([
			"updateProducts",
			"fetchCategoriesTopics",
			"fetchMarketingEmployees",
		]),
		parseOrderStatus(status) {
			// replaces space in status with underscore for classes
			return status.split(" ").join("_");
		},
		sortByCategory(categoryId) {
			// go get products by category from the store
			this.productList = this.productsByCategory(categoryId);
			// update UI based on category selection
			this.selectedCategory = categoryId;
		},
		editProduct(id) {
            this.$router.push(`/admin/product-management/edit-product/${id}`);
		},
		addProduct() {
			this.$router.push("/admin/product-management/add-product");
		},
		duplicateProduct(id) {
			this.$router.push(`/admin/product-management/duplicate-product/${id}`);
		},
	},
	async mounted() {
        this.fetchCategoriesTopics();
        this.fetchMarketingEmployees();

        // show products immediately if they exist in store
        if (this.allProducts.length > 0) {
            this.baseProducts = this.allProducts;
            this.storeIsLoading = false;
        }

        await this.updateProducts();
        this.storeIsLoading = false;
    },
};
</script>

<style lang="scss" scoped>
.productMgmt {
	padding: 4rem 12rem 12rem;
}
.utilityBar {
	display: flex;
	justify-content: space-between;
	margin: 4rem 0 1.5rem;
	button {
		display: block;
		margin-left: auto;
		&:hover {
			background-color: $orange;
			color: #fff;
		}
	}
}
.resultsTable {
	.vgt-global-search {
		right: unset;
		left: 0;
	}
	.status {
		display: inline-block;
		width: 9rem;
		text-align: center;
	}
}
::v-deep p.loading {
    margin-top: 4rem;
    text-align: left;
}
</style>
