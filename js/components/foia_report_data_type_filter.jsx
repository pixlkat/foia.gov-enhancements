import React, { Component } from 'react';
import USWDSSelectWidget from './uswds_select_widget';
import FoiaModal from './foia_modal';
import rdm from '../util/annual_report_data/report_data_map.json';
import FoiaTooltip from './foia_tooltip';


class FoiaReportDataTypeFilter extends Component {
  render() {
    return (
      <div>
        <USWDSSelectWidget
          name="data_type"
          title="Data Type"
          id="data_type"
          value={this.state.selectedDataType}
          options={this.state.reportDataOpts}
          handleChange={this.updateDataType}
        />
        <FoiaModal
          triggerText="Filter Results"
          ariaLabel="Add Data Filter"
          modalContent={
            <div className="form-group">
              <h3 className="sans">Add Data Filter</h3>
              <div className="form-group field">
                <label htmlFor="data_filter_subject">
                  Data Filters
                  <FoiaTooltip
                    text={"Select the type of FOIA data you would like to view. The data comes from agencies' Annual FOIA Reports. To learn more about the data, view the terms in the Glossary."}
                  />
                </label>
                <select name="data_filter_subject" id="data_filter_subject">
                  <option value="request_ex_6">Request Ex. 6</option>
                  <option value="request_ex_7">Request Ex. 7</option>
                  <option value="request_ex_8">Request Ex. 8</option>
                  <option value="request_ex_9">Request Ex. 9</option>
                  <option value="request_ex_10">Request Ex. 10</option>
                </select>
              </div>
              <div className="form-group field">
                <label htmlFor="data_filter_operator">Select a value</label>
                <select name="data_filter_operator" id="data_filter_operator">
                  <option value="greater_than">is greater than</option>
                  <option value="less_than">is less than</option>
                  <option value="equal_to">is equal to</option>
                  <option value="is_na">is equal to N/A</option>
                </select>
              </div>
              <div className="form-group field">
                <label htmlFor="data_filter_value">Enter a Numeric Value</label>
                <input
                  name="data_filter_value"
                  id="data_filter_value"
                  value=""
                  placeholder="Enter a Numeric Value"
                />
              </div>
              <div className="form-group form-group_footer">
                <button className="usa-button usa-button-primary-alt">Submit
                </button>
                <button className="usa-button usa-button-outline">Cancel
                </button>
                <a href="#">Reset Filter</a>
              </div>
            </div>
          }
        /> {/* End FoiaModal */}

      </div>
    );
  }
}

export default FoiaReportDataTypeFilter;
