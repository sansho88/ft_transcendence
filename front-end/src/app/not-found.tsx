export default function NotFound() {
    const errorImgs = [
        "/images/404a.jpg",
        "/images/404b.jpg",
        "/images/404c.jpg"
    ]

    const randomImg = errorImgs[Math.floor(Math.random() * errorImgs.length)];
  return (
    <div className={"welcome"}>
      <div className={"welcome-title"}>404</div>
      <div className={"welcome-msg"}>Not Found</div>
        <img src={randomImg} alt="404" className={"welcome-img"} width={"60%"} height={"60%"} style={{marginInline:"auto"}}/>
    </div>
  )
}
