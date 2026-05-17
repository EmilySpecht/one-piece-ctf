import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import posts from "../../posts.json";
import { useCreatePost } from "../../hooks/useCreatePost.hook";
import "./posts.css";
import downloadIcon from "./download.png";

type Post = {
  id: number;
  user: string;
  text: string;
  file: string;
  isImage?: boolean;
  comments?: { id: number; user: string; text: string }[];
};

export const Posts = () => {
  const [expandedMap, setExpandedMap] = useState<Record<number, boolean>>({});
  const [newText, setNewText] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const { createPost } = useCreatePost();

  const typedPosts = posts as Post[];
  const visiblePosts = typedPosts.slice(0, 9);

  const getUserSlug = (user: string) => user.replace(/\s+/g, "").toLowerCase();

  const isExpanded = (id: number) => !!expandedMap[id];
  const toggleExpanded = (id: number) =>
    setExpandedMap((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewFile(event.target.files?.[0] ?? null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newText.trim() && !newFile) {
      setStatusMessage("Informe texto ou envie um arquivo para criar o post.");
      return;
    }

    try {
      setIsSubmitting(true);
      setStatusMessage("Enviando post...");

      const result = await createPost({
        text: newText.trim(),
        postFile: newFile ?? undefined,
        user: localStorage.getItem("userName") || "anonymous",
      });

      setStatusMessage(result?.message || "Post enviado com sucesso!");
      setNewText("");
      setNewFile(null);
      formRef.current?.reset();
    } catch (error) {
      console.error(error);
      setStatusMessage("Falha ao criar post. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="posts-page">
      <header className="posts-header">
        <div className="posts-title">
          <span className="pirate-flag">🏴‍☠️</span>
          <div>
            <h1>Crew One Piece Log</h1>
            <p>Journals from the Grand Line, shipmates, marines and legends.</p>
          </div>
        </div>
      </header>
      <div className="create-post-panel">
        <form
          className="create-post-form"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <div className="create-post">
            <textarea
              className="post-description"
              value={newText}
              onChange={(event) => setNewText(event.target.value)}
              placeholder="Escreva algo para seu post..."
              rows={2}
            />
            <input type="file" accept="*/*" onChange={handleFileChange} />
          </div>
          {newFile && (
            <div className="file-preview">
              Arquivo selecionado: <strong>{newFile.name}</strong>
            </div>
          )}
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Criar post"}
          </button>
          {statusMessage && (
            <div className="status-message">{statusMessage}</div>
          )}
        </form>
      </div>

      <div className="posts-grid">
        {visiblePosts.map((post) => (
          <article className="post" key={post.id}>
            <div className="post-card" key={post.id}>
              <div className="post-card-header">
                <div className="post-avatar">
                  {post.user.charAt(0).toUpperCase()}
                </div>
                <Link
                  to={`/profile/${getUserSlug(post.user)}`}
                  className="post-user-link"
                >
                  <span className="post-user">{post.user}</span>
                  <span className="post-tag">@{getUserSlug(post.user)}</span>
                </Link>
              </div>

              <p
                className={`post-text ${post.isImage ? "post-text--image" : "post-text--file"}`}
              >
                {post.text}
              </p>
              {post.file ? (
                post.isImage ? (
                  <img src={post.file} alt={post.text} className="post-image" />
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
            </div>
            {post.comments && post.comments.length > 0 && (
              <div className="comments">
                <h4 className="comments-title">
                  Comentários ({post.comments.length})
                </h4>
                <ul className="comments-list">
                  {(isExpanded(post.id)
                    ? post.comments
                    : post.comments.slice(0, 2)
                  ).map((c) => (
                    <li className="comment" key={c.id}>
                      <div className="comment-avatar">
                        {c.user.charAt(0).toUpperCase()}
                      </div>
                      <div className="comment-body">
                        <span className="comment-user">{c.user}</span>
                        <p className="comment-text">{c.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div>
                  {post.comments.length > 2 && (
                    <button
                      className="comments-toggle"
                      onClick={() => toggleExpanded(post.id)}
                      aria-expanded={isExpanded(post.id)}
                    >
                      {isExpanded(post.id)
                        ? "Ver menos"
                        : `Ver mais (${post.comments.length - 2})`}
                    </button>
                  )}
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};
