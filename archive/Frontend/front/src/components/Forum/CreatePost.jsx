import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css'; // 根据需要添加CSS样式

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // 这里应该是发帖到服务器的代码，但现在我们只是简单地打印出帖子数据
    console.log('Creating post:', { title, content });
    // 假设创建成功后，导航回论坛主页面
    navigate('/forum');
  };

  return (
    <div className="create-post-container">
      <h1>Create New Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CreatePost;
