const CommentList = ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    let content;

    if (comment.status === "pending") content = "Comment is being moderated";
    if (comment.status === "rejected") content = "Comment was rejected";
    if (comment.status === "approved") content = comment.content;

    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
