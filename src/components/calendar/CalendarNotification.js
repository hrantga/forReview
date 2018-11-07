import React, { Component } from 'react';
import { Icon, Message  } from 'semantic-ui-react';


class CalendarNotification extends Component {

    constructor(props) {
        super(props);

        this.state = {
            ratesCount: 0,
            activeIndex: 0,
            ratesHeader: '',
            ratesContent: ''

        }
    }

    componentWillMount(){
        if(this.props.index === 1){
                 if(this.props.ratesCount === 0){
                     this.setState({
                         ratesHeader: 'Please set rates for all your units',
                         ratesContent: 'You should set rate for at least one unit to be able to add reservations and publish your website.'
                     })
                 }else{
                     this.setState({
                         ratesHeader: 'Please set rates for your units',
                         ratesContent: 'You should set rate for a unit to be able to add reservations and publish it on your website.'
                     })
                 }
         }
    }

    setRates(){
        this.props.switchPane(1);
        if(this.props.ratesCount === 0){
            this.setState({
                ratesHeader: 'Please set rates for all your units',
                ratesContent: 'You should set rate for at least one unit to be able to add reservations and publish your website.'
            })
        }else{
            this.setState({
                ratesHeader: 'Please set rates for your units',
                ratesContent: 'You should set rate for a unit to be able to add reservations and publish it on your website.'
            })
        }

    }
    publishRates(){
        this.props.openSidebar();
    }

   renderNotification(){

        if(this.props.index === 0){
            return(
                <div className="notification-wrapper">
                    <Message
                        attached
                        header='You are almost there!'
                        content='To publish your website and start receiving both online and direct reservations, you should first set your rates and then ass current reservations to the calendar, if you have one.'
                    />
                    <Message attached='bottom' warning>
                        <span className="not-btn set-rates" onClick={() => this.setRates()}>Set Rates</span>
                    </Message>
                </div>
            )
        }



       if(this.props.index === 1){
           return(
               <div className="notification-wrapper">
                   <Message
                       attached
                       header={this.state.ratesHeader}
                       content={this.state.ratesContent}
                   />
                   <Message attached='bottom' warning>
                       <span className="not-btn">Add current reservations</span>
                       <span className="not-btn" onClick={() => this.publishRates()}>Publish</span>
                   </Message>
               </div>
           )
       }

   }


    render() {
        return (<div>{this.renderNotification()}</div>)
    }
}

export default CalendarNotification;
