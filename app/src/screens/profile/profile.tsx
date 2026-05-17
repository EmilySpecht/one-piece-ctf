import React from "react";
import { Link, useParams } from "react-router-dom";
import posts from "../../posts.json";
import "../posts/posts.css";
import "./profile.css";
import downloadIcon from "../posts/download.png";

type Post = {
  id: number;
  user: string;
  text: string;
  file: string;
  isImage?: boolean;
  comments?: { id: number; user: string; text: string }[];
};

const slugify = (value: string) => value.replace(/\s+/g, "").toLowerCase();

export const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const typedPosts = posts as Post[];
  const userSlug = username ?? "";
  const userPosts = typedPosts.filter(
    (post) => slugify(post.user) === userSlug,
  );
  const displayName = userPosts[0]?.user ?? decodeURIComponent(userSlug);

  return (
    <section className="posts-page">
      <header className="posts-header">
        <div className="posts-title">
          <span className="pirate-flag">🧭</span>
          <div>
            <h1>Perfil de {displayName}</h1>
            <p>
              {userPosts.length > 0
                ? `Posts publicados por ${displayName}`
                : "Nenhum post encontrado para este usuário."}
            </p>
          </div>
        </div>
      </header>

      <div className="profile-actions">
        <Link to="/posts" className="profile-back">
          ← Voltar aos posts
        </Link>
      </div>

      {userPosts.length > 0 && (
        <div className="posts-grid">
          {userPosts.map((post) => (
            <article className="post" key={post.id}>
              <div className="post-card">
                <div className="post-card-header">
                  <div className="post-avatar">
                    {post.user.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="post-user">{post.user}</span>
                    <span className="post-tag">@{slugify(post.user)}</span>
                  </div>
                </div>

                <p className="post-text">{post.text}</p>
                {post.file ? (
                  post.isImage ? (
                    <img
                      src={post.file}
                      alt={post.text}
                      className="post-image"
                    />
                  ) : (
                    <div className="post-file">
                      <div className="file-icon">📄</div>
                      <div className="file-info">
                        <a
                          href={post.file}
                          target="_blank"
                          rel="noreferrer"
                          className="file-link"
                        >
                          {post.file ? post.file.split("/").pop() : "file"}
                        </a>
                        <div className="file-meta">Arquivo</div>
                      </div>
                    </div>
                  )
                ) : undefined}
              </div>

              <div className="post-footer">
                <span>🌊 Crew rumor</span>
                <span>⚓ Island gossip</span>
                {post.file && (
                  <a
                    href={post.file}
                    download
                    className="download-btn"
                    aria-label={`Download file from ${post.user}`}
                  >
                    <img
                      src={downloadIcon}
                      alt="Download"
                      className="download-icon"
                    />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
