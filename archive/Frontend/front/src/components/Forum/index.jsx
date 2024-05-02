import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Forum.css'; // 确保有对应的CSS文件

function Forum() {
  // 假设posts是从后端获取的帖子列表，这里我们用一个简单的本地状态来模拟
  const [posts, setPosts] = useState([
    { id: 1, title: 'First post', content: 'This is the first post.' },
    // 可以继续添加更多初始帖子
  ]);

  return (
    <div className="forum-container">
      <h1>Forum</h1>
      <Link to="/forum/create">Create New Post</Link>
      <div className="posts-list">
        {posts.map(post => (
          <div key={post.id} className="post">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forum;
