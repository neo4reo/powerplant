/**
 * @namespace AddBedsForm
 * @memberof client.components.beds
 */

const React = require('react');
const ChooseCrops = require('../crops/ChooseCrops');
const CropGroups = require('../crops/CropGroups');
const { Button } = require('react-bootstrap');
const { getCropGroups } = require('../../utils/apiCalls');
const { withRouter } = require('react-router-dom');

/**
 * @extends Component
 */
class AddBedForm extends React.Component {
	/**
	 * @param {Object} props 
	 */
	constructor(props) {
		super(props);
		this.onChangeChooseCrop = this.onChangeChooseCrop.bind(this);
		this.onChangeCropGroups = this.onChangeCropGroups.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.chosenBeds = [];
		//this.onSuccess;

		this.state = {
			chosenCrops: [],
			loadingGroups: false,
			groups: [],
			groupsError: false,
			savingError: false,
		}
	}

	/**
	 * @param {String[]} cropIds 
	 */
	getGroups(cropIds) {
		this.setState({
			loadingGroups: true
		});
		getCropGroups({ cropIds }).then((response) => {
			this.setState({
				groups: response.data,
				loadingGroups: false
			});
		}).catch((error) => {
			this.setState({
				groupsError: response,
				loadingGroups: false
			});
		});
	}

	/**
	 * @param {Object} event
	 */
	onSubmit(event) {
		event.preventDefault();
		//TODO: VALIDATE PLANTS
		let createPromises = [];
		this.chosenBeds.forEach((crops, index) => {
			let generatedName = '';
			crops.forEach((crop) => {
				generatedName += crop.commonName.slice(0, 2);
			});
			//create beds from
			createPromises.push(this.props.onSubmit({
				name: generatedName,
				crops
			}));
		});
		Promise.all(createPromises).then(() => this.props.onSuccess())
		.catch((error) => {
			this.setState({
				savingError: { form: 'Error saving beds'}
			});
		});
	}

	/**
	 * @param {Crop[]} chosenCrops 
	 */
	onChangeChooseCrop(chosenCrops) {
		this.setState({ chosenCrops });
		const cropIds = chosenCrops.map((crop) => crop._id);
		if (chosenCrops.length >= this.props.minNumberOfCrops) {
			this.getGroups(cropIds);
		}
	}

	/**
	 * @param {Object} chosenGroups 
	 */
	onChangeCropGroups(chosenGroups) {
		this.chosenBeds = chosenGroups;
	}

	cropGroups() {
		if (this.state.chosenCrops.length < this.props.minNumberOfCrops) {
			return (<p>{this.props.minNumberOfCropsText}</p>);
		} else {
			return (
				<CropGroups
					error={this.state.groupsError}
					loading={this.state.loadingGroups}
					groups={this.state.groups}
		  			onChange={this.onChangeCropGroups}
					/>
			);
		}
	}

	render() {
		this.chosenBeds = this.state.groups;
		return (
			<form onSubmit={this.onSubmit}>
				<div>{this.props.explanation}</div>
				<div className="choose-crops">
					<ChooseCrops onChange={this.onChangeChooseCrop}/>
				</div>
				{this.cropGroups()}
				<div className="button-checkbox-center">
					<Button
						type="submit"
						className="btn btn-primary"
						disabled={this.state.groups.length === 0}
						>
						{this.props.submitButtonText}
					</Button>
				</div>
			</form>
		);
	}
}

AddBedForm.defaultProps = {
	minNumberOfCrops: 3,
	submitButtonText: "Submit",
	minNumberOfCropsText: "Please select at least 3 crops.",
	explanation: "Please choose the crops you want to add in your garden. We will suggest you which plants should go together into the same bed."
};

module.exports = withRouter(AddBedForm);
