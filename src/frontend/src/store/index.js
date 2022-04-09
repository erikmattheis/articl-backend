import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      user: undefined,
      userId: undefined,
      userFullName: undefined,
      isEmailVerified: undefined,
      accessTokenExpires: undefined,
      accessTokenValue: undefined,
      refreshTokenExpires: undefined,
      refreshTokenValue: undefined,
      isLoggedIn: undefined,
      errorMessage: undefined,
      errorTitle: undefined,
      errorFileName: undefined,
      errorLineNumber: undefined,
      errorStack: undefined,
    };
  },
  mutations: {
    SET_ACCESS_TOKEN_VALUE(state, payload) {
      state.accessTokenValue = payload;
    },
    SET_ACCESS_TOKEN_EXPIRES(state, payload) {
      state.accessTokenExpires = payload;
    },
    SET_REFRESH_TOKEN_VALUE(state, payload) {
      state.refreshTokenValue = payload;
    },
    SET_REFRESH_TOKEN_EXPIRES(state, payload) {
      state.refreshTokenExpires = payload;
    },
    SET_USER(state, payload) {
      state.user = payload;
    },
    SET_ERROR_TITLE(state, payload) {
      state.errorTitle = payload;
    },
    SET_ERROR_MESSAGE(state, payload) {
      state.errorMessage = payload;
    },
    SET_ERROR_FILE_NAME(state, payload) {
      state.errorFileName = payload;
    },
    SET_ERROR_LINE_NUMBER(state, payload) {
      state.errorLineNumber = payload;
    },
    SET_ERROR_STACK(state, payload) {
      state.errorStack = payload;
    },
  },
  actions: {
    logout(context) {
      context.commit('SET_ACCESS_TOKEN_EXPIRES', '');
      context.commit('SET_ACCESS_TOKEN_VALUE', '');
      context.commit('SET_REFRESH_TOKEN_EXPIRES', '');
      context.commit('SET_REFRESH_TOKEN_VALUE', '');
    },
    accessTokenExpires(context, payload) {
      if (payload) {
        context.commit('SET_ACCESS_TOKEN_EXPIRES', payload);
      }
    },
    accessTokenValue(context, payload) {
      if (payload) {
        context.commit('SET_ACCESS_TOKEN_VALUE', payload);
      }
    },
    refreshTokenExpires(context, payload) {
      if (payload) {
        context.commit('SET_REFRESH_TOKEN_EXPIRES', payload);
      }
    },
    refreshTokenValue(context, payload) {
      if (payload) {
        context.commit('SET_REFRESH_TOKEN_VALUE', payload);
      }
    },
    setUser(context, payload) {
      context.commit('SET_USER', payload);
    },
    setError(context, payload) {
      let errorTitle = 'Error';
      let errorMessage = 'Unknown error';
      let errorFileName = '';
      let errorLineNumber = '';
      let errorStack = '';

      if (payload?.response?.data?.message) {
        errorMessage = payload.response.data.message;
      } else if (payload.message) {
        errorMessage = payload.message;
      } else if (typeof payload === 'string' && payload.length) {
        errorMessage = payload;
      }

      if (payload?.response?.data?.fileName) {
        errorFileName = payload.response.data.fileName;
      } else if (payload.fileName) {
        errorFileName = payload.fileName;
      }

      if (payload?.response?.data?.stack) {
        errorStack = payload.response.data.stack;
        errorStack = `${errorStack.slice(0, 100)} ${errorStack.slice(100)}`;
      } else if (payload.stack) {
        errorStack = payload.stack;
      }

      if (payload?.response?.data?.lineNumber) {
        errorLineNumber = payload.response.data.lineNumber;
      } else if (payload?.lineNumber) {
        errorLineNumber = payload.message;
      }

      if (payload?.response?.data?.error && typeof payload?.response.data.error === 'string') {
        errorTitle = payload?.response.data.error;
      } else if (payload?.response?.data?.name) {
        errorTitle = payload.response.data.name;
      } else if (payload.name) {
        errorTitle = payload.name;
      }

      context.commit('SET_ERROR_TITLE', errorTitle);
      context.commit('SET_ERROR_MESSAGE', errorMessage);
      context.commit('SET_ERROR_FILE_NAME', errorFileName);
      context.commit('SET_ERROR_LINE_NUMBER', errorLineNumber);
      context.commit('SET_ERROR_STACK', errorStack);
    },
    clearError(context) {
      context.commit('SET_ERROR_TITLE', '');
      context.commit('SET_ERROR_MESSAGE', '');
      context.commit('SET_ERROR_FILE_NAME', '');
      context.commit('SET_ERROR_LINE_NUMBER', '');
      context.commit('SET_ERROR_STACK', '');
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
    userId(state) {
      return state.user.id;
    },
    userFullName(state) {
      return `${state.user.nameFirst} ${state.user.nameLast}`;
    },
    isEmailVerified(state) {
      return state.user.isEmailVerified;
    },
    accessTokenExpires(state) {
      return state.accessTokenExpires;
    },
    accessTokenValue(state) {
      return state.accessTokenValue;
    },
    refreshTokenExpires(state) {
      return state.refreshTokenExpires;
    },
    refreshTokenValue(state) {
      return state.refreshTokenValue;
    },
    isLoggedIn(state) {
      const now = Date.now();
      return state.accessTokenExpires > now;
    },
    errorMessage(state) {
      return state.errorMessage;
    },
    errorTitle(state) {
      // console.error(state.error.title);
      return state.errorTitle;
    },
    errorFileName(state) {
      // console.error(state.error.fileName);
      return state.errorFileName;
    },
    errorLineNumber(state) {
      // console.error(state.error.lineNumber);
      return state.errorLineNumber;
    },
    errorStack(state) {
      return state.errorStack;
    },
  },
});
