export interface UserInfo {
  username: string;
  name: string;
  email: string | null;
  roles: string[];
}

interface BffUserClaims {
  preferred_username: string;
  given_name: string;
  family_name: string;
  name: string;
}

interface BffUserResponse {
  authenticated: boolean;
  authorities: Array<{ authority: string }>;
  credentials: {
    claims: BffUserClaims;
    [key: string]: unknown;
  };
}

function isNumeric(str: string): boolean {
  return /^\d+$/.test(str);
}

function parseBffUserResponse(data: BffUserResponse): UserInfo {
  const { claims } = data.credentials;
  const authorities = data.authorities;
  const roles = authorities.map(a => a.authority);

  const username = isNumeric(claims.preferred_username)
    ? claims.given_name
    : claims.preferred_username;

  const name = `${claims.given_name} ${claims.family_name}`.trim();

  return {
    username,
    name,
    email: null,
    roles,
  };
}

export type { BffUserResponse, BffUserClaims };
export type UserProfile = BffUserResponse;
export { isNumeric, parseBffUserResponse };
