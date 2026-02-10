export type AuthUser = {
  user: {
    _id: string,
    firstName: string,
    lastName: string,
    fullName: string,
    email: string,
    profilePicture: string,
    bannerImg: string,
    headline: string,
    location: string,
    about: string,
    skills: string[],
    connections: string[],
    username: string,
    experience: string[],
    education: string[],
    createdAt?: string,
    updatedAt?: string,
  }
};