class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
  }

  addMessageToBotState = (messages) => {
    if (Array.isArray(messages)) {
      this.setState((state) => ({
        ...state,
        messages: [...state.messages, ...messages],
      }));
    } else {
      this.setState((state) => ({
        ...state,
        messages: [...state.messages, messages],
      }));
    }
  };

  // Helper function to get dates from today to the next 5 days
  getNextFiveDays = () => {
    const today = new Date();
    const dates = [];

    for (let i = 0; i < 5; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      const formattedDate = futureDate.toISOString().split("T")[0]; // YYYY-MM-DD format
      dates.push(formattedDate);
    }

    return dates;
  };

  handleYes = () => {
    const dates = this.getNextFiveDays();

    // Create buttons for each date
    const message = this.createChatBotMessage("Please select a date:", {
      widget: "DateOptions",
      withAvatar: true,
      dateOptions: dates, // Pass date options to widget
    });
    this.addMessageToBotState(message);
  };

  handleNo = () => {
    const message = this.createChatBotMessage(
      "Okay, let me know if you need help with anything else."
    );
    this.addMessageToBotState(message);
  };

  handleDateSelection = (date) => {
    const message = this.createChatBotMessage(
      `How many tickets do you want to book for ${date}?`
    );
    this.setState((state) => ({
      ...state,
      bookingDate: date, // Save the selected date in state
    }));
    this.addMessageToBotState(message);
  };

  handleTicketInput = (ticketCount) => {
    const { bookingDate } = this.state;
    const message = this.createChatBotMessage(
      `You are booking ${ticketCount} tickets for ${bookingDate}. Sending request to the server...`
    );
    this.addMessageToBotState(message);

    // Send booking data to the server
    fetch("http://localhost:5000/booktickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: bookingDate,
        tickets: ticketCount,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const confirmationMessage = this.createChatBotMessage(
          `Your tickets have been successfully booked!`
        );
        this.addMessageToBotState(confirmationMessage);
      })
      .catch((error) => {
        const errorMessage = this.createChatBotMessage(
          "There was an error booking your tickets. Please try again."
        );
        this.addMessageToBotState(errorMessage);
      });
  };
}

export default ActionProvider;
