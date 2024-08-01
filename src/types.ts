export interface WebManifestIcon {
  src: string
  sizes: string
  type: string
  purpose?: string
}

export interface WebManifestRelatedApplication {
  platform: string
  url: string
  id?: string
}

export interface WebManifest {
  name?: string
  short_name?: string
  description?: string
  icons?: WebManifestIcon[]
  screenshots?: WebManifestIcon[]
  start_url?: string
  display?: "fullscreen" | "standalone" | "minimal-ui" | "browser"
  background_color?: string
  theme_color?: string
  orientation?:
    | "any"
    | "natural"
    | "portrait"
    | "landscape"
    | "portrait-primary"
    | "portrait-secondary"
    | "landscape-primary"
    | "landscape-secondary"
  scope?: string
  related_applications?: WebManifestRelatedApplication[]
  prefer_related_applications?: boolean
  id?: string
}
