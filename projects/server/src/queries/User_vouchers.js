const { User_vouchers, Vouchers, Promotions } = require("../models/index.js");
const { Op } = require("sequelize");

const readUserVoucherQuery = async (user_id, id) => {
	return await User_vouchers.findOne({ where: { [Op.and]: { user_id, id, isUsed: false } } });
};

const readUserVouchersQuery = async (user_id) => {
	return await User_vouchers.findAll({
		where: { [Op.and]: { user_id, isUsed: false } },
		include: [
			{
				model: Vouchers,
				where: {
					[Op.or]: [{ expired_at: { [Op.gte]: new Date() } }, { expired_at: null }],
				},
				attributes: [
					"id",
					"name",
					"description",
					"value",
					"start_at",
					"expired_at",
					"min_spend",
					"max_discount",
					"inventory_id",
					"branch_id",
				],
				include: [{ model: Promotions }],
			},
		],
		attributes: ["id"],
	});
};

const createUserVouchersAsReferralReward = async (registrant_id, referred_id, transaction) => {
	return await User_vouchers.bulkCreate(
		[
			{ user_id: registrant_id, voucher_id: 1 },
			{ user_id: referred_id, voucher_id: 1 },
		],
		{ transaction },
	);
};

const createUserVouchersAsTransactionReward = async (user_id, transaction) => {
	return await User_vouchers.create({ user_id, voucher_id: 7 }, { transaction });
};

const updateUsedUserVouchersQuery = async (id, transaction) => {
	return await User_vouchers.update(
		{ isUsed: true },
		{
			where: {
				id,
			},
			transaction,
		},
	);
};

module.exports = {
	readUserVoucherQuery,
	readUserVouchersQuery,
	createUserVouchersAsReferralReward,
	updateUsedUserVouchersQuery,
	createUserVouchersAsTransactionReward,
};
