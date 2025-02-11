const { Op, literal } = require("sequelize");
const { sequelize } = require("../models/index.js");
const moment = require("moment");

const getAdminQueryFilter = async (query) => {
	const filter = { branch: [] };
	const branchFilter = ["name", "id", "admin_id", "city_id"];
	await branchFilter.forEach((key) => {
		if (query[key]) filter.branch.push({ [key]: query[key] });
	});

	return filter;
};

const getAdminQueryOrder = async (query) => {
	const order = { branch: [] };
	const branchOrder = ["name"];
	const ascending = query.asc == 1 ? "ASC" : "DESC";

	branchOrder.forEach((key) => {
		if (query.order === key) order.branch.push([sequelize.models.Branches, key, ascending]);
	});

	return order;
};

const getInventoryPromotionQueryFilter = async (query) => {
	const filter = { Inventory_promotions: {} };

	const inventoryPromotionsFilter = ["promotion_id"];
	await inventoryPromotionsFilter.forEach((key) => {
		if (query[key]) filter.Inventory_promotions[key] = query[key];
	});

	return filter;
};

const getProductsRecommendationFilter = async (query) => {
	const filter = { Inventories: {} };

	const inventoriesFilter = ["branch_id"];

	await inventoriesFilter.forEach((key) => {
		if (query[key]) filter.Inventories[key] = query[key];
	});

	return filter;
};

const getRelatedProductsFilter = async (query) => {
	const filter = { Products: {}, Inventories: {} };

	const inventoriesFilter = ["branch_id"];
	const inventoriesFilterNegate = ["id"];
	const productsFilter = ["category_id"];

	await inventoriesFilter.forEach((key) => {
		if (query[key]) filter.Inventories[key] = query[key];
	});
	await inventoriesFilterNegate.forEach((key) => {
		if (query[key]) filter.Inventories[key] = { [Op.not]: query[key] };
	});
	await productsFilter.forEach((key) => {
		if (query[key]) filter.Products[key] = query[key];
	});
	return filter;
};

const getCategoryQueryFilter = async (query) => {
	const filter = query.name ? { name: { [Op.like]: "%" + query.name + "%" } } : {};
	return filter;
};

const getCategoryQueryOrder = async (query) => {
	const ascending = query.asc == 1 ? "ASC" : "DESC";
	const order = query.order && query.asc ? [[query.order, ascending]] : [];
	return order;
};

const getProductQueryFilter = async (query) => {
	const filter = {};
	const productFilter = ["name", "category_id", "branch_id", "active"];
	await productFilter.forEach((key) => {
		if (key === "name" && query[key]) filter[key] = { [Op.like]: "%" + query[key] + "%" };
		else if (query[key]) filter[key] = query[key];
	});
	return filter;
};

const getProductQueryOrder = async (query) => {
	const ascending = query.asc == 1 ? "ASC" : "DESC";
	const order = query.order && query.asc ? [[query.order, ascending]] : [];
	return order;
};

const getInventoryPromotionQueryOrder = async (query) => {
	const order = { Inventory_promotions: [] };
	const inventoryPromotionsOrder = ["start_at", "expired_at"];
	const ascending = query.asc == 1 ? "ASC" : "DESC";

	inventoryPromotionsOrder.forEach((key) => {
		if (query.order === key) order.Inventory_promotions.push([key, ascending]);
	});

	return order;
};

// TODO: Delete
const paginateData = (data, page) => {
	const itemPerPage = 8;
	const startIndex = (page - 1) * itemPerPage;
	const endIndex = page * itemPerPage;

	return data.slice(startIndex, endIndex);
};

const getInventoriesQueryFilter = async (query) => {
	const filter = { Products: {} };

	const productsFilter = ["category_id"];

	await productsFilter.forEach((key) => {
		if (query[key]) filter.Products[key] = query[key];
	});

	return filter;
};

const getInventoriesQueryOrder = async (query) => {
	const order = { Inventories: [], Products: [] };

	const inventoriesOrder = ["stock"];
	const productsOrder = ["name"];

	const ascending = query.asc == 1 ? "ASC" : "DESC";

	inventoriesOrder.forEach((key) => {
		if (query.order === key) order.Inventories.push([key, ascending]);
	});

	productsOrder.forEach((key) => {
		if (query.order === key) order.Products.push([key, ascending]);
	});

	return order;
};

const transactionsFilter = ["branch_id", "status_id"];
const getAdminTransactionQueryFilter = async (query) => {
	const filter = {
		Transactions: {
			created_at: {
				[Op.and]: {
					[Op.gte]: query?.start_after || "1971-01-01",
					[Op.lt]: moment(query?.end_before).add(1, "day").utc() || new Date(),
				},
			},
		},
	};
	if (query.id) filter.Transactions.id = query.id;

	if (query.voucher_id > 0) {
		filter.Transactions.voucher_id = { [Op.not]: null };
	} else if (query.voucher_id === "0") {
		filter.Transactions.voucher_id = null;
	}

	transactionsFilter.forEach((key) => {
		if (query[key]) filter.Transactions[key] = query[key];
	});

	return filter;
};

const transactionsOrder = ["amount", "created_at"];
const getAdminTransactionQueryOrder = async (query) => {
	const order = { Transactions: [] };
	const ascending = query.asc == 1 ? "ASC" : "DESC";

	transactionsOrder.forEach((key) => {
		if (query.order === key) order.Transactions.push([key, ascending]);
	});

	return order;
};

const getMutationByDescription = async (description) => {
	if (description === "sales") {
		return "Sales";
	} else if (description === "other") {
		return { [Op.ne]: "Sales" };
	} else if (description === "all") {
		return { [Op.not]: null };
	}
};

// const productsFilter = ["name"];
const getStockChangesQueryFilter = async (query) => {
	const filter = await {
		Stock_changes: {
			created_at: {
				[Op.and]: {
					[Op.gte]: query?.start_after || "1971-01-01",
					[Op.lt]: moment(query?.end_before).add(1, "day").utc() || new Date(),
				},
			},
			description: query?.description ? await getMutationByDescription(query.description) : { [Op.not]: null },
		},
		Products: {},
	};

	if (query.name) filter.Products.name = { [Op.like]: "%" + query.name + "%" };

	return filter;
};

const stockChangesOrder = ["created_at"];
const getStockChangesQueryOrder = async (query) => {
	const order = { Stock_changes: [] };
	const ascending = query.asc == 1 ? "ASC" : "DESC";

	stockChangesOrder.forEach((key) => {
		if (query.order === key) order.Stock_changes.push([key, ascending]);
	});

	return order;
};

module.exports = {
	paginateData,
	getAdminQueryFilter,
	getAdminQueryOrder,
	getInventoryPromotionQueryFilter,
	getInventoryPromotionQueryOrder,
	getCategoryQueryFilter,
	getCategoryQueryOrder,
	getInventoriesQueryFilter,
	getInventoriesQueryOrder,
	getProductQueryFilter,
	getProductQueryOrder,
	getProductsRecommendationFilter,
	getRelatedProductsFilter,
	getAdminTransactionQueryFilter,
	getAdminTransactionQueryOrder,
	getStockChangesQueryFilter,
	getStockChangesQueryOrder,
};
