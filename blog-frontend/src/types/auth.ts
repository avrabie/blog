export interface UserInfo {
  username: string;
  name: string;
  email: string;
  roles: string[];
}

export interface UserProfile {
  preferred_username: string;
  given_name: string;
  family_name: string;
  name: string;
  authorities: Array<{ authority: string }>;
  credentials: {
    claims: {
      preferred_username: string;
      given_name: string;
      family_name: string;
      name: string;
    };
  };
}
