export const useAuthServiceMock = {
  userLoading: false,
  userError: null,
  login: vi.fn(),
  logout: vi.fn(),
  getUser: vi.fn(),
  isLoggedOut: false,
  setIsLoggedOut: vi.fn(),
};
