
  import appManifestPath from "./sebastian-software.webmanifest"
  import svgPath from "./sebastian-software-opt.svg"
  import icoPath from "./sebastian-software.ico"
  import touchIcon152 from "./sebastian-software-apple-152.png"
import touchIcon167 from "./sebastian-software-apple-167.png"
import touchIcon180 from "./sebastian-software-apple-180.png"

  function Favicon() {
    <link rel="icon" href={icoPath} sizes="32x32">
    <link rel="icon" href={svgPath} type="image/svg+xml">
    <link rel="apple-touch-icon" href={touchIcon152}>
  <link rel="apple-touch-icon" href={touchIcon167}>
  <link rel="apple-touch-icon" href={touchIcon180}>
    <link rel="manifest" href={appManifestPath}>
  }