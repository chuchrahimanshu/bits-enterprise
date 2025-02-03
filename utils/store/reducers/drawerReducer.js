const initialData = {
  compData: {}
};
const DrawerReducer = (state = initialData, { type, payload }) => {
  switch (type) {
    case "GET_LINK":
      return {
        ...state,
        compData: payload
      };

    default:
      return state;
  }
};

export default DrawerReducer;
