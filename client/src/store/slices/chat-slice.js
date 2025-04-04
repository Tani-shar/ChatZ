export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  closeChat: () =>
    set({
      selectedChatType: undefined,
      selectedChatData: undefined,
      selectedChatMessages: [],
    }),
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatData;

    set({
    selectedChatMessages: [
      ...selectedChatMessages,
      {
        ...message,
        recipient:
          get().selectedChatType === "channel"
            ? message.recipient
            : message.recipient._id,
        sender:
          get().selectedChatType === "channel"
            ? message.sender
            : message.sender._id,
      },
    ],
    });
  },
});
