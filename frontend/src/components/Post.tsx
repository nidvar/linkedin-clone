import type { PostType } from '../utils/types';

function Post({post} : {post: PostType}) {
  return (
    <div className="post-container">
      <h1>{post.content}</h1>
    </div>
  )
}

export default Post