export default function Panel({ header, content }) {
  return (
    <div className="panel">
      {!!header && <div className="panel--header">{header}</div>}
      {!!content && <div className="panel--content">{content}</div>}
    </div>
  );
}
