class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse = (message) => {
    const lowerCase = message.toLowerCase();

    // If the user enters a date (YYYY-MM-DD)
    const datePattern = /\d{4}-\d{2}-\d{2}/;
    if (datePattern.test(message)) {
      this.actionProvider.handleDateInput(message);
      return;
    }

    // If the user enters a ticket count
    const ticketCount = parseInt(message);
    if (!isNaN(ticketCount) && ticketCount > 0) {
      this.actionProvider.handleTicketInput(ticketCount);
      return;
    }

    // Default case for unrecognized inputs
    this.actionProvider.handleDefault();
  };
}

export default MessageParser;
