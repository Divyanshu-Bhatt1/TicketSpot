import { createChatBotMessage } from "react-chatbot-kit";
import DateOptionsWidget from "./dateoption";

const botName = "Monument Bot";

const config = {
  botName: botName,
  customStyles: {
    botMessageBox: {
      backgroundColor: "#376B7E",
    },
    chatButton: {
      backgroundColor: "#5ccc9d",
    },
  },
  initialMessages: [
    createChatBotMessage(`Hi, do you want to book tickets for a monument?`, {
      widget: "YesNoOptions",
    }),
  ],
  widgets: [
    {
      widgetName: "YesNoOptions",
      widgetFunc: (props) => (
        <div>
          <button onClick={() => props.actionProvider.handleYes()}>Yes</button>
          <button onClick={() => props.actionProvider.handleNo()}>No</button>
        </div>
      ),
    },
    {
      widgetName: "DateOptions",
      widgetFunc: (props) => <DateOptionsWidget {...props} />,
      mapStateToProps: ["dateOptions"], // Connect the widget to date options
    },
  ],
};

export default config;
