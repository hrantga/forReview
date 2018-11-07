import React, { Component } from 'react';
import { Dropdown, Icon } from 'semantic-ui-react';

class SelectUnits extends Component {
    constructor(props){
        super(props);

        this.state = {
            units: [],
            defValue: null,
            id: null
        }
    }
    componentWillMount(){
        this.selectOptionUnits(this.props.calendarData.units, this.props.id);
    }
    componentWillReceiveProps(nextProps) {
        if( nextProps.calendarData.units !== this.props.calendarData.units || nextProps.calendarPane.ratesSidebarOpen.id !== this.props.calendarPane.ratesSidebarOpen.id) {
           this.selectOptionUnits(nextProps.calendarData.units, nextProps.calendarPane.ratesSidebarOpen.id)
        }

        if( nextProps.calendarData.units !== this.props.calendarData.units || nextProps.calendarPane.openClosedSidebar.id !== this.props.calendarPane.openClosedSidebar.id) {
           this.selectOptionUnits(nextProps.calendarData.units, nextProps.calendarPane.openClosedSidebar.id)
        }
    }

    selectOptionUnits(unitsList,unitId){
        let units = unitsList.map((value,index) => {
            if(value.id === unitId) this.setState({ defValue: index })
            return {key: value.id, value: index, text: `(${value.type}) ${value.name}`, icon: 'checkmark', selected: value.id === unitId}
        })
        this.setState({units})
    }

    onChangeUnit = (e, { value}) => {
        this.setState({defValue:  value});
        this.props.selectedRatesSidebar(this.props.calendarData.units[value].id);

    }

    render() {
        return (
            <div className="select-unit">
                <div className="select-unit-wrapp">
                    <Dropdown value={(this.state.defValue !== null)  ? this.state.units[this.state.defValue].value : ''} onChange={this.onChangeUnit} className='icon' placeholder='Select Unit' closeOnBlur={true}  selection options={this.state.units} />
                    <div className="duplicate">
                        <Icon name='clone' />
                        <span>duplicate <br/> all</span>
                    </div>
                </div>

            </div>
        );
    }
}

export default SelectUnits;
