import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, OrderedMap } from 'immutable';
import { uniqueId } from 'lodash';

import USWDSSelectWidget from './uswds_select_widget';
import FoiaModal from './foia_modal';
import FoiaTooltip from './foia_tooltip';
import dispatcher from '../util/dispatcher';
import { types } from '../actions/report';

class FoiaReportDataTypeFilter extends Component {
  constructor(props) {
    super(props);

    this.handleDataTypeChange = this.handleDataTypeChange.bind(this);
    this.handleFilterFieldUpdate = this.handleFilterFieldUpdate.bind(this);
  }

  componentWillMount() {
    this.setState({
      id: uniqueId(),
    });
  }

  handleDataTypeChange(e) {
    const selection = {
      id: e.target.value,
      index: this.props.selectedDataType.index,
    };

    dispatcher.dispatch({
      type: types.ANNUAL_REPORT_DATA_TYPE_UPDATE,
      selectedDataType: selection,
      previousDataType: this.props.selectedDataType,
    });
  }

  handleFilterFieldUpdate(e) {
    const selection = this.props.selectedDataType;
    const filterUpdate = {
      name: e.target.name,
      value: e.target.value,
    };

    dispatcher.dispatch({
      type: types.ANNUAL_REPORT_DATA_TYPE_FILTER_UPDATE,
      currentSelection: selection,
      filter: filterUpdate,
    });
  }

  handleModalSubmit() {
    const selection = this.props.selectedDataType;
    selection.filter[applied] = true;

    dispatcher.dispatch({
      type: types.ANNUAL_REPORT_DATA_TYPE_FILTER_SUBMIT,
      currentSelection: selection,
    });
  }

  handleModalClose() {
    dispatcher.dispatch({
      type: types.ANNUAL_REPORT_DATA_TYPE_FILTER_RESET,
      currentSelection: this.props.selectedDataType,
    });
  }

  modalCanSubmit() {
    const selection = this.props.selectedDataType;
    return selection.filter.compareValue !== '';
  }


  buildModalContent() {
    const { selectedDataType } = this.props;
    const options = selectedDataType
      .filterOptions
      .map(opt => ({ value: opt.id, label: opt.label }));

    return (
      <div className="form-group">
        <h3 className="sans">Add Data Filter</h3>
        <div className="form-group field">
          <label htmlFor="filterField">
            Data Filters
            <FoiaTooltip text={"Select the type of FOIA data you would like to view. The data comes from agencies' Annual FOIA Reports. To learn more about the data, view the terms in the Glossary."} />
          </label>
          <USWDSSelectWidget
            id="filterField"
            name="filterField"
            title=""
            options={options}
            placeholder=""
            handleChange={this.handleFilterFieldUpdate}
          />
        </div>
        <div className="form-group field">
          <label htmlFor="op">Select a value</label>
          <select
            name="op"
            id="op"
            onChange={this.handleFilterFieldUpdate}
          >
            <option value="greater_than">is greater than</option>
            <option value="less_than">is less than</option>
            <option value="equal_to">is equal to</option>
            <option value="is_na">is equal to N/A</option>
          </select>
        </div>
        <div className="form-group field">
          <label htmlFor="compareValue">Enter a Numeric Value</label>
          <input
            name="compareValue"
            id="compareValue"
            placeholder="Enter a Numeric Value"
            onChange={this.handleFilterFieldUpdate}
          />
        </div>
      </div>
    );
  }

  render() {
    const dataTypeSelected = (this.props.selectedDataType.id !== '' && this.props.selectedDataType.id !== 'group_iv_exemption_3_statutes') || false;
    return (
      <div>
        <USWDSSelectWidget
          name="data_type"
          title="Data Type"
          id={`data-type-${this.state.id}`}
          value={this.props.selectedDataType.id}
          options={[...this.props.dataTypeOptions]}
          handleChange={this.handleDataTypeChange}
        />
        {dataTypeSelected &&
          <FoiaModal
            triggerText="Filter Results"
            ariaLabel="Add Data Filter"
            modalContent={this.buildModalContent()}
          />
        }
      </div>
    );
  }
}

FoiaReportDataTypeFilter.propTypes = {
  dataTypes: PropTypes.instanceOf(OrderedMap),
  dataTypeOptions: PropTypes.instanceOf(List),
  selectedDataType: PropTypes.object,
};

FoiaReportDataTypeFilter.defaultProps = {
  dataTypes: new OrderedMap(),
  dataTypeOptions: new List(),
  selectedDataType: { index: 0, id: '' },
};

export default FoiaReportDataTypeFilter;
