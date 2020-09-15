import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChatBot from 'react-simple-chatbot';
import io from 'socket.io-client';

class DBPedia extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      result: '',
      trigger: false,
      opened: false,
      socket: io("http://localhost:3000"),
      room: "user1",
    };

    //this.triggetNext = this.triggetNext.bind(this);
  }
  componentDidMount() {
    this.state.socket.connect(true);
    this.state.socket.emit('join', this.state.room);
    this.state.socket.on("send-msg-response", async (msg) => {
        //self.setState({ loading: false, result:msg});
        
       if (this.props.previousStep.message===this.props.steps.search.message){
          this._sendMessage(msg);
       }
    })
    this._onMessageWasSent();
}
  async _onMessageWasSent() {
    const y = this.props.steps.search.value;
   await this.state.socket.emit('new-msg', { msg: y, room: this.state.room });
  }
  _sendMessage(text) {
    if (text.length > 0) {
      this.setState({loading: false, result:text});
    }
  }

  triggetNext() {
    this.setState({ trigger: true }, () => {
      this.props.triggerNextStep();
    });
  }
  
  render() {
    const { result } = this.state
    return (
      <div className="dbpedia">
        {result}

      </div>
     
     
    );
  }
}

DBPedia.propTypes = {
  steps: PropTypes.object,
  step:PropTypes.object,
  previousStep:PropTypes.object,
  triggerNextStep: PropTypes.func,
};

DBPedia.defaultProps = {
  steps: undefined,
  step:undefined,
  previousStep:undefined,
  triggerNextStep: undefined,
};

class ChatBotRobot extends React.Component {
      constructor(props) {
          super(props);
  this.state = {
              opened: false,
          }
  }
  toggleFloating = ({ opened }) => {
    this.setState({ opened }); 
  }
  render() {
    
    const { opened } = this.state;
  return (
<ChatBot
    steps={[
      {
        id: '1',
        message: 'Hi, I am Titan. How can I help?',
        trigger: 'search',
      },
      {
        id: 'search',
        user: true,
        trigger: '3',
      },
      {
        id: '3',
        component: <DBPedia />,
        asMessage:true,
        trigger: 'search',
        
      },
    ]}
       floating={true}
       opened={opened}
       toggleFloating={this.toggleFloating}
       headerTitle = {'Titan'}
       placeholder = {'Enter the message'}
       botAvatar = {'https://i.ibb.co/hBs6YKj/Titan-logo-2.png'}
  />
    )
     }
  }


  export default ChatBotRobot;