const React = require('react');
const { Link } = require('react-router-dom');
const PropTypes = require('prop-types');
const { HelpBlock, Col, Row } = require('react-bootstrap');
const ItemHeader = require('./ItemHeader');

const ItemList = ({ deleteAction, match, items, ItemView, itemName }) => {
	const itemEntries = Object.entries(items);
	return (
		<Row>
			{itemEntries.length > 0 ? (
				itemEntries.map(([id,item]) => (
					<Link to={`${match.url}/${id}`} key={id}>
						<ItemView
							item={item}
							header={
								<ItemHeader
									name={
										typeof item.name !== 'undefined'
										? item.name
										: itemName
									}
									editLink={`${match.url}/${id}/edit`}
									refreshLink={match.url}
									deleteAction={deleteAction.bind(this, id)} //binding to this id
								/>
							}
						/>
					</Link>
				))
			) : (
				<Col>
					<HelpBlock>No {itemName}s yet</HelpBlock>
				</Col>
			)}
		</Row>
	);
}

ItemList.propTypes = {
	match: PropTypes.object.isRequired,
	deleteAction: PropTypes.func,
	items: PropTypes.object.isRequired,
	ItemView: PropTypes.func.isRequired,
	itemName: PropTypes.string.isRequired
};

module.exports = ItemList;
