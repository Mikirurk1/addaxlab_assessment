import { useMemo, useState, useEffect } from "react";
import {
  AvatarCircle,
  AvatarImageWrap,
  AvatarImg,
} from "./InitialsAvatar.styled";

/** Palette of distinct colors for avatar backgrounds (stable per name via hash). */
const AVATAR_COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#db2777", // rose
  "#059669", // emerald
  "#0d9488", // teal
  "#2563eb", // blue
  "#7c3aed", // purple
  "#ca8a04", // yellow
  "#ea580c", // orange
  "#dc2626", // red
  "#0891b2", // cyan
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) {
    const word = parts[0];
    return word.length >= 2
      ? word.slice(0, 2).toUpperCase()
      : word.slice(0, 1).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export interface InitialsAvatarProps {
  name: string;
  size?: number;
  title?: string;
  /** If provided and loads successfully, show image; otherwise show initials. */
  imageUrl?: string;
  /** Called when image loads successfully. Parent can use to sync state (e.g. header + modal). */
  onImageLoad?: () => void;
  /** Called when image fails to load (e.g. 404). Parent can use this to hide image. */
  onImageError?: () => void;
}

export function InitialsAvatar({
  name,
  size = 28,
  title,
  imageUrl,
  onImageLoad,
  onImageError,
}: InitialsAvatarProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  const { initials, bg } = useMemo(() => {
    const init = getInitials(name);
    const index = hashString(name) % AVATAR_COLORS.length;
    const background = AVATAR_COLORS[index];
    return { initials: init, bg: background };
  }, [name]);

  const showImage = imageUrl && !imageError;

  const handleImageError = () => {
    setImageError(true);
    onImageError?.();
  };

  const handleImageLoad = () => {
    onImageLoad?.();
  };

  if (showImage) {
    return (
      <AvatarImageWrap
        $size={size}
        role="img"
        aria-label={name}
        title={title ?? name}
      >
        <AvatarImg src={imageUrl} alt="" onLoad={handleImageLoad} onError={handleImageError} />
      </AvatarImageWrap>
    );
  }

  return (
    <AvatarCircle
      $bg={bg}
      $size={size}
      title={title ?? name}
      role="img"
      aria-label={name}
    >
      {initials}
    </AvatarCircle>
  );
}
