import icoPath from "./sebastian-software.ico";
import appManifestPath from "./sebastian-software.webmanifest";
import touchIcon152 from "./sebastian-software-apple-152.png";
import touchIcon167 from "./sebastian-software-apple-167.png";
import touchIcon180 from "./sebastian-software-apple-180.png";
import svgPath from "./sebastian-software-opt.svg";

export function Favicon() {
  return (
    <>
      <link rel="icon" href={icoPath} sizes="32x32" />
      <link rel="manifest" href={appManifestPath} />
      <link rel="icon" href={svgPath} type="image/svg+xml" />
      <link rel="apple-touch-icon" sizes="152x152" href={touchIcon152} />
      <link rel="apple-touch-icon" sizes="167x167" href={touchIcon167} />
      <link rel="apple-touch-icon" sizes="180x180" href={touchIcon180} />
    </>
  );
}
