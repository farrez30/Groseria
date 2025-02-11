import moment from "moment";

const Mutation = ({ item }) => {
	const changes = item.stock_after - item.stock_before;
	const isNegative = changes < 0;

	const string = isNegative ? changes.toString() : `+${changes}`;
	const className = isNegative ? "text-red font-bold" : "text-green-300 font-bold";

	return <span className={className}>{string}</span>;
};

const Time = ({ item }) => {
	const fullDate = new Date(item.created_at).toString();
	const date = fullDate.split(" ").slice(0, 4).join(" ").replace(" ", ", ");
	const time = fullDate.split(" ").slice(4, 5).join(" ");

	return (
		<span>
			{date} - {time}
		</span>
	);
};

const TransactionSalesViewMode = ({ item, index, page, itemPerPage }) => {
	const tdClassName = index % 2 ? "py-4 bg-green-100 text-xs text-center" : "py-4 bg-white text-xs text-center";
	return (
		<tbody key={index}>
			<tr>
				{/* <td className={tdClassName}>
					<img src={item.Inventory.Product.image} className="max-w-[80px] mx-auto" />
				</td> */}
				<td className={tdClassName}>{(page - 1) * itemPerPage + (index + 1)}</td>
				<td className={tdClassName}>Rp {item.amount.toLocaleString("id")}</td>
				<td className={tdClassName}>{moment(item.updated_at).format("dddd, MMMM Do YYYY, h:mm:ss a")}</td>
				{/* <td className={tdClassName}>
					<Mutation item={item} />
				</td>
				<td className={tdClassName}>
					<Time item={item} />
				</td> */}
			</tr>
		</tbody>
	);
};

export default TransactionSalesViewMode;
