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

export type CommentType = {
  user: {
    _id: string
    fullName: string
    profilePicture: string
  },
  _id: string
  createdAt: string
  content?: string
}

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
  comments: CommentType[],
  createdAt: string
  updatedAt: string
}

export type SuggestedUsersType = {
  _id: string
  fullName: string
  profilePicture: string
  headline: string
}

export type NotificationType = {
  _id: string
  type: string
  relatedUser: {
    _id: string
    profilePicture: string
    fullName: string
  }
  relatedPost: {
    _id: string
    content: string
    image: string
  }
  read: boolean
  createdAt: string
  updatedAt: string
}

export type ConnectionRequestType = {
  _id: string
  sender: {
    connections: string[]
    fullName: string
    profilePicture: string
    headline: string
    _id: string
  }
  recipient: string
  status: string
  createdAt: string
  updatedAt: string
}

export type sentRequestType = {
  _id: string
  recipient: {
    connections: string[]
    fullName: string
    profilePicture: string
    headline: string
    _id: string
  }
  sender: string
  status: string
  createdAt: string
  updatedAt: string
}

export type ConnectionType = {
  _id: string
  fullName: string
  profilePicture: string
  headline: string
  connections: string[]
}