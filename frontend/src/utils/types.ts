export type AuthUserType = {
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
};

export type PostType = {
  _id: string,
  author: {
      _id: string,
      profilePicture: string
      headline: string
      username: string
      fullName: string
  },
  content: string
  image: string,
  likes: string[],
  comments: string[],
  createdAt: string
  updatedAt: string
}