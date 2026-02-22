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
  experience: ExperienceType[],
  education: EducationType[],
  createdAt?: string,
  updatedAt?: string,
};

export type ExperienceType = {
  title: String,
  company: String,
  startYear: Number,
  endYear: Number,
  numberOfMonths?: String
  description: String,
}

export type EducationType = {
  school: String,
  field: String,
  startYear: Number,
  endYear: Number,
}

export type CommentType = {
  user: userDetailsType,
  _id: string
  createdAt: string
  content?: string
}

export type PostType = {
  _id: string,
  author: userDetailsType,
  content: string
  image: string,
  likes: string[],
  comments: CommentType[],
  createdAt: string
  updatedAt: string
}

export type NotificationType = {
  _id: string
  type: string
  relatedUser: {
    _id: string
    profilePicture: string
    fullName: string
    username?: string
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
  sender: userDetailsType
  recipient: string
  status: string
  createdAt: string
  updatedAt: string
}

export type sentRequestType = {
  _id: string
  recipient: userDetailsType
  sender: string
  status: string
  createdAt: string
  updatedAt: string
}

export type userDetailsType = {
  _id: string
  fullName: string
  username?: string
  headline?: string
  profilePicture: string
  connections?: string[]
}